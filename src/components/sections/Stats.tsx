"use client";

import { STATS } from "@/lib/constants";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function Stats() {
  return (
    <section className="section-padding" aria-label="Statistics">
      <ScrollReveal>
        <div className="glass-strong rounded-3xl p-10 md:p-16 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              label={stat.label}
            />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
