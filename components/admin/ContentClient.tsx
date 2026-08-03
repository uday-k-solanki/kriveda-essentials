"use client";

import { useState } from "react";
import type { CMSSiteContent } from "@/lib/cms-types";

interface Props { initial: CMSSiteContent; }

type Section = "hero" | "collection" | "transparency" | "footer";

export default function ContentClient({ initial }: Props) {
  const [content, setContent] = useState<CMSSiteContent>(initial);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const patch = (section: Section, key: string, value: string) =>
    setContent((c) => ({ ...c, [section]: { ...c[section], [key]: value } }));

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteContent: content }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const sections: { key: Section; label: string; icon: string }[] = [
    { key: "hero", label: "Hero Banner", icon: "🏔️" },
    { key: "collection", label: "Collection Header", icon: "🧪" },
    { key: "transparency", label: "Transparency Section", icon: "🔬" },
    { key: "footer", label: "Footer Closing", icon: "📜" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Site Content</h1>
          <p className="mt-0.5 text-xs text-[#6B7280]">Edit text copy for each section of the live site</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-[#B8912E] px-5 py-2 text-sm font-medium text-[#0D1117] disabled:opacity-60 hover:opacity-90"
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Section picker */}
        <nav className="w-48 shrink-0 border-r border-white/[0.06] bg-[#0D1117] p-3">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`mb-0.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${activeSection === s.key ? "bg-[#B8912E]/15 text-[#E6CF8B]" : "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-white"}`}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row">
          {/* Fields */}
          <div className="w-full border-r border-white/[0.06] p-6 lg:w-1/2">
            {activeSection === "hero" && (
              <FieldSet title="Hero Banner — above the fold">
                <F label="Eyebrow text (small uppercase above headline)">
                  <input className={inp} value={content.hero.eyebrow} onChange={(e) => patch("hero", "eyebrow", e.target.value)} />
                </F>
                <F label="Main Headline">
                  <input className={inp} value={content.hero.headline} onChange={(e) => patch("hero", "headline", e.target.value)} />
                </F>
                <F label="Sub-headline">
                  <input className={inp} value={content.hero.subheadline} onChange={(e) => patch("hero", "subheadline", e.target.value)} />
                </F>
                <F label="Primary CTA button text">
                  <input className={inp} value={content.hero.ctaPrimary} onChange={(e) => patch("hero", "ctaPrimary", e.target.value)} />
                </F>
                <F label="Secondary CTA button text">
                  <input className={inp} value={content.hero.ctaSecondary} onChange={(e) => patch("hero", "ctaSecondary", e.target.value)} />
                </F>
              </FieldSet>
            )}
            {activeSection === "collection" && (
              <FieldSet title="Collection Section Header">
                <F label="Eyebrow"><input className={inp} value={content.collection.eyebrow} onChange={(e) => patch("collection", "eyebrow", e.target.value)} /></F>
                <F label="Headline"><input className={inp} value={content.collection.headline} onChange={(e) => patch("collection", "headline", e.target.value)} /></F>
              </FieldSet>
            )}
            {activeSection === "transparency" && (
              <FieldSet title="Transparency / Evidence Section">
                <F label="Eyebrow"><input className={inp} value={content.transparency.eyebrow} onChange={(e) => patch("transparency", "eyebrow", e.target.value)} /></F>
                <F label="Headline"><input className={inp} value={content.transparency.headline} onChange={(e) => patch("transparency", "headline", e.target.value)} /></F>
                <F label="Subheading">
                  <textarea rows={3} className={inp} value={content.transparency.subheading} onChange={(e) => patch("transparency", "subheading", e.target.value)} />
                </F>
              </FieldSet>
            )}
            {activeSection === "footer" && (
              <FieldSet title="Footer Closing Copy">
                <F label="Closing Eyebrow"><input className={inp} value={content.footer.closingEyebrow} onChange={(e) => patch("footer", "closingEyebrow", e.target.value)} /></F>
                <F label="Closing Headline"><input className={inp} value={content.footer.closingHeadline} onChange={(e) => patch("footer", "closingHeadline", e.target.value)} /></F>
                <F label="Closing Subheading">
                  <textarea rows={3} className={inp} value={content.footer.closingSubheading} onChange={(e) => patch("footer", "closingSubheading", e.target.value)} />
                </F>
              </FieldSet>
            )}
          </div>

          {/* Preview */}
          <div className="w-full overflow-y-auto bg-[#0A0F0A] p-6 lg:w-1/2">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[#6B7280]">Live Preview</p>
            {activeSection === "hero" && (
              <div className="overflow-hidden rounded-2xl bg-[#1C2A1E] px-6 py-10 text-center">
                <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[#E6CF8B]/70">{content.hero.eyebrow || "Eyebrow text"}</p>
                <h2 className="mt-3 font-serif text-3xl font-light leading-tight text-[#F6F1E7]">{content.hero.headline || "Headline"}</h2>
                <p className="mt-2 text-sm italic text-[#F6F1E7]/60">{content.hero.subheadline || "Subheadline"}</p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <span className="rounded-full bg-[#B8912E] px-5 py-2 text-xs font-medium text-[#0D1117]">{content.hero.ctaPrimary || "CTA Primary"}</span>
                  <span className="rounded-full border border-[#F6F1E7]/30 px-5 py-2 text-xs text-[#F6F1E7]/70">{content.hero.ctaSecondary || "CTA Secondary"}</span>
                </div>
              </div>
            )}
            {activeSection === "collection" && (
              <div className="overflow-hidden rounded-2xl bg-[#F6F1E7] px-6 py-10 text-center">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#B8912E]">{content.collection.eyebrow || "Eyebrow"}</p>
                <h2 className="mt-3 font-serif text-3xl font-light text-[#2E3B2C]">{content.collection.headline || "Headline"}</h2>
              </div>
            )}
            {activeSection === "transparency" && (
              <div className="overflow-hidden rounded-2xl bg-[#1C2A1E] px-6 py-10 text-center">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#E6CF8B]/70">{content.transparency.eyebrow || "Eyebrow"}</p>
                <h2 className="mt-3 font-serif text-3xl font-light text-[#F6F1E7]">{content.transparency.headline || "Headline"}</h2>
                <p className="mt-3 text-sm text-[#F6F1E7]/60">{content.transparency.subheading || "Subheading"}</p>
              </div>
            )}
            {activeSection === "footer" && (
              <div className="overflow-hidden rounded-2xl bg-[#0D1A0F] px-6 py-10 text-center">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#E6CF8B]/60">{content.footer.closingEyebrow || "Eyebrow"}</p>
                <h2 className="mt-3 font-serif text-3xl font-light text-[#F6F1E7]">{content.footer.closingHeadline || "Headline"}</h2>
                <p className="mt-3 text-sm text-[#F6F1E7]/55">{content.footer.closingSubheading || "Subheading"}</p>
              </div>
            )}
            <p className="mt-4 text-center text-[0.65rem] text-[#4B5563]">
              Changes are reflected on the live site after saving.{" "}
              <a href="/" target="_blank" className="text-[#B8912E] hover:underline">Open live site →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full rounded-xl border border-white/[0.06] bg-[#0D1117] px-3 py-2 text-sm text-white placeholder-[#4B5563] outline-none focus:border-[#B8912E]/50 focus:ring-1 focus:ring-[#B8912E]/20";

function FieldSet({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-5 text-xs font-medium uppercase tracking-wide text-[#6B7280]">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[#9CA3AF]">{label}</label>
      {children}
    </div>
  );
}
