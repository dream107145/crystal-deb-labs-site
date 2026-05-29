"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Search,
  Map,
  Palette,
  Code2,
  TestTube,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { PROCESS_STEPS } from "@/lib/constants";
import ScrollReveal from "@/components/animations/ScrollReveal";

const iconMap: Record<string, LucideIcon> = {
  Search,
  Map,
  Palette,
  Code2,
  TestTube,
  Rocket,
};

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="section-padding" aria-labelledby="process-heading">
      <ScrollReveal>
        <h2 id="process-heading" className="heading-lg text-center mb-16">
          Our <span className="gradient-text">Process</span>
        </h2>
      </ScrollReveal>

      <div ref={containerRef} className="relative max-w-3xl mx-auto">
        <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-white/10">
          <motion.div
            className="w-full bg-gradient-to-b from-crystal-blue to-crystal-purple origin-top"
            style={{ height: lineHeight }}
          />
        </div>

        <div className="space-y-12">
          {PROCESS_STEPS.map((step, i) => {
            const Icon = iconMap[step.icon] || Search;
            const isEven = i % 2 === 0;
            return (
              <ScrollReveal key={step.step} delay={i * 0.1}>
                <motion.div
                  className={`relative flex items-start gap-6 pl-16 md:pl-0 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  whileInView={{ scale: [0.95, 1] }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`hidden md:block flex-1 ${
                      isEven ? "text-right pr-8" : "text-left pl-8"
                    }`}
                  >
                    <h3 className="text-xl font-heading font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-muted mt-2">{step.description}</p>
                  </div>

                  <motion.div
                    className="absolute left-3 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-crystal-blue/20 border-2 border-crystal-blue flex items-center justify-center z-10 glow-cyan"
                    whileInView={{ scale: [0, 1.2, 1] }}
                    viewport={{ once: true }}
                  >
                    <Icon className="w-5 h-5 text-crystal-cyan" aria-hidden />
                  </motion.div>

                  <div className="md:hidden flex-1">
                    <span className="text-crystal-cyan text-sm font-medium">
                      Step {step.step}
                    </span>
                    <h3 className="text-xl font-heading font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-muted mt-2">{step.description}</p>
                  </div>

                  <div
                    className={`hidden md:block flex-1 ${
                      isEven ? "text-left pl-8" : "text-right pr-8"
                    }`}
                  >
                    {!isEven && (
                      <>
                        <h3 className="text-xl font-heading font-bold text-white">
                          {step.title}
                        </h3>
                        <p className="text-muted mt-2">{step.description}</p>
                      </>
                    )}
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
