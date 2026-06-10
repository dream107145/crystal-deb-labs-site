import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

const schema = z.object({
  status: z.enum(["accepted", "declined"]),
});

export async function PATCH(
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
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: quote, error } = await supabase
    .from("quotes")
    .update({ status: parsed.data.status })
    .eq("id", params.id)
    .eq("status", "pending")
    .select("*, request:project_requests(id, service, user_id)")
    .single();

  if (error || !quote) {
    return NextResponse.json(
      { error: error?.message || "Quote not found or already responded" },
      { status: 400 }
    );
  }

  // Notify all admins of the response
  try {
    const admin = createAdminClient();
    const { data: admins } = await admin
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    const service = quote.request?.service ?? "project";
    await Promise.all(
      (admins || []).map((a) =>
        createNotification({
          userId: a.id,
          type: "quote_response",
          title: `Quote ${parsed.data.status}`,
          body: `A customer ${parsed.data.status} the quote for their ${service} request.`,
          link: "/admin",
        })
      )
    );
  } catch (err) {
    console.error("Failed to notify admins:", err);
  }

  return NextResponse.json({ quote });
}
