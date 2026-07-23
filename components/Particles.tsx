"use client";

import { useEffect, useState } from "react";

type Particle = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
};

/**
 * Floating motes inspired by suspended botanical extract.
 * Generated client-side only to avoid SSR hydration mismatch.
 */
export default function Particles({ count = 26 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const arr = Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 3.5,
      duration: 9 + Math.random() * 14,
      delay: -Math.random() * 20,
      drift: (Math.random() - 0.5) * 40,
      opacity: 0.18 + Math.random() * 0.4,
    }));
    setParticles(arr);
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background:
              "radial-gradient(circle, rgba(230,207,139,0.95), rgba(184,145,46,0.15) 70%, transparent)",
            boxShadow: "0 0 6px rgba(212,175,78,0.5)",
            animation: `mote ${p.duration}s ease-in-out ${p.delay}s infinite`,
            // CSS var consumed by the keyframes below
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes mote {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(var(--drift), -38px) scale(1.25);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
