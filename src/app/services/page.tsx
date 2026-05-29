import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ServiceCard from "@/components/cards/ServiceCard";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import { SERVICES } from "@/lib/constants";
export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Comprehensive development solutions: Website, AI, Bot, Software, and Blockchain development for your business.",
};

export default function ServicesPage() {
  return (
    <>
      <Hero
        title="Our Services"
        subtitle="Comprehensive Development Solutions for Your Business"
        showCrystal={false}
        showCTA={false}
        compact
      />
      <section className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SERVICES.map((service, i) => (
            <div key={service.id} id={service.id}>
              <ServiceCard service={service} index={i} variant="detail" />
            </div>
          ))}
        </div>
      </section>
      <ProcessTimeline />
    </>
  );
}
