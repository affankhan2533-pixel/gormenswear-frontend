"use client";

import { useEffect } from "react";
import AdminEmptyState from "@/components/admin/feedback/AdminEmptyState";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Product Workspace Error:", error);
  }, [error]);

  return (
    <AdminEmptyState
      title="Product Workspace Encountered an Error"
      description="An error occurred while rendering the product catalog. Please retry loading."
      actionLabel="Try Again"
      onAction={reset}
      aiSuggestion="AI Suggestion: Verify product service endpoints and network connection."
    />
  );
}
