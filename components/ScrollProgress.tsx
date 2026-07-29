"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

export default function ScrollProgress() {
  const [visible, setVisible] = useState(false);
  const rawProgress = useMotionValue(0);
  const spring = useSpring(rawProgress, { stiffness: 100, damping: 20 });

  const size = 44;
  const strokeW = 2.5;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;

  const strokeDashoffset = useTransform(spring, (v) => circ - v * circ);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      rawProgress.set(total > 0 ? scrolled / total : 0);
      setVisible(scrolled > 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rawProgress]);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Progress ring */}
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(46,59,44,0.12)" strokeWidth={strokeW} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#B8912E"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          style={{ strokeDashoffset }}
        />
      </svg>
      {/* Glass button */}
      <span className="glass relative flex h-8 w-8 items-center justify-center rounded-full">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-botanical-deep" aria-hidden>
          <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </motion.button>
  );
}
