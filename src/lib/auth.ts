import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getSession();
  if (!user) return null;
  return getProfile(user.id);
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return profile;
}

export function canSignIn(profile: Profile): {
  allowed: boolean;
  reason?: string;
} {
  if (!profile.email_verified) {
    return { allowed: false, reason: "Please verify your email before signing in." };
  }
  if (profile.role === "developer" && !profile.is_approved) {
    return {
      allowed: false,
      reason: "Your developer account is pending admin approval.",
    };
  }
  return { allowed: true };
}
