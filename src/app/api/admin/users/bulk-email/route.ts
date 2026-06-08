import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { sendBulkEmail } from "@/lib/email";

const bulkEmailSchema = z.object({
  user_ids: z.array(z.string().uuid()).min(1),
  subject: z.string().min(1).max(200),
  html: z.string().min(1).max(50000),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = bulkEmailSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from("profiles")
    .select("email")
    .in("id", parsed.data.user_ids);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const emails = users.map((u) => u.email).filter(Boolean);
  if (emails.length === 0) {
    return NextResponse.json({ error: "No valid recipients" }, { status: 400 });
  }

  const html = `
    <div style="font-family:sans-serif;line-height:1.6;max-width:600px;">
      ${parsed.data.html}
    </div>
  `;

  try {
    const result = await sendBulkEmail(emails, parsed.data.subject, html);
    if (!result.sent) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }
    return NextResponse.json({ success: true, sent: result.count });
  } catch (err) {
    console.error("Bulk email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send emails" },
      { status: 500 }
    );
  }
}
