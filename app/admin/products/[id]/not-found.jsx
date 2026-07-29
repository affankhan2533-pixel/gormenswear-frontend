import AdminEmptyState from "@/components/admin/feedback/AdminEmptyState";

export default function NotFound() {
  return (
    <AdminEmptyState
      title="Product SKU Not Found"
      description="The requested product ID could not be located in the catalog database."
      actionLabel="Return to Product Workspace"
    />
  );
}
