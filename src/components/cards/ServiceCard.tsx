"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Brain,
  Bot,
  Code2,
  Link as LinkIcon,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Brain,
  Bot,
  Code2,
  Link: LinkIcon,
};

interface ServiceCardProps {
  service: Service;
  index?: number;
  variant?: "preview" | "detail";
}

export default function ServiceCard({
  service,
  index = 0,
  variant = "preview",
}: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Globe;

  if (variant === "detail") {
    return (
      <TiltCard accentColor={service.accentColor}>
        <div className="glass-strong rounded-2xl p-8 h-full gradient-border">
          <motion.div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
            style={{
              background: `${service.accentColor}20`,
              boxShadow: `0 0 30px ${service.accentColor}40`,
            }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <Icon
              className="w-8 h-8"
              style={{ color: service.accentColor }}
              aria-hidden
            />
          </motion.div>
          <span className="text-2xl mb-2 block" aria-hidden>
            {service.emoji}
          </span>
          <h3 className="heading-md text-white mb-4">{service.title}</h3>
          <p className="text-muted mb-6 leading-relaxed">{service.description}</p>
          <ul className="space-y-2 mb-8" role="list">
            {service.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-muted"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: service.accentColor }}
                />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mb-8">
            {service.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs rounded-full glass"
              >
                {t}
              </span>
            ))}
          </div>
          <Link
            href={`/contact?service=${service.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${service.accentColor}, ${service.accentColor}99)`,
              color: "#0A0A0F",
            }}
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </TiltCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <TiltCard accentColor={service.accentColor}>
        <Link
          href={`/services#${service.id}`}
          className="block glass rounded-2xl p-6 h-full group hover:glow-cyan-hover transition-shadow duration-300"
        >
          <motion.div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 glass"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon
              className="w-7 h-7 text-crystal-blue group-hover:text-crystal-cyan transition-colors"
              aria-hidden
            />
          </motion.div>
          <span className="text-xl mb-2 block" aria-hidden>
            {service.emoji}
          </span>
          <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-crystal-cyan transition-colors">
            {service.title}
          </h3>
          <p className="text-muted text-sm leading-relaxed mb-4">
            {service.shortDescription}
          </p>
          <span className="inline-flex items-center gap-1 text-crystal-blue text-sm font-medium group-hover:gap-2 transition-all">
            Learn More
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </TiltCard>
    </motion.div>
  );
}

function TiltCard({
  children,
  accentColor,
}: {
  children: React.ReactNode;
  accentColor: string;
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-200 h-full")}
      style={{ transformStyle: "preserve-3d" }}
      whileHover={{
        boxShadow: `0 0 30px ${accentColor}40, 0 0 60px ${accentColor}20`,
      }}
    >
      {children}
    </motion.div>
  );
}
