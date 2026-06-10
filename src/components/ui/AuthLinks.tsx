"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AUTH_CHANGED_EVENT } from "@/lib/signOut";
import Button from "./Button";
import NotificationBell from "./NotificationBell";
import type { Profile } from "@/types/database";

export default function AuthLinks() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setLoading(false);
        return;
      }
      loadProfile();
    });

    const onAuthChanged = () => {
      setProfile(null);
      setLoading(false);
      loadProfile();
    };
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    };
  }, [loadProfile]);

  if (loading) return null;

  if (!profile) {
    return (
      <div className="hidden md:flex items-center gap-3">
        <Link href="/auth/signin" className="text-sm text-muted hover:text-white transition-colors">
          Sign In
        </Link>
        <Button href="/contact" variant="primary">
          Get Started
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      <NotificationBell userId={profile.id} />
      {profile.role === "admin" && (
        <Link href="/admin" className="text-sm text-crystal-cyan hover:text-white transition-colors">
          Admin
        </Link>
      )}
      <Link href="/profile" className="text-sm text-muted hover:text-white transition-colors">
        Profile
      </Link>
      <Button href="/contact" variant="primary">
        Get Started
      </Button>
    </div>
  );
}
