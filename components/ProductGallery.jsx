"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
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
  const imageList =
    Array.isArray(images) && images.length > 0
      ? images.filter(Boolean)
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const hasMultiple = imageList.length > 1;
  const currentImage = imageList[activeIndex] || null;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation & body scroll lock for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isLightboxOpen, imageList.length]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full min-w-0">
        {/* 1. THUMBNAILS:
            - Desktop (md:): Vertical column on the LEFT (md:order-1)
            - Mobile: Horizontal swipeable strip on the BOTTOM (order-2)
        */}
        {hasMultiple && (
          <div className="order-2 md:order-1 flex md:flex-col gap-2 sm:gap-3 overflow-x-auto md:overflow-y-auto w-full md:w-auto md:max-h-[520px] py-1 md:py-0 px-0.5 scrollbar-thin shrink-0 min-w-0">
            {imageList.map((img, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  aria-label={`View photo ${idx + 1} of ${title}`}
                  className={`relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-xl md:rounded-2xl border-2 transition-all duration-200 bg-white ${
                    isActive
                      ? "border-forest shadow-md scale-102 ring-1 ring-forest/30"
                      : "border-neutral-200/80 hover:border-neutral-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${title} thumbnail ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 64px, 80px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* 2. MAIN LARGE SHOWCASE IMAGE:
            - Desktop (md:): On the RIGHT of thumbnails (md:order-2)
            - Mobile: Top image showcase (order-1)
        */}
        <div
          onClick={() => currentImage && setIsLightboxOpen(true)}
          className="order-1 md:order-2 relative aspect-square w-full min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white shadow-sm group cursor-zoom-in"
          title="Click to view full photo"
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt={`${title} - View ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
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
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4 flex flex-col gap-1.5 sm:gap-2 z-10 pointer-events-none">
            <StockTag stock={stock} />
            {badge && (
              <span className="rounded-full bg-neutral-900/90 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-sm backdrop-blur-xs">
                {badge}
              </span>
            )}
          </div>

          {/* Expand Fullscreen Button */}
          {currentImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              aria-label="Click to enlarge photo"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-neutral-800 shadow-md backdrop-blur-xs opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white hover:scale-105 active:scale-95"
            >
              <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Expand</span>
            </button>
          )}

          {/* Prev / Next Arrow Controls */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-xs opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95 z-10"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-xs opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95 z-10"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Photo Counter Pill (e.g. 5 / 11) */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 rounded-full bg-black/60 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-white backdrop-blur-xs shadow-sm pointer-events-none">
                {activeIndex + 1} / {imageList.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && currentImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full size photo viewer"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between px-3 py-3 sm:px-8 sm:py-4 text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
              <span className="font-semibold text-xs sm:text-base text-neutral-200 truncate max-w-[180px] sm:max-w-md">
                {title}
              </span>
              {hasMultiple && (
                <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-neutral-300">
                  {activeIndex + 1} / {imageList.length}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
              aria-label="Close fullscreen view (Esc)"
              title="Close (Esc)"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Center Image Display */}
          <div
            className="relative flex-1 flex items-center justify-center px-2 sm:px-16 md:px-20 py-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev button */}
            {hasMultiple && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-6 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
                title="Previous photo (Left Arrow)"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}

            {/* High-Res Image Container */}
            <div
              className="relative h-full w-full max-w-5xl max-h-[70vh] sm:max-h-[78vh] md:max-h-[82vh] flex items-center justify-center cursor-zoom-out"
              onClick={() => setIsLightboxOpen(false)}
              title="Click to close"
            >
              <Image
                src={currentImage}
                alt={`${title} - View ${activeIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Next button */}
            {hasMultiple && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-2 sm:right-6 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
                title="Next photo (Right Arrow)"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {hasMultiple && (
            <div
              className="px-3 py-2.5 sm:py-4 flex items-center justify-center overflow-x-auto gap-2 sm:gap-2.5 z-20 scrollbar-thin max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Jump to photo ${idx + 1}`}
                  className={`relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 shrink-0 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-150 bg-neutral-900 ${
                    idx === activeIndex
                      ? "border-emerald-400 scale-105 ring-2 ring-emerald-400/50"
                      : "border-transparent opacity-40 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
