"use client";

import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import { whatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/products";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";

export default function ProductActions({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const isOutOfStock = product.stock === "out";

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const totalAmount = product.price * quantity;
    const message = 
`Hi Leafnest.lk, I’d like to buy:
• Product: ${product.name}
• Quantity: ${quantity}
• Unit Price: ${formatPrice(product.price)}
• Total Amount: ${formatPrice(totalAmount)}

Please confirm my order and island-wide delivery details.`;

    const url = whatsappLink(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (isOutOfStock) {
    return (
      <div className="mt-8 flex flex-col gap-3">
        <a
          href={whatsappLink(`Hi Leafnest.lk, when will "${product.name}" be back in stock?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center rounded-md border-2 border-forest font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          Ask about restock on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {/* 1. Quantity Selector matching user image */}
      <div className="flex h-12 items-center rounded-md border border-neutral-300 bg-white px-2 select-none">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:text-black disabled:opacity-30 disabled:hover:text-neutral-600"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <span className="w-10 text-center font-semibold text-neutral-900 text-sm">
          {quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          className="flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:text-black"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 2. Add To Cart Button (Filled, Forest brand colour) */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="flex h-12 flex-1 min-w-[140px] items-center justify-center gap-2 rounded-md bg-forest px-6 text-sm font-semibold text-cream shadow-sm transition-all hover:bg-nature active:scale-[0.99]"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            <span>Add To Cart</span>
          </>
        )}
      </button>

      {/* 3. Buy Now Button (Bordered, Forest brand colour) */}
      <button
        type="button"
        onClick={handleBuyNow}
        className="flex h-12 flex-1 min-w-[130px] items-center justify-center rounded-md border-2 border-forest px-6 text-sm font-semibold text-forest transition-all hover:bg-forest hover:text-cream active:scale-[0.99]"
      >
        Buy Now
      </button>
    </div>
  );
}
