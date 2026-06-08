"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "./Button";
import type { Profile } from "@/types/database";

export default function AuthLinks() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const loadProfile = async () => {
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
    };

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

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
