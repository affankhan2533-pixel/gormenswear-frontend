"use client";

import { useEffect } from "react";
import AdminEmptyState from "@/components/admin/feedback/AdminEmptyState";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Product Editor Error:", error);
  }, [error]);

  return (
    <AdminEmptyState
      title="Product Editor Encountered an Error"
      description="An error occurred while loading this product SKU. Please retry."
      actionLabel="Try Again"
      onAction={reset}
      aiSuggestion="AI Suggestion: Verify product ID exists in the database or service layer."
    />
  );
}
