"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/forms/inputClass";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setDone(true);
      setTimeout(() => router.push("/auth/signin"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="glass-strong rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-muted mb-6">Missing reset token. Please use the link from your email.</p>
        <Button href="/auth/forgot-password" variant="outline">
          Request New Link
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="glass-strong rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="heading-md gradient-text mb-4">Password Updated</h3>
        <p className="text-muted mb-6">Redirecting you to sign in...</p>
        <Button href="/auth/signin" variant="primary">
          Sign In Now
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 md:p-10 space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm" role="alert">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
          New Password <span className="text-crystal-cyan">*</span>
        </label>
        <input
          id="password"
          type="password"
          className={inputClass()}
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-white mb-2">
          Confirm Password <span className="text-crystal-cyan">*</span>
        </label>
        <input
          id="confirm"
          type="password"
          className={inputClass()}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      <Button type="submit" variant="primary" isLoading={loading} className="w-full">
        Update Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="heading-lg gradient-text text-center mb-8">Reset Password</h1>
        <Suspense fallback={<div className="glass-strong rounded-2xl p-10 animate-pulse h-64" />}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </section>
  );
}
