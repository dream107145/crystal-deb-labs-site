"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserManagement from "@/components/admin/UserManagement";
import PortfolioManagement from "@/components/admin/PortfolioManagement";
import ContactInfoManagement from "@/components/admin/ContactInfoManagement";
import RequestManagement from "@/components/admin/RequestManagement";
import TestimonialManagement from "@/components/admin/TestimonialManagement";
import Button from "@/components/ui/Button";
import { signOutUser } from "@/lib/signOut";
import { cn } from "@/lib/utils";

type Tab = "requests" | "users" | "portfolio" | "testimonials" | "contact";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("requests");

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
    router.refresh();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "requests", label: "Requests" },
    { id: "users", label: "Users" },
    { id: "portfolio", label: "Portfolio" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact Info" },
  ];

  return (
    <section className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading-lg gradient-text">Admin Dashboard</h1>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm transition-colors",
                tab === t.id
                  ? "bg-crystal-blue/20 text-crystal-cyan"
                  : "text-muted hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "requests" && <RequestManagement />}
        {tab === "users" && <UserManagement />}
        {tab === "portfolio" && <PortfolioManagement />}
        {tab === "testimonials" && <TestimonialManagement />}
        {tab === "contact" && <ContactInfoManagement />}
      </div>
    </section>
  );
}
