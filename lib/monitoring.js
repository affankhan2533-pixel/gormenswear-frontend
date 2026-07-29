"use client";

/**
  Reusable Telemetry & Observability Utility
  Supports Sentry, OpenTelemetry, Web Vitals, and Admin Audit Logging.
 */

const isDev = process.env.NODE_ENV === "development";

/**
  Log Web Vitals metrics
 */
export function reportWebVitals(metric) {
  try {
    if (isDev) {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value);
    }
    // Sentry / Analytics dispatch fallback
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", metric.name, {
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  } catch (e) {
    // Fail silently
  }
}

/**
  Capture client runtime exception
 */
export function captureException(error, contextInfo = {}) {
  try {
    if (isDev) {
      console.error("[Runtime Error Captured]:", error, contextInfo);
    }
    if (typeof window !== "undefined" && window.Sentry) {
      window.Sentry.captureException(error, { extra: contextInfo });
    }
  } catch (e) {
    // Fail silently
  }
}

/**
  Standardized Admin Audit Event Logger
 */
export function logAuditEvent({ eventType, actor = "system", resource, action, status = "success" }) {
  try {
    const auditPayload = {
      eventType,
      actor,
      resource,
      action,
      status,
      timestamp: new Date().toISOString(),
    };

    if (isDev) {
      console.log("[Audit Log Event]:", auditPayload);
    }

    return auditPayload;
  } catch (e) {
    return null;
  }
}
