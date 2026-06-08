import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: tokenRow, error: tokenError } = await supabase
    .from("email_verification_tokens")
    .select("user_id, expires_at")
    .eq("token", token)
    .single();

  if (tokenError || !tokenRow) {
    return NextResponse.json(
      { error: "Invalid or expired verification link" },
      { status: 400 }
    );
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Verification link has expired" },
      { status: 400 }
    );
  }

  const { error: confirmError } = await supabase.auth.admin.updateUserById(
    tokenRow.user_id,
    { email_confirm: true }
  );

  if (confirmError) {
    return NextResponse.json({ error: confirmError.message }, { status: 500 });
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ email_verified: true })
    .eq("id", tokenRow.user_id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  await supabase
    .from("email_verification_tokens")
    .delete()
    .eq("token", token);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_approved")
    .eq("id", tokenRow.user_id)
    .single();

  return NextResponse.json({
    success: true,
    role: profile?.role,
    needsApproval: profile?.role === "developer" && !profile?.is_approved,
  });
}
