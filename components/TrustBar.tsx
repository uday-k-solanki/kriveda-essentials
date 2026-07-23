"use client";

import Reveal from "./Reveal";
import { trust } from "@/lib/data";

export default function TrustBar() {
  return (
    <section className="relative z-10 bg-ivory">
      <div className="mx-auto max-w-editorial px-6">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-botanical/10 bg-botanical/10 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t, i) => (
            <Reveal
              key={t.title}
              delay={i * 0.07}
              className="group bg-ivory-50 p-7 transition-colors duration-500 hover:bg-ivory-100"
            >
              <span className="font-sans text-[0.66rem] font-medium tracking-luxe text-gold-deep">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-display text-2xl text-botanical-deep">
                {t.title}
              </h3>
              <span className="mt-3 block h-px w-8 bg-gold/40 transition-all duration-500 group-hover:w-14" />
              <p className="mt-4 text-[0.95rem] leading-relaxed text-stone-deep">
                {t.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
