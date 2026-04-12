import { getUserOrders } from "@/features/profile/actions";
import { Package, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function MyOrdersPage() {
  const orders = await getUserOrders();

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/20 pb-8">
        <div className="space-y-4">
          <Link href="/profile" className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-muted-foreground uppercase hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back to Sanctuary Overview
          </Link>
          <h1 className="font-playfair text-5xl md:text-6xl uppercase font-medium">Order History</h1>
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">A chronicle of your olfactory journeys</p>
        </div>
      </div>

      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="py-60 text-center flex flex-col items-center gap-12 animate-in slide-in-from-bottom-10 duration-1000">
             <div className="relative w-24 h-24">
                <Package className="w-24 h-24 text-primary/10 stroke-[1px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-12 h-12 border border-primary/20 rounded-full animate-pulse" />
                </div>
             </div>
             
             <div className="space-y-6">
               <h3 className="font-playfair text-4xl md:text-5xl uppercase tracking-tighter italic">
                 The Gallery is Currently Silent
               </h3>
               <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase max-w-sm mx-auto leading-relaxed">
                 Your sanctuary history remains unwritten. No sacred scents have yet departed our atelier for your destination.
               </p>
             </div>

             <div className="pt-8">
               <Link href="/shop" className="group relative px-12 py-5 overflow-hidden block">
                  <div className="absolute inset-0 border border-primary/30 group-hover:border-primary transition-colors" />
                  <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative text-[10px] tracking-[0.5em] font-black uppercase text-foreground">
                    Discover New Narrative
                  </span>
               </Link>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {orders.map((order: any) => (
              <div key={order.id} className="group relative border border-border/10 bg-zinc-50 dark:bg-zinc-950/20 p-8 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ExternalLink className="w-4 h-4 text-primary" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                  <div className="space-y-4">
                     <div>
                        <p className="text-[8px] tracking-[0.4em] text-muted-foreground uppercase mb-1">VOYAGE IDENTIFIER</p>
                        <h3 className="text-sm font-black tracking-[0.2em] uppercase">#{order.order_number}</h3>
                     </div>
                     <div>
                        <p className="text-[8px] tracking-[0.4em] text-muted-foreground uppercase mb-1">STATUS</p>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-[0.3em]">
                          {order.status}
                        </span>
                     </div>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <p className="text-[8px] tracking-[0.4em] text-muted-foreground uppercase">SELECTED ESSENCES</p>
                    <div className="space-y-3">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={`${order.id}-${idx}`} className="flex justify-between items-center group/item">
                          <p className="text-[10px] tracking-widest uppercase font-bold group-hover/item:text-primary transition-colors">
                            {item.quantity}x {item.product_name} ({item.variant_size}ml)
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.unit_price.toLocaleString("vi-VN")} VND
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end justify-between gap-4">
                     <div className="text-right">
                        <p className="text-[8px] tracking-[0.4em] text-muted-foreground uppercase mb-1">ORDER TOTAL</p>
                        <p className="text-2xl font-bold tracking-tighter">{order.total_amount.toLocaleString("vi-VN")} VND</p>
                     </div>
                     <p className="text-[8px] tracking-widest text-muted-foreground uppercase italic text-right">
                        Recorded on {new Date(order.created_at).toLocaleDateString()}
                     </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
