"use client";

import { useAdminContext } from "@/components/admin/providers/AdminProvider";

export function useAdmin() {
  return useAdminContext();
}
