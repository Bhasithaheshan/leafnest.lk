"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import PlantArt from "./PlantArt";
import { StockTag } from "./ProductCard";

export default function ProductGallery({
  images = [],
  title = "Product",
  stock = "in",
  badge = null,
  art = "artificial",
  tint = "#EFEBDD",
}) {
  // Normalize images array
  const imageList = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean)
    : [];

  const [activeIndex, setActiveIndex] = useState(0);

  const hasMultiple = imageList.length > 1;
  const currentImage = imageList[activeIndex] || null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* 1. THUMBNAILS (Vertical on Desktop, Horizontal on Mobile) */}
      {hasMultiple && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[540px] py-1 md:py-0 px-1 scrollbar-thin">
          {imageList.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                aria-label={`View photo ${idx + 1} of ${title}`}
                className={`relative h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 bg-white ${
                  isActive
                    ? "border-forest shadow-md scale-102 ring-1 ring-forest/30"
                    : "border-neutral-200/80 hover:border-neutral-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 2. MAIN LARGE SHOWCASE IMAGE */}
      <div className="relative flex-1 aspect-square w-full overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm group">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={`${title} - View ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlantArt
            kind={art || "artificial"}
            tint={tint || "#EFEBDD"}
            className="aspect-square w-full"
          />
        )}

        {/* Stock Status & Promo Badge Overlay */}
        <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
          <StockTag stock={stock} />
          {badge && (
            <span className="rounded-full bg-neutral-900/90 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs">
              {badge}
            </span>
          )}
        </div>

        {/* Prev / Next Arrow Controls (Visible if multiple images) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-xs opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-xs opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Photo Counter Pill (e.g. 1 / 4) */}
            <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs shadow-sm">
              {activeIndex + 1} / {imageList.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
