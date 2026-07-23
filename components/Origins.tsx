"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { origins } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Origins() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".origin-panel");
      const trackEl = track.current!;
      const distance = trackEl.scrollWidth - window.innerWidth;

      const tween = gsap.to(trackEl, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: reduce ? true : 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (fill.current)
              fill.current.style.transform = `scaleX(${self.progress})`;
            setActive(
              Math.min(
                panels.length - 1,
                Math.round(self.progress * (panels.length - 1))
              )
            );
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="origins" className="relative bg-ivory">
      {/* Intro */}
      <div className="mx-auto max-w-editorial px-6 pb-14 pt-28 sm:pt-36">
        <span className="eyebrow">The Land</span>
        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4.75rem)] font-light leading-[0.98] tracking-[-0.01em] text-botanical-deep">
            Geography is not marketing here.
            <span className="block italic text-stone-deep">
              It is chemistry.
            </span>
          </h2>
          <p className="max-w-sm text-pretty leading-relaxed text-stone-deep md:text-right">
            Where a plant grows changes what it produces. Six landscapes across
            three continents — origin as specification, not story.
          </p>
        </div>
      </div>

      {/* Pinned horizontal journey (desktop) / vertical stack (mobile) */}
      <div ref={container} className="relative md:overflow-hidden">
        <div
          ref={track}
          className="flex flex-col md:h-screen md:flex-row md:flex-nowrap"
        >
          {origins.map((o, i) => (
            <article
              key={o.place}
              className="origin-panel relative flex min-h-[90vh] w-full shrink-0 flex-col justify-end overflow-hidden md:h-screen md:min-h-0 md:w-screen"
            >
              <Image
                src={o.image}
                alt={`${o.place}, ${o.region}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
              {/* legibility gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

              {/* giant index numeral */}
              <span className="pointer-events-none absolute right-6 top-24 select-none font-display text-[26vw] leading-none text-white/10 md:right-[6vw] md:top-[14vh] md:text-[15vw]">
                0{i + 1}
              </span>

              {/* content */}
              <div className="relative z-10 mx-auto w-full max-w-editorial px-6 pb-20 md:px-[6vw] md:pb-28">
                <p className="mb-4 flex items-center gap-3 text-[0.62rem] uppercase tracking-luxe text-white/75">
                  <span className="h-px w-8 bg-gold-light/70" />
                  {o.coords} · {o.detail}
                </p>
                <h3 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.9] text-white">
                  {o.place}
                </h3>
                <p className="mt-1 font-display text-2xl italic text-gold-pale">
                  {o.region}
                </p>
                <div className="mt-7 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
                  <p className="max-w-xl text-pretty leading-relaxed text-white/85">
                    {o.story}
                  </p>
                  <p className="text-sm uppercase tracking-wide2 text-white/60 md:text-right">
                    Source of
                    <span className="mt-1 block font-sans text-lg normal-case tracking-normal text-gold-light">
                      {o.ingredient}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Progress rail (desktop) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden px-[6vw] pb-6 md:block">
          <div className="mx-auto flex max-w-editorial items-center gap-4">
            <span className="text-[0.62rem] uppercase tracking-luxe text-white/80">
              {origins[active].place}
            </span>
            <div className="relative h-px flex-1 bg-white/25">
              <div
                ref={fill}
                className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gold-light"
              />
            </div>
            <span className="text-[0.62rem] tracking-luxe text-white/80">
              0{active + 1} / 0{origins.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
