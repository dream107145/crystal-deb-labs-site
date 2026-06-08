import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { canSignIn } from "@/lib/auth";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const access = canSignIn(profile);
    if (!access.allowed) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: access.reason }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: { id: data.user.id, email: data.user.email },
      profile: {
        role: profile.role,
        email_verified: profile.email_verified,
        is_approved: profile.is_approved,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
