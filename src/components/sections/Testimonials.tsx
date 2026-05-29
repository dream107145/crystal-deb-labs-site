"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import TestimonialCard from "@/components/cards/TestimonialCard";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding" aria-labelledby="testimonials-heading">
      <ScrollReveal>
        <h2 id="testimonials-heading" className="heading-lg text-center mb-16">
          What Our <span className="gradient-text">Clients Say</span>
        </h2>
      </ScrollReveal>

      <div className="relative max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <TestimonialCard testimonial={TESTIMONIALS[current]} />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-crystal-cyan w-8 glow-cyan"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
