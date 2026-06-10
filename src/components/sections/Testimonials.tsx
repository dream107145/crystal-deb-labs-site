"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { Testimonial } from "@/types/database";

type PublicTestimonial = Pick<
  Testimonial,
  "id" | "name" | "company" | "quote" | "rating" | "created_at"
> & { avatar_url: string | null };

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((json) => setTestimonials(json.testimonials || []))
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="heading-lg gradient-text mb-4">What Clients Say</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Real feedback from customers who shipped projects with us.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.slice(0, 6).map((t, i) => (
          <ScrollReveal key={t.id} delay={i * 0.1}>
            <figure className="glass-strong rounded-2xl p-6 h-full flex flex-col">
              <div className="flex gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= t.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-white/20"
                    }
                  />
                ))}
              </div>
              <blockquote className="text-muted text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-crystal-blue/20 border border-white/10 shrink-0">
                  {t.avatar_url ? (
                    <Image
                      src={t.avatar_url}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-crystal-cyan font-semibold text-sm">
                      {t.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-white font-medium text-sm block">{t.name}</span>
                  {t.company && (
                    <span className="text-muted text-xs">{t.company}</span>
                  )}
                </div>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
