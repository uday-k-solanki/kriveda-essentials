"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CartIcon from "./CartIcon";

const links = [
  { label: "Home", href: "#top" },
  { label: "Our Story", href: "#story" },
  { label: "Collection", href: "#collection" },
  { label: "Origins", href: "#origins" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
    >
      <nav
        className={`glass flex w-full max-w-editorial items-center justify-between rounded-full px-5 py-2.5 transition-all duration-700 ease-luxe sm:px-7 ${
          scrolled ? "shadow-[0_24px_60px_-30px_rgba(46,59,44,0.55)]" : ""
        }`}
        aria-label="Primary"
      >
        {/* Logo */}
        <a
          href="#top"
          className="relative flex shrink-0 items-center"
          aria-label="KRIVEDA — home"
        >
          <Image
            src="/images/logo.png"
            alt="KRIVEDA"
            width={132}
            height={28}
            priority
            className="h-[22px] w-auto sm:h-[26px]"
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative inline-block px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-wide2 text-botanical/70 transition-colors duration-500 hover:text-botanical"
              >
                {l.label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 ease-luxe group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

          {/* Right: CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href="/catalogue"
            className="hidden rounded-full border border-botanical/15 px-4 py-2 text-[0.7rem] font-medium uppercase tracking-wide2 text-botanical transition-all duration-500 ease-luxe hover:border-gold/60 hover:bg-white/40 lg:inline-block"
          >
            Shop
          </a>
          <CartIcon />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition-colors hover:bg-white/40 lg:hidden"
          >
            <span
              className={`h-px w-5 bg-botanical transition-all duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-botanical transition-all duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
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
            <div
              className="absolute inset-0 bg-botanical-deep/30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass absolute inset-x-4 top-24 rounded-3xl p-6"
            >
              <ul className="flex flex-col divide-y divide-botanical/10">
                {links.map((l, i) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-4 font-display text-2xl text-botanical transition-colors hover:text-gold-deep"
                    >
                      {l.label}
                      <span className="font-sans text-[0.65rem] tracking-luxe text-gold-deep/60">
                        0{i + 1}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
