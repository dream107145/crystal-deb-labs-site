import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

const schema = z.object({ body: z.string().min(1).max(4000) });

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS restricts rows to request participants
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("project_messages")
    .select("*")
    .eq("request_id", params.id)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const senderIds = Array.from(new Set((messages || []).map((m) => m.sender_id)));
  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, avatar_url, role")
    .in("id", senderIds.length ? senderIds : ["00000000-0000-0000-0000-000000000000"]);

  const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
  const enriched = (messages || []).map((m) => ({
    ...m,
    sender: profileMap[m.sender_id] || null,
  }));

  return NextResponse.json({ messages: enriched });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
  }

  // RLS "with check" enforces that the sender is a participant
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_messages")
    .insert({
      request_id: params.id,
      sender_id: user.id,
      body: parsed.data.body,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "You don't have access to this project chat" },
      { status: 403 }
    );
  }

  // Notify other participants (owner + assigned developers)
  try {
    const admin = createAdminClient();
    const [{ data: req }, { data: assignments }] = await Promise.all([
      admin
        .from("project_requests")
        .select("user_id, service")
        .eq("id", params.id)
        .single(),
      admin
        .from("request_assignments")
        .select("developer_id")
        .eq("request_id", params.id),
    ]);

    const participantIds = new Set<string>();
    if (req?.user_id) participantIds.add(req.user_id);
    (assignments || []).forEach((a) => participantIds.add(a.developer_id));
    participantIds.delete(user.id);

    await Promise.all(
      Array.from(participantIds).map((id) =>
        createNotification({
          userId: id,
          type: "message",
          title: "New project chat message",
          body: `New message in your ${req?.service ?? ""} project chat.`,
          link: "/profile",
        })
      )
    );
  } catch (err) {
    console.error("Chat notification failed:", err);
  }

  return NextResponse.json({ message: data });
}
