import AdminEmptyState from "@/components/admin/feedback/AdminEmptyState";

export default function NotFound() {
  return (
    <AdminEmptyState
      title="Product Workspace Not Found"
      description="The requested product resource or catalog view could not be located."
      actionLabel="Return to Admin"
    />
  );
}
