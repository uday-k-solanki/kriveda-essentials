"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  Megaphone,
  FileText,
  ImageIcon,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const nav = [
  { label: "Overview",         href: "/admin/dashboard",              icon: LayoutDashboard },
  { label: "Products",         href: "/admin/dashboard/products",     icon: Package },
  { label: "Categories",       href: "/admin/dashboard/categories",   icon: Tag },
  { label: "Announcement Bar", href: "/admin/dashboard/announcement", icon: Megaphone },
  { label: "Site Content",     href: "/admin/dashboard/content",      icon: FileText },
  { label: "Media",            href: "/admin/dashboard/media",        icon: ImageIcon },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div>
          <Image
            src="/images/logo.png"
            alt="KRIVEDA"
            width={110}
            height={16}
            className="h-5 w-auto brightness-0 invert opacity-60"
          />
          <span className="mt-0.5 block text-[0.6rem] font-medium uppercase tracking-[0.2em] text-[#4B5563]">
            Admin
          </span>
        </div>
        <button
          className="rounded-lg p-1 text-[#4B5563] hover:bg-white/5 hover:text-white md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Dashboard navigation">
        <p className="mb-2 px-2 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-[#374151]">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.82rem] font-medium transition-all duration-150 ${
                    active
                      ? "bg-[#B8912E]/12 text-[#E6CF8B]"
                      : "text-[#9CA3AF] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    size={16}
                    className={active ? "text-[#B8912E]" : "text-[#6B7280]"}
                    strokeWidth={active ? 2 : 1.5}
                  />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom links */}
      <div className="border-t border-white/[0.06] px-3 py-3 space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.82rem] font-medium text-[#6B7280] transition-all hover:bg-white/[0.04] hover:text-white"
        >
          <ExternalLink size={15} strokeWidth={1.5} />
          View Live Site
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[0.82rem] font-medium text-[#6B7280] transition-all hover:bg-red-950/40 hover:text-red-400"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#0D1117]">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-white/[0.06] bg-[#0D1117] md:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-56 border-r border-white/[0.06] bg-[#0D1117]">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0D1117] px-5">
          <button
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-white/[0.06] hover:text-white md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[0.72rem] font-medium text-[#6B7280]">
              Kriveda Admin
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B8912E]/20 text-[0.7rem] font-semibold text-[#B8912E]">
              K
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
