"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/forms/inputClass";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["customer", "developer"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signupSchema>;

export default function SignUpForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "customer" },
  });

  const onSubmit = async (data: SignUpValues) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Signup failed");
      setSuccess(json.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-10 text-center"
      >
        <div className="text-5xl mb-4">📧</div>
        <h3 className="heading-md gradient-text mb-4">Check Your Email</h3>
        <p className="text-muted mb-6">{success}</p>
        <Button href="/auth/signin" variant="outline">
          Go to Sign In
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
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          Email <span className="text-crystal-cyan">*</span>
        </label>
        <input id="email" type="email" {...register("email")} className={inputClass(errors.email)} placeholder="you@example.com" />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
          Role <span className="text-crystal-cyan">*</span>
        </label>
        <select id="role" {...register("role")} className={inputClass(errors.role)}>
          <option value="customer" className="bg-crystal-darker">Customer</option>
          <option value="developer" className="bg-crystal-darker">Developer</option>
        </select>
        <p className="text-muted text-xs mt-1">Developer accounts require admin approval after email verification.</p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
          Password <span className="text-crystal-cyan">*</span>
        </label>
        <input id="password" type="password" {...register("password")} className={inputClass(errors.password)} placeholder="Min. 8 characters" />
        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
          Confirm Password <span className="text-crystal-cyan">*</span>
        </label>
        <input id="confirmPassword" type="password" {...register("confirmPassword")} className={inputClass(errors.confirmPassword)} />
        {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-muted text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-crystal-cyan hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
