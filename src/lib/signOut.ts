import { createClient } from "@/lib/supabase/client";

export const AUTH_CHANGED_EVENT = "cdl-auth-changed";

export async function signOutUser() {
  const supabase = createClient();
  await supabase.auth.signOut();
  await fetch("/api/auth/signout", { method: "POST" });
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
