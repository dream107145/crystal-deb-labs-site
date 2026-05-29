"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import type { TeamMember } from "@/types";

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export default function TeamCard({ member, index }: TeamCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-strong rounded-2xl p-6 text-center transition-transform duration-200"
    >
      <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-crystal-blue/50">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-xl font-heading font-bold text-white">{member.name}</h3>
      <p className="text-crystal-cyan text-sm mb-3">{member.role}</p>
      <p className="text-muted text-sm leading-relaxed mb-4">{member.bio}</p>
      <div className="flex justify-center gap-4">
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-crystal-cyan transition-colors"
            aria-label={`${member.name} GitHub`}
          >
            <FaGithub className="w-5 h-5" />
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-crystal-cyan transition-colors"
            aria-label={`${member.name} LinkedIn`}
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
        )}
        {member.twitter && (
          <a
            href={member.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-crystal-cyan transition-colors"
            aria-label={`${member.name} Twitter`}
          >
            <FaTwitter className="w-5 h-5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
