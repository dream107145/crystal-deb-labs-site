"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/sections/Hero";
import ProjectCard from "@/components/cards/ProjectCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { PROJECTS, PORTFOLIO_FILTERS } from "@/lib/constants";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { Project, ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

export default function PortfolioContent() {
  const [filter, setFilter] = useState<ProjectCategory>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const [screenshotIndex, setScreenshotIndex] = useState(0);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === filter),
    [filter]
  );

  return (
    <>
      <Hero
        title="Our Work"
        subtitle="Explore our portfolio of successful projects across web, AI, bots, software, and blockchain."
        showCrystal={false}
        showCTA={false}
        compact
      />

      <section className="section-padding">
        <ScrollReveal>
          <div
            className="flex flex-wrap justify-center gap-3 mb-12"
            role="tablist"
            aria-label="Filter projects"
          >
            {PORTFOLIO_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  filter === f.id
                    ? "bg-crystal-blue/20 border-2 border-crystal-cyan text-crystal-cyan glow-cyan"
                    : "glass text-muted hover:text-white border border-transparent"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onClick={() => {
                  setSelected(project);
                  setScreenshotIndex(0);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </section>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ""}
      >
        {selected && (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={selected.screenshots[screenshotIndex] ?? selected.image}
                alt={`${selected.title} screenshot`}
                fill
                className="object-cover"
              />
              {selected.screenshots.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {selected.screenshots.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setScreenshotIndex(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === screenshotIndex
                          ? "bg-crystal-cyan w-6"
                          : "bg-white/40"
                      )}
                      aria-label={`Screenshot ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="text-muted leading-relaxed">{selected.description}</p>
            <div>
              <h4 className="font-heading font-semibold text-white mb-2">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {selected.techStack.map((t) => (
                  <span key={t} className="px-3 py-1 text-xs rounded-full glass">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted">
                <strong className="text-white">Client:</strong> {selected.client}
              </p>
              <p className="text-sm text-muted mt-2">
                <strong className="text-white">Results:</strong>{" "}
                {selected.outcomes}
              </p>
            </div>
            <Button href="/contact" variant="primary">
              Contact Us
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
