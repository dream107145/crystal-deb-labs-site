import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(["customer", "developer", "admin"]).optional(),
  is_approved: z.boolean().optional(),
  email_verified: z.boolean().optional(),
  telegram: z.string().max(100).nullable().optional(),
  discord_id: z.string().max(100).nullable().optional(),
  password: z.string().min(8).optional(),
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
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { password, email, ...profileFields } = parsed.data;
  const admin = createAdminClient();

  if (password || email) {
    const authUpdate: { password?: string; email?: string; email_confirm?: boolean } = {};
    if (password) authUpdate.password = password;
    if (email) {
      authUpdate.email = email;
      authUpdate.email_confirm = true;
    }

    const { error: authError } = await admin.auth.admin.updateUserById(
      params.id,
      authUpdate
    );

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
  }

  const supabase = await createClient();
  const updateData = {
    ...profileFields,
    ...(email ? { email } : {}),
  };

  if (Object.keys(updateData).length === 0 && !password) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  let currentUserId: string | undefined;
  try {
    const adminProfile = await requireAdmin();
    currentUserId = adminProfile.id;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (params.id === currentUserId) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
