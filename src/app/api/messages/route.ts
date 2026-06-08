import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

const messageSchema = z.object({
  recipient_id: z.string().uuid(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || "inbox";

  const supabase = await createClient();

  let query = supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (folder === "sent") {
    query = query.eq("sender_id", user.id);
  } else {
    query = query.eq("recipient_id", user.id);
  }

  const { data: messages, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userIds = Array.from(
    new Set(
      (messages || []).flatMap((m) => [m.sender_id, m.recipient_id])
    )
  );

  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, avatar_url")
    .in("id", userIds);

  const profileMap = Object.fromEntries(
    (profiles || []).map((p) => [p.id, p])
  );

  const enriched = (messages || []).map((m) => ({
    ...m,
    sender: profileMap[m.sender_id] || null,
    recipient: profileMap[m.recipient_id] || null,
  }));

  return NextResponse.json({ messages: enriched });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.id,
      recipient_id: parsed.data.recipient_id,
      subject: parsed.data.subject,
      body: parsed.data.body,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: data });
}
