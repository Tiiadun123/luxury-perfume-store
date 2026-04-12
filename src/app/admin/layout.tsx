import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
