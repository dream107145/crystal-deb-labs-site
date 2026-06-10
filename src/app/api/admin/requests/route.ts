import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_requests")
    .select("*, quotes(*), assignments:request_assignments(id, developer_id)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const developerIds = Array.from(
    new Set(
      (data || []).flatMap((r) =>
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

  const requests = (data || []).map((r) => ({
    ...r,
    assignments: (r.assignments || []).map(
      (a: { id: string; developer_id: string }) => ({
        ...a,
        developer: profileMap[a.developer_id] || null,
      })
    ),
  }));

  return NextResponse.json({ requests });
}
