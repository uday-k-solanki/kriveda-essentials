"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  bgColor: string;
  textColor: string;
  link?: string;
  linkLabel?: string;
}

export default function AnnouncementBarClient(props: Props) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Before mount we don't know the pathname — render bar (server match).
  // After mount, hide on admin routes.
  if (mounted && pathname?.startsWith("/admin")) return null;

  return <AnnouncementBarInner {...props} />;
}

function AnnouncementBarInner({ text, bgColor, textColor, link, linkLabel }: Props) {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Always false on first render (SSR) — set via effect to avoid hydration mismatch
  const [shouldMarquee, setShouldMarquee] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!textRef.current || !containerRef.current) return;
      setShouldMarquee(textRef.current.scrollWidth > containerRef.current.clientWidth);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text]);

  return (
    <div
      className="relative z-50 w-full overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
      role="banner"
      aria-label="Site announcement"
    >
      <div className="flex items-center justify-center gap-3 px-4 py-2.5">
        <div
          ref={containerRef}
          className="relative min-w-0 flex-1 overflow-hidden"
          style={{ maxWidth: link && linkLabel ? "calc(100% - 120px)" : "100%" }}
        >
          <span
            ref={textRef}
            className={`block whitespace-nowrap text-sm font-medium ${shouldMarquee ? "animate-marquee" : "text-center"}`}
          >
            {text}
            {shouldMarquee && <span aria-hidden className="pl-16">{text}</span>}
          </span>
        </div>

        {link && linkLabel && (
          <a
            href={link}
            className="shrink-0 rounded-full border px-3 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide transition-opacity hover:opacity-80"
            style={{ borderColor: textColor }}
          >
            {linkLabel}
          </a>
        )}
      </div>
    </div>
  );
}
