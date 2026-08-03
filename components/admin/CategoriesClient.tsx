"use client";

import { useState } from "react";
import type { CMSCategory } from "@/lib/cms-types";

interface Props { initialCategories: CMSCategory[]; }

const newCat = (): CMSCategory => ({ id: "", name: "", description: "", order: 99 });

export default function CategoriesClient({ initialCategories }: Props) {
  const [cats, setCats] = useState<CMSCategory[]>(initialCategories);
  const [editing, setEditing] = useState<CMSCategory | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const openNew = () => { setEditing(newCat()); setIsNew(true); };
  const cancel = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms");
      const store = await res.json();
      const idx = store.categories.findIndex((c: CMSCategory) => c.id === editing.id);
      if (isNew) {
        store.categories.push(editing);
      } else {
        if (idx !== -1) store.categories[idx] = editing;
      }
      await fetch("/api/admin/cms", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categories: store.categories }) });
      setCats(store.categories);
      showToast("Category saved");
      cancel();
    } catch { showToast("Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    const res = await fetch("/api/admin/cms");
    const store = await res.json();
    store.categories = store.categories.filter((c: CMSCategory) => c.id !== id);
    await fetch("/api/admin/cms", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categories: store.categories }) });
    setCats(store.categories);
    setDeleteConfirm(null);
    showToast("Category deleted");
  };

  const patch = <K extends keyof CMSCategory>(k: K, v: CMSCategory[K]) =>
    setEditing((e) => e ? { ...e, [k]: v } : e);

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-800 bg-emerald-950 px-5 py-3 text-sm font-medium text-emerald-300 shadow-2xl">
          {toast}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Categories</h1>
          <p className="mt-0.5 text-xs text-[#6B7280]">Organise products into collections — essential, carrier, or custom types</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#B8912E] px-4 py-2 text-sm font-medium text-[#0D1117] transition-opacity hover:opacity-90">
          <span className="text-base leading-none">+</span> Add Category
        </button>
      </div>

      {/* Edit / New Panel */}
      {editing && (
        <div className="mb-6 rounded-2xl border border-[#B8912E]/30 bg-[#111827] p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[#6B7280]">{isNew ? "New Category" : "Edit Category"}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9CA3AF]">ID (slug key) *</label>
              <input
                className={inp}
                value={editing.id}
                onChange={(e) => patch("id", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                placeholder="specialty-oils"
                disabled={!isNew}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9CA3AF]">Display Name *</label>
              <input className={inp} value={editing.name} onChange={(e) => patch("name", e.target.value)} placeholder="Specialty Oils" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#9CA3AF]">Description</label>
              <input className={inp} value={editing.description} onChange={(e) => patch("description", e.target.value)} placeholder="A short description for this category" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9CA3AF]">Sort Order</label>
              <input type="number" className={inp} value={editing.order} onChange={(e) => patch("order", Number(e.target.value))} />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={save} disabled={saving} className="rounded-xl bg-[#B8912E] px-5 py-2 text-sm font-medium text-[#0D1117] disabled:opacity-60 hover:opacity-90">
              {saving ? "Saving…" : "Save Category"}
            </button>
            <button onClick={cancel} className="rounded-xl border border-[#1F2937] px-4 py-2 text-sm text-[#9CA3AF] hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#1F2937]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1F2937] bg-[#111827]">
              <th className="px-4 py-3 text-left text-[0.65rem] font-medium uppercase tracking-wide text-[#6B7280]">Name</th>
              <th className="hidden px-4 py-3 text-left text-[0.65rem] font-medium uppercase tracking-wide text-[#6B7280] sm:table-cell">ID</th>
              <th className="hidden px-4 py-3 text-left text-[0.65rem] font-medium uppercase tracking-wide text-[#6B7280] md:table-cell">Description</th>
              <th className="px-4 py-3 text-left text-[0.65rem] font-medium uppercase tracking-wide text-[#6B7280]">Order</th>
              <th className="px-4 py-3 text-right text-[0.65rem] font-medium uppercase tracking-wide text-[#6B7280]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]">
            {[...cats].sort((a, b) => a.order - b.order).map((c) => (
              <tr key={c.id} className="bg-[#0D1117] hover:bg-[#111827]">
                <td className="px-4 py-3 text-sm font-medium text-white">{c.name}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <code className="rounded bg-[#1F2937] px-2 py-0.5 text-xs text-[#9CA3AF]">{c.id}</code>
                </td>
                <td className="hidden max-w-xs px-4 py-3 text-xs text-[#6B7280] md:table-cell">{c.description}</td>
                <td className="px-4 py-3 text-sm text-[#6B7280]">{c.order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditing({ ...c }); setIsNew(false); }} className="rounded-lg px-3 py-1.5 text-xs text-[#9CA3AF] hover:bg-[#1F2937] hover:text-white">Edit</button>
                    {deleteConfirm === c.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => del(c.id)} className="rounded-lg bg-red-950 px-3 py-1.5 text-xs text-red-400 hover:bg-red-900">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="rounded-lg px-2 py-1.5 text-xs text-[#6B7280] hover:bg-[#1F2937]">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(c.id)} className="rounded-lg px-3 py-1.5 text-xs text-[#6B7280] hover:bg-red-950/50 hover:text-red-400">Delete</button>
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
}

const inp = "w-full rounded-xl border border-white/[0.06] bg-[#0D1117] px-3 py-2 text-sm text-white placeholder-[#4B5563] outline-none focus:border-[#B8912E]/50 focus:ring-1 focus:ring-[#B8912E]/20";
