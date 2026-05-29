"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Button from "@/components/ui/Button";

const ParticleBackground = dynamic(
  () => import("@/components/particles/ParticleBackground"),
  { ssr: false }
);

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground className="opacity-60" />
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-8xl md:text-9xl font-heading font-bold gradient-text mb-4">
          404
        </h1>
        <p className="text-xl text-muted mb-8 max-w-md mx-auto">
          This page seems to have drifted into the void. Let&apos;s get you back
          on track.
        </p>
        <Button href="/" variant="primary">
          <Home className="w-5 h-5" />
          Go Home
        </Button>
      </motion.div>
    </section>
  );
}
