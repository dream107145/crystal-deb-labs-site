"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailDot {
  id: number;
  x: number;
  y: number;
}

export default function MouseTrail() {
  const [dots, setDots] = useState<TrailDot[]>([]);
  const [bursts, setBursts] = useState<TrailDot[]>([]);
  const idRef = useRefCounter();

  const addDot = useCallback((x: number, y: number) => {
    const id = idRef.current++;
    setDots((prev) => [...prev.slice(-8), { id, x, y }]);
    setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== id));
    }, 500);
  }, [idRef]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => addDot(e.clientX, e.clientY);
    const onClick = (e: MouseEvent) => {
      const id = idRef.current++;
      setBursts((prev) => [
        ...prev,
        { id, x: e.clientX, y: e.clientY },
      ]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 600);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, [addDot, idRef]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]" aria-hidden>
      <AnimatePresence>
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-3 h-3 rounded-full bg-crystal-cyan/60 blur-sm"
            style={{
              left: dot.x - 6,
              top: dot.y - 6,
              boxShadow: "0 0 12px rgba(0, 245, 255, 0.8)",
            }}
          />
        ))}
        {bursts.map((burst) => (
          <motion.div
            key={`burst-${burst.id}`}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute w-4 h-4 rounded-full border-2 border-crystal-blue"
            style={{ left: burst.x - 8, top: burst.y - 8 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function useRefCounter() {
  return useRef(0);
}
