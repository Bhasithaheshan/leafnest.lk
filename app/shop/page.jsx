import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Shop Artificial Plants & Pots | Leafnest.lk",
  description:
    "Explore our collection of realistic artificial plants, stylish pots, and home décor accessories in Sri Lanka.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F7] pt-8 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-black">
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">Shop</span>
        </nav>

        <div className="mt-6 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-forest font-semibold">
            Our Collection
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Explore Artificial Plants &amp; Pots
          </h1>
          <p className="mt-1 text-sm text-neutral-600 max-w-xl">
            Filter by artificial foliage, modern planters, and home accessories with direct island-wide delivery.
          </p>
        </div>

        <Suspense fallback={<p className="text-sm text-neutral-500 py-10">Loading catalogue…</p>}>
          <ShopClient />
        </Suspense>
      </div>
    </div>
  );
}
