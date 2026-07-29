"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import CartIcon from "./CartIcon";
import { useNavbarTheme } from "@/lib/use-navbar-theme";

const homeLinks = [
  { label: "Home", href: "/#top" },
  { label: "Our Story", href: "/#story" },
  { label: "Collection", href: "/#collection" },
  { label: "Origins", href: "/#origins" },
  { label: "Journal", href: "/#journal" },
  { label: "Contact", href: "/#contact" },
];

const catalogueLinks = [
  { label: "Home", href: "/" },
  { label: "All Oils", href: "/catalogue" },
  { label: "Essential Oils", href: "/catalogue?filter=essential" },
  { label: "Carrier Oils", href: "/catalogue?filter=carrier" },
  { label: "Our Story", href: "/#story" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navTheme = useNavbarTheme();

  const isHome = pathname === "/";
  const links = isHome ? homeLinks : catalogueLinks;

  // Dynamic color tokens based on detected background luminance
  const isDark = navTheme === "light"; // light theme = dark bg → use light text
  const textSecondary = isDark ? "text-ivory/60"        : "text-botanical/70";
  const textHover     = isDark ? "hover:text-ivory"     : "hover:text-botanical";
  const borderColor   = isDark ? "border-ivory/20"      : "border-botanical/15";
  const borderHover   = isDark ? "hover:border-ivory/50 hover:bg-white/10" : "hover:border-gold/60 hover:bg-white/40";
  const hamBg         = isDark ? "bg-ivory"             : "bg-botanical";
  const hamHover      = isDark ? "hover:bg-white/20"    : "hover:bg-white/40";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
    >
      <nav
        className={`glass flex w-full max-w-editorial items-center justify-between overflow-visible rounded-full px-4 py-1.5 transition-all duration-500 ease-luxe sm:px-6 sm:py-2 lg:px-8 lg:py-2 ${
          scrolled ? "shadow-[0_24px_60px_-30px_rgba(46,59,44,0.85)]" : ""
        }`}
        aria-label="Primary"
      >
        {/* Logo */}
        <a href="/" className="relative flex shrink-0 items-center" aria-label="KRIVEDA — home">
          <Image
            src="/images/logo.png"
            alt="KRIVEDA"
            width={400}
            height={30}
            priority
            className="h-[54px] w-auto sm:h-[60px] lg:h-[68px]"          />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className={`group relative inline-block px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-wide2 transition-colors duration-300 ${textSecondary} ${textHover}`}
              >
                {l.label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 ease-luxe group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right: CTA + cart + hamburger */}
        <div className="flex items-center gap-2">
          {isHome ? (
            <a
              href="/catalogue"
              className={`hidden rounded-full border px-4 py-2 text-[0.7rem] font-medium uppercase tracking-wide2 transition-all duration-300 ease-luxe lg:inline-block ${
                isDark
                  ? "border-gold/60 bg-gold/15 text-gold-light hover:bg-gold/25 hover:border-gold/80"
                  : "border-gold bg-gold/10 text-gold-deep hover:bg-gold/20 hover:border-gold-deep"
              }`}
            >
              Shop
            </a>
          ) : (
            <>
              <a
                href="/"
                className={`hidden rounded-full border px-4 py-2 text-[0.7rem] font-medium uppercase tracking-wide2 transition-all duration-300 ease-luxe lg:inline-block ${borderColor} ${textSecondary} ${borderHover}`}
              >
                ← Home
              </a>
              <CartIcon />
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition-colors ${hamHover} lg:hidden`}
          >
            <span className={`h-px w-5 transition-all duration-300 ${hamBg} ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-px w-5 transition-all duration-300 ${hamBg} ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-botanical-deep/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass absolute inset-x-4 top-24 rounded-3xl p-6"
            >
              <ul className="flex flex-col divide-y divide-botanical/10">
                {links.map((l, i) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-4 font-display text-2xl text-botanical transition-colors hover:text-gold-deep"
                    >
                      {l.label}
                      <span className="font-sans text-[0.65rem] tracking-luxe text-gold-deep/60">0{i + 1}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={isHome ? "/catalogue" : "/"}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4 font-display text-2xl text-gold-deep transition-colors hover:text-botanical-deep"
                  >
                    {isHome ? "Shop Now" : "← Home"}
                    <span className="font-sans text-[0.65rem] tracking-luxe text-gold-deep/60">0{links.length + 1}</span>
                  </a>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
