"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/forms/inputClass";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="heading-lg gradient-text text-center mb-2">Forgot Password</h1>
        <p className="text-muted text-center mb-8">
          We&apos;ll email you a link to reset your password
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-2xl p-10 text-center"
          >
            <div className="text-5xl mb-4">📧</div>
            <h3 className="heading-md gradient-text mb-4">Check Your Email</h3>
            <p className="text-muted mb-6">
              If an account exists for {email}, a reset link has been sent. The
              link expires in 1 hour.
            </p>
            <Button href="/auth/signin" variant="outline">
              Back to Sign In
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 md:p-10 space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm" role="alert">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email <span className="text-crystal-cyan">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={inputClass()}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" isLoading={loading} className="w-full">
              Send Reset Link
            </Button>
            <p className="text-center text-muted text-sm">
              Remembered it?{" "}
              <Link href="/auth/signin" className="text-crystal-cyan hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
