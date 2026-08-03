import { readCMSStore } from "@/lib/cms-server";
import {
  Package,
  Eye,
  Star,
  Tag,
  Megaphone,
  FileText,
  ImageIcon,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const store = readCMSStore();
  const visible = store.products.filter((p) => p.visible).length;
  const bestsellers = store.products.filter((p) => p.isBestseller).length;

  const stats = [
    { label: "Total Products", value: store.products.length, color: "#B8912E", Icon: Package },
    { label: "Visible",        value: visible,                color: "#10B981", Icon: Eye },
    { label: "Bestsellers",    value: bestsellers,            color: "#F59E0B", Icon: Star },
    { label: "Categories",     value: store.categories.length, color: "#818CF8", Icon: Tag },
  ];

  const quickLinks = [
    { label: "Manage Products",   href: "/admin/dashboard/products",     Icon: Package },
    { label: "Announcement Bar",  href: "/admin/dashboard/announcement", Icon: Megaphone },
    { label: "Site Content",      href: "/admin/dashboard/content",      Icon: FileText },
    { label: "Categories",        href: "/admin/dashboard/categories",   Icon: Tag },
    { label: "Media Library",     href: "/admin/dashboard/media",        Icon: ImageIcon },
    { label: "Live Preview",      href: "/",  target: "_blank",          Icon: ExternalLink },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Overview</h1>
        <p className="mt-0.5 text-sm text-[#6B7280]">
          Last updated:{" "}
          {new Date(store.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value, color, Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/[0.06] bg-[#111827] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">{label}</p>
              <Icon size={15} style={{ color }} strokeWidth={1.5} />
            </div>
            <p className="mt-3 text-3xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Announcement bar status */}
      <div className="mt-5 rounded-2xl border border-white/[0.06] bg-[#111827] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone size={16} className="shrink-0 text-[#6B7280]" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Announcement Bar
              </p>
              <p className="mt-0.5 text-sm text-white">{store.announcementBar.text}</p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              store.announcementBar.enabled
                ? "bg-emerald-950 text-emerald-400"
                : "bg-white/[0.05] text-[#6B7280]"
            }`}
          >
            {store.announcementBar.enabled ? "Live" : "Hidden"}
          </span>
        </div>
      </div>

      {/* Quick links */}
      <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {quickLinks.map(({ label, href, target, Icon }) => (
          <a
            key={label}
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#111827] p-4 text-sm font-medium text-[#D1D5DB] transition-all hover:border-[#B8912E]/30 hover:bg-[#1A2235]"
          >
            <Icon size={16} className="text-[#6B7280]" strokeWidth={1.5} />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
