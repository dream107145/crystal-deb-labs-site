"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  isLoading?: boolean;
  children?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-crystal-blue to-crystal-cyan text-[#0A0A0F] font-semibold glow-cyan hover:glow-cyan-hover",
  secondary:
    "bg-crystal-purple/80 hover:bg-crystal-purple text-white font-semibold shadow-glow-purple",
  outline:
    "border-2 border-crystal-blue/60 text-crystal-blue hover:bg-crystal-blue/10 hover:border-crystal-cyan",
  ghost: "text-muted hover:text-white hover:bg-white/5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      children,
      isLoading,
      href,
      disabled,
      type = "button",
      onClick,
    },
    ref
  ) => {
    const classes = cn(
      "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed",
      variants[variant],
      className
    );

    const content = (
      <>
        <span
          className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-xl"
          aria-hidden
        />
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          <span className="relative z-10">{children}</span>
        )}
      </>
    );

    if (href) {
      return (
        <motion.a
          href={href}
          className={cn(classes, "group")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        className={cn(classes, "group")}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
