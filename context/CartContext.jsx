"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([
    {
      id: "p1",
      name: "Savile Double-Breasted Cashmere Blazer",
      price: 1450,
      selectedSize: "L",
      selectedColor: { name: "Deep Navy", hex: "#1c2e4a" },
      quantity: 1,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "p3",
      name: "Atelier Raw Silk Grandad Shirt",
      price: 420,
      selectedSize: "M",
      selectedColor: { name: "Ivory", hex: "#f2f1ec" },
      quantity: 1,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(["p1", "p4"]);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Totals calculation
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = promoDiscount > 0 ? Math.round(subtotal * promoDiscount) : 0;
  const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 45;
  const tax = Math.round((subtotal - discountAmount) * 0.08);
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping + tax);

  const addToCart = (product, size = null, color = null, quantity = 1) => {
    const chosenSize = size || (product.sizes ? product.sizes[0] : "M");
    const chosenColor = color || (product.colors ? product.colors[0] : { name: "Navy", hex: "#1c2e4a" });
    const image = product.images ? product.images[0] : product.img1;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor.name === chosenColor.name
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
          quantity,
          image,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (id, size, colorName, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (
            item.id === id &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id, size, colorName) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          )
      )
    );
  };

  const applyPromoCode = (code) => {
    if (code.toUpperCase() === "GORVIP" || code.toUpperCase() === "ATELIER15") {
      setPromoCode(code.toUpperCase());
      setPromoDiscount(0.15);
      return { success: true, message: "VIP 15% Atelier Discount Applied!" };
    }
    return { success: false, message: "Invalid promo code" };
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        discountAmount,
        shipping,
        tax,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        promoCode,
        applyPromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
