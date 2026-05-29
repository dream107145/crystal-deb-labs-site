"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 2,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) => {
    const rounded = Math.round(v);
    if (suffix === "K+") return `${rounded}${suffix}`;
    return `${prefix}${rounded}${suffix}`;
  });

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  return (
    <div ref={ref} className="text-center">
      <motion.span className="block text-4xl md:text-5xl font-heading font-bold gradient-text">
        {display}
      </motion.span>
      <span className="mt-2 block text-muted text-sm md:text-base">
        {label}
      </span>
    </div>
  );
}
