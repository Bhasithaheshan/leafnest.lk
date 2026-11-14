"use client";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { categories, products, getCategory } from "@/lib/products";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ShopClient({ initialProducts = [] }) {
  const params = useSearchParams();
  const router = useRouter();
  const rawCat = params.get("category") || "all";
  
  // Resolve alias (e.g. 'plant-pots' -> 'pots-planters')
  const resolvedCat = getCategory(rawCat);
  const currentCategory = rawCat === "all" ? "all" : (resolvedCat?.slug || rawCat);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  const allProducts = initialProducts && initialProducts.length > 0 ? initialProducts : products;

  const setCategory = (slug) =>
    router.push(slug === "all" ? "/shop" : `/shop?category=${slug}`, { scroll: false });

  const list = useMemo(() => {
    let r = allProducts.filter(
      (p) => currentCategory === "all" || p.category === currentCategory
    );
    const q = query.trim().toLowerCase();
    if (q) {
      r = r.filter((p) => (p.name + " " + p.description).toLowerCase().includes(q));
    }
    if (inStockOnly) r = r.filter((p) => p.stock !== "out");
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [currentCategory, query, sort, inStockOnly]);

  const chip = (active) =>
    `rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-200 ${
      active
        ? "bg-neutral-900 text-white shadow-sm"
        : "bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-100 hover:text-black"
    }`;

  return (
    <div className="pb-20">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Categories">
        <button className={chip(currentCategory === "all")} onClick={() => setCategory("all")}>
          All Products
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={chip(currentCategory === c.slug)}
            onClick={() => setCategory(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white/70 p-4 backdrop-blur-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plants, pots, accessories..."
            aria-label="Search products"
            className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 outline-none focus:border-neutral-900"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded accent-neutral-900"
            />
            In stock only
          </label>
        </div>
      </div>

      {/* Product count */}
      <div className="mt-6 flex items-center justify-between text-xs text-neutral-500">
        <p aria-live="polite">
          Showing <span className="font-semibold text-neutral-900">{list.length}</span>{" "}
          {list.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Grid */}
      {list.length ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-12 text-center">
          <p className="text-base font-bold text-neutral-900">No products match your criteria.</p>
          <p className="mt-1 text-xs text-neutral-500">
            Try searching for something else, or clear your filters to view all products.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setInStockOnly(false);
              setCategory("all");
            }}
            className="mt-5 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
