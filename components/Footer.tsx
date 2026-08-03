"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";

const journal = [
  {
    tag: "Method",
    title: "How Steam Distillation Works",
    read: "6 min",
    content: {
      subtitle: "The oldest extraction in perfumery — and still the most honest.",
      sections: [
        {
          heading: "What is steam distillation?",
          body: `Steam distillation is a centuries-old technique for pulling volatile aromatic compounds out of plant material. The principle is simple: pass steam through crushed or fresh botanicals, let it carry the aromatic molecules with it, then cool the mixture back down into liquid. What separates is oil and hydrosol — the oil floats, the water sinks, and you collect each.

No solvents. No chemical intermediaries. Just water, heat, and time.`,
        },
        {
          heading: "Why it matters for quality",
          body: `The temperature and duration of distillation directly shape the finished oil. Distill too fast and you strip only the lightest molecules — the aroma is thin and incomplete. Distill too long and you risk degrading delicate compounds like linalyl acetate in lavender or terpinen-4-ol in tea tree.

At KRIVEDA, we work with distillers who control both variables deliberately — not industrially. The result is an oil that reflects the whole plant, not just its most volatile fraction.`,
        },
        {
          heading: "What you're actually buying",
          body: `When you open a bottle of KRIVEDA steam-distilled oil, you're holding the condensed aromatic identity of that plant — nothing added, nothing stripped beyond what distillation naturally removes.

The yield is low. Rosemary gives roughly 1–2% by weight. Lavender slightly more. This is why genuine essential oils are small-volume products, and why dilution with carrier oil or synthetic fragrance is such a persistent industry habit. We don't do either.`,
        },
        {
          heading: "A note on hydrosols",
          body: `The water that separates during distillation isn't waste — it's a hydrosol, and it carries its own gentle version of the plant's aromatic compounds. Rose hydrosol, lavender water, and rosemary mist are all byproducts of proper steam distillation. They're mild enough to use directly on skin, making them a natural companion to the concentrated oils.

We don't bottle hydrosols currently, but understanding them helps you understand the process — and why every step of distillation has value.`,
        },
      ],
    },
  },
  {
    tag: "Provenance",
    title: "How to Read a Batch Note",
    read: "8 min",
    content: {
      subtitle: "What the label tells you, what it doesn't, and how to fill the gap.",
      sections: [
        {
          heading: "What a batch note is",
          body: `A batch note is a document attached to a specific production run of an essential oil or carrier oil. It tells you when the oil was made, from what source material, and what was verified before it left the supplier.

Most consumers never see one. Most brands don't share one. We think that's a problem — not because every customer needs to decode a GC/MS report, but because the willingness to share it is itself evidence of something.`,
        },
        {
          heading: "The three things worth reading",
          body: `If you're looking at a batch note for the first time, start with three things:

**1. Botanical name.** "Lavender" is a marketing term. Lavandula angustifolia is a species. They are not interchangeable — lavandin (Lavandula x intermedia) is often sold as lavender and smells similar but has a higher camphor content and a different safety profile.

**2. Country and region of origin.** Soil, altitude, climate, and harvest timing all affect chemistry. Kashmir lavender and French lavender from the same species will smell different and have different linalool levels. Neither is better — but they're different, and you should know which you're buying.

**3. Key marker compounds.** For rosemary, that's 1,8-cineole. For tea tree, it's terpinen-4-ol. These are the compounds that define the oil's character and are the most commonly diluted or adulterated. A batch note that lists verified marker levels is a batch note you can trust.`,
        },
        {
          heading: "What a batch note can't tell you",
          body: `A batch note verifies chemistry at the point of testing — it doesn't guarantee how the oil was stored between then and when it reaches you, or how long it sat in a warehouse.

This is why we pay attention to shelf life, packaging, and turnover. Dark glass, airtight seals, and cool storage matter as much as what's in the bottle. Chemistry is only the beginning of quality.`,
        },
        {
          heading: "Our current practice",
          body: `Every KRIVEDA oil is sourced from suppliers who can produce documentation. We don't publish full GC/MS reports on the product page — they're dense and not genuinely useful for most buyers — but we keep them on file, and we're happy to share on request.

The batch note mindset, more than any single document, is what we want you to take from this. Ask questions. Expect answers. That's what transparency means in practice.`,
        },
      ],
    },
  },
  {
    tag: "Field Notes",
    title: "Lavender Harvest in Kashmir",
    read: "5 min",
    content: {
      subtitle: "A brief account from the valley where our lavender is grown.",
      sections: [
        {
          heading: "The valley in June",
          body: `Kashmir's lavender season is short — typically three to four weeks between late June and mid-July, timed to the moment when the flower heads reach peak bloom but before the seed sets. Miss the window and the linalyl acetate drops; the oil becomes flatter, less floral, more herbaceous.

The fields in the Bhaderwah and Doda districts sit between 1,500 and 1,800 metres. At that altitude, the temperature rarely exceeds 25°C during flowering, which preserves the delicate top notes that make high-altitude lavender distinctive. The nights are cold — often under 10°C — and this daily temperature swing is part of what concentrates the aromatic compounds in the flowers.`,
        },
        {
          heading: "The harvest",
          body: `Harvest is done by hand. Mechanical cutting risks bruising the stems and introducing moisture into the cut material, both of which affect distillation. Harvesters work in the early morning before the day's heat begins to volatilise the surface oils — the same logic that governs rose picking in Bulgaria and jasmine in Grasse.

Bundles are taken directly to the distillation unit, which in most Kashmir operations is a small copper still or stainless unit run by the farming family or a collective. Fresh-to-still time matters: the longer the cut material sits, the more it begins to break down. Most of the lavender we source goes to still within six hours of harvest.`,
        },
        {
          heading: "What gets lost in scale",
          body: `Industrial lavender production — primarily in France and increasingly in China — runs on mechanical harvesting, centralised distillation, and high-volume throughput. The economics favour speed over timing. The result is a consistent product, but consistency here means averaging out the variation that makes place-specific lavender interesting.

Kashmir lavender is not yet industrialised. The farms are small, the stills are local, and the bottleneck is hand labour. This makes it slower and more expensive to source. It also means the oil we carry tastes of its place in a way that commodity lavender doesn't.`,
        },
        {
          heading: "A note on year-to-year variation",
          body: `Our Kashmir lavender will vary between harvests. Rainfall timing, early frost, and harvest date all shift the chemistry slightly. This is not a quality failure — it's what place-based sourcing produces. If you order from us across multiple years and notice the scent has shifted, that shift is the crop reporting on its season.

We'll always note significant variation in our batch documentation. What we won't do is blend batches to eliminate it.`,
        },
      ],
    },
  },
];

type JournalEntry = (typeof journal)[number];

function JournalModal({ entry, onClose }: { entry: JournalEntry; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-botanical-deep/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-ivory shadow-[0_40px_80px_-20px_rgba(28,42,30,0.7)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="journal-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-botanical/10 px-8 pb-6 pt-8">
          <div>
            <span className="text-[0.62rem] uppercase tracking-luxe text-gold-deep">{entry.tag}</span>
            <h2
              id="journal-modal-title"
              className="mt-2 font-display text-[clamp(1.5rem,4vw,2.2rem)] font-light leading-tight text-botanical-deep"
            >
              {entry.title}
            </h2>
            <p className="mt-2 text-sm italic text-stone-mid">{entry.content.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close article"
            className="ml-4 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-botanical/20 text-botanical/60 transition-colors hover:bg-botanical hover:text-ivory"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body — book-style */}
        <div
          className="overflow-y-auto overscroll-contain px-8 py-8"
          data-lenis-prevent
        >
          <div className="mx-auto max-w-prose space-y-8">
            {entry.content.sections.map((s, i) => (
              <div key={i}>
                <h3 className="font-display text-xl text-botanical-deep">{s.heading}</h3>
                <div className="mt-3 space-y-4">
                  {s.body.split("\n\n").map((para, j) => (
                    <p key={j} className="text-[0.95rem] leading-[1.8] text-stone-deep">
                      {para.startsWith("**") ? (
                        <span dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                      ) : para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer read time */}
          <div className="mt-10 flex items-center gap-3 border-t border-botanical/10 pt-6">
            <span className="h-px w-8 bg-gold/50" />
            <span className="text-[0.65rem] uppercase tracking-luxe text-stone-mid">{entry.read} read</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface FooterProps {
  closingEyebrow?: string;
  closingHeadline?: string;
  closingSubheading?: string;
}

export default function Footer({
  closingEyebrow = "The KRIVEDA standard",
  closingHeadline = "Clear oils. Carefully made.",
  closingSubheading = "Steam-distilled essential oils and cold-pressed carriers, named clearly from plant to bottle.",
}: FooterProps) {
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [activeLegal, setActiveLegal] = useState<"privacy" | "terms" | null>(null);

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
          </div>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-botanical/10 bg-botanical/10 md:grid-cols-3">
            {journal.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08} className="group bg-ivory-50">
                <button
                  onClick={() => setActiveEntry(a)}
                  className="flex h-full w-full flex-col p-8 text-left"
                >
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
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journal modal */}
      <AnimatePresence>
        {activeEntry && (
          <JournalModal entry={activeEntry} onClose={() => setActiveEntry(null)} />
        )}
      </AnimatePresence>

      {/* Closing + Footer */}
      <footer
        id="contact"
        className="relative overflow-hidden bg-botanical-deep pt-28 text-ivory sm:pt-36"
      >
        {/* Background watermark — "Kriveda" outlined text */}
        <WatermarkText />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[40vmax] w-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,145,46,0.14),transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-editorial px-6">
          {/* Closing statement */}
          <Reveal>
            <p className="eyebrow text-gold-light">{closingEyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 max-w-4xl text-balance font-display text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.95]">
              {closingHeadline.includes(".") ? (
                <>
                  {closingHeadline.split(".")[0]}.
                  <span className="text-gilded"> {closingHeadline.split(".").slice(1).join(".").trim()}</span>
                </>
              ) : (
                closingHeadline
              )}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ivory/70">
              {closingSubheading}
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
                { label: "Jojoba", href: "/catalogue" },
                { label: "Sweet Almond", href: "/catalogue" },
                { label: "Virgin Coconut", href: "/catalogue" },
              ]}
            />
            <div>
              <FooterCol
                title="Company"
                links={[
                  { label: "Contact Us", href: "mailto:support@kriveda.onmicrosoft.com" },
                ]}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-[0.62rem] uppercase tracking-luxe text-ivory/45">Contact</h4>
              <ul className="mt-5 space-y-3 text-sm text-ivory/75">
                <li>
                  <a href="mailto:support@kriveda.onmicrosoft.com" className="break-all transition-colors hover:text-gold-light">
                    support@kriveda.onmicrosoft.com
                  </a>
                </li>
                <li>
                  ARISTO AURA,IN FRONT OF SANGHANI SKYZ,BESIDE AARNA 84, NAVRACHNA-BHAYLI ROAD VADODARA, GUJARAT 391410
                </li>
                <li>
                  <a href="tel:+917016121585" className="transition-colors hover:text-gold-light">
                    +91 7016121585
                  </a>
                </li>
                <li className="text-ivory/50">Crafted in India</li>
              </ul>
              <h4 className="mt-8 text-[0.62rem] uppercase tracking-luxe text-ivory/45">Follow</h4>
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
              © 2026 Kriveda Essentials · All rights reserved
            </p>
            <div className="flex gap-5 text-[0.65rem] uppercase tracking-wide2 text-ivory/55">
              <button
                onClick={() => setActiveLegal("privacy")}
                className="transition-colors hover:text-gold-light"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveLegal("terms")}
                className="transition-colors hover:text-gold-light"
              >
                Terms
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal modals */}
      <AnimatePresence>
        {activeLegal && (
          <LegalModal type={activeLegal} onClose={() => setActiveLegal(null)} />
        )}
      </AnimatePresence>
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

const legalContent = {
  privacy: {
    title: "Privacy Policy",
    updated: "January 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        body: `When you visit our website or place an order, we may collect the following information: your name, email address, phone number, shipping address, and payment details. We also collect non-personal data such as browser type, IP address, and pages visited to improve our website experience.`,
      },
      {
        heading: "2. How We Use Your Information",
        body: `We use your personal information to process and fulfil your orders, communicate with you about your purchase, send order confirmations and shipping updates, respond to customer service enquiries, and improve our website and product offerings. We do not sell, trade, or transfer your personal information to third parties without your consent, except as required to fulfil your order (e.g. courier services).`,
      },
      {
        heading: "3. Data Security",
        body: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. Payment information is processed through secure, encrypted channels and we do not store card details on our servers.`,
      },
      {
        heading: "4. Cookies",
        body: `Our website uses cookies to enhance your browsing experience, remember your preferences, and analyse website traffic. You may choose to disable cookies through your browser settings, though this may affect the functionality of certain parts of our site.`,
      },
      {
        heading: "5. Third-Party Services",
        body: `We may use third-party services such as analytics providers and payment processors. These services have their own privacy policies and we encourage you to review them. We are not responsible for the privacy practices of third-party websites linked from our site.`,
      },
      {
        heading: "6. Your Rights",
        body: `You have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, and opt out of marketing communications at any time. To exercise any of these rights, please contact us at krivedaessentials@gmail.com.`,
      },
      {
        heading: "7. Contact",
        body: `For any questions regarding this Privacy Policy, please reach out to us at krivedaessentials@gmail.com or call +91 7016121585. We will respond within 5 business days.`,
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "January 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: `By accessing or using the Kriveda Essentials website and purchasing our products, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website or services.`,
      },
      {
        heading: "2. Products and Descriptions",
        body: `We make every effort to display our products accurately, including descriptions, ingredients, and images. However, we do not warrant that product descriptions or other content on the site are complete, accurate, or error-free. Colours and appearances may vary slightly due to screen settings.

Our essential oils and carrier oils are for external use only unless explicitly stated otherwise. Always perform a patch test before use. Keep out of reach of children. Consult a healthcare professional before use if pregnant, nursing, or if you have a medical condition.`,
      },
      {
        heading: "3. Orders and Payment",
        body: `All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion. Prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We accept major payment methods as displayed at checkout.`,
      },
      {
        heading: "4. Shipping and Delivery",
        body: `We aim to dispatch orders within 1–2 business days. Same-day shipping is available for orders placed before the daily cut-off time, subject to availability. Delivery timelines vary by location and are estimates only — we are not liable for delays caused by courier services or circumstances beyond our control.`,
      },
      {
        heading: "5. Returns and Refunds",
        body: `If you receive a damaged or incorrect product, please contact us within 48 hours of delivery with photographic evidence. We will arrange a replacement or refund at no additional cost. Due to the nature of our products, we do not accept returns of opened items unless they are faulty. Unused, sealed products may be returned within 7 days of receipt for a full refund.`,
      },
      {
        heading: "6. Intellectual Property",
        body: `All content on this website — including text, images, logos, and design — is the property of Kriveda Essentials and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content without our prior written permission.`,
      },
      {
        heading: "7. Limitation of Liability",
        body: `Kriveda Essentials shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or website. Our maximum liability in any event shall not exceed the amount paid for the specific product giving rise to the claim.`,
      },
      {
        heading: "8. Governing Law",
        body: `These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts of Gujarat, India.`,
      },
      {
        heading: "9. Changes to Terms",
        body: `We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes your acceptance of the revised terms.`,
      },
    ],
  },
};

function WatermarkText() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex items-end justify-center overflow-hidden select-none"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouse({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ pointerEvents: "auto", height: "340px" }}
    >
      {/* Spotlight glow that follows cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 280px at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(184,145,46,0.18) 0%, transparent 70%)`,
          }}
        />
      )}
      <span
        className="block select-none whitespace-nowrap pb-4 font-display font-bold leading-none"
        style={{
          fontSize: "clamp(5rem, 22vw, 18rem)",
          color: "transparent",
          WebkitTextStroke: "1.5px",
          WebkitTextStrokeColor: "transparent",
          backgroundImage: "linear-gradient(135deg, rgba(184,145,46,0.18) 0%, rgba(230,207,139,0.22) 40%, rgba(151,115,22,0.15) 70%, rgba(184,145,46,0.18) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          letterSpacing: "-0.02em",
          transition: "filter 0.4s ease",
          filter: isHovered ? "drop-shadow(0 0 40px rgba(184,145,46,0.35))" : "none",
        }}
      >
        Kriveda
      </span>
    </div>
  );
}

function LegalModal({ type, onClose }: { type: "privacy" | "terms"; onClose: () => void }) {
  const content = legalContent[type];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
    >
      <motion.div
        className="absolute inset-0 bg-botanical-deep/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-ivory shadow-[0_40px_80px_-20px_rgba(28,42,30,0.7)]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-botanical/10 px-8 pb-6 pt-8">
          <div>
            <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] font-light leading-tight text-botanical-deep">
              {content.title}
            </h2>
            <p className="mt-1 text-[0.62rem] uppercase tracking-luxe text-stone-mid">
              Last updated: {content.updated}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-4 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-botanical/20 text-botanical/60 transition-colors hover:bg-botanical hover:text-ivory"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto overscroll-contain px-8 py-8" data-lenis-prevent>
          <div className="mx-auto max-w-prose space-y-7">
            {content.sections.map((s, i) => (
              <div key={i}>
                <h3 className="font-display text-lg text-botanical-deep">{s.heading}</h3>
                <div className="mt-2 space-y-3">
                  {s.body.split("\n\n").map((para, j) => (
                    <p key={j} className="text-[0.9rem] leading-[1.8] text-stone-deep">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-3 border-t border-botanical/10 pt-6">
            <span className="h-px w-8 bg-gold/50" />
            <span className="text-[0.62rem] uppercase tracking-luxe text-stone-mid">
              © 2026 Kriveda Essentials · All rights reserved
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
