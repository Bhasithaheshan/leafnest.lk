"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Database,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/products";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/orders"),
          fetch("/api/products"),
        ]);

        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (statsData.success) setStats(statsData.stats);
        if (ordersData.success) setRecentOrders(ordersData.orders.slice(0, 5));
        if (productsData.success) setProducts(productsData.products.slice(0, 5));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span className="text-xs">Loading Leafnest dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Store Overview
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Real-time analytics and management for Leafnest.lk
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-semibold text-cream shadow-lg transition-all hover:bg-emerald-700"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Database Connection Status Card */}
      <div
        className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
          stats?.isSupabaseConnected
            ? "border-emerald-500/20 bg-emerald-950/20 text-emerald-200"
            : "border-amber-500/20 bg-amber-950/20 text-amber-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              stats?.isSupabaseConnected ? "bg-emerald-500/20" : "bg-amber-500/20"
            }`}
          >
            <Database
              className={`h-5 w-5 ${
                stats?.isSupabaseConnected ? "text-emerald-400" : "text-amber-400"
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {stats?.isSupabaseConnected
                  ? "Supabase PostgreSQL Database Connected"
                  : "Local JSON Persistence Active (Supabase Ready)"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  stats?.isSupabaseConnected
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {stats?.isSupabaseConnected ? "Cloud Sync Live" : "Local Mode"}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {stats?.isSupabaseConnected
                ? "All changes are saved directly to your Supabase cloud tables."
                : "Products and orders are persisted locally. Enter your Supabase credentials in Settings to link cloud PostgreSQL."}
            </p>
          </div>
        </div>

        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
        >
          <span>Configure Database</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* 4 KPI METRICS CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-white/10 bg-[#141d17] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Total Revenue</span>
            <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">
              {formatPrice(stats?.totalRevenue || 0)}
            </span>
            <p className="mt-1 text-[11px] text-neutral-500">
              From confirmed & fulfilled orders
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-white/10 bg-[#141d17] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Total Orders</span>
            <span className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <ShoppingBag className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</span>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="text-amber-400 font-semibold">{stats?.pendingOrders || 0} Pending</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{stats?.confirmedOrders || 0} Confirmed</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded-2xl border border-white/10 bg-[#141d17] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Active Products</span>
            <span className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats?.totalProducts || 0}</span>
            <p className="mt-1 text-[11px] text-neutral-400">
              100% Artificial plants, pots & décor
            </p>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="rounded-2xl border border-white/10 bg-[#141d17] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Stock Alerts</span>
            <span className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">
              {(stats?.lowStockCount || 0) + (stats?.outOfStockCount || 0)}
            </span>
            <div className="mt-1 flex items-center gap-2 text-[11px]">
              <span className="text-amber-400">{stats?.lowStockCount || 0} Low Stock</span>
              <span className="text-neutral-600">•</span>
              <span className="text-red-400">{stats?.outOfStockCount || 0} Out of Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="rounded-2xl border border-white/10 bg-[#141d17] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Recent Orders</h2>
            <p className="text-xs text-neutral-400">Latest customer orders via WhatsApp & website</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Phone</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                  <td className="py-3 font-medium text-neutral-200">{ord.customerName}</td>
                  <td className="py-3 font-mono text-neutral-400">{ord.customerPhone}</td>
                  <td className="py-3 text-neutral-300">
                    {ord.items?.map((it) => `${it.name} (x${it.quantity})`).join(", ") || "—"}
                  </td>
                  <td className="py-3 font-semibold text-white">{formatPrice(ord.totalAmount)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === "confirmed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : ord.status === "shipped"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : ord.status === "delivered"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href="/admin/orders"
                      className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:bg-white/20"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
