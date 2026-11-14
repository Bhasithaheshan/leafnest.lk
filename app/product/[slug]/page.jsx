import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PlantArt from "@/components/PlantArt";
import ProductCard, { StockTag } from "@/components/ProductCard";
import ProductActions from "@/components/ProductActions";
import ProductGallery from "@/components/ProductGallery";
import { getProduct, getCategory, products, formatPrice } from "@/lib/products";
import { getProductById, getAllProducts } from "@/lib/dataService";
import { whatsappLink } from "@/lib/config";
import { Truck, ShieldCheck, PhoneCall, Check, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const p = (await getProductById(params.slug)) || getProduct(params.slug);
  return {
    title: p ? `${p.name} | Leafnest.lk` : "Product",
    description: p ? p.description : undefined,
  };
}

export default async function ProductPage({ params }) {
  const p = (await getProductById(params.slug)) || getProduct(params.slug);
  if (!p) notFound();
  const allProducts = await getAllProducts();
  const activeProducts = allProducts && allProducts.length > 0 ? allProducts : products;
  const cat = getCategory(p.category);
  const related = activeProducts
    .filter((x) => x.category === p.category && x.slug !== p.slug)
    .slice(0, 4);
  const out = p.stock === "out";

  const details = [
    ["Size", p.size],
    ["Material", p.material],
    ["Category", cat?.name],
  ].filter(([, v]) => v);

  return (
    <div className="min-h-screen bg-[#FAF9F7] py-10 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <Link href="/shop" className="inline-flex items-center gap-1 hover:text-black">
            <ArrowLeft className="h-3.5 w-3.5" />
            Shop
          </Link>
          <span>/</span>
          <Link href={`/shop?category=${p.category}`} className="hover:text-black">
            {cat?.name}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 truncate max-w-xs">{p.name}</span>
        </nav>

        {/* Main Product Showcase */}
        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery
              images={p.images && p.images.length > 0 ? p.images : [p.image].filter(Boolean)}
              title={p.name}
              stock={p.stock}
              badge={p.badge}
              art={p.art || "artificial"}
              tint={p.tint || "#EFEBDD"}
            />
          </div>

          {/* Right: Product Details & WhatsApp Order */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {cat?.name}
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              {p.name}
            </h1>

            {/* Price & Stock */}
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black text-neutral-900">
                {formatPrice(p.price)}
              </span>
              {p.oldPrice && (
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(p.oldPrice)}
                </span>
              )}
              {p.stock === "in" && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Ready to Deliver
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-neutral-600 sm:text-base">
              {p.description}
            </p>

            {/* Specs Table */}
            <dl className="mt-6 divide-y divide-neutral-100 rounded-2xl border border-neutral-200/80 bg-white/80 px-5 text-xs sm:text-sm">
              {details.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="font-semibold text-neutral-500">{k}</dt>
                  <dd className="text-right font-medium text-neutral-900">{v}</dd>
                </div>
              ))}
            </dl>

            {/* Quantity Selector, Add To Cart & Buy Now Buttons */}
            <ProductActions product={p} />

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-neutral-200/80 pt-6">
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <Truck className="h-4 w-4 text-neutral-800" />
                <span>Island-wide secure dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <ShieldCheck className="h-4 w-4 text-neutral-800" />
                <span>100% Quality guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features & Maintenance */}
        <div className="mt-16 grid gap-8 rounded-3xl border border-neutral-200/80 bg-white/60 p-8 sm:p-12 md:grid-cols-2">
          {p.features?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Key Features</h2>
              <ul className="mt-4 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {p.care?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                {p.category.includes("artificial") ? "Maintenance" : "Care Instructions"}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {p.care.map((c) => (
                  <li key={c} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-neutral-800">
                      •
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              More from {cat?.name}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
