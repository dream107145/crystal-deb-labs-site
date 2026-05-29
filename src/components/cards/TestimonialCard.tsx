"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="glass-strong rounded-2xl p-8 md:p-10 text-center max-w-3xl mx-auto">
      <div className="flex justify-center gap-1 mb-6" aria-label={`${testimonial.rating} stars`}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 fill-crystal-cyan text-crystal-cyan"
            aria-hidden
          />
        ))}
      </div>
      <blockquote className="text-lg md:text-xl text-white leading-relaxed mb-8">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center justify-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-crystal-blue/40">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-left">
          <p className="font-heading font-bold text-white">
            {testimonial.name}
          </p>
          <p className="text-muted text-sm">{testimonial.company}</p>
        </div>
      </div>
    </div>
  );
}
