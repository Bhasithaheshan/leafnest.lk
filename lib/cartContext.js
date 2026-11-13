"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext({
  items: [],
  cartCount: 0,
  cartTotal: 0,
  cartOpen: false,
  setCartOpen: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("leafnest_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      // ignore JSON parse errors
    }
    setLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem("leafnest_cart", JSON.stringify(items));
      } catch (e) {
        // ignore storage errors
      }
    }
  }, [items, loaded]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.slug === product.slug);
      if (existing) {
        return prev.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          art: product.art,
          tint: product.tint,
          quantity,
        },
      ];
    });
    setCartOpen(true);
  };

  const updateQuantity = (slug, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(slug);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (slug) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
