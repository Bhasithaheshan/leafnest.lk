"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import PlantArt from "./PlantArt";
import { categories, products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cartContext";
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  X,
  Menu,
  PhoneCall,
  ArrowRight,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { whatsappLink } from "@/lib/config";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Cart context
  const {
    items,
    cartCount,
    cartTotal,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
  } = useCart();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShopDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products for search
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Generate WhatsApp order message for entire cart
  const handleCheckoutCart = () => {
    if (items.length === 0) return;
    const itemList = items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.name} (Qty: ${it.quantity}) - ${formatPrice(it.price * it.quantity)}`
      )
      .join("\n");

    const message = 
`Hi Leafnest.lk, I’d like to place an order for the following items:
${itemList}

• Total Amount: ${formatPrice(cartTotal)}

Please confirm my order and let me know the island-wide delivery details.`;

    const url = whatsappLink(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (From mockup) */}
      {showTopBar && (
        <div className="relative z-50 bg-[#1f2421] text-xs font-medium text-neutral-200 transition-all">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-center">
              <span className="text-emerald-400">🌱</span>
              <p className="text-[11px] sm:text-xs">
                <span className="font-semibold text-white">Bring Nature Home</span>{" "}
                — Free Delivery on Orders Over Rs. 5,000
              </p>
            </div>
            <div className="flex flex-1 justify-end">
              <button
                type="button"
                onClick={() => setShowTopBar(false)}
                className="rounded p-1 text-neutral-400 hover:text-white transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/70 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Official Brand Logo - Enlarged and responsive for clear visibility on mobile */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:opacity-95 py-1"
            aria-label="Leafnest.lk Home"
          >
            <Logo className="h-11 w-auto sm:h-12 lg:h-14" />
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 text-[14px] font-medium text-neutral-700 md:flex"
          >
            {/* Home with active bottom indicator line from mockup */}
            <Link
              href="/"
              className={`relative py-1 transition-colors hover:text-black ${
                pathname === "/"
                  ? "font-semibold text-black after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:bg-neutral-900"
                  : ""
              }`}
            >
              Home
            </Link>

            {/* Shop with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className={`flex items-center gap-1 py-1 transition-colors hover:text-black ${
                  pathname.startsWith("/shop") ? "font-semibold text-black" : ""
                }`}
                aria-expanded={shopDropdownOpen}
              >
                <span>Shop</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    shopDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Shop Dropdown Menu */}
              {shopDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-neutral-200/80 bg-white/95 p-3 shadow-xl backdrop-blur-md">
                  <div className="mb-2 px-3 pt-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Browse Categories
                  </div>
                  <Link
                    href="/shop"
                    onClick={() => setShopDropdownOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
                  >
                    <span>All Products</span>
                    <span className="text-[11px] text-neutral-400">({products.length})</span>
                  </Link>
                  <hr className="my-1.5 border-neutral-100" />
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop?category=${c.slug}`}
                      onClick={() => setShopDropdownOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-neutral-400">{c.blurb}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#about"
              className="py-1 transition-colors hover:text-black"
            >
              About Us
            </Link>

            <Link
              href="/#categories"
              className="py-1 transition-colors hover:text-black"
            >
              Categories
            </Link>

            <Link
              href="/#contact"
              className="py-1 transition-colors hover:text-black"
            >
              Contact
            </Link>
          </nav>

          {/* Right: Action Icons (Search, Account, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
              aria-label="Search store"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Account / User Trigger - visible on sm+ to keep mobile header clean and spacious */}
            <a
              href={whatsappLink("Hi Leafnest.lk, I'd like to ask about my order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex rounded-full p-2 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
              aria-label="Customer Account / Support"
              title="Customer Support"
            >
              <User className="h-5 w-5" />
            </a>

            {/* Cart Trigger with Real Badge Count */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-forest text-[10px] font-bold text-cream shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-1 rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200/80 bg-white/95 px-5 py-4 backdrop-blur-lg md:hidden">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-base font-semibold ${
                  pathname === "/" ? "text-neutral-900" : "text-neutral-600"
                }`}
              >
                Home
              </Link>
              <div className="border-y border-neutral-100 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Shop Categories
                </span>
                <div className="mt-2 space-y-1 pl-2">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-sm font-semibold text-neutral-800"
                  >
                    All Products
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop?category=${c.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 text-sm text-neutral-600 hover:text-black"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-base font-medium text-neutral-600 hover:text-black"
              >
                About Us
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-base font-medium text-neutral-600 hover:text-black"
              >
                Contact
              </Link>
              <div className="pt-2">
                <a
                  href={whatsappLink("Hi Leafnest.lk, I'd like to ask about your artificial plants / order.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-semibold text-cream shadow-sm hover:opacity-95"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>WhatsApp Support (077 583 5445)</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* 3. SEARCH MODAL DIALOG */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20 backdrop-blur-sm sm:pt-28">
          <div className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex flex-1 items-center gap-3">
                <Search className="h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search artificial plants, pots, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm font-medium text-neutral-900 placeholder-neutral-400 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="mt-4 max-h-80 overflow-y-auto">
              {searchQuery.trim() ? (
                filteredProducts.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/product/${p.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-neutral-100"
                      >
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {p.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatPrice(p.price)}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-neutral-400" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-neutral-500">
                    No products matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                )
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Quick suggestions
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {["Monstera", "Artificial Ivy", "Ceramic Pot", "Watering Can"].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSearchQuery(tag)}
                          className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-200"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. CART SLIDE-OVER DRAWER WITH REAL ITEMS & WHATSAPP CHECKOUT */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-neutral-900" />
                <h2 className="text-lg font-bold text-neutral-900">
                  Your Cart ({cartCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            {items.length > 0 ? (
              <>
                <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 py-4">
                  {items.map((item) => (
                    <div key={item.slug} className="flex gap-3.5 py-4">
                      {/* Thumbnail */}
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <PlantArt
                            kind={item.art || "artificial"}
                            tint={item.tint || "#EFEBDD"}
                            className="h-full w-full"
                          />
                        )}
                      </div>

                      {/* Info & Quantity */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs font-bold text-forest mt-0.5">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex h-7 items-center rounded border border-neutral-200 bg-neutral-50 px-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                              className="px-1 text-neutral-500 hover:text-black"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                              className="px-1 text-neutral-500 hover:text-black"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.slug)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer with Total and WhatsApp Checkout */}
                <div className="border-t border-neutral-100 pt-4">
                  <div className="flex items-center justify-between text-sm font-bold text-neutral-900 mb-4">
                    <span>Total Amount</span>
                    <span className="text-lg text-forest">{formatPrice(cartTotal)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckoutCart}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-forest py-3.5 text-sm font-semibold text-cream shadow-md transition-all hover:bg-nature"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>Checkout on WhatsApp</span>
                  </button>
                </div>
              </>
            ) : (
              /* Empty Cart State */
              <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                  Your cart is currently empty
                </h3>
                <p className="mt-1 max-w-xs text-xs text-neutral-500">
                  Browse our realistic artificial plants and stylish pots to bring nature home.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setCartOpen(false)}
                  className="mt-6 rounded-md bg-forest px-6 py-2.5 text-xs font-semibold text-cream hover:bg-nature transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
