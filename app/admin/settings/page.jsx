"use client";

import { useState, useEffect } from "react";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Phone,
  Truck,
  Sparkles,
} from "lucide-react";
import { WHATSAPP_PHONE, WHATSAPP_BUSINESS_URL } from "@/lib/config";

export default function AdminSettingsPage() {
  const [stats, setStats] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
      });
  }, []);

  const envTemplate = `# Leafnest.lk Supabase Cloud Database Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Dashboard Password (Default: leafnest2026)
ADMIN_PASSWORD="leafnest2026"
`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
          Store & Database Settings
        </h1>
        <p className="mt-1 text-xs text-neutral-400">
          Supabase PostgreSQL configuration, WhatsApp business details & production setup
        </p>
      </div>

      {/* Supabase PostgreSQL Configuration Section */}
      <div className="rounded-2xl border border-white/10 bg-[#141d17] p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Supabase Cloud Database</h2>
              <p className="text-xs text-neutral-400">
                Production PostgreSQL database & image storage engine
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              stats?.isSupabaseConnected
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}
          >
            {stats?.isSupabaseConnected ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Connected & Live</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Local Storage Active (Ready to Link)</span>
              </>
            )}
          </span>
        </div>

        {/* 3 Step Connection Guide */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            How to Connect Supabase in 3 Simple Steps:
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
            {/* Step 1 */}
            <div className="rounded-xl border border-white/5 bg-black/30 p-4 space-y-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 font-bold text-emerald-300 text-[11px]">
                1
              </div>
              <h4 className="font-semibold text-white">Create Supabase Project</h4>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">supabase.com</a>, create a free project and select Singapore (ap-southeast-1) for lowest latency to Sri Lanka.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-white/5 bg-black/30 p-4 space-y-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 font-bold text-emerald-300 text-[11px]">
                2
              </div>
              <h4 className="font-semibold text-white">Run Schema SQL</h4>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Open Supabase SQL Editor and run the pre-written script located in <code className="text-emerald-300">supabase/schema.sql</code>. It creates products, orders, and security policies automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-white/5 bg-black/30 p-4 space-y-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 font-bold text-emerald-300 text-[11px]">
                3
              </div>
              <h4 className="font-semibold text-white">Add Keys to .env.local</h4>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Copy your Project URL and anon API Key into your <code className="text-emerald-300">.env.local</code> file or Vercel environment settings.
              </p>
            </div>
          </div>

          {/* Environment Variables Box */}
          <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-neutral-300">.env.local template</span>
              <button
                type="button"
                onClick={handleCopyEnv}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:bg-white/20 transition-colors"
              >
                <Copy className="h-3 w-3" />
                <span>{copiedEnv ? "Copied!" : "Copy Template"}</span>
              </button>
            </div>
            <pre className="overflow-x-auto text-[11px] font-mono text-emerald-400/90 leading-relaxed">
              {envTemplate}
            </pre>
          </div>
        </div>
      </div>

      {/* WhatsApp Business & Delivery Settings */}
      <div className="rounded-2xl border border-white/10 bg-[#141d17] p-6 space-y-6">
        <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">
          Store Details & WhatsApp Business
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* WhatsApp Phone */}
          <div className="rounded-xl border border-white/5 bg-black/30 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <Phone className="h-4 w-4 text-emerald-400" />
              <span>WhatsApp Business Number</span>
            </div>
            <p className="text-sm font-mono font-bold text-white">077 583 5445 (94775835445)</p>
            <p className="text-[11px] text-neutral-400">
              Direct customer chats & orders route to this number.
            </p>
          </div>

          {/* Delivery Policy */}
          <div className="rounded-xl border border-white/5 bg-black/30 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <Truck className="h-4 w-4 text-emerald-400" />
              <span>Island-wide Delivery Policy</span>
            </div>
            <p className="text-sm font-bold text-white">Free delivery on orders over Rs. 5,000</p>
            <p className="text-[11px] text-neutral-400">
              Prominently displayed on header announcement bar and checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
