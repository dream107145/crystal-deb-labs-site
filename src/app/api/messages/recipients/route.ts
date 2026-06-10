import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession, getProfile } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile(user.id);
  const admin = createAdminClient();

  // Admins can message anyone; regular users can message admins
  let query = admin
    .from("profiles")
    .select("id, email, role")
    .neq("id", user.id)
    .order("email");

  if (profile?.role !== "admin") {
    query = query.eq("role", "admin");
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recipients: data });
}
