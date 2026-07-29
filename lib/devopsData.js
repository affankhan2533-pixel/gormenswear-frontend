// GOR MENSWEAR — Enterprise DevOps, Production Readiness & Reliability Data

export const INITIAL_DEVOPS_HEALTH = {
  overallStatus: "Operational",
  uptimeSLA: "99.99%",
  globalResponseTime: "32 ms",
  services: [
    {
      id: "svc-app",
      name: "Next.js App Server Cluster",
      category: "Application",
      status: "Operational",
      latency: "28 ms",
      cpuUsage: "24%",
      memoryUsage: "1.4 GB / 8 GB",
      uptime: "99.99%",
    },
    {
      id: "svc-db",
      name: "PostgreSQL Primary Cluster",
      category: "Database",
      status: "Operational",
      latency: "8 ms",
      connections: "45 / 50 Active",
      iops: "4,200 IOPS",
      uptime: "100.0%",
    },
    {
      id: "svc-redis",
      name: "Redis Sentinel Cache & Session Store",
      category: "Cache",
      status: "Operational",
      latency: "2 ms",
      hitRatio: "99.4%",
      memoryUsage: "1.2 GB / 4 GB",
      uptime: "100.0%",
    },
    {
      id: "svc-s3",
      name: "AWS S3 & CloudFront CDN Media Assets",
      category: "Storage",
      status: "Operational",
      latency: "14 ms",
      bandwidth: "4.8 GB/s",
      uptime: "100.0%",
    },
  ],
};

export const INITIAL_OBSERVABILITY_LOGS = [
  {
    id: "log-101",
    timestamp: "2026-07-28 10:14:02",
    level: "INFO",
    service: "auth-service",
    traceId: "tr-99021-a12",
    message: "Admin authentication token issued for user admin@gormenswear.com.",
    details: "Client IP: 192.168.1.1, Scope: super_admin",
  },
  {
    id: "log-102",
    timestamp: "2026-07-28 10:11:45",
    level: "INFO",
    service: "checkout-api",
    traceId: "tr-99021-a14",
    message: "Payment capture event verified via Stripe webhook.",
    details: "Order ORD-2026-8801, Amount $2,450.00",
  },
  {
    id: "log-103",
    timestamp: "2026-07-28 10:05:12",
    level: "WARN",
    service: "inventory-sync",
    traceId: "tr-99021-a18",
    message: "Low inventory threshold reached for SKU GOR-SH-SILK-KYOTO.",
    details: "Stock level: 2 units remaining",
  },
  {
    id: "log-104",
    timestamp: "2026-07-28 09:50:00",
    level: "INFO",
    service: "b2b-gateway",
    traceId: "tr-99021-a22",
    message: "Wholesale PO ORD-B2B-9901 submitted by Savile Row Bespoke Ltd.",
    details: "Credit line utilized: $12,400 / $50,000",
  },
];

export const INITIAL_TELEMETRY_METRICS = {
  webVitals: {
    lcp: "0.8s (Good)",
    fid: "12ms (Good)",
    cls: "0.01 (Good)",
    ttfb: "42ms (Good)",
  },
  sentryActiveErrors: 0,
  openTelemetrySpansCount: "142,500 / min",
};

export const INITIAL_SECURITY_DATA = {
  rateLimiting: {
    enabled: true,
    policy: "100 requests / minute per IP",
    status: "Active (0 blocked IP threats)",
  },
  securityHeaders: [
    { header: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload", status: "Protected" },
    { header: "Content-Security-Policy (CSP)", value: "default-src 'self'; script-src 'self' 'unsafe-inline'", status: "Protected" },
    { header: "X-Frame-Options", value: "DENY", status: "Protected" },
    { header: "X-Content-Type-Options", value: "nosniff", status: "Protected" },
    { header: "Referrer-Policy", value: "strict-origin-when-cross-origin", status: "Protected" },
  ],
  vaultSecretManager: "HashiCorp Vault Enterprise (Connected & Encrypted)",
  fileUploadSecurity: "ClamAV Real-Time Malware Scanner Active",
};

export const INITIAL_DEPLOYMENT_HISTORY = [
  {
    id: "dep-240",
    version: "v2.4.0",
    environment: "Production",
    status: "Passed",
    deployedAt: "2026-07-28 04:39:25",
    commitHash: "7ffb2ddb",
    author: "DeepMind Agentic Assistant",
    releaseNotes: "Phase 32 Enterprise Connectivity Platform & Phase 31 Mobile Admin Platform integrated.",
  },
  {
    id: "dep-239",
    version: "v2.3.9",
    environment: "Staging",
    status: "Passed",
    deployedAt: "2026-07-27 22:15:00",
    commitHash: "41a99bc1",
    author: "GOR Lead DevOps Engineer",
    releaseNotes: "Phase 30 Vendor Marketplace & Phase 29 Subscription Commerce release candidate.",
  },
  {
    id: "dep-238",
    version: "v2.3.8",
    environment: "Production",
    status: "Passed",
    deployedAt: "2026-07-25 14:00:00",
    commitHash: "88210fe2",
    author: "GOR Lead DevOps Engineer",
    releaseNotes: "Phase 28 B2B Wholesale Commerce & Phase 27 WMS Inventory release.",
  },
];

export const INITIAL_DISASTER_RECOVERY = {
  rpo: "5 Minutes (Recovery Point Objective)",
  rto: "15 Minutes (Recovery Time Objective)",
  lastBackupTimestamp: "2026-07-28 10:00:00",
  retentionPolicy: "30 Days Point-in-Time Recovery (PITR) Automated Snapshots",
  backupStatus: "Healthy & Verified",
  checklist: [
    { step: "PostgreSQL Write-Ahead Logging (WAL) Archive", verified: true },
    { step: "AWS S3 Cross-Region Asset Replication", verified: true },
    { step: "Redis Cache Snapshot Memory Dump", verified: true },
    { step: "Automated Daily Restore Test Diagnostic", verified: true },
  ],
};

export const INITIAL_FEATURE_FLAGS = [
  {
    id: "flag-01",
    key: "ENABLE_AI_STYLIST_RECOMMENDER",
    name: "AI Personal Stylist Engine",
    description: "Activates LLM-powered garment pairing recommendations.",
    enabled: true,
    rolloutPercentage: 100,
    targetedSegment: "All B2C Customers",
  },
  {
    id: "flag-02",
    key: "ENABLE_B2B_WHOLESALE_PORTAL",
    name: "Enterprise B2B Commerce Portal",
    description: "Enables wholesale POs, credit limits, and Net terms checkout.",
    enabled: true,
    rolloutPercentage: 100,
    targetedSegment: "Verified B2B Buyers",
  },
  {
    id: "flag-03",
    key: "ENABLE_MOBILE_ADMIN_SCANNER",
    name: "Mobile Admin Barcode & Camera",
    description: "Enables smartphone camera image upload and laser SKU scan.",
    enabled: true,
    rolloutPercentage: 100,
    targetedSegment: "GOR Warehouse Staff",
  },
  {
    id: "flag-04",
    key: "ENABLE_MARKETPLACE_AUTO_PAYOUTS",
    name: "Automated Vendor Marketplace Payouts",
    description: "Triggers Stripe Connect automated net vendor payouts.",
    enabled: true,
    rolloutPercentage: 50,
    targetedSegment: "Approved Marketplace Sellers",
  },
];

export const INITIAL_ENV_VARS = [
  { key: "NEXT_PUBLIC_APP_URL", value: "https://gormenswear.com", environment: "Production", isSecret: false },
  { key: "DATABASE_URL", value: "postgresql://gor_prod:••••••••••••@db.gormenswear.com:5432/gor_db", environment: "Production", isSecret: true },
  { key: "REDIS_URL", value: "redis://:••••••••••••@redis.gormenswear.com:6379/0", environment: "Production", isSecret: true },
  { key: "STRIPE_SECRET_KEY", value: "sk_live_51P8x••••••••••••••••••••••••", environment: "Production", isSecret: true },
  { key: "AWS_S3_BUCKET", value: "gor-menswear-cdn-assets", environment: "Production", isSecret: false },
  { key: "SENTRY_DSN", value: "https://a19b88••••@sentry.io/450912", environment: "Production", isSecret: true },
];

export const SYSTEM_DOCUMENTATION_HUB = [
  {
    id: "doc-arch",
    title: "Platform Architecture Overview",
    category: "Architecture",
    summary: "System design diagram detailing Next.js App Router, Tailwind/Vanilla CSS tokens, PostgreSQL, Redis, and Enterprise Modules.",
    content: `
# GOR Menswear — Platform Architecture

## Core Technology Stack
1. **Frontend**: Next.js 16 (App Router), React 19, Framer Motion, Lucide Icons, Tailwind & Vanilla CSS tokens.
2. **Backend Services**: Node.js REST & Next.js Server Actions, PostgreSQL Database, Redis Cache.
3. **Enterprise Modules**:
   - Executive Admin Dashboard (\`/admin\`)
   - Warehouse Management System (\`/admin/wms\`)
   - B2B Wholesale Commerce (\`/admin/b2b\`)
   - Subscription Commerce (\`/admin/subscriptions\`)
   - Vendor Marketplace (\`/admin/marketplace\`)
   - Mobile Admin Platform (\`/admin/mobile\`)
   - Enterprise Connectivity Platform (\`/admin/connectivity\`)
   - Production Readiness & DevOps (\`/admin/devops\`)
`,
  },
  {
    id: "doc-structure",
    title: "Directory & Folder Structure",
    category: "Developer Guide",
    summary: "Comprehensive file layout guide for frontend components, API routes, data utilities, and context providers.",
    content: `
# Folder Structure Reference

\`\`\`text
GOR/
├── frontend/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── b2b/page.js
│   │   │   ├── connectivity/page.js
│   │   │   ├── devops/page.js
│   │   │   ├── marketplace/page.js
│   │   │   ├── mobile/page.js
│   │   │   ├── subscriptions/page.js
│   │   │   ├── wms/page.js
│   │   │   └── page.js
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── b2b/
│   │   ├── connectivity/
│   │   ├── devops/
│   │   ├── marketplace/
│   │   ├── mobileAdmin/
│   │   ├── subscriptions/
│   │   ├── wms/
│   │   └── sections/
│   └── lib/
│       ├── b2bData.js
│       ├── connectivityData.js
│       ├── devopsData.js
│       ├── mobileAdminData.js
│       ├── subscriptionData.js
│       ├── vendorData.js
│       └── wmsData.js
\`\`\`
`,
  },
  {
    id: "doc-deploy",
    title: "Production Deployment Guide",
    category: "DevOps",
    summary: "Step-by-step instructions for deploying GOR Menswear to Vercel Enterprise, AWS ECS, and Docker containers.",
    content: `
# Production Deployment Guide

## Automated Next.js Production Build
Run the following build command in the \`frontend/\` directory:

\`\`\`bash
cd frontend
npx next build
\`\`\`

## Health Check Endpoint
Verify zero-downtime deployment by executing an HTTP GET request to:
\`https://gormenswear.com/api/health\`
`,
  },
];
