"use client";

import dynamic from "next/dynamic";
import { SITE } from "@/lib/constants";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";

const ParticleBackground = dynamic(
  () => import("@/components/particles/ParticleBackground"),
  { ssr: false }
);

export default function CTA() {
  return (
    <section className="relative section-padding overflow-hidden" aria-labelledby="cta-heading">
      <ParticleBackground className="opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-crystal-blue/10 via-crystal-purple/10 to-crystal-cyan/10 animate-pulse-glow" />
      <ScrollReveal className="relative z-10 text-center max-w-3xl mx-auto">
        <h2 id="cta-heading" className="heading-lg mb-4">
          Ready to Start Your <span className="gradient-text">Project?</span>
        </h2>
        <p className="text-muted text-lg mb-8">
          Let&apos;s build something amazing together.
        </p>
        <Button href={SITE.discordTicket} variant="primary">
          Open Ticket
        </Button>
      </ScrollReveal>
    </section>
  );
}
