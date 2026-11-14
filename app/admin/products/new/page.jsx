"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Sparkles, AlertCircle } from "lucide-react";

const IMAGE_PRESETS = [
  { label: "Monstera", url: "/images/products/monstera.jpg" },
  { label: "Fiddle Leaf", url: "/images/products/fiddle-leaf.jpg" },
  { label: "Trailing Ivy", url: "/images/products/ivy.jpg" },
  { label: "Snake Plant", url: "/images/products/snake-plant.jpg" },
  { label: "Succulents", url: "/images/products/succulent.jpg" },
  { label: "Ceramic Pot", url: "/images/products/ceramic-pot.jpg" },
  { label: "Modern Planter", url: "/images/products/modern-planter.jpg" },
  { label: "Hanging Planter", url: "/images/products/hanging-planter.jpg" },
  { label: "Watering Can", url: "/images/products/watering-can.jpg" },
  { label: "Plant Stand", url: "/images/products/plant-stand.jpg" },
];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "artificial-plants",
    price: "",
    oldPrice: "",
    stock: "in",
    badge: "",
    featured: false,
    image: "/images/products/monstera.jpg",
    size: "",
    material: "",
    description: "",
    featuresText: "Zero watering or care required\nRealistic embossed leaf texture\nWeighted base for stability",
    careText: "Dust leaves occasionally with a soft dry cloth\nKeep away from prolonged heavy outdoor rain",
  });

  const handleNameChange = (e) => {
    const name = e.target.value;
    const autoSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const features = form.featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const care = form.careText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category: form.category,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: form.stock,
        badge: form.badge.trim() || null,
        featured: form.featured,
        image: form.image.trim(),
        size: form.size.trim(),
        material: form.material.trim(),
        description: form.description.trim(),
        features,
        care,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
          Add New Product
        </h1>
        <p className="mt-1 text-xs text-neutral-400">
          Create a new artificial plant, ceramic pot, or home accessory for Leafnest.lk
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-950/50 p-4 text-xs font-medium text-red-300 border border-red-500/20">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-2xl border border-white/10 bg-[#141d17] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Artificial Areca Palm Tree"
                value={form.name}
                onChange={handleNameChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. artificial-areca-palm"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-neutral-200 outline-none focus:border-emerald-500/80"
              >
                <option value="artificial-plants">Artificial Plants (No live plants)</option>
                <option value="pots-planters">Pots & Planters</option>
                <option value="accessories-decor">Accessories & Décor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Price (Rs.) *
              </label>
              <input
                type="number"
                required
                placeholder="3500"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Original Price (Rs. for Discount)
              </label>
              <input
                type="number"
                placeholder="4200 (Optional)"
                value={form.oldPrice}
                onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Stock Status *
              </label>
              <select
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-neutral-200 outline-none focus:border-emerald-500/80"
              >
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Promotional Badge
              </label>
              <input
                type="text"
                placeholder="e.g. Best Seller, New, Sale"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="inline-flex items-center gap-2 text-xs text-neutral-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-white/10 bg-black/40 text-forest focus:ring-emerald-500 h-4 w-4"
                />
                <span>Feature on Homepage</span>
              </label>
            </div>
          </div>
        </div>

        {/* Photography & Imagery */}
        <div className="rounded-2xl border border-white/10 bg-[#141d17] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">
            Product Photography
          </h2>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Image URL / Path *
            </label>
            <input
              type="text"
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80 font-mono"
            />
          </div>

          <div>
            <span className="text-[11px] text-neutral-400 font-medium mb-2 block">
              Quick Presets (or paste your own hosted image URL):
            </span>
            <div className="flex flex-wrap gap-2">
              {IMAGE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setForm({ ...form, image: p.url })}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                    form.image === p.url
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Description & Specs */}
        <div className="rounded-2xl border border-white/10 bg-[#141d17] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">
            Description & Specifications
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Size & Dimensions
              </label>
              <input
                type="text"
                placeholder="e.g. Approx. 70 cm tall, 15 cm pot width"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Material & Finish
              </label>
              <input
                type="text"
                placeholder="e.g. Silk-polymer foliage with realistic stems"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Full Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed description of the artificial plant / pot for the product page..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Key Features (one per line)
              </label>
              <textarea
                rows={4}
                value={form.featuresText}
                onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Care Instructions (one per line)
              </label>
              <textarea
                rows={4}
                value={form.careText}
                onChange={(e) => setForm({ ...form, careText: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-neutral-300 hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-forest px-6 py-2.5 text-xs font-semibold text-cream shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
