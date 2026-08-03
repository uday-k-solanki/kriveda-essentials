"use client";

import { Suspense } from "react";
import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// Separated out so useSearchParams is inside a Suspense boundary
function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/admin/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(redirect);
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          placeholder="••••••••"
          className="w-full rounded-xl border border-white/[0.08] bg-[#1A2235] px-4 py-3 text-sm text-white placeholder:text-[#4B5563] outline-none transition-colors focus:border-[#B8912E] focus:ring-1 focus:ring-[#B8912E]/30"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-2.5 text-xs text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#B8912E] px-4 py-3 text-sm font-semibold text-[#0D1117] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1117] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,145,46,0.07),transparent_65%)]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="KRIVEDA"
            width={160}
            height={24}
            className="h-8 w-auto brightness-0 invert opacity-75"
          />
          <span className="text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#4B5563]">
            Admin Dashboard
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-8 shadow-2xl shadow-black/50">
          <h1 className="mb-1 text-lg font-semibold text-white">Sign in</h1>
          <p className="mb-6 text-sm text-[#6B7280]">Enter your admin password to continue.</p>

          {/* Suspense required because useSearchParams reads URL at render time */}
          <Suspense fallback={
            <div className="space-y-4">
              <div className="h-10 animate-pulse rounded-xl bg-white/[0.04]" />
              <div className="h-10 animate-pulse rounded-xl bg-[#B8912E]/20" />
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-[0.65rem] text-[#374151]">
          KRIVEDA Essentials · Admin Portal · 2026
        </p>
      </div>
    </div>
  );
}
