"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/forms/inputClass";

type SignInValues = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/profile";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>();

  const onSubmit = async (data: SignInValues) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sign in failed");

      if (json.profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

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
        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
          Password <span className="text-crystal-cyan">*</span>
        </label>
        <input id="password" type="password" {...register("password")} className={inputClass(errors.password)} />
        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
        Sign In
      </Button>

      <p className="text-center text-muted text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-crystal-cyan hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
