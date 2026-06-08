"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { User } from "lucide-react";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/forms/inputClass";
import type { Profile } from "@/types/database";

const profileSchema = z.object({
  telegram: z.string().max(100).optional(),
  discord_id: z.string().max(100).optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
}

export default function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      telegram: profile.telegram || "",
      discord_id: profile.discord_id || "",
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setAvatarUrl(json.avatar_url);
      onUpdate({ ...profile, avatar_url: json.avatar_url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileValues) => {
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onUpdate(json.profile);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-strong rounded-2xl p-8 space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">{error}</div>
      )}
      {saved && (
        <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 text-sm">
          Profile saved successfully.
        </div>
      )}

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/10 border-2 border-crystal-blue/30 shrink-0">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <User size={40} />
            </div>
          )}
        </div>
        <div>
          <p className="text-white font-medium mb-1">{profile.email}</p>
          <p className="text-muted text-sm capitalize mb-3">{profile.role}</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} isLoading={uploading}>
            {uploading ? "Uploading..." : "Change Avatar"}
          </Button>
        </div>
      </div>

      <div>
        <label htmlFor="telegram" className="block text-sm font-medium text-white mb-2">Telegram</label>
        <input id="telegram" {...register("telegram")} className={inputClass(errors.telegram)} placeholder="@username" />
      </div>

      <div>
        <label htmlFor="discord_id" className="block text-sm font-medium text-white mb-2">Discord ID</label>
        <input id="discord_id" {...register("discord_id")} className={inputClass(errors.discord_id)} placeholder="username#0000 or user ID" />
      </div>

      <Button type="submit" variant="primary" isLoading={isSubmitting}>
        Save Profile
      </Button>
    </form>
  );
}
