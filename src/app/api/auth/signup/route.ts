import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendVerificationEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["customer", "developer"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password, role } = parsed.data;
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const isAdmin = adminEmail && email.toLowerCase() === adminEmail;
    const finalRole = isAdmin ? "admin" : role;
    const isApproved = finalRole !== "developer";

    const supabase = createAdminClient();

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email,
        role: finalRole,
        email_verified: false,
        is_approved: isApproved,
      })
      .select()
      .single();

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error: tokenError } = await supabase
      .from("email_verification_tokens")
      .insert({ user_id: userId, token, expires_at: expiresAt });

    if (tokenError) {
      return NextResponse.json({ error: tokenError.message }, { status: 500 });
    }

    try {
      await sendVerificationEmail(email, token);
    } catch (emailErr) {
      console.error("Verification email failed:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message:
        finalRole === "developer"
          ? "Account created. Please verify your email. Developer accounts require admin approval after verification."
          : "Account created. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
