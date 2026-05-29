"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/constants";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  return (
    <section className="section-padding" aria-labelledby="faq-heading">
      <ScrollReveal>
        <h2 id="faq-heading" className="heading-lg text-center mb-12">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
      </ScrollReveal>

      <div className="max-w-3xl mx-auto space-y-4">
        {FAQS.map((faq, i) => (
          <ScrollReveal key={faq.id} delay={i * 0.05}>
            <div className="glass rounded-xl overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                aria-expanded={openId === faq.id}
                aria-controls={`faq-${faq.id}`}
              >
                <span className="font-heading font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-crystal-cyan shrink-0 transition-transform duration-300",
                    openId === faq.id && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    id={`faq-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-6 text-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
