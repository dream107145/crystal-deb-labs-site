import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { sendApprovalEmail } from "@/lib/email";

const approveSchema = z.object({
  user_id: z.string().uuid(),
  approved: z.boolean(),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = approveSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_approved: parsed.data.approved })
    .eq("id", parsed.data.user_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (parsed.data.approved && data.email) {
    try {
      await sendApprovalEmail(data.email);
    } catch (emailErr) {
      console.error("Approval email failed:", emailErr);
    }
  }

  return NextResponse.json({ user: data });
}
