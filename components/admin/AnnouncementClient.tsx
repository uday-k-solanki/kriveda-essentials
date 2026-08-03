"use client";

import { useState } from "react";
import type { CMSAnnouncementBar } from "@/lib/cms-types";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface Props { initial: CMSAnnouncementBar; }

export default function AnnouncementClient({ initial }: Props) {
  const [bar, setBar] = useState<CMSAnnouncementBar>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const patch = <K extends keyof CMSAnnouncementBar>(k: K, v: CMSAnnouncementBar[K]) =>
    setBar((b) => ({ ...b, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementBar: bar }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Announcement Bar</h1>
          <p className="mt-0.5 text-sm text-[#6B7280]">
            The strip that appears above the navigation on every page
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-[#B8912E] px-5 py-2 text-sm font-semibold text-[#0D1117] transition-opacity disabled:opacity-60 hover:opacity-90"
        >
          {saving ? "Saving…" : saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      {/* Live preview */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.06]">
        <p className="border-b border-white/[0.06] bg-[#111827] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
          Preview
        </p>
        <div className="relative overflow-hidden" style={{ backgroundColor: bar.bgColor, color: bar.textColor }}>
          {bar.enabled ? (
            <div className="flex items-center justify-center gap-3 px-4 py-2.5 text-sm">
              <span className="whitespace-nowrap font-medium">{bar.text || "Your announcement text"}</span>
              {bar.link && bar.linkLabel && (
                <span
                  className="shrink-0 rounded-full border px-3 py-0.5 text-xs font-semibold"
                  style={{ borderColor: bar.textColor }}
                >
                  {bar.linkLabel}
                </span>
              )}
            </div>
          ) : (
            <div className="px-4 py-2.5 text-center text-xs text-[#6B7280]">
              Bar is hidden — enable it to show on the live site
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">
          <Card title="Visibility">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D1117] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Show announcement bar</p>
                <p className="mt-0.5 text-xs text-[#6B7280]">Toggle visibility across the entire site</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={bar.enabled}
                onClick={() => patch("enabled", !bar.enabled)}
                className="shrink-0 transition-colors"
                aria-label="Toggle announcement bar"
              >
                {bar.enabled
                  ? <ToggleRight size={32} className="text-[#B8912E]" strokeWidth={1.5} />
                  : <ToggleLeft size={32} className="text-[#374151]" strokeWidth={1.5} />
                }
              </button>
            </div>
          </Card>

          <Card title="Content">
            <label className="block">
              <span className={lbl}>Announcement Text</span>
              <textarea
                rows={3}
                className={inp}
                value={bar.text}
                onChange={(e) => patch("text", e.target.value)}
                placeholder="🌿 Launch Offer — Upto 40% off on all products · Free shipping above ₹999"
              />
              <p className="mt-1 text-[0.65rem] text-[#6B7280]">
                Long text scrolls automatically on narrow screens.
              </p>
            </label>
            <label className="block">
              <span className={lbl}>Link URL (optional)</span>
              <input
                className={inp}
                value={bar.link ?? ""}
                onChange={(e) => patch("link", e.target.value)}
                placeholder="/catalogue"
              />
            </label>
            <label className="block">
              <span className={lbl}>Link Label (optional)</span>
              <input
                className={inp}
                value={bar.linkLabel ?? ""}
                onChange={(e) => patch("linkLabel", e.target.value)}
                placeholder="Shop Now"
              />
            </label>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card title="Colours">
            <label className="block">
              <span className={lbl}>Background Colour</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded-lg border border-white/[0.06] bg-transparent p-1"
                  value={bar.bgColor}
                  onChange={(e) => patch("bgColor", e.target.value)}
                />
                <input
                  className={inp + " flex-1 font-mono text-xs uppercase"}
                  value={bar.bgColor}
                  onChange={(e) => patch("bgColor", e.target.value)}
                />
              </div>
            </label>
            <label className="block">
              <span className={lbl}>Text Colour</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded-lg border border-white/[0.06] bg-transparent p-1"
                  value={bar.textColor}
                  onChange={(e) => patch("textColor", e.target.value)}
                />
                <input
                  className={inp + " flex-1 font-mono text-xs uppercase"}
                  value={bar.textColor}
                  onChange={(e) => patch("textColor", e.target.value)}
                />
              </div>
            </label>
          </Card>

          <Card title="Presets">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Forest Dark",  bg: "#1C2A1E", text: "#E6CF8B" },
                { label: "Gold on Dark", bg: "#1A1200", text: "#E6CF8B" },
                { label: "Ivory Light",  bg: "#F6F1E7", text: "#2E3B2C" },
                { label: "Deep Navy",    bg: "#0F172A", text: "#A5B4FC" },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setBar((b) => ({ ...b, bgColor: p.bg, textColor: p.text }))}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0D1117] px-3 py-2 text-xs text-[#9CA3AF] transition-colors hover:border-white/[0.12] hover:text-white"
                >
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-white/10"
                    style={{ background: p.bg }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const inp =
  "w-full rounded-xl border border-white/[0.06] bg-[#0D1117] px-3 py-2 text-sm text-white placeholder-[#4B5563] outline-none transition-colors focus:border-[#B8912E]/50 focus:ring-1 focus:ring-[#B8912E]/20";

const lbl = "mb-1.5 block text-xs font-medium text-[#9CA3AF]";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
