"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Trash2 } from "lucide-react";

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

export default function EditProductPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    image: "",
    extraImagesText: "",
    size: "",
    material: "",
    description: "",
    featuresText: "",
    careText: "",
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Product not found");
        }

        const p = data.product;
        const imagesList =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images
            : p.image
            ? [p.image]
            : [];
        const primaryImage = imagesList[0] || p.image || "";
        const extraImages = imagesList.slice(1).join("\n");

        setForm({
          name: p.name || "",
          slug: p.slug || "",
          category: p.category || "artificial-plants",
          price: String(p.price || ""),
          oldPrice: p.oldPrice ? String(p.oldPrice) : "",
          stock: p.stock || "in",
          badge: p.badge || "",
          featured: Boolean(p.featured),
          image: primaryImage,
          extraImagesText: extraImages,
          size: p.size || "",
          material: p.material || "",
          description: p.description || "",
          featuresText: Array.isArray(p.features) ? p.features.join("\n") : "",
          careText: Array.isArray(p.care) ? p.care.join("\n") : "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const features = form.featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const care = form.careText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const extraImages = form.extraImagesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const allImages = [form.image.trim(), ...extraImages].filter(Boolean);

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category: form.category,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: form.stock,
        badge: form.badge.trim() || null,
        featured: form.featured,
        image: allImages[0] || "/images/cat-artificial.webp",
        images: allImages,
        size: form.size.trim(),
        material: form.material.trim(),
        description: form.description.trim(),
        features,
        care,
      };

      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span className="text-xs">Loading product details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
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
          Edit Product: {form.name}
        </h1>
        <p className="mt-1 text-xs text-neutral-400">
          Update prices, stock levels, or specifications
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-950/50 p-4 text-xs font-medium text-red-300 border border-red-500/20">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#141d17] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">
            Product Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white">
              Product Photography & Gallery
            </h2>
            <span className="text-[11px] text-emerald-400 font-medium">
              Multiple photos supported
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Primary Cover Photo URL *
            </label>
            <input
              type="text"
              required
              placeholder="/images/products/monstera.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Additional Gallery Photos (One image URL per line)
            </label>
            <textarea
              rows={3}
              placeholder={"/images/products/monstera-2.jpg\n/images/products/monstera-close-up.jpg"}
              value={form.extraImagesText}
              onChange={(e) => setForm({ ...form, extraImagesText: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-500/80 font-mono text-[11px]"
            />
            <p className="mt-1 text-[11px] text-neutral-500">
              Customers will see these as clickable thumbnails in the product gallery.
            </p>
          </div>

          <div>
            <span className="text-[11px] text-neutral-400 font-medium mb-2 block">
              Quick Presets (Click to set as primary, or click &quot;+ Add&quot; to append to gallery):
            </span>
            <div className="flex flex-wrap gap-2">
              {IMAGE_PRESETS.map((p) => (
                <div key={p.label} className="inline-flex rounded-lg border border-white/10 bg-white/5 overflow-hidden text-[11px]">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: p.url })}
                    className={`px-2.5 py-1 font-medium transition-colors ${
                      form.image === p.url
                        ? "bg-emerald-500/20 text-emerald-300 font-bold"
                        : "text-neutral-300 hover:bg-white/10"
                    }`}
                  >
                    {p.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const current = form.extraImagesText.trim();
                      setForm({
                        ...form,
                        extraImagesText: current ? `${current}\n${p.url}` : p.url,
                      });
                    }}
                    title="Add to gallery photos"
                    className="border-l border-white/10 px-2 py-1 text-emerald-400 hover:bg-emerald-500/20 font-bold"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Specs */}
        <div className="rounded-2xl border border-white/10 bg-[#141d17] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">
            Specs & Details
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Size & Dimensions
              </label>
              <input
                type="text"
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

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-neutral-300 hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-forest px-6 py-2.5 text-xs font-semibold text-cream shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Update Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
