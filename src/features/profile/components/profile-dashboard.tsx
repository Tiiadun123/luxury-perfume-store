import { getUserOrders } from "../actions";
import { Button } from "@/components/ui/button";
import { Package, User, MapPin, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { signout } from "@/features/auth/actions";

interface ProfileOrderItem {
   quantity: number;
   product: {
      name: string | null;
      slug: string | null;
   } | null;
}

interface ProfileOrder {
   id: string;
   order_number: string;
   status: string;
   total_amount: number;
   created_at: string;
   items: ProfileOrderItem[];
}

interface InitialProfile {
  full_name: string | null;
  email: string | null;
  address?: string | null;
}

export default async function ProfileDashboard({ initialProfile }: { initialProfile: InitialProfile }) {
  const profile = initialProfile;
  const orders = (await getUserOrders()) as ProfileOrder[];

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 space-y-16">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-border/20">
         <div className="space-y-4">
            <h1 className="font-playfair text-5xl md:text-7xl uppercase font-medium tracking-tighter">
              {profile.full_name || "MEMBER"}
            </h1>
            <div className="flex items-center gap-6">
               <p className="text-[10px] tracking-[0.4em] text-primary font-black uppercase">GOLD MEMBERSHIP</p>
               <span className="w-1.5 h-1.5 bg-border rounded-full" />
               <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">{profile.email}</p>
            </div>
         </div>
          <form action={signout}>
            <Button 
              type="submit"
              variant="outline" 
              className="h-14 px-8 text-[10px] tracking-widest font-bold uppercase border-border/40 hover:bg-destructive hover:text-destructive-foreground"
            >
               <LogOut className="w-4 h-4 mr-2" />
               Sign Out
            </Button>
          </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Quick Stats / Navigation */}
        <div className="space-y-10 lg:sticky lg:top-32 h-fit">
           <div className="grid grid-cols-1 gap-4">
              <Link href="/profile" className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-950 border border-primary/20 text-[10px] tracking-[0.4em] font-black uppercase">
                 <div className="flex items-center gap-4">
                    <User className="w-5 h-5" />
                    Account Overview
                 </div>
              </Link>
              <Link href="/profile/orders" className="flex items-center justify-between p-6 border border-border/20 hover:border-primary transition-colors text-[10px] tracking-[0.4em] font-black uppercase group">
                 <div className="flex items-center gap-4">
                    <Package className="w-5 h-5" />
                    Order History
                 </div>
                 <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-sm">{orders.length}</span>
              </Link>
              <Link href="/wishlist" className="flex items-center justify-between p-6 border border-border/20 hover:border-primary transition-colors text-[10px] tracking-[0.4em] font-black uppercase">
                 <div className="flex items-center gap-4">
                    <Heart className="w-5 h-5" />
                    My Sanctuary
                 </div>
              </Link>
           </div>
           
           <div className="p-8 bg-zinc-50 dark:bg-zinc-950 border border-border/10 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                 <MapPin className="w-5 h-5" />
                 <h4 className="text-[10px] tracking-[0.3em] font-black uppercase">Default Shipping</h4>
              </div>
              <p className="text-[10px] leading-relaxed tracking-widest text-muted-foreground uppercase italic">
                 {profile.address || "No address saved for primary dispatch."}
              </p>
           </div>
        </div>

        {/* Main Content: Recent Activity */}
        <div className="lg:col-span-2 space-y-12">
           <div className="space-y-8">
              <div className="flex justify-between items-center border-b border-border/20 pb-4">
                 <h2 className="text-xs tracking-[0.4em] font-black uppercase text-primary">RECENT DISPATCHES</h2>
                 <Link href="/profile/orders" className="text-[10px] font-bold tracking-widest uppercase hover:underline">View All</Link>
              </div>

              {orders.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-border/40">
                  <p className="font-playfair text-xl italic text-muted-foreground uppercase tracking-widest">
                    No voyages have been recorded yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                   {orders.slice(0, 3).map((order) => (
                     <div key={order.id} className="p-8 border border-border/10 bg-zinc-50 dark:bg-zinc-950/20 flex flex-col md:flex-row justify-between gap-8 group hover:border-primary/40 transition-all">
                        <div className="space-y-4">
                           <div className="flex items-center gap-4">
                              <span className="text-xs font-bold tracking-widest uppercase">#{order.order_number}</span>
                              <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'
                              }`}>
                                {order.status}
                              </span>
                           </div>
                           <div className="space-y-1">
                                             {order.items?.map((item, idx) => (
                                                <p key={`${order.id}-${idx}`} className="text-[10px] tracking-widest uppercase text-muted-foreground">
                                   {item.quantity}x {item.product?.name}
                                </p>
                              ))}
                           </div>
                        </div>
                        <div className="flex flex-col md:items-end justify-between gap-4">
                           <p className="text-sm font-bold tracking-widest">{order.total_amount.toLocaleString("vi-VN")} VND</p>
                           <p className="text-[8px] tracking-widest text-muted-foreground uppercase italic">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
