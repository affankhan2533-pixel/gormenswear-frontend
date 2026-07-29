"use client";

// GA4, Meta Pixel, and Clarity Safe Analytics Engine

const isDev = process.env.NODE_ENV === "development";

const logDevEvent = (eventName, payload) => {
  if (isDev) {
    console.log(`[Analytics Event] ${eventName}:`, payload);
  }
};

/**
  Check if analytics cookie consent is granted
 */
export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("gor_cookie_consent") === "accepted";
  } catch (e) {
    return false;
  }
}

/**
  Track Page View
 */
export function trackPageView(url) {
  try {
    if (!hasAnalyticsConsent()) return;

    const payload = {
      page_path: url,
      timestamp: new Date().toISOString(),
    };

    logDevEvent("page_view", payload);

    if (window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }

    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  } catch (e) {
    // Fail silently
  }
}

/**
  Track View Item / Product Impression
 */
export function trackViewItem(product) {
  try {
    if (!hasAnalyticsConsent() || !product) return;

    const payload = {
      currency: "USD",
      value: product.price,
      items: [
        {
          item_id: String(product.id || product._id),
          item_name: product.name,
          item_category: product.category || "Garment",
          price: product.price,
          quantity: 1,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    logDevEvent("view_item", payload);

    if (window.gtag) {
      window.gtag("event", "view_item", payload);
    }

    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: product.name,
        content_category: product.category,
        content_ids: [String(product.id || product._id)],
        content_type: "product",
        value: product.price,
        currency: "USD",
      });
    }
  } catch (e) {
    // Fail silently
  }
}

/**
  Track Add To Cart
 */
export function trackAddToCart(product, quantity = 1, selectedSize = "M") {
  try {
    if (!hasAnalyticsConsent() || !product) return;

    const payload = {
      currency: "USD",
      value: product.price * quantity,
      items: [
        {
          item_id: String(product.id || product._id),
          item_name: product.name,
          item_category: product.category || "Garment",
          item_variant: selectedSize,
          price: product.price,
          quantity,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    logDevEvent("add_to_cart", payload);

    if (window.gtag) {
      window.gtag("event", "add_to_cart", payload);
    }

    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: product.name,
        content_ids: [String(product.id || product._id)],
        content_type: "product",
        value: product.price * quantity,
        currency: "USD",
      });
    }
  } catch (e) {
    // Fail silently
  }
}

/**
  Track Add To Wishlist
 */
export function trackAddToWishlist(product) {
  try {
    if (!hasAnalyticsConsent() || !product) return;

    const payload = {
      currency: "USD",
      value: product.price,
      items: [
        {
          item_id: String(product.id || product._id),
          item_name: product.name,
          item_category: product.category || "Garment",
          price: product.price,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    logDevEvent("add_to_wishlist", payload);

    if (window.gtag) {
      window.gtag("event", "add_to_wishlist", payload);
    }

    if (window.fbq) {
      window.fbq("track", "AddToWishlist", {
        content_name: product.name,
        content_ids: [String(product.id || product._id)],
        value: product.price,
        currency: "USD",
      });
    }
  } catch (e) {
    // Fail silently
  }
}

/**
  Track Begin Checkout
 */
export function trackBeginCheckout(cartItems = [], grandTotal = 0) {
  try {
    if (!hasAnalyticsConsent()) return;

    const payload = {
      currency: "USD",
      value: grandTotal,
      items: cartItems.map((item) => ({
        item_id: String(item.id || item._id),
        item_name: item.name,
        item_variant: item.selectedSize || "M",
        price: item.price,
        quantity: item.quantity,
      })),
      timestamp: new Date().toISOString(),
    };

    logDevEvent("begin_checkout", payload);

    if (window.gtag) {
      window.gtag("event", "begin_checkout", payload);
    }

    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        num_items: cartItems.length,
        value: grandTotal,
        currency: "USD",
      });
    }
  } catch (e) {
    // Fail silently
  }
}

/**
  Track Purchase Event
 */
export function trackPurchase(orderId, grandTotal = 0, items = []) {
  try {
    if (!hasAnalyticsConsent()) return;

    const payload = {
      transaction_id: String(orderId),
      value: grandTotal,
      currency: "USD",
      items: items.map((item) => ({
        item_id: String(item.id || item._id),
        item_name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      timestamp: new Date().toISOString(),
    };

    logDevEvent("purchase", payload);

    if (window.gtag) {
      window.gtag("event", "purchase", payload);
    }

    if (window.fbq) {
      window.fbq("track", "Purchase", {
        value: grandTotal,
        currency: "USD",
        content_type: "product",
      });
    }
  } catch (e) {
    // Fail silently
  }
}

/**
  Track Search Analytics
 */
export function trackSearch(searchTerm, resultsCount = 0) {
  try {
    if (!hasAnalyticsConsent() || !searchTerm) return;

    const payload = {
      search_term: searchTerm,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
    };

    logDevEvent("search", payload);

    if (window.gtag) {
      window.gtag("event", "search", payload);
    }
  } catch (e) {
    // Fail silently
  }
}
