import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Hero from "@/components/sections/Hero";
import ContactForm from "@/components/forms/ContactForm";
import FAQ from "@/components/sections/FAQ";
import { SITE } from "@/lib/constants";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Crystal Dev Labs. Submit your project details and we'll respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Get In Touch"
        subtitle="Ready to start your next project? We'd love to hear from you."
        showCrystal={false}
        showCTA={false}
        compact
      />

      <section className="section-padding">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <ScrollReveal direction="left">
            <Suspense fallback={<div className="glass-strong rounded-2xl p-10 h-96 animate-pulse" />}>
              <ContactForm />
            </Suspense>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="space-y-8">
              <h2 className="heading-md text-white">Contact Information</h2>
              <div className="space-y-6">
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-4 glass rounded-xl p-4 hover:glow-cyan-hover transition-shadow group"
                >
                  <Mail className="w-6 h-6 text-crystal-blue group-hover:text-crystal-cyan" />
                  <div>
                    <p className="text-sm text-muted">Email</p>
                    <p className="text-white font-medium">{SITE.email}</p>
                  </div>
                </a>
                <a
                  href={SITE.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 glass rounded-xl p-4 hover:glow-cyan-hover transition-shadow group"
                >
                  <MessageCircle className="w-6 h-6 text-crystal-purple group-hover:text-crystal-cyan" />
                  <div>
                    <p className="text-sm text-muted">Discord</p>
                    <p className="text-white font-medium">Join our server</p>
                  </div>
                </a>
              </div>

              <div>
                <h3 className="font-heading font-semibold text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 glass rounded-xl hover:glow-cyan text-muted hover:text-crystal-cyan transition-all"
                    aria-label="GitHub"
                  >
                    <FaGithub className="w-6 h-6" />
                  </a>
                  <a
                    href={SITE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 glass rounded-xl hover:glow-cyan text-muted hover:text-crystal-cyan transition-all"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                  <a
                    href={SITE.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 glass rounded-xl hover:glow-cyan text-muted hover:text-crystal-cyan transition-all"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FAQ />
    </>
  );
}
