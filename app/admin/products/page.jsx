"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Quick 1-click stock status toggle
  const handleToggleStock = async (prod) => {
    const nextStock =
      prod.stock === "in" ? "low" : prod.stock === "low" ? "out" : "in";

    try {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, stock: nextStock } : p))
      );

      const res = await fetch(`/api/products/${prod.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: nextStock }),
      });

      if (!res.ok) fetchProducts();
    } catch (err) {
      console.error("Toggle stock error:", err);
      fetchProducts();
    }
  };

  // Delete product
  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete product error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchesStock = stockFilter === "all" || p.stock === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Products Catalog
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Manage your artificial plants, ceramic pots, and home décor inventory
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-semibold text-cream shadow-lg transition-all hover:bg-emerald-700"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#141d17] p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search artificial plants, pots, accessories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200 outline-none focus:border-emerald-500/80"
          >
            <option value="all">All Categories</option>
            <option value="artificial-plants">Artificial Plants</option>
            <option value="pots-planters">Pots & Planters</option>
            <option value="accessories-decor">Accessories & Décor</option>
          </select>

          {/* Stock Filter Dropdown */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200 outline-none focus:border-emerald-500/80"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-white/10 bg-[#141d17] p-6 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mb-2" />
            Loading products catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Stock (Click to Toggle)</th>
                  <th className="pb-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    {/* Product Name & Image */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-800 border border-white/10">
                          <Image
                            src={prod.image || "/images/cat-artificial.webp"}
                            alt={prod.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white">{prod.name}</span>
                            {prod.badge && (
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            /product/{prod.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 pr-4">
                      <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-neutral-300 capitalize">
                        {prod.category.replace("-", " ")}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 pr-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.oldPrice && (
                          <span className="text-[10px] text-neutral-500 line-through">
                            {formatPrice(prod.oldPrice)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Quick Toggle */}
                    <td className="py-3.5 pr-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(prod)}
                        title="Click to toggle stock status"
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 ${
                          prod.stock === "in"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : prod.stock === "low"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {prod.stock === "in" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>In Stock</span>
                          </>
                        ) : prod.stock === "low" ? (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            <span>Low Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right space-x-1.5">
                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        className="inline-flex rounded-lg bg-white/10 p-2 text-neutral-300 hover:bg-white/20 hover:text-white"
                        title="View on store"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/products/${prod.id}/edit`}
                        className="inline-flex rounded-lg bg-emerald-500/20 p-2 text-emerald-300 hover:bg-emerald-500/30"
                        title="Edit product"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod.id, prod.name)}
                        disabled={deletingId === prod.id}
                        className="inline-flex rounded-lg bg-red-500/20 p-2 text-red-300 hover:bg-red-500/30 disabled:opacity-50"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
