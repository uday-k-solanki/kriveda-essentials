"use client";

import Image from "next/image";
import { useState } from "react";
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

          {/* Contact Form */}
          <Reveal delay={0.12}>
            <ContactForm />
          </Reveal>

          {/* Link columns */}
          <div className="mt-20 grid grid-cols-2 gap-10 border-t border-ivory/12 py-14 sm:grid-cols-4">
            <FooterCol
              title="Explore"
              links={[
                { label: "Our Story", href: "#story" },
                { label: "Collection", href: "#collection" },
                { label: "Origins", href: "#origins" },
                { label: "Journal", href: "#journal" },
              ]}
            />
            <FooterCol
              title="The Oils"
              links={[
                { label: "Rosemary", href: "/catalogue" },
                { label: "Tea Tree", href: "/catalogue" },
                { label: "Lavender", href: "/catalogue" },
                { label: "Carrier Oils", href: "/catalogue" },
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                { label: "Our Philosophy", href: "#story" },
                { label: "Sustainability", href: "#story" },
                { label: "Batch Notes", href: "#journal" },
                { label: "Contact Us", href: "mailto:hello@kriveda.com" },
              ]}
            />
            <div>
              <h4 className="text-[0.62rem] uppercase tracking-luxe text-ivory/45">
                Contact
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-ivory/75">
                <li>
                  <a href="mailto:krivedaessentials@gmail.com" className="transition-colors hover:text-gold-light">
                    krivedaessentials@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+917016121585" className="transition-colors hover:text-gold-light">
                    +91 7016121585
                  </a>
                </li>
                <li className="text-ivory/50">Crafted in India</li>
              </ul>
              {/* Social links */}
              <h4 className="mt-8 text-[0.62rem] uppercase tracking-luxe text-ivory/45">
                Follow
              </h4>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href="https://www.instagram.com/krivedaessentials_/?hl=en" target="_blank" rel="noopener noreferrer" className="text-sm text-ivory/75 transition-colors hover:text-gold-light">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/share/1LBN2KQqg7/" target="_blank" rel="noopener noreferrer" className="text-sm text-ivory/75 transition-colors hover:text-gold-light">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Base bar */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-ivory/12 py-10 sm:flex-row">
            <Image
              src="/images/favicon.png"
              alt="KRIVEDA"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <p className="text-[0.65rem] uppercase tracking-wide2 text-ivory/45">
              © {new Date().getFullYear()} KRIVEDA · Steam distilled · Cold
              pressed · Nothing hidden
            </p>
            <div className="flex gap-5 text-[0.65rem] uppercase tracking-wide2 text-ivory/55">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold-light">
                Instagram
              </a>
              <a href="#" className="transition-colors hover:text-gold-light">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-gold-light">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[0.62rem] uppercase tracking-luxe text-ivory/45">
        {title}
      </h4>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-sm text-ivory/75 transition-colors hover:text-gold-light"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}


function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("sent");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-12 max-w-md space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Name"
          className="w-full rounded-full border border-ivory/20 bg-ivory/5 px-5 py-3.5 text-sm text-ivory placeholder:text-ivory/40 outline-none transition-colors focus:border-gold-light/60"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email"
          className="w-full rounded-full border border-ivory/20 bg-ivory/5 px-5 py-3.5 text-sm text-ivory placeholder:text-ivory/40 outline-none transition-colors focus:border-gold-light/60"
        />
      </div>
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        aria-label="Message"
        rows={4}
        className="w-full resize-none rounded-2xl border border-ivory/20 bg-ivory/5 px-5 py-3.5 text-sm text-ivory placeholder:text-ivory/40 outline-none transition-colors focus:border-gold-light/60"
      />
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-[0.7rem] font-medium uppercase tracking-wide2 text-botanical-deep transition-all duration-500 ease-luxe hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : status === "sent" ? "Message Sent ✓" : "Send Message"}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-400">Something went wrong. Please try again.</p>
        )}
      </div>
      {status === "sent" && (
        <p className="text-xs text-ivory/50">
          We've received your message and will get back to you soon.
        </p>
      )}
    </form>
  );
}
