import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Lightbulb,
  Award,
  Eye,
  Handshake,
  Star,
  type LucideIcon,
} from "lucide-react";
import Hero from "@/components/sections/Hero";
import { VALUES } from "@/lib/constants";
import ScrollReveal from "@/components/animations/ScrollReveal";

const Crystal3D = dynamic(
  () => import("@/components/particles/Crystal3D"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Crystal Dev Labs — our story, mission, and values driving innovation in digital development.",
};

const valueIcons: Record<string, LucideIcon> = {
  Lightbulb,
  Award,
  Eye,
  Handshake,
  Star,
};

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About Crystal Dev Labs"
        subtitle="Innovators, builders, and partners in your digital journey."
        showCrystal={false}
        showCTA={false}
        compact
      />

      <section className="section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <h2 className="heading-lg mb-6">
              Our <span className="gradient-text">Story</span>
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Founded with a vision to bridge cutting-edge technology and
                real-world business needs, Crystal Dev Labs has delivered{" "}
                <strong className="text-white">7 successful projects</strong>{" "}
                across web, AI, bots, software, and blockchain.
              </p>
              <p>
                <strong className="text-white">Mission:</strong> Empower
                businesses with innovative digital solutions that drive growth,
                efficiency, and competitive advantage.
              </p>
              <p>
                <strong className="text-white">Vision:</strong> To be the
                leading partner for organizations seeking to harness the power of
                web, AI, automation, and blockchain technologies.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="h-80 lg:h-96">
              <Crystal3D />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding">
        <ScrollReveal>
          <h2 className="heading-lg text-center mb-16">
            Our <span className="gradient-text">Values</span>
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {VALUES.map((value, i) => {
            const Icon = valueIcons[value.icon] || Star;
            return (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 text-center hover:glow-cyan-hover transition-shadow">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-crystal-purple/20 flex items-center justify-center animate-pulse-glow">
                    <Icon className="w-7 h-7 text-crystal-cyan" aria-hidden />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted text-sm">{value.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
