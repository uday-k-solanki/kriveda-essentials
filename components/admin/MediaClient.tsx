"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface Props { initialFiles: string[]; }

export default function MediaClient({ initialFiles }: Props) {
  const [files, setFiles] = useState<string[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (fileList: FileList) => {
    setUploading(true);
    setError(null);
    const newUrls: string[] = [];
    for (const file of Array.from(fileList)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Upload failed"); break; }
      newUrls.push(data.url);
    }
    setFiles((f) => [...newUrls, ...f]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Media Library</h1>
          <p className="mt-0.5 text-xs text-[#6B7280]">{files.length} uploaded file{files.length !== 1 ? "s" : ""} · JPG, PNG, WebP, GIF · max 5MB each</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#B8912E] px-4 py-2 text-sm font-medium text-[#0D1117] transition-opacity hover:opacity-90">
          {uploading ? "Uploading…" : "Upload Files"}
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); }} />
        </label>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mb-6 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${dragOver ? "border-[#B8912E] bg-[#B8912E]/5" : "border-[#1F2937] bg-[#111827]"}`}
      >
        <p className="text-sm text-[#6B7280]">Drag & drop images here, or use the button above</p>
        <p className="mt-1 text-xs text-[#4B5563]">PNG, JPG, WebP, GIF · up to 5MB per file</p>
      </div>

      {files.length === 0 ? (
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-12 text-center">
          <p className="text-[#6B7280]">No uploads yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {files.map((url) => (
            <div key={url} className="group relative overflow-hidden rounded-2xl border border-[#1F2937] bg-[#111827]">
              <div className="relative aspect-square">
                <Image src={url} alt="" fill className="object-contain p-2" />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0D1117]/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(url)}
                  className="rounded-lg bg-[#B8912E] px-3 py-1.5 text-xs font-medium text-[#0D1117]"
                >
                  {copied === url ? "Copied!" : "Copy URL"}
                </button>
                <p className="max-w-[90%] break-all text-center text-[0.55rem] text-[#9CA3AF]">{url.split("/").pop()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
