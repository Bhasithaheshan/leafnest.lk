"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "All Products", icon: Package },
  { href: "/admin/products/new", label: "Add Product", icon: PlusCircle },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/settings", label: "Settings & DB", icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, render directly without admin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1411] text-neutral-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-white">
      {/* MOBILE TOP BAR */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[#141d17] px-4 md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo-light.png"
            alt="Leafnest.lk Admin"
            width={1200}
            height={333}
            className="h-8 w-auto object-contain"
          />
          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
            ADMIN
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="rounded-lg p-2 text-neutral-300 hover:bg-white/10"
          aria-label="Toggle navigation menu"
        >
          {mobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-white/10 bg-[#121914] p-5 transition-transform duration-300 md:static md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Portal Badge */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href="/admin" className="flex flex-col">
              <Image
                src="/logo-light.png"
                alt="Leafnest.lk"
                width={1200}
                height={333}
                priority
                className="h-9 w-auto object-contain"
              />
              <div className="mt-2 flex items-center gap-1.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-300 tracking-wide uppercase">
                  Admin Dashboard
                </span>
              </div>
            </Link>
            {mobileSidebarOpen && (
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded p-1 text-neutral-400 hover:text-white md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Nav Links */}
          <nav className="mt-6 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-forest text-cream shadow-md shadow-forest/20"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-cream" : "text-neutral-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          {/* View Live Store */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-emerald-400"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="h-4 w-4" />
              <span>View Live Store</span>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* BACKDROP for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
