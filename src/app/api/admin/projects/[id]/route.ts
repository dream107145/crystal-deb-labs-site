import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const projectSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  image: z.string().url().optional(),
  link: z.union([z.literal(""), z.string().url()]).optional(),
  description: z.string().min(1).optional(),
  tech_stack: z.array(z.string()).optional(),
  client: z.string().min(1).optional(),
  outcomes: z.string().min(1).optional(),
  screenshots: z.array(z.string().url()).optional(),
  sort_order: z.number().int().optional(),
  published: z.boolean().optional(),
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
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .update(parsed.data)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
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
    .from("portfolio_projects")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
