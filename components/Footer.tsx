"use client";

import Image from "next/image";
import Reveal from "./Reveal";

const journal = [
  {
    tag: "Method",
    title: "How steam distillation works",
    read: "6 min",
  },
  {
    tag: "Provenance",
    title: "How to read a batch note",
    read: "8 min",
  },
  {
    tag: "Field notes",
    title: "Lavender harvest in Kashmir",
    read: "5 min",
  },
];

export default function Footer() {
  return (
    <>
      {/* Journal */}
      <section id="journal" className="bg-ivory py-28 sm:py-36">
        <div className="mx-auto max-w-editorial px-6">
          <div className="flex items-end justify-between">
            <Reveal>
              <div>
                <span className="eyebrow">The Journal</span>
                <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1] text-botanical-deep">
                  Notes for better use.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href="#contact"
                className="hidden whitespace-nowrap text-[0.7rem] uppercase tracking-wide2 text-botanical underline-offset-8 transition-colors hover:text-gold-deep hover:underline sm:inline-block"
              >
                All entries
              </a>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-botanical/10 bg-botanical/10 md:grid-cols-3">
            {journal.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08} className="group bg-ivory-50">
                <a href="#contact" className="flex h-full flex-col p-8">
                  <span className="text-[0.62rem] uppercase tracking-luxe text-gold-deep">
                    {a.tag}
                  </span>
                  <h3 className="mt-5 grow font-display text-2xl leading-snug text-botanical-deep transition-colors duration-500 group-hover:text-gold-deep">
                    {a.title}
                  </h3>
                  <span className="mt-8 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-wide2 text-stone-mid">
                    {a.read} read
                    <span className="h-px w-6 bg-gold/50 transition-all duration-500 group-hover:w-10" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing + Footer */}
      <footer
        id="contact"
        className="relative overflow-hidden bg-botanical-deep pt-28 text-ivory sm:pt-36"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[40vmax] w-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,145,46,0.14),transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-editorial px-6">
          {/* Closing statement */}
          <Reveal>
            <p className="eyebrow text-gold-light">The KRIVEDA standard</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 max-w-4xl text-balance font-display text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.95]">
              Clear oils.
              <span className="text-gilded"> Carefully made.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ivory/70">
              Steam-distilled essential oils and cold-pressed carriers, named
              clearly from plant to bottle.
            </p>
          </Reveal>

          {/* Newsletter */}
          <Reveal delay={0.12}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-12 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Your email"
                aria-label="Email address"
                className="w-full rounded-full border border-ivory/20 bg-ivory/5 px-6 py-4 text-sm text-ivory placeholder:text-ivory/40 outline-none transition-colors focus:border-gold-light/60"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-[0.7rem] font-medium uppercase tracking-wide2 text-botanical-deep transition-transform duration-500 ease-luxe hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-ivory/45">
              Field notes, product care, and batch updates.
            </p>
          </Reveal>

          {/* Link columns */}
          <div className="mt-20 grid grid-cols-2 gap-10 border-t border-ivory/12 py-14 sm:grid-cols-4">
            <FooterCol
              title="Explore"
              links={["Our Philosophy", "Collection", "Origins", "Journal"]}
            />
            <FooterCol
              title="The Oils"
              links={["Rosemary", "Tea Tree", "Lavender", "Carrier oils"]}
            />
            <FooterCol
              title="Company"
              links={["Provenance", "Batch notes", "Sustainability", "Contact"]}
            />
            <div>
              <h4 className="text-[0.62rem] uppercase tracking-luxe text-ivory/45">
                Contact
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-ivory/75">
                <li>hello@kriveda.com</li>
                <li>+91 00000 00000</li>
                <li className="text-ivory/50">Crafted in India</li>
              </ul>
            </div>
          </div>

          {/* Base bar */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-ivory/12 py-10 sm:flex-row">
            <Image
              src="/images/logo.png"
              alt="KRIVEDA"
              width={130}
              height={28}
              className="h-6 w-auto"
            />
            <p className="text-[0.65rem] uppercase tracking-wide2 text-ivory/45">
              © {new Date().getFullYear()} KRIVEDA · Steam distilled · Cold
              pressed · Nothing hidden
            </p>
            <div className="flex gap-5 text-[0.65rem] uppercase tracking-wide2 text-ivory/55">
              <a href="#" className="transition-colors hover:text-gold-light">
                Instagram
              </a>
              <a href="#" className="transition-colors hover:text-gold-light">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-[0.62rem] uppercase tracking-luxe text-ivory/45">
        {title}
      </h4>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm text-ivory/75 transition-colors hover:text-gold-light"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
