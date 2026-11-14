"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1410] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="rounded-3xl border border-white/10 bg-[#141d17]/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-auto items-center justify-center">
              <Image
                src="/logo-light.png"
                alt="Leafnest.lk"
                width={1200}
                height={333}
                priority
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Admin Portal</span>
            </div>
            <h1 className="mt-4 text-xl font-bold text-white tracking-tight">
              Sign in to Leafnest Dashboard
            </h1>
            <p className="mt-1 text-xs text-neutral-400">
              Manage artificial plants, customer orders & inventory
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-950/50 p-3 text-xs font-medium text-red-300 border border-red-500/20">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-neutral-300 mb-1.5"
              >
                Admin Passcode / Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter admin password (leafnest2026)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pl-11 text-sm text-white placeholder-neutral-500 outline-none transition-all focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
                />
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
              <p className="mt-1.5 text-[11px] text-neutral-400">
                Default password: <code className="text-emerald-400 font-mono">leafnest2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-3 text-sm font-semibold text-cream shadow-lg transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 border-t border-white/5 pt-5 text-center text-[11px] text-neutral-500">
            Protected Leafnest.lk Administration • Production Grade
          </div>
        </div>
      </div>
    </div>
  );
}
