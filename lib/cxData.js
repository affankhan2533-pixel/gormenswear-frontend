// GOR MENSWEAR — Enterprise Customer Experience & Service Platform Core Data

export const INITIAL_CX_METRICS = {
  activeConversationsCount: 18,
  openSupportCasesCount: 12,
  avgResponseTime: "4m 12s",
  csatScore: 4.9,
  pendingFollowupsCount: 5,
  escalatedCasesCount: 1,
  firstResponseTimeSLA: 98.2,
};

export const INITIAL_SUPPORT_CASES = [
  {
    id: "case-9001",
    caseNumber: "CASE-2026-9001",
    customerName: "Lord Julian Sterling",
    customerEmail: "j.sterling@mayfair.co.uk",
    channel: "WhatsApp",
    priority: "Urgent",
    status: "Open",
    assignedAgent: "Marcus Sterling (Lead Concierge)",
    subject: "Bespoke Sleeve Alteration Request (34.5 inch adjustment)",
    createdAt: "15 mins ago",
    slaTarget: "Target: 30 mins remaining",
    sentiment: "Positive",
    notes: "VIP Client requested express 24h alteration turnaround.",
  },
  {
    id: "case-9002",
    caseNumber: "CASE-2026-9002",
    customerName: "Dominic Thorne",
    customerEmail: "d.thorne@gormenswear.com",
    channel: "Email",
    priority: "High",
    status: "Pending",
    assignedAgent: "Sarah Jenkins",
    subject: "Exchange Request: Size 50 to 52 for Merino Trousers",
    createdAt: "42 mins ago",
    slaTarget: "Target: 1.5 hours remaining",
    sentiment: "Neutral",
    notes: "Awaiting courier pickup confirmation.",
  },
  {
    id: "case-9003",
    caseNumber: "CASE-2026-9003",
    customerName: "Alexander Vance",
    customerEmail: "alexander.vance@gormenswear.com",
    channel: "Live Chat",
    priority: "Medium",
    status: "Resolved",
    assignedAgent: "Elena Rostova",
    subject: "DHL Express Dispatch Tracking Inquiry",
    createdAt: "2 hours ago",
    slaTarget: "SLA Met",
    sentiment: "Positive",
    notes: "Provided DHL tracking link #DHL-99201928.",
  },
];

export const INITIAL_CUSTOMER_TIMELINE = [
  {
    id: "tl-01",
    date: "2026-07-28 10:14",
    type: "Order Placed",
    title: "Placed Order #ORD-2026-8801",
    amount: "$2,450.00",
    details: "Biella Shearling Trimmed Suede Jacket (Size 50)",
    icon: "ShoppingBag",
  },
  {
    id: "tl-02",
    date: "2026-07-28 10:05",
    type: "Support Interaction",
    title: "Opened Case #CASE-2026-9001",
    details: "Requested bespoke sleeve tailoring adjustment via WhatsApp Concierge.",
    icon: "MessageSquare",
  },
  {
    id: "tl-03",
    date: "2026-07-25 14:20",
    type: "Loyalty Upgrade",
    title: "Upgraded to VIP Platinum Tier",
    details: "Lifetime spend surpassed $20,000 threshold.",
    icon: "Star",
  },
  {
    id: "tl-04",
    date: "2026-07-20 11:30",
    type: "Product Review",
    title: "Submitted 5/5 Star Product Review",
    details: 'Reviewed "Italian Merino Wool Pleated Trousers" — "Flawless Savile Row drape."',
    icon: "Heart",
  },
];

export const INITIAL_POST_PURCHASE_SERVICES = [
  {
    id: "post-101",
    reqNumber: "REQ-ALT-2026-01",
    type: "Alteration",
    customerName: "Lord Julian Sterling",
    productName: "Biella Shearling Trimmed Suede Jacket",
    status: "In Progress",
    assignedStaff: "Master Tailor Master Giuseppi",
    etaDate: "2026-07-29",
    details: "Shorten sleeve by 1.25 inches with horn button repositioning.",
  },
  {
    id: "post-102",
    reqNumber: "REQ-EXC-2026-02",
    type: "Exchange",
    customerName: "Dominic Thorne",
    productName: "Italian Merino Wool Pleated Trousers",
    status: "Quality Check",
    assignedStaff: "Warehouse Ops Team",
    etaDate: "2026-07-30",
    details: "Size exchange from EU 50 to EU 52.",
  },
  {
    id: "post-103",
    reqNumber: "REQ-REP-2026-03",
    type: "Repair & Care",
    customerName: "Alexander Vance",
    productName: "Atelier Raw Silk Grandad Shirt",
    status: "Completed",
    assignedStaff: "Atelier Care Specialist",
    etaDate: "2026-07-27",
    details: "Reinforced top collar stitching and Mother-of-Pearl button replacement.",
  },
];

export const INITIAL_CUSTOMER_FEEDBACK = [
  {
    id: "fb-301",
    customerName: "Lord Julian Sterling",
    rating: 5,
    category: "Product Review",
    productName: "Biella Shearling Trimmed Suede Jacket",
    comment: "Exceptional craftsmanship. The shearling collar texture is unmatched in modern menswear.",
    sentiment: "Positive",
    status: "Published",
    date: "2026-07-28",
  },
  {
    id: "fb-302",
    customerName: "Dominic Thorne",
    rating: 5,
    category: "Store & Service Review",
    productName: "Mayfair Flagship Store",
    comment: "Private dressing room appointment was seamless. Concierge service is top tier.",
    sentiment: "Positive",
    status: "Published",
    date: "2026-07-26",
  },
  {
    id: "fb-303",
    customerName: "Anonymous Buyer",
    rating: 3,
    category: "Packaging Feedback",
    productName: "Bespoke Silk Monogram Shirt",
    comment: "Garment is exquisite, but garment bag zipper felt slightly stiff.",
    sentiment: "Neutral",
    status: "Pending Review",
    date: "2026-07-25",
  },
];

export const INITIAL_KNOWLEDGE_BASE_ARTICLES = [
  {
    id: "kb-101",
    title: "Raw Silk & Shearling Garment Care Manual",
    category: "Garment Care",
    views: 1240,
    helpfulCount: 412,
    summary: "Instructions for dry cleaning raw silk shirts and storing shearling jackets in climate-controlled environments.",
    content: "Store shearling in breathable cotton garment bags away from direct heat. Dry clean silk only with specialized organic solvents.",
  },
  {
    id: "kb-102",
    title: "Bespoke Alteration & Tailoring Policies",
    category: "Services",
    views: 980,
    helpfulCount: 310,
    summary: "Details on complimentary alteration timelines for VIP Platinum members at all GOR Atelier locations.",
    content: "VIP Platinum members receive complimentary 24-hour alteration turnarounds at Mayfair, Tokyo, and New York stores.",
  },
  {
    id: "kb-103",
    title: "International Courier Dispatch & Returns Protocol",
    category: "Shipping & Returns",
    views: 1560,
    helpfulCount: 520,
    summary: "Return guidelines for DHL Express pickups and pre-printed return labels.",
    content: "All orders include a pre-printed DHL return airway bill valid for 30 days from dispatch date.",
  },
];

export const INITIAL_SLA_GOVERNANCE = {
  vipResponseTarget: "15 Minutes",
  standardResponseTarget: "2 Hours",
  vipResolutionTarget: "4 Hours",
  standardResolutionTarget: "24 Hours",
  businessHours: "Mon-Sat 08:00 - 22:00 GMT",
  escalationRule: "Escalate to Lead Concierge if unresolved within 50% SLA threshold.",
};

export const INITIAL_CX_REPORTING = {
  agentLeaderboard: [
    { name: "Marcus Sterling", csat: "99.2%", casesResolved: 48, avgTime: "3m 10s" },
    { name: "Sarah Jenkins", csat: "98.6%", casesResolved: 42, avgTime: "4m 05s" },
    { name: "Elena Rostova", csat: "97.9%", casesResolved: 35, avgTime: "4m 45s" },
  ],
  channelVolume: [
    { channel: "WhatsApp Concierge", percentage: "45%", volume: 180 },
    { channel: "Email Support", percentage: "35%", volume: 140 },
    { channel: "Live Chat", percentage: "20%", volume: 80 },
  ],
};
