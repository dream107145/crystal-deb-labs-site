"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({
  project,
  index,
  onClick,
}: ProjectCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      role="button"
      tabIndex={0}
      aria-label={`View project: ${project.title}`}
    >
      <div className="relative overflow-hidden rounded-2xl glass aspect-[4/3]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-crystal-dark via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="text-xs uppercase tracking-wider text-crystal-cyan mb-1">
            {project.category}
          </span>
          <h3 className="text-lg font-heading font-bold text-white">
            {project.title}
          </h3>
        </div>
        <motion.div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-crystal-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
        >
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-crystal-blue text-crystal-dark font-semibold">
            View Project
            <ExternalLink className="w-4 h-4" />
          </span>
        </motion.div>
      </div>
    </motion.article>
  );
}
