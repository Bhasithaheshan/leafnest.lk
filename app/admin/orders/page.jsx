"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  Filter,
} from "lucide-react";
import { formatPrice } from "@/lib/products";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    bg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    bg: "bg-green-500/20 text-green-300 border-green-500/30",
    icon: PackageCheck,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-500/20 text-red-300 border-red-500/30",
    icon: XCircle,
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Update status error:", err);
      fetchOrders();
    }
  };

  const handleDelete = async (orderId, orderNum) => {
    if (!confirm(`Delete order ${orderNum}?`)) return;

    try {
      await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Delete order error:", err);
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  // Format customer phone for Sri Lankan WhatsApp link
  const getWhatsAppLink = (phone, orderNum, customerName) => {
    let cleanPhone = (phone || "").replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = "94" + cleanPhone.slice(1);
    if (!cleanPhone.startsWith("94")) cleanPhone = "94" + cleanPhone;

    const message = encodeURIComponent(
      `Hi ${customerName}, this is Leafnest.lk regarding your order ${orderNum}. We are preparing your order for island-wide delivery.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Customer Orders
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Track, confirm, and update artificial plants delivery orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-white/10 bg-[#141d17] px-3.5 py-2 text-xs font-semibold text-neutral-300">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
              filterStatus === st
                ? "bg-forest text-cream shadow-sm"
                : "border border-white/10 bg-[#141d17] text-neutral-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {st} ({st === "all" ? orders.length : orders.filter((o) => o.status === st).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-400">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mb-2" />
          Loading customer orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#141d17] py-16 text-center text-xs text-neutral-400">
          No orders found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const statusInfo = STATUS_CONFIG[ord.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={ord.id}
                className="rounded-2xl border border-white/10 bg-[#141d17] p-5 shadow-sm transition-all hover:border-white/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
                  {/* Left: Order number & Date */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                      {ord.orderNumber}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                      <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Right: Status Dropdown & WhatsApp Chat Button */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400 font-medium">Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider outline-none border cursor-pointer ${statusInfo.bg}`}
                      >
                        <option value="pending" className="bg-[#141d17] text-amber-300">
                          Pending
                        </option>
                        <option value="confirmed" className="bg-[#141d17] text-emerald-300">
                          Confirmed
                        </option>
                        <option value="shipped" className="bg-[#141d17] text-blue-300">
                          Shipped
                        </option>
                        <option value="delivered" className="bg-[#141d17] text-green-300">
                          Delivered
                        </option>
                        <option value="cancelled" className="bg-[#141d17] text-red-300">
                          Cancelled
                        </option>
                      </select>
                    </div>

                    {/* Chat with Customer on WhatsApp */}
                    {ord.customerPhone && (
                      <a
                        href={getWhatsAppLink(
                          ord.customerPhone,
                          ord.orderNumber,
                          ord.customerName
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 shadow-sm"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(ord.id, ord.orderNumber)}
                      className="rounded-lg p-1.5 text-neutral-500 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                      title="Delete order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Customer Details & Items Grid */}
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {/* Customer Info */}
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Customer Details
                    </span>
                    <p className="font-semibold text-white">{ord.customerName}</p>
                    <p className="font-mono text-neutral-400">{ord.customerPhone}</p>
                    {ord.customerAddress && (
                      <p className="text-neutral-400 flex items-start gap-1 pt-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                        <span>
                          {ord.customerAddress}
                          {ord.customerCity ? `, ${ord.customerCity}` : ""}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Ordered Items */}
                  <div className="sm:col-span-2 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Ordered Products
                    </span>
                    <div className="rounded-xl bg-black/30 p-3 space-y-1.5 border border-white/5">
                      {ord.items?.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs text-neutral-300"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{it.name}</span>
                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-neutral-300">
                              Qty: {it.quantity}
                            </span>
                          </div>
                          <span className="font-mono text-neutral-200">
                            {formatPrice(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-white/10 pt-2 flex items-center justify-between text-xs font-bold text-white">
                        <span>Total Order Amount:</span>
                        <span className="text-sm font-bold text-emerald-400">
                          {formatPrice(ord.totalAmount)}
                        </span>
                      </div>
                    </div>
                    {ord.notes && (
                      <p className="text-[11px] text-neutral-400 italic">
                        Note: &quot;{ord.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
