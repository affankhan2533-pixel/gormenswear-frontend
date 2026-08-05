"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("gor_cart_items");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem("gor_wishlist_items");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("gor_cart_items", JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }, [cartItems, isLoaded]);

  // Save wishlist to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("gor_wishlist_items", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist, isLoaded]);

  // Totals calculation
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const discountAmount = promoDiscount > 0 ? Math.round(subtotal * promoDiscount) : 0;
  const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 45;
  const tax = Math.round((subtotal - discountAmount) * 0.08);
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping + tax);

  const addToCart = (product, size = null, color = null, quantity = 1) => {
    if (!product) return;

    const chosenSize = size || (Array.isArray(product.sizes) ? product.sizes[0] : "M");
    const chosenColor = color || (Array.isArray(product.colors) ? product.colors[0] : { name: "Onyx Black", hex: "#111111" });
    const image =
      product.image ||
      (Array.isArray(product.images) && product.images[0]) ||
      product.imageUrl ||
      "/images/products/gor-codset-burgundy-alo.webp";

    const prodId = product.id || product._id;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          (item.id || item._id) === prodId &&
          item.selectedSize === chosenSize &&
          item.selectedColor?.name === chosenColor?.name
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          id: prodId,
          _id: prodId,
          name: product.name,
          price: Number(product.price) || 0,
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
            (item.id === id || item._id === id) &&
            item.selectedSize === size &&
            (item.selectedColor?.name === colorName || !colorName)
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
            (item.id === id || item._id === id) &&
            item.selectedSize === size &&
            (item.selectedColor?.name === colorName || !colorName)
          )
      )
    );
  };

  const applyPromoCode = (code) => {
    if (code && (code.toUpperCase() === "GORVIP" || code.toUpperCase() === "ATELIER15")) {
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
    if (!productId) return;
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
