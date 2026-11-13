import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/lib/products";
import {
  ArrowRight,
  Leaf,
  Truck,
  Headphones,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import { whatsappLink } from "@/lib/config";

export default function Home() {
  const featured = products.filter((p) => p.stock !== "out").slice(0, 8);

  const trustBadges = [
    {
      icon: Leaf,
      title: "Premium Quality",
      subtitle: "Plants & Products",
    },
    {
      icon: Truck,
      title: "Island-wide Delivery",
      subtitle: "Safe & Secure",
    },
    {
      icon: Headphones,
      title: "Friendly Support",
      subtitle: "Always Here",
    },
    {
      icon: ShieldCheck,
      title: "Secure Online Shopping",
      subtitle: "Shop with Confidence",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900">
      {/* =========================================================================
          1. HERO SECTION (With original buttons & official brand colors)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F4F0] to-[#FAF9F7] pt-6 pb-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Content Column */}
            <div className="flex flex-col justify-center lg:col-span-6 z-10">
              {/* Eyebrow subtitle with horizontal line from mockup */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Bring Nature Home
                </span>
                <span className="h-[1.5px] w-12 bg-neutral-300" />
              </div>

              {/* Main Headline */}
              <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl leading-[1.08]">
                Green Living<br />
                Made Easy
              </h1>

              {/* Description (Original copy: Artificial plants, stylish pots...) */}
              <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-neutral-600">
                Artificial plants, stylish pots, gardening accessories and nature-inspired décor to make your space a little greener.
              </p>

              {/* Original Hero Buttons restored exactly as requested */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="rounded-full bg-forest px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-nature"
                >
                  Shop all products
                </Link>
                <Link
                  href="/shop?category=artificial-plants"
                  className="rounded-full border-2 border-forest px-7 py-3 font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
                >
                  Browse artificial plants
                </Link>
              </div>
            </div>

            {/* Right Hero Image Column (Monstera, succulent & potted plants) */}
            <div className="relative lg:col-span-6">
              <div className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-100/60 shadow-xl lg:max-w-none">
                <Image
                  src="/images/hero-composition.jpg"
                  alt="Green Living Made Easy with Leafnest.lk artificial plants"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Subtle light vignette/gradient overlay for high-end aesthetic */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TRUST / FEATURE BADGES STRIP (4 Columns from Mockup)
      ========================================================================= */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6">
        <div className="rounded-2xl border border-neutral-200/80 bg-white/85 p-6 shadow-sm backdrop-blur-md">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.title}
                  className={`flex items-center gap-3.5 ${
                    idx > 0 ? "pt-4 md:pt-0 md:pl-6" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                      {badge.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-500">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. OUR CATEGORIES SECTION (100% Artificial Plants, Pots & Accessories)
      ========================================================================= */}
      <section id="categories" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        {/* Section Header with Centered Leaf Icon */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-8 bg-neutral-300" />
            <Leaf className="h-4 w-4 text-neutral-800" />
            <span className="h-[1px] w-8 bg-neutral-300" />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Our Categories
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-neutral-500">
            Find the perfect greenery for your space
          </p>
        </div>

        {/* 3 Core Category Cards in Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group flex items-center justify-between gap-3.5 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md"
            >
              {/* Left: Thumbnail image from mockup */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/60">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Middle: Title & Subtitle */}
              <div className="min-w-0 flex-1 pr-1">
                <h3 className="text-base font-bold text-neutral-900 transition-colors group-hover:text-forest">
                  {cat.name}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1">
                  {cat.blurb}
                </p>
              </div>

              {/* Right: Circular Dark Button with Arrow */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-all duration-300 group-hover:bg-forest group-hover:scale-105">
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. FEATURED PRODUCTS SECTION (Artificial Plants, Pots & Accessories)
      ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Handpicked Selection
            </span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-900">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-800 hover:text-forest"
          >
            <span>View all products</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. ABOUT & VALUE PROPOSITION (Artificial Plants Focus)
      ========================================================================= */}
      <section id="about" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/70 p-8 shadow-sm backdrop-blur-sm sm:p-12 lg:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest font-semibold">
                About Leafnest.lk
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
                Breathe Evergreen Style Into Your Spaces
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-600">
                At Leafnest.lk, we curate high-grade realistic artificial plants, elegant ceramic pots, and mindful accessories to make every corner of your home or workspace feel calm, green, and naturally inspired — without the fuss of watering, wilting, or repotting.
              </p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium text-neutral-800">
                  <CheckCircle2 className="h-5 w-5 text-forest flex-shrink-0" />
                  <span>Doorstep delivery throughout all 25 districts in Sri Lanka</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-neutral-800">
                  <CheckCircle2 className="h-5 w-5 text-forest flex-shrink-0" />
                  <span>Lifelike artificial foliage that stays vibrant forever</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-neutral-800">
                  <CheckCircle2 className="h-5 w-5 text-forest flex-shrink-0" />
                  <span>Handcrafted ceramic pots and modern planters</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-nature"
                >
                  <span>Explore the Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200/70">
              <Image
                src="/images/cat-pots-hd.jpg"
                alt="Modern planters and artificial greenery"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. CLOSING CALL TO ACTION BANNER
      ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-forest px-8 py-16 text-center text-cream sm:px-16">
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-lime backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Direct Island-Wide Orders
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Make your space a little greener.
            </h2>
            <p className="mt-4 text-base text-cream/80">
              Pick an artificial plant, a pot, and a place for it. We pack each piece with extra care and deliver straight to your door across Sri Lanka.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-lime px-8 py-3.5 text-sm font-semibold text-forest transition-colors hover:bg-cream"
              >
                Start shopping
              </Link>
              <a
                href={whatsappLink("Hi Leafnest.lk, I'd like help choosing artificial plants for my home.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cream/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
