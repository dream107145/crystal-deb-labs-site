"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setStatus("success");
        if (json.needsApproval) {
          setMessage(
            "Email verified! Your developer account is pending admin approval. You'll receive an email once approved."
          );
        } else {
          setMessage("Email verified successfully! You can now sign in.");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed");
      });
  }, [token]);

  return (
    <div className="glass-strong rounded-2xl p-10 text-center">
      {status === "loading" && (
        <>
          <div className="text-5xl mb-4 animate-pulse">⏳</div>
          <p className="text-muted">Verifying your email...</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="text-5xl mb-4">✅</div>
          <h3 className="heading-md gradient-text mb-4">Verified!</h3>
          <p className="text-muted mb-6">{message}</p>
          <Button href="/auth/signin" variant="primary">
            Sign In
          </Button>
        </>
      )}
      {status === "error" && (
        <>
          <div className="text-5xl mb-4">❌</div>
          <h3 className="heading-md text-red-400 mb-4">Verification Failed</h3>
          <p className="text-muted mb-6">{message}</p>
          <Button href="/auth/signup" variant="outline">
            Sign Up Again
          </Button>
        </>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="heading-lg gradient-text text-center mb-8">Email Verification</h1>
        <Suspense fallback={<div className="glass-strong rounded-2xl p-10 animate-pulse h-48" />}>
          <VerifyContent />
        </Suspense>
      </div>
    </section>
  );
}
