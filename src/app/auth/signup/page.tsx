import type { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Crystal Dev Labs account",
};

export default function SignUpPage() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="heading-lg gradient-text text-center mb-2">Create Account</h1>
        <p className="text-muted text-center mb-8">
          Join Crystal Dev Labs as a customer or developer
        </p>
        <SignUpForm />
      </div>
    </section>
  );
}
