"use client";

import { SERVICES } from "@/lib/constants";
import ServiceCard from "@/components/cards/ServiceCard";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function ServicesPreview() {
  return (
    <section id="services" className="section-padding relative" aria-labelledby="services-heading">
      <ScrollReveal>
        <h2 id="services-heading" className="heading-lg text-center mb-4">
          Our <span className="gradient-text">Services</span>
        </h2>
        <p className="text-muted text-center max-w-2xl mx-auto mb-16">
          Comprehensive development solutions tailored to elevate your digital presence.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}
