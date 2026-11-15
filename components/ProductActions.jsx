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
      <div className="mt-6 flex flex-col gap-3 w-full">
        <a
          href={whatsappLink(`Hi Leafnest.lk, when will "${product.name}" be back in stock?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-forest font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          Ask about restock on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
      {/* Row 1 on mobile: Quantity selector + Add To Cart button */}
      <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        {/* Quantity Selector */}
        <div className="flex h-12 items-center rounded-xl border border-neutral-300 bg-white px-2 select-none shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="flex h-8 w-8 items-center justify-center text-neutral-600 transition-colors hover:text-black disabled:opacity-30 disabled:hover:text-neutral-600"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <span className="w-8 text-center font-bold text-neutral-900 text-sm">
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

        {/* Add To Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex h-12 flex-1 sm:flex-initial sm:px-6 items-center justify-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-cream shadow-sm transition-all hover:bg-nature active:scale-[0.98]"
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
      </div>

      {/* Buy Now (WhatsApp direct order) button */}
      <button
        type="button"
        onClick={handleBuyNow}
        className="flex h-12 w-full sm:flex-1 items-center justify-center gap-2 rounded-xl border-2 border-forest bg-forest/5 px-6 text-sm font-semibold text-forest transition-all hover:bg-forest hover:text-cream active:scale-[0.98]"
      >
        <span>Buy Now</span>
      </button>
    </div>
  );
}
