import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

const schema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().max(100).optional().default(""),
  quote: z.string().min(10).max(1000),
  rating: z.number().int().min(1).max(5),
});

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("testimonials")
    .select(
      "id, name, company, quote, rating, created_at, profile:profiles(avatar_url)"
    )
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const testimonials = (data || []).map((t) => {
    const { profile, ...rest } = t as typeof t & {
      profile: { avatar_url: string | null } | null;
    };
    return { ...rest, avatar_url: profile?.avatar_url ?? null };
  });

  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      company: parsed.data.company,
      quote: parsed.data.quote,
      rating: parsed.data.rating,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Notify admins of new testimonial to review
  try {
    const admin = createAdminClient();
    const { data: admins } = await admin
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    await Promise.all(
      (admins || []).map((a) =>
        createNotification({
          userId: a.id,
          type: "testimonial",
          title: "New testimonial submitted",
          body: `${parsed.data.name} left a ${parsed.data.rating}-star review.`,
          link: "/admin",
        })
      )
    );
  } catch (err) {
    console.error("Failed to notify admins:", err);
  }

  return NextResponse.json({ testimonial: data });
}
