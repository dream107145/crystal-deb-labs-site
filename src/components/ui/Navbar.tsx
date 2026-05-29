"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Button from "./Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong py-3 shadow-lg" : "py-5 bg-transparent"
      )}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label={`${SITE.name} home`}
        >
          <motion.div
            whileHover={{ rotate: 180, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="relative w-8 h-8 shrink-0"
          >
            <Image
              src={SITE.logo}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
          </motion.div>
          <span className="font-heading font-bold text-lg gradient-text">
            {SITE.name}
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "link-underline text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-crystal-cyan"
                    : "text-muted hover:text-white"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button href="/contact" variant="primary">
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/10"
          >
            <ul className="flex flex-col p-4 gap-4" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-2 text-lg",
                      pathname === link.href
                        ? "text-crystal-cyan"
                        : "text-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Button href="/contact" variant="primary" className="w-full">
                  Get Started
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
