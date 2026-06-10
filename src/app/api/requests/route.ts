import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS returns requests the user owns or is assigned to as a developer
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_requests")
    .select("*, quotes(*), assignments:request_assignments(id, developer_id)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const visible = (data || []).filter(
    (r) =>
      r.user_id === user.id ||
      (r.assignments || []).some(
        (a: { developer_id: string }) => a.developer_id === user.id
      )
  );

  // Enrich assignments with developer emails/avatars
  const developerIds = Array.from(
    new Set(
      visible.flatMap((r) =>
        (r.assignments || []).map((a: { developer_id: string }) => a.developer_id)
      )
    )
  );

  let profileMap: Record<
    string,
    { id: string; email: string; avatar_url: string | null }
  > = {};

  if (developerIds.length > 0) {
    const admin = createAdminClient();
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, email, avatar_url")
      .in("id", developerIds);
    profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
  }

  const requests = visible.map((r) => ({
    ...r,
    is_owner: r.user_id === user.id,
    assignments: (r.assignments || []).map(
      (a: { id: string; developer_id: string }) => ({
        ...a,
        developer: profileMap[a.developer_id] || null,
      })
    ),
  }));

  return NextResponse.json({ requests });
}
