"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import InboxPanel from "@/components/profile/InboxPanel";
import MyProjectsPanel from "@/components/profile/MyProjectsPanel";
import Button from "@/components/ui/Button";
import { signOutUser } from "@/lib/signOut";
import type { Profile } from "@/types/database";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "inbox" | "projects">("profile");

  useEffect(() => {
    fetch("/api/profile")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/auth/signin?redirect=/profile");
          return;
        }
        const json = await res.json();
        setProfile(json.profile);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <section className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto glass-strong rounded-2xl p-10 animate-pulse h-96" />
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading-lg gradient-text">My Account</h1>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab("profile")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === "profile"
                ? "bg-crystal-blue/20 text-crystal-cyan"
                : "text-muted hover:text-white"
            }`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setTab("inbox")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === "inbox"
                ? "bg-crystal-blue/20 text-crystal-cyan"
                : "text-muted hover:text-white"
            }`}
          >
            Inbox
          </button>
          <button
            type="button"
            onClick={() => setTab("projects")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === "projects"
                ? "bg-crystal-blue/20 text-crystal-cyan"
                : "text-muted hover:text-white"
            }`}
          >
            My Projects
          </button>
        </div>

        {tab === "profile" && <ProfileForm profile={profile} onUpdate={setProfile} />}
        {tab === "inbox" && <InboxPanel />}
        {tab === "projects" && <MyProjectsPanel profile={profile} />}
      </div>
    </section>
  );
}
