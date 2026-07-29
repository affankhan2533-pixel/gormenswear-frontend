// GOR MENSWEAR — Enterprise AI Operations & Autonomous Administration Data

export const INITIAL_AI_OPS_METRICS = {
  platformHealthScore: 98.6,
  activeAlertsCount: 4,
  criticalIssuesCount: 1,
  pendingApprovalsCount: 3,
  automationStatus: "Active",
  recommendationAccuracy: 96.8,
  decisionLatency: "140 ms",
};

export const INITIAL_BUSINESS_INSIGHTS = {
  revenueTrend: "+18.4% Projected Q3 Revenue Growth",
  salesForecast: "$420,000 Q3 Target (84% Probability)",
  topProductPerformance: "Biella Shearling Trimmed Suede Jacket (+34% MoM demand)",
  customerGrowth: "+14.2% New VIP Platinum Members",
  inventoryHealthScore: 94.5,
  marketingROI: "4.2x ROAS on Private Club Campaign",
};

export const INITIAL_SMART_ALERTS = [
  {
    id: "alt-801",
    severity: "Critical",
    title: "Inventory Depletion Risk: Suede Jacket",
    message: "Biella Shearling Suede Jacket inventory dropped to 4 units. Stockout predicted in 48 hours based on sales velocity.",
    category: "Inventory",
    detectedAt: "10 mins ago",
  },
  {
    id: "alt-802",
    severity: "Warning",
    title: "Unexpected Sales Dip: Silk Grandad Shirt",
    message: "Atelier Raw Silk Grandad Shirt conversion rate decreased by 14% over the last 6 hours.",
    category: "Sales",
    detectedAt: "25 mins ago",
  },
  {
    id: "alt-803",
    severity: "Warning",
    title: "Unusual VIP Account Activity",
    message: "Lord Julian Sterling's account logged in from 3 distinct IP locations within 15 minutes.",
    category: "Security & CRM",
    detectedAt: "42 mins ago",
  },
  {
    id: "alt-804",
    severity: "Info",
    title: "Microsoft Dynamics 365 Sync Latency",
    message: "OData v4 gateway response time spiked to 340ms during batch reconciliation.",
    category: "Integrations",
    detectedAt: "1 hour ago",
  },
];

export const INITIAL_AI_RECOMMENDATIONS = [
  {
    id: "rec-101",
    title: "Issue Emergency PO for Biella Suede Jacket",
    description: "Re-order 10 units from Parisian Tweed House supplier to prevent stockout.",
    category: "Inventory Restock",
    confidenceScore: 97.4,
    riskLevel: "Medium",
    estimatedImpact: "+$24,500 Revenue Protection",
    status: "Recommended",
  },
  {
    id: "rec-102",
    title: "Optimize Price on Atelier Raw Silk Shirt",
    description: "Adjust retail price from $420 to $445 based on luxury demand elasticity.",
    category: "Pricing Optimization",
    confidenceScore: 94.2,
    riskLevel: "Low",
    estimatedImpact: "+$3,200 Monthly Margin Increase",
    status: "Recommended",
  },
  {
    id: "rec-103",
    title: "Trigger Anniversary VIP Concierge Gift Voucher",
    description: "Issue $250 bespoke tailoring credit to top 15 VIP Platinum members.",
    category: "Customer Retention",
    confidenceScore: 98.1,
    riskLevel: "Low",
    estimatedImpact: "+$18,900 Repeat Booking Revenue",
    status: "Recommended",
  },
  {
    id: "rec-104",
    title: "Rebalance Multi-Warehouse Inventory",
    description: "Transfer 5 units of Merino Wool Trousers from Tokyo Hub to Mayfair Flagship.",
    category: "WMS Rebalancing",
    confidenceScore: 92.5,
    riskLevel: "Medium",
    estimatedImpact: "Reduces international shipping friction by 40%",
    status: "Recommended",
  },
];

export const INITIAL_APPROVAL_CENTER_ACTIONS = [
  {
    id: "act-901",
    actionName: "Auto-Issue Purchase Order #PO-2026-9901",
    category: "Inventory & Purchasing",
    riskLevel: "High",
    confidenceScore: 97.4,
    description: "Generate and dispatch $14,500 purchase order to Parisian Tweed House supplier.",
    payload: '{"supplier":"Parisian Tweed House","sku":"GOR-JKT-SUEDE-BIELLA","quantity":10,"unit_cost":1450}',
    status: "Pending Approval",
  },
  {
    id: "act-902",
    actionName: "Apply Dynamic Price Adjustment (+6%)",
    category: "Pricing",
    riskLevel: "Medium",
    confidenceScore: 94.2,
    description: "Update Atelier Raw Silk Grandad Shirt retail price from $420 to $445.",
    payload: '{"sku":"GOR-SH-SILK-KYOTO","old_price":420,"new_price":445}',
    status: "Pending Approval",
  },
  {
    id: "act-903",
    actionName: "Dispatch VIP Platinum Bespoke Voucher",
    category: "Customer CRM",
    riskLevel: "Low",
    confidenceScore: 98.1,
    description: "Send personalized WhatsApp & email invitation with $250 credit code 'GOR-VIP-2026'.",
    payload: '{"target_segment":"VIP Platinum","discount_code":"GOR-VIP-2026","value":250}',
    status: "Pending Approval",
  },
];

export const INITIAL_WORKFLOW_AUTOMATIONS = [
  {
    id: "wf-301",
    name: "Automated Low Stock Supplier Alert",
    trigger: "SKU stock drops below 3 units",
    action: "Send email alert to Supplier & generate draft PO",
    enabled: true,
    executionCount: 14,
  },
  {
    id: "wf-302",
    name: "VIP Order Escalation Protocol",
    trigger: "Order total exceeds $2,000",
    action: "Notify Concierge via WhatsApp & apply priority packaging tag",
    enabled: true,
    executionCount: 38,
  },
  {
    id: "wf-[#303]",
    idStr: "wf-303",
    name: "Abandoned Cart Concierge Follow-up",
    trigger: "Cart abandoned > 2 hours by logged-in VIP",
    action: "Schedule personal concierge outreach message",
    enabled: true,
    executionCount: 22,
  },
  {
    id: "wf-304",
    name: "Automated Marketplace Vendor Settlement",
    trigger: "Bi-weekly payout schedule window",
    action: "Execute Stripe Connect net vendor payout transfers",
    enabled: false,
    executionCount: 6,
  },
];

export const INITIAL_KNOWLEDGE_ASSISTANT_QA = [
  {
    question: "What is our current top-performing outerwear piece?",
    answer: "The Biella Shearling Trimmed Suede Jacket is currently our #1 performing outerwear item, generating $24,500 in revenue this month with a 34% month-over-month increase in demand.",
  },
  {
    question: "How many pending orders require fulfillment?",
    answer: "There are currently 6 pending orders requiring fulfillment, including 1 VIP high-value order (#ORD-2026-8801) for Lord Julian Sterling.",
  },
  {
    question: "What is our current platform integration health score?",
    answer: "Our enterprise integration health score is 98.4%, with 22 active system connections and 1 degraded connection (Microsoft Dynamics 365 OData gateway).",
  },
];

export const INITIAL_AI_GOVERNANCE_CONFIG = {
  confidenceThresholdPercent: 90,
  requireHumanApprovalHighRisk: true,
  autoExecuteLowRiskTasks: true,
  featureToggles: {
    predictiveSalesForecasting: true,
    dynamicPriceOptimization: true,
    automatedInventoryRestock: false,
    aiConciergeMessaging: true,
  },
};
