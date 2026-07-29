"use client";

import Image from "next/image";
import Reveal from "./Reveal";

const cards = [
  {
    kicker: "Collection 01 — Essential Oils",
    headline: "Aromatic oils for focused rituals.",
    body: "Steam-distilled botanicals for scent, scalp, bath, and blend work.",
    chips: ["Steam Distilled", "Single Ingredient", "Aromatic"],
    cta: "Explore Essential Oils",
    image: "/images/botanical/lavender.jpg",
    href: "#collection",
  },
  {
    kicker: "Collection 02 — Carrier Oils",
    headline: "Smooth bases for daily care.",
    body: "Cold-pressed oils for massage, moisture, and safe dilution.",
    chips: ["Cold Pressed", "Blend Friendly", "Everyday Care"],
    cta: "Explore Carrier Oils",
    image: "/images/botanical/almond.jpg",
    href: "#collection",
  },
];

export default function CollectionsTeaser() {
  return (
    <section className="relative bg-champagne-light py-24 sm:py-32">
      <div className="mx-auto max-w-editorial px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.kicker} delay={i * 0.1} y={40}>
              <a
                href={c.href}
                className="group relative block h-[28rem] overflow-hidden rounded-[2rem] sm:h-[34rem]"
              >
                {/* Background Image */}
                <Image
                  src={c.image}
                  alt={c.headline}
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover brightness-[0.65] contrast-[0.9] saturate-[0.8] transition-all duration-[1400ms] ease-luxe group-hover:scale-105 group-hover:brightness-[0.7]"
                />

                {/* Soft dark overlay */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Luxury gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-botanical-deep/95 via-botanical-deep/55 to-black/20" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
                  <div className="max-w-lg rounded-3xl bg-black/10 p-6 backdrop-blur-[2px]">
                    <span className="text-[0.68rem] font-medium uppercase tracking-luxe text-gold-light">
                      {c.kicker}
                    </span>

                    <h3 className="mt-4 font-display text-[clamp(2rem,3.4vw,3rem)] font-light leading-[1.02] text-ivory drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
                      {c.headline}
                    </h3>

                    <p className="mt-4 text-pretty text-base leading-relaxed text-ivory/60 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
                      {c.body}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      {c.chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex min-h-8 items-center rounded-full border border-ivory/35 bg-white/10 px-3 py-1.5 text-center text-[0.64rem] font-medium uppercase tracking-wide2 text-ivory/95 backdrop-blur-sm"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    <span className="mt-7 inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-wide2 text-ivory transition-colors group-hover:text-gold-light">
                      {c.cta}
                      <svg
                        width="16"
                        height="10"
                        viewBox="0 0 16 10"
                        fill="none"
                        aria-hidden
                        className="transition-transform duration-500 ease-luxe group-hover:translate-x-1.5"
                      >
                        <path
                          d="M1 5h13M10 1l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
