"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SERVICES, BUDGET_OPTIONS, SITE } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ServiceId } from "@/types";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  service: z.enum(["website", "ai", "bot", "software", "blockchain"]),
  details: z
    .string()
    .min(20, "Please provide at least 20 characters of detail"),
  budget: z.string().min(1, "Please select a budget range"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") as ServiceId | null;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      service:
        preselected &&
        ["website", "ai", "bot", "software", "blockchain"].includes(
          preselected
        )
          ? preselected
          : "website",
      budget: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to send message");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-10 text-center"
        role="status"
      >
        <div className="text-5xl mb-4" aria-hidden>
          ✨
        </div>
        <h3 className="heading-md gradient-text mb-4">Message Sent!</h3>
        <p className="text-muted mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24
          hours. Reach us faster on{" "}
          <a href={SITE.discord} className="text-crystal-cyan underline">
            Discord
          </a>{" "}
          or Telegram {SITE.telegramHandle}.
        </p>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-strong rounded-2xl p-8 md:p-10 space-y-6"
      noValidate
    >
      {error && (
        <div
          className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
          Name <span className="text-crystal-cyan">*</span>
        </label>
        <input
          id="name"
          {...register("name")}
          className={inputClass(errors.name)}
          placeholder="Your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-red-400 text-sm mt-1" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          Email <span className="text-crystal-cyan">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={inputClass(errors.email)}
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-white mb-2">
          Service Type <span className="text-crystal-cyan">*</span>
        </label>
        <select
          id="service"
          {...register("service")}
          className={inputClass(errors.service)}
          aria-invalid={!!errors.service}
        >
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id} className="bg-crystal-darker">
              {s.title}
            </option>
          ))}
        </select>
        {errors.service && (
          <p className="text-red-400 text-sm mt-1" role="alert">
            {errors.service.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-white mb-2">
          Project Details <span className="text-crystal-cyan">*</span>
        </label>
        <textarea
          id="details"
          rows={5}
          {...register("details")}
          className={cn(inputClass(errors.details), "resize-y")}
          placeholder="Tell us about your project..."
          aria-invalid={!!errors.details}
        />
        {errors.details && (
          <p className="text-red-400 text-sm mt-1" role="alert">
            {errors.details.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-white mb-2">
          Budget <span className="text-crystal-cyan">*</span>
        </label>
        <select
          id="budget"
          {...register("budget")}
          className={inputClass(errors.budget)}
          aria-invalid={!!errors.budget}
        >
          <option value="" className="bg-crystal-darker">
            Select budget range
          </option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b.value} value={b.value} className="bg-crystal-darker">
              {b.label}
            </option>
          ))}
        </select>
        {errors.budget && (
          <p className="text-red-400 text-sm mt-1" role="alert">
            {errors.budget.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
        Send Message
      </Button>
    </form>
  );
}

function inputClass(hasError?: { message?: string }) {
  return cn(
    "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/40 focus:outline-none focus:ring-2 transition-all",
    hasError
      ? "border-red-500 focus:ring-red-500/50"
      : "border-white/10 focus:ring-crystal-blue/50 focus:border-crystal-blue"
  );
}
