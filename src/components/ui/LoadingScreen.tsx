"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    const alreadyLoaded = sessionStorage.getItem("cdl-loaded");
    if (alreadyLoaded) {
      setLoading(false);
      return;
    }
    sessionStorage.setItem("cdl-loaded", "true");
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-crystal-dark"
          role="status"
          aria-label="Loading"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Image
              src={SITE.logo}
              alt=""
              width={64}
              height={64}
              className="w-16 h-16"
              style={{
                filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.8))",
              }}
              priority
            />
          </motion.div>
          <motion.p
            className="mt-6 font-heading font-bold text-xl gradient-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {SITE.name}
          </motion.p>
          <motion.div
            className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-crystal-blue to-crystal-cyan"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
