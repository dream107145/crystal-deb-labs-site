import type { Metadata } from "next";
import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Crystal Dev Labs account",
};

export default function SignInPage() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="heading-lg gradient-text text-center mb-2">Sign In</h1>
        <p className="text-muted text-center mb-8">
          Access your profile and messages
        </p>
        <Suspense fallback={<div className="glass-strong rounded-2xl p-10 animate-pulse h-80" />}>
          <SignInForm />
        </Suspense>
      </div>
    </section>
  );
}
