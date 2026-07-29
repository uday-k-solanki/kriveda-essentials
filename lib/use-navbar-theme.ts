"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type NavTheme = "light" | "dark";
// "light" = use light/ivory text  → navbar is over a DARK background
// "dark"  = use dark/green text   → navbar is over a LIGHT background

// Complete section map for the home page
// id → background tone
const SECTION_TONES: Record<string, NavTheme> = {
  top:          "light",  // Hero — dark bg (botanical-deep + scenery)
  story:        "dark",   // Story — light ivory bg
  philosophy:   "dark",   // Brand story — champagne/ivory bg
  collection:   "dark",   // Collection — ivory/champagne bg
  transparency: "light",  // Evidence — dark bg (botanical-deep)
  origins:      "dark",   // Origins — ivory bg
  journal:      "dark",   // Journal — ivory bg
  contact:      "light",  // Footer — dark bg (botanical-deep)
};

export function useNavbarTheme(): NavTheme {
  const [theme, setTheme] = useState<NavTheme>("light");
  const pathname = usePathname();

  useEffect(() => {
    // Non-home pages
    if (pathname !== "/") {
      // Catalogue top header is dark-green, then body is light
      // Product detail hero is dark
      if (pathname.startsWith("/products/")) {
        setTheme("light");
      } else {
        // /catalogue — dark header at top, light after scroll
        const update = () => {
          setTheme(window.scrollY < 300 ? "light" : "dark");
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
      }
      return;
    }

    // Home page — section-based detection
    const update = () => {
      const navMid = 70; // y position to test (middle of navbar)
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[id], footer[id]")
      );

      // Find the section whose bounds contain the navbar midpoint
      let matched: NavTheme = "light"; // default: top of page = dark hero
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navMid && rect.bottom > navMid) {
          const id = section.id;
          matched = SECTION_TONES[id] ?? "light";
          break;
        }
      }
      setTheme(matched);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    // Re-run after layout settles
    const t = setTimeout(update, 400);
    return () => {
      window.removeEventListener("scroll", update);
      clearTimeout(t);
    };
  }, [pathname]);

  return theme;
}
