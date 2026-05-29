"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SITE } from "@/lib/constants";
import Button from "@/components/ui/Button";
const ParticleBackground = dynamic(
  () => import("@/components/particles/ParticleBackground"),
  { ssr: false }
);
const Crystal3D = dynamic(
  () => import("@/components/particles/Crystal3D"),
  { ssr: false, loading: () => <div className="h-64 w-64" /> }
);

interface HeroProps {
  title?: string;
  subtitle?: string;
  showCrystal?: boolean;
  showCTA?: boolean;
  compact?: boolean;
}

export default function Hero({
  title = SITE.tagline,
  subtitle = SITE.description,
  showCrystal = true,
  showCTA = true,
  compact = false,
}: HeroProps) {
  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${
        compact ? "min-h-[50vh] pt-32 pb-16" : "min-h-screen"
      }`}
      aria-label="Hero"
    >
      <ParticleBackground className="opacity-80" />

      <div className="relative z-10 section-padding w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        <div className={`flex-1 text-center ${showCrystal ? "lg:text-left" : ""}`}>
          <motion.h1
            className="heading-xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="gradient-text">{title}</span>
          </motion.h1>
          <motion.p
            className="text-muted text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
          {showCTA && (
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button href="/services" variant="primary">
                View Services
              </Button>
              <Button href="/contact" variant="outline">
                Contact Us
              </Button>
            </motion.div>
          )}
        </div>

        {showCrystal && (
          <motion.div
            className="flex-1 w-full max-w-md h-64 lg:h-96"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Crystal3D className="w-full h-full" />
          </motion.div>
        )}
      </div>

      {!compact && (
        <motion.a
          href="#services"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-crystal-cyan z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          aria-label="Scroll to services"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.a>
      )}
    </section>
  );
}
