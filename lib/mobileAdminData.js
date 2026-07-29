// GOR MENSWEAR — Enterprise Mobile Admin Platform Core Data & Utilities

export const INITIAL_MOBILE_METRICS = {
  revenueToday: "$18,450",
  ordersToday: 28,
  pendingOrders: 6,
  lowStockAlerts: 4,
  activeCustomers: 1840,
  unreadNotifications: 5,
};

export const INITIAL_MOBILE_QUICK_ACTIONS = [
  { id: "add-prod", title: "Add Product", icon: "Plus", color: "#C8A45D" },
  { id: "update-inv", title: "Update Inventory", icon: "Package", color: "#34d399" },
  { id: "view-orders", title: "View Orders", icon: "ShoppingBag", color: "#60a5fa" },
  { id: "manage-cust", title: "Manage Customers", icon: "Users", color: "#c084fc" },
  { id: "pub-coll", title: "Publish Collection", icon: "Layers", color: "#f472b6 text-pink-400" },
  { id: "create-promo", title: "Create Promo", icon: "Tag", color: "#fbbf24" },
];

export const INITIAL_MOBILE_ORDERS = [
  {
    id: "m-ord-101",
    orderId: "ORD-2026-8801",
    customerName: "Lord Julian Sterling",
    customerEmail: "j.sterling@mayfair.co.uk",
    orderDate: "10:14 AM",
    amount: 2450,
    status: "Processing",
    paymentStatus: "Paid",
    fulfillment: "Unfulfilled",
    internalNotes: "VIP client requested gift packaging with gold ribbon.",
    items: [
      { name: "Biella Shearling Trimmed Suede Jacket", qty: 1, price: 2450 },
    ],
  },
  {
    id: "m-ord-102",
    orderId: "ORD-2026-8802",
    customerName: "Dominic Thorne",
    customerEmail: "d.thorne@gormenswear.com",
    orderDate: "09:42 AM",
    amount: 1000,
    status: "Pending",
    paymentStatus: "Paid",
    fulfillment: "Unfulfilled",
    internalNotes: "Hold dispatch until sleeve tailoring confirmation.",
    items: [
      { name: "Italian Merino Wool Pleated Trousers", qty: 1, price: 580 },
      { name: "Atelier Raw Silk Grandad Shirt", qty: 1, price: 420 },
    ],
  },
  {
    id: "m-ord-103",
    orderId: "ORD-2026-8803",
    customerName: "Alexander Vance",
    customerEmail: "alexander.vance@gormenswear.com",
    orderDate: "08:15 AM",
    amount: 390,
    status: "Completed",
    paymentStatus: "Paid",
    fulfillment: "Fulfilled",
    internalNotes: "Express DHL 2-day delivery dispatched.",
    items: [
      { name: "Bespoke Silk Monogram Camp Shirt", qty: 1, price: 390 },
    ],
  },
];

export const INITIAL_MOBILE_PRODUCTS = [
  {
    id: "m-prod-01",
    sku: "GOR-JKT-SUEDE-BIELLA",
    productName: "Biella Shearling Trimmed Suede Jacket",
    price: 2450,
    stockLevel: 4,
    enabled: true,
    category: "Outerwear",
    barcode: "849201938401",
    image: "/images/products/shearling-jacket.jpg",
  },
  {
    id: "m-prod-02",
    sku: "GOR-TR-WOOL-SAVILE",
    productName: "Italian Merino Wool Pleated Trousers",
    price: 580,
    stockLevel: 14,
    enabled: true,
    category: "Trousers",
    barcode: "849201938402",
    image: "/images/products/pleated-trousers.jpg",
  },
  {
    id: "m-prod-03",
    sku: "GOR-SH-SILK-KYOTO",
    productName: "Atelier Heavyweight Raw Silk Grandad Shirt",
    price: 420,
    stockLevel: 2,
    enabled: true,
    category: "Shirts",
    barcode: "849201938403",
    image: "/images/products/silk-shirt.jpg",
  },
  {
    id: "m-prod-04",
    sku: "GOR-SH-CAMP-SILK",
    productName: "Bespoke Silk Monogram Camp Shirt",
    price: 390,
    stockLevel: 18,
    enabled: true,
    category: "Shirts",
    barcode: "849201938404",
    image: "/images/products/camp-shirt.jpg",
  },
];

export const INITIAL_MOBILE_CUSTOMERS = [
  {
    id: "m-cust-01",
    name: "Lord Julian Sterling",
    email: "j.sterling@mayfair.co.uk",
    phone: "+44 20 7946 0912",
    lifetimeSpend: "$24,500",
    totalOrders: 12,
    tags: ["VIP Platinum", "Bespoke", "Mayfair Club"],
    notes: "Prefers morning telephone updates.",
    orderHistory: [
      { id: "ORD-2026-8801", date: "2026-07-28", total: 2450 },
      { id: "ORD-2026-7012", date: "2026-06-14", total: 5800 },
    ],
  },
  {
    id: "m-cust-02",
    name: "Alexander Vance",
    email: "alexander.vance@gormenswear.com",
    phone: "+1 212 555 0192",
    lifetimeSpend: "$14,800",
    totalOrders: 8,
    tags: ["VIP Gold", "Atelier Subscriber"],
    notes: "Requires custom sleeve length 34.5 inch.",
    orderHistory: [
      { id: "ORD-2026-8803", date: "2026-07-28", total: 390 },
    ],
  },
];

export const INITIAL_MOBILE_NOTIFICATIONS = [
  {
    id: "notif-01",
    type: "order",
    title: "New High-Value Order",
    message: "Lord Julian Sterling placed Order #ORD-2026-8801 ($2,450).",
    time: "5m ago",
    read: false,
  },
  {
    id: "notif-02",
    type: "stock",
    title: "Low Stock Alert: Raw Silk Shirt",
    message: "Atelier Raw Silk Grandad Shirt inventory reached low threshold (2 units left).",
    time: "18m ago",
    read: false,
  },
  {
    id: "notif-03",
    type: "customer",
    title: "VIP Concierge Message",
    message: "Marcus Sterling submitted a custom sizing query via WhatsApp.",
    time: "42m ago",
    read: false,
  },
  {
    id: "notif-04",
    type: "system",
    title: "Background Sync Complete",
    message: "Mobile Admin data synchronized with GOR Cloud database.",
    time: "1h ago",
    read: true,
  },
];

export const INITIAL_OFFLINE_SYNC_STATE = {
  isOnline: true,
  pendingChangesCount: 0,
  lastSyncTimestamp: "2026-07-28 10:06:55",
};
