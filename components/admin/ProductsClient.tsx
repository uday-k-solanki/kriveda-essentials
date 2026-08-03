"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import type { CMSProduct, CMSCategory } from "@/lib/cms-types";
import { invalidateCMSCache } from "@/lib/use-cms-products";

interface Props {
  initialProducts: CMSProduct[];
  categories: CMSCategory[];
}

const emptyProduct = (): Omit<CMSProduct, "updatedAt"> => ({
  slug: "",
  name: "",
  fullName: "",
  category: "essential",
  method: "",
  botanical: "",
  family: "",
  extraction: "",
  origin: "",
  partUsed: "",
  actives: [],
  purity: "",
  scent: "",
  shelf: "",
  tagline: "",
  benefit: "",
  qty: "",
  originalPrice: 0,
  discountedPrice: 0,
  discountLabel: "Upto 40% off",
  isBestseller: false,
  accent: "#6f7d4a",
  images: [],
  hoverImage: "",
  visible: true,
});

type View = "list" | "edit" | "new";

export default function ProductsClient({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<CMSProduct[]>(initialProducts);
  const [view, setView] = useState<View>("list");
  const [editing, setEditing] = useState<CMSProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const hoverFileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openEdit = (p: CMSProduct) => { setEditing({ ...p }); setView("edit"); };
  const openNew = () => { setEditing({ ...emptyProduct(), updatedAt: new Date().toISOString() }); setView("new"); };
  const cancelEdit = () => { setEditing(null); setView("list"); };

  const patchEditing = <K extends keyof CMSProduct>(key: K, val: CMSProduct[K]) =>
    setEditing((prev) => prev ? { ...prev, [key]: val } : prev);

  const saveProduct = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", { method: "GET" });
      const store = await res.json();
      const idx = store.products.findIndex((p: CMSProduct) => p.slug === editing.slug);
      const updated = { ...editing, updatedAt: new Date().toISOString() };
      if (view === "new") {
        store.products.push(updated);
      } else {
        if (idx !== -1) store.products[idx] = updated;
      }
      await fetch("/api/admin/cms", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ products: store.products }) });
      setProducts(store.products);
      invalidateCMSCache(); // bust client cache so live site reloads fresh
      showToast("Product saved successfully");
      setView("list");
      setEditing(null);
    } catch {
      showToast("Failed to save product", "err");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (slug: string) => {
    try {
      const res = await fetch("/api/admin/cms");
      const store = await res.json();
      store.products = store.products.filter((p: CMSProduct) => p.slug !== slug);
      await fetch("/api/admin/cms", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ products: store.products }) });
      setProducts(store.products);
      setDeleteConfirm(null);
      showToast("Product deleted");
    } catch {
      showToast("Failed to delete", "err");
    }
  };

  const toggleVisible = async (slug: string) => {
    const res = await fetch("/api/admin/cms");
    const store = await res.json();
    store.products = store.products.map((p: CMSProduct) => p.slug === slug ? { ...p, visible: !p.visible } : p);
    await fetch("/api/admin/cms", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ products: store.products }) });
    setProducts(store.products);
  };

  const uploadImage = useCallback(async (file: File, isHover = false, galleryIdx?: number) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || "Upload failed", "err"); return; }
    if (isHover) {
      patchEditing("hoverImage", data.url);
    } else {
      setEditing((prev) => {
        if (!prev) return prev;
        const imgs = [...prev.images];
        if (galleryIdx !== undefined && galleryIdx < imgs.length) {
          imgs[galleryIdx] = { url: data.url, alt: imgs[galleryIdx]?.alt || "" };
        } else {
          imgs.push({ url: data.url, alt: "" });
        }
        return { ...prev, images: imgs };
      });
    }
  }, []);

  // ─── List View ────────────────────────────────────────────────────────────────
  if (view === "list") return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-medium shadow-2xl transition-all ${toast.type === "ok" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-red-950 text-red-300 border border-red-800"}`}>
          {toast.msg}
        </div>
      )}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Products</h1>
          <p className="mt-0.5 text-xs text-[#6B7280]">{products.length} products · manage images, pricing, and visibility</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#B8912E] px-4 py-2 text-sm font-medium text-[#0D1117] transition-opacity hover:opacity-90">
          <span className="text-base leading-none">+</span> Add Product
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-[#111827]">
              <th className="px-4 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-[#6B7280]">Product</th>
              <th className="hidden px-4 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-[#6B7280] sm:table-cell">Category</th>
              <th className="hidden px-4 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-[#6B7280] md:table-cell">Pricing</th>
              <th className="px-4 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-[#6B7280]">Status</th>
              <th className="px-4 py-3 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-[#6B7280]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {products.map((p) => (
              <tr key={p.slug} className="bg-[#0D1117] transition-colors hover:bg-[#111827]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] && (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#1F2937]">
                        <Image src={p.images[0].url} alt={p.name} fill className="object-contain" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-[#6B7280]">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className="rounded-full bg-[#1F2937] px-2.5 py-1 text-xs text-[#9CA3AF]">{p.category}</span>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <div>
                    <span className="text-sm font-medium text-white">₹{p.discountedPrice}</span>
                    <span className="ml-2 text-xs text-[#6B7280] line-through">₹{p.originalPrice}</span>
                    <span className="ml-1.5 rounded-full bg-[#B8912E]/15 px-1.5 py-0.5 text-[0.6rem] text-[#E6CF8B]">{p.discountLabel}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleVisible(p.slug)} className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.visible ? "bg-emerald-950 text-emerald-400" : "bg-[#1F2937] text-[#6B7280]"}`}>
                    {p.visible ? "Visible" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#9CA3AF] transition-colors hover:bg-[#1F2937] hover:text-white">Edit</button>
                    {deleteConfirm === p.slug ? (
                      <div className="flex gap-1">
                        <button onClick={() => deleteProduct(p.slug)} className="rounded-lg bg-red-950 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-900">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="rounded-lg px-2 py-1.5 text-xs text-[#6B7280] hover:bg-[#1F2937]">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(p.slug)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#6B7280] transition-colors hover:bg-red-950/50 hover:text-red-400">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── Edit / New View ─────────────────────────────────────────────────────────
  if (!editing) return null;

  const discountPct = editing.originalPrice > 0 ? Math.round((1 - editing.discountedPrice / editing.originalPrice) * 100) : 0;

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-medium shadow-2xl ${toast.type === "ok" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-red-950 text-red-300 border border-red-800"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={cancelEdit} className="rounded-lg p-2 text-[#6B7280] transition-colors hover:bg-[#1F2937] hover:text-white">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12 16L6 10l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-white">{view === "new" ? "Add Product" : `Edit: ${editing.name}`}</h1>
            <p className="mt-0.5 text-xs text-[#6B7280]">{view === "new" ? "Create a new product" : `slug: ${editing.slug}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={cancelEdit} className="rounded-xl border border-[#1F2937] px-4 py-2 text-sm text-[#9CA3AF] transition-colors hover:border-[#374151] hover:text-white">Cancel</button>
          <button onClick={saveProduct} disabled={saving} className="rounded-xl bg-[#B8912E] px-5 py-2 text-sm font-medium text-[#0D1117] transition-opacity disabled:opacity-60 hover:opacity-90">
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left col — main fields */}
        <div className="space-y-5 lg:col-span-2">

          {/* Identity */}
          <Section title="Identity">
            <Field label="Slug (URL key)" required>
              <input className={inputCls} value={editing.slug} onChange={e => patchEditing("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="rosemary" disabled={view === "edit"} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name"><input className={inputCls} value={editing.name} onChange={e => patchEditing("name", e.target.value)} placeholder="Rosemary" /></Field>
              <Field label="Full Name"><input className={inputCls} value={editing.fullName} onChange={e => patchEditing("fullName", e.target.value)} placeholder="Rosemary Essential Oil" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select className={inputCls} value={editing.category} onChange={e => patchEditing("category", e.target.value)}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Qty / Volume"><input className={inputCls} value={editing.qty} onChange={e => patchEditing("qty", e.target.value)} placeholder="15 ml" /></Field>
            </div>
            <Field label="Tagline"><input className={inputCls} value={editing.tagline} onChange={e => patchEditing("tagline", e.target.value)} /></Field>
            <Field label="Benefit"><textarea className={inputCls} rows={2} value={editing.benefit} onChange={e => patchEditing("benefit", e.target.value)} /></Field>
          </Section>

          {/* Pricing */}
          <Section title="Pricing">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Original Price (₹)"><input type="number" className={inputCls} value={editing.originalPrice || ""} onChange={e => patchEditing("originalPrice", Number(e.target.value))} /></Field>
              <Field label="Sale Price (₹)"><input type="number" className={inputCls} value={editing.discountedPrice || ""} onChange={e => patchEditing("discountedPrice", Number(e.target.value))} /></Field>
              <Field label="Discount Label"><input className={inputCls} value={editing.discountLabel} onChange={e => patchEditing("discountLabel", e.target.value)} placeholder="Upto 40% off" /></Field>
            </div>
            {editing.originalPrice > 0 && (
              <p className="text-xs text-[#6B7280]">Effective discount: <span className="text-[#E6CF8B] font-medium">{discountPct}% off</span> · Customer saves ₹{editing.originalPrice - editing.discountedPrice}</p>
            )}
          </Section>

          {/* Botanical Details */}
          <Section title="Botanical Details">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Botanical Name"><input className={inputCls} value={editing.botanical} onChange={e => patchEditing("botanical", e.target.value)} /></Field>
              <Field label="Plant Family"><input className={inputCls} value={editing.family} onChange={e => patchEditing("family", e.target.value)} /></Field>
              <Field label="Extraction Method"><input className={inputCls} value={editing.extraction} onChange={e => patchEditing("extraction", e.target.value)} /></Field>
              <Field label="Part Used"><input className={inputCls} value={editing.partUsed} onChange={e => patchEditing("partUsed", e.target.value)} /></Field>
              <Field label="Origin"><input className={inputCls} value={editing.origin} onChange={e => patchEditing("origin", e.target.value)} /></Field>
              <Field label="Processing Method"><input className={inputCls} value={editing.method} onChange={e => patchEditing("method", e.target.value)} /></Field>
              <Field label="Purity"><input className={inputCls} value={editing.purity} onChange={e => patchEditing("purity", e.target.value)} /></Field>
              <Field label="Scent Profile"><input className={inputCls} value={editing.scent} onChange={e => patchEditing("scent", e.target.value)} /></Field>
            </div>
            <Field label="Shelf Life"><input className={inputCls} value={editing.shelf} onChange={e => patchEditing("shelf", e.target.value)} /></Field>
          </Section>

          {/* Key Actives */}
          <Section title="Key Compounds / Actives">
            <div className="space-y-2">
              {editing.actives.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input className={inputCls + " flex-1"} placeholder="Compound name" value={a.name} onChange={e => { const arr = [...editing.actives]; arr[i] = { ...arr[i], name: e.target.value }; patchEditing("actives", arr); }} />
                  <input className={inputCls + " w-32"} placeholder="Value %" value={a.value} onChange={e => { const arr = [...editing.actives]; arr[i] = { ...arr[i], value: e.target.value }; patchEditing("actives", arr); }} />
                  <button onClick={() => { const arr = editing.actives.filter((_, j) => j !== i); patchEditing("actives", arr); }} className="text-[#6B7280] hover:text-red-400 transition-colors">✕</button>
                </div>
              ))}
              <button onClick={() => patchEditing("actives", [...editing.actives, { name: "", value: "" }])} className="mt-1 text-xs text-[#B8912E] hover:underline">+ Add Compound</button>
            </div>
          </Section>
        </div>

        {/* Right col */}
        <div className="space-y-5">

          {/* Images */}
          <Section title="Images">
            <div className="space-y-3">
              <p className="text-xs text-[#6B7280]">Primary image is first. Click + to upload. Drag to reorder.</p>
              {editing.images.map((img, i) => (
                <div key={i} className="group relative flex items-center gap-3 rounded-xl border border-[#1F2937] bg-[#0D1117] p-2">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#1F2937]">
                    <Image src={img.url} alt={img.alt} fill className="object-contain" />
                  </div>
                  <input className="flex-1 bg-transparent text-xs text-[#9CA3AF] outline-none" placeholder="Alt text" value={img.alt} onChange={e => { const arr = [...editing.images]; arr[i] = { ...arr[i], alt: e.target.value }; patchEditing("images", arr); }} />
                  <label className="cursor-pointer rounded-lg p-1.5 text-xs text-[#6B7280] hover:bg-[#1F2937] hover:text-white">
                    ↺
                    <input type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { setUploadingIdx(i); await uploadImage(f, false, i); setUploadingIdx(null); } }} />
                  </label>
                  <button onClick={() => { const arr = editing.images.filter((_, j) => j !== i); patchEditing("images", arr); }} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-red-950/50 hover:text-red-400">✕</button>
                </div>
              ))}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#374151] p-3 text-xs text-[#6B7280] transition-colors hover:border-[#B8912E]/50 hover:text-[#B8912E]">
                {uploadingIdx === editing.images.length ? "Uploading…" : "+ Upload Image"}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { setUploadingIdx(editing.images.length); await uploadImage(f); setUploadingIdx(null); if (fileRef.current) fileRef.current.value = ""; } }} />
              </label>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-[#9CA3AF]">Hover Image</p>
              {editing.hoverImage && (
                <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-xl border border-[#1F2937]">
                  <Image src={editing.hoverImage} alt="hover" fill className="object-contain" />
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#374151] p-2.5 text-xs text-[#6B7280] hover:border-[#B8912E]/50 hover:text-[#B8912E]">
                {editing.hoverImage ? "Replace hover image" : "+ Upload hover image"}
                <input ref={hoverFileRef} type="file" accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { await uploadImage(f, true); if (hoverFileRef.current) hoverFileRef.current.value = ""; } }} />
              </label>
            </div>
          </Section>

          {/* Settings */}
          <Section title="Settings">
            <Field label="Accent Color">
              <div className="flex items-center gap-2">
                <input type="color" className="h-8 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0" value={editing.accent} onChange={e => patchEditing("accent", e.target.value)} />
                <input className={inputCls + " flex-1 font-mono text-xs"} value={editing.accent} onChange={e => patchEditing("accent", e.target.value)} />
              </div>
            </Field>
            <div className="flex items-center justify-between rounded-xl border border-[#1F2937] px-4 py-3">
              <span className="text-sm text-[#D1D5DB]">Bestseller badge</span>
              <Toggle value={editing.isBestseller} onChange={v => patchEditing("isBestseller", v)} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#1F2937] px-4 py-3">
              <span className="text-sm text-[#D1D5DB]">Visible on site</span>
              <Toggle value={editing.visible} onChange={v => patchEditing("visible", v)} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────
const inputCls = "w-full rounded-xl border border-white/[0.06] bg-[#0D1117] px-3 py-2 text-sm text-white placeholder-[#4B5563] outline-none transition-colors focus:border-[#B8912E]/50 focus:ring-1 focus:ring-[#B8912E]/20";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[#9CA3AF]">{label}{required && <span className="ml-1 text-red-400">*</span>}</label>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${value ? "bg-[#B8912E]" : "bg-[#374151]"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? "translate-x-4.5" : "translate-x-0.5"}`} />
    </button>
  );
}
