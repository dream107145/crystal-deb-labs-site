import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { sendQuoteEmail } from "@/lib/email";

const schema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(1).max(8).default("USD"),
  description: z.string().max(2000).optional().default(""),
});

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
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: req, error: reqError } = await supabase
    .from("project_requests")
    .select("*")
    .eq("id", params.id)
    .single();

  if (reqError || !req) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const { data: quote, error } = await supabase
    .from("quotes")
    .insert({
      request_id: params.id,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      description: parsed.data.description,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Move the request to "quoted"
  await supabase
    .from("project_requests")
    .update({ status: "quoted" })
    .eq("id", params.id);

  if (req.user_id) {
    await createNotification({
      userId: req.user_id,
      type: "quote",
      title: "You received a quote",
      body: `${parsed.data.currency} ${parsed.data.amount.toLocaleString()} for your ${req.service} project.`,
      link: "/profile",
    });
  }

  try {
    await sendQuoteEmail(
      req.email,
      req.service,
      parsed.data.amount,
      parsed.data.currency
    );
  } catch (err) {
    console.error("Quote email failed:", err);
  }

  return NextResponse.json({ quote });
}
