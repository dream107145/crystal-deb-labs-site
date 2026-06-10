import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { sendStatusUpdateEmail } from "@/lib/email";

const schema = z.object({
  status: z.enum([
    "pending",
    "quoted",
    "in_progress",
    "review",
    "delivered",
    "cancelled",
  ]),
});

export async function PATCH(
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
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_requests")
    .update({ status: parsed.data.status })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data.user_id) {
    await createNotification({
      userId: data.user_id,
      type: "request_status",
      title: "Project status updated",
      body: `Your ${data.service} request is now "${parsed.data.status.replace("_", " ")}".`,
      link: "/profile",
    });
  }

  try {
    await sendStatusUpdateEmail(data.email, data.service, parsed.data.status);
  } catch (err) {
    console.error("Status email failed:", err);
  }

  return NextResponse.json({ request: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("project_requests")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
