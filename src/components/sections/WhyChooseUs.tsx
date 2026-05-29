"use client";

import { motion } from "framer-motion";
import {
  Users,
  Sparkles,
  Zap,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";
import ScrollReveal from "@/components/animations/ScrollReveal";
import dynamic from "next/dynamic";

const ParticleBackground = dynamic(
  () => import("@/components/particles/ParticleBackground"),
  { ssr: false }
);

const iconMap: Record<string, LucideIcon> = {
  Users,
  Sparkles,
  Zap,
  Headphones,
};

export default function WhyChooseUs() {
  return (
    <section className="relative section-padding overflow-hidden" aria-labelledby="why-heading">
      <ParticleBackground className="opacity-30" />
      <div className="relative z-10">
        <ScrollReveal>
          <h2 id="why-heading" className="heading-lg text-center mb-16">
            Why Choose <span className="gradient-text">Us</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon] || Sparkles;
            return (
              <ScrollReveal key={feature.title} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                <motion.div
                  className="glass rounded-2xl p-8 h-full hover:glow-cyan-hover transition-shadow duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-crystal-blue/20 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Icon className="w-6 h-6 text-crystal-cyan" aria-hidden />
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
