"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import PlantArt from "./PlantArt";
import { formatPrice, getCategory } from "@/lib/products";
import { ArrowUpRight } from "lucide-react";

export function StockTag({ stock }) {
  if (stock === "out") {
    return (
      <span className="rounded-full bg-neutral-900/80 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
        Out of stock
      </span>
    );
  }
  if (stock === "low") {
    return (
      <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
        Low stock
      </span>
    );
  }
  return null;
}

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const cat = getCategory(product.category);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200/70 transition-all duration-300 group-hover:shadow-lg group-hover:border-neutral-300">
        {product.image && !imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <PlantArt
            kind={product.art || "artificial"}
            tint={product.tint || "#EFEBDD"}
            className="aspect-square w-full transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Stock status badge */}
        <div className="absolute left-3 top-3 z-10">
          <StockTag stock={product.stock} />
        </div>

        {/* Quick view indicator on hover */}
        <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:scale-105">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="pt-3">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {cat?.name || "Greenery"}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-neutral-900 group-hover:text-black line-clamp-1 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
