"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/forms/inputClass";

const fields = [
  { id: "email", label: "Email", type: "email", placeholder: "contact@example.com" },
  { id: "discord", label: "Discord URL", type: "url", placeholder: "https://discord.gg/..." },
  { id: "discord_ticket", label: "Discord Ticket URL", type: "url", placeholder: "https://discord.gg/..." },
  { id: "telegram", label: "Telegram URL", type: "url", placeholder: "https://t.me/..." },
  { id: "telegram_handle", label: "Telegram Handle", type: "text", placeholder: "@username" },
] as const;

export default function ContactInfoManagement() {
  const [form, setForm] = useState({
    email: "",
    discord: "",
    discord_ticket: "",
    telegram: "",
    telegram_handle: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contact-info")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        const c = json.contactInfo;
        setForm({
          email: c.email,
          discord: c.discord,
          discord_ticket: c.discord_ticket,
          telegram: c.telegram,
          telegram_handle: c.telegram_handle,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/contact-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="glass-strong rounded-2xl p-10 animate-pulse h-64" />;
  }

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-4">
      <h3 className="font-heading font-semibold text-white">Contact Information</h3>
      <p className="text-muted text-sm">These details appear on the contact page and footer site-wide.</p>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">{error}</div>
      )}
      {saved && (
        <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 text-sm">
          Contact info updated.
        </div>
      )}

      {fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-sm font-medium text-white mb-2">
            {field.label} <span className="text-crystal-cyan">*</span>
          </label>
          <input
            id={field.id}
            type={field.type}
            className={inputClass()}
            placeholder={field.placeholder}
            value={form[field.id]}
            onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
          />
        </div>
      ))}

      <Button variant="primary" onClick={handleSave} isLoading={saving}>
        Save Contact Info
      </Button>
    </div>
  );
}
