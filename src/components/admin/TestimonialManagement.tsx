"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, Check, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/database";

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setTestimonials(json.testimonials || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const setApproved = async (id: string, approved: boolean) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? json.testimonial : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) {
    return <div className="glass-strong rounded-2xl p-10 animate-pulse h-64" />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">{error}</div>
      )}

      <h3 className="font-heading font-semibold text-white">
        Testimonials ({testimonials.length})
      </h3>

      {testimonials.length === 0 ? (
        <div className="glass-strong rounded-2xl p-10 text-center text-muted">
          No testimonials yet. Customers can submit reviews from their profile
          after a delivered project.
        </div>
      ) : (
        testimonials.map((t) => (
          <div key={t.id} className="glass-strong rounded-2xl p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">
                  {t.name}
                  {t.company && <span className="text-muted font-normal"> · {t.company}</span>}
                </p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= t.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/20"
                      }
                    />
                  ))}
                </div>
              </div>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  t.approved
                    ? "bg-green-500/20 text-green-300"
                    : "bg-yellow-500/20 text-yellow-300"
                )}
              >
                {t.approved ? "Approved" : "Pending"}
              </span>
            </div>

            <p className="text-sm text-muted">&ldquo;{t.quote}&rdquo;</p>

            <div className="flex gap-3">
              {t.approved ? (
                <Button variant="ghost" onClick={() => setApproved(t.id, false)} className="text-sm py-2">
                  <EyeOff size={16} /> Unpublish
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setApproved(t.id, true)} className="text-sm py-2">
                  <Check size={16} /> Approve
                </Button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="text-red-400 hover:text-red-300 text-sm inline-flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
