import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

const schema = z.object({ developer_id: z.string().uuid() });

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid developer" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("request_assignments")
    .insert({ request_id: params.id, developer_id: parsed.data.developer_id })
    .select()
    .single();

  if (error) {
    const message = error.code === "23505"
      ? "Developer is already assigned to this project"
      : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data: req } = await supabase
    .from("project_requests")
    .select("service")
    .eq("id", params.id)
    .single();

  await createNotification({
    userId: parsed.data.developer_id,
    type: "request_status",
    title: "You were assigned to a project",
    body: `You've been assigned to a ${req?.service ?? ""} project. Open My Projects to chat with the client.`,
    link: "/profile",
  });

  return NextResponse.json({ assignment: data });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid developer" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("request_assignments")
    .delete()
    .eq("request_id", params.id)
    .eq("developer_id", parsed.data.developer_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
