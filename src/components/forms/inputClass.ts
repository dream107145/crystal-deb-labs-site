import { cn } from "@/lib/utils";

export function inputClass(hasError?: { message?: string }) {
  return cn(
    "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/40 focus:outline-none focus:ring-2 transition-all",
    hasError
      ? "border-red-500 focus:ring-red-500/50"
      : "border-white/10 focus:ring-crystal-blue/50 focus:border-crystal-blue"
  );
}
