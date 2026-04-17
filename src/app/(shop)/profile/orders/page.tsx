import ProfileOrders, { ProfileOrder } from "@/features/profile/components/profile-orders";
import { getUserOrders } from "@/features/profile/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History",
  description: "Your curated history of luxury fragrance acquisitions.",
};

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <ProfileOrders orders={orders as ProfileOrder[]} />
    </div>
  );
}
