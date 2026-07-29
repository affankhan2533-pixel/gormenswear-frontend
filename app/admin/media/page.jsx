"use client";

import AdminShell from "@/components/admin/shell/AdminShell";
import MediaLibraryModal from "@/components/admin/media/MediaLibraryModal";

export default function AdminMediaPage() {
  return (
    <AdminShell>
      <div className="space-y-4 max-w-7xl pb-24">
        <MediaLibraryModal isModal={false} />
      </div>
    </AdminShell>
  );
}
