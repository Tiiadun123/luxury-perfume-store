import { getAllOrders } from "@/features/admin/actions";
import { AdminOrdersClient } from "@/features/admin/components/admin-orders-client";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="font-playfair text-5xl uppercase font-medium">Dispatch Registry</h1>
        <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Managing Scêntia Voyagers</p>
      </div>
      
      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
