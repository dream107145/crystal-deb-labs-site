"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { Testimonial } from "@/types/database";

type PublicTestimonial = Pick<
  Testimonial,
  "id" | "name" | "company" | "quote" | "rating" | "created_at"
>;

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
              <figcaption className="mt-4 pt-4 border-t border-white/10">
                <span className="text-white font-medium text-sm">{t.name}</span>
                {t.company && (
                  <span className="text-muted text-sm"> · {t.company}</span>
                )}
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
