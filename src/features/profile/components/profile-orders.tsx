"use client";

import { Package, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ProfileOrderItem {
   quantity: number;
   unit_price: number;
   total_price: number;
   product_name: string;
   variant_size: number;
   variant?: {
      product: {
         name: string;
         slug: string;
      };
   };
}

export interface ProfileOrder {
   id: string;
   order_number: string;
   status: string;
   total_amount: number;
   created_at: string;
   items: ProfileOrderItem[];
}

export default function ProfileOrders({ orders }: { orders: ProfileOrder[] }) {
  return (
    <div className="container mx-auto px-6 md:px-12 py-12 max-w-5xl space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-border/20">
         <div className="space-y-4">
            <Link href="/profile">
               <motion.button 
                 whileHover={{ x: -4 }}
                 className="flex items-center gap-2 text-[10px] tracking-widest text-muted-foreground hover:text-primary uppercase font-bold transition-colors mb-2"
               >
                  <ArrowLeft className="w-3 h-3" />
                  Return to Sanctuary
               </motion.button>
            </Link>
            <h1 className="font-playfair text-5xl md:text-6xl uppercase font-medium tracking-tighter">
               Curated History
            </h1>
            <div className="flex items-center gap-4">
               <p className="text-[10px] tracking-[0.4em] text-primary font-black uppercase">Your Personal Voyages & Dispatches</p>
               <span className="w-1.5 h-1.5 bg-border rounded-full" />
               <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Archives Updated Just Now</p>
            </div>
         </div>
         <div className="bg-primary/5 border border-primary/20 px-6 py-4 rounded-sm flex items-center gap-8">
            <div className="space-y-1">
               <span className="text-[10px] tracking-[0.2em] font-black uppercase text-zinc-500 block">Total Voyages</span>
               <span className="text-2xl font-playfair font-medium capitalize">{orders.length} Records</span>
            </div>
            <div className="w-px h-10 bg-primary/20" />
            <Package className="w-8 h-8 text-primary opacity-40" />
         </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-40 text-center border border-dashed border-border/20 bg-zinc-400/5 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <Package className="w-16 h-16 text-zinc-700 mx-auto mb-8 opacity-20 relative z-10" />
           <p className="font-playfair text-3xl italic text-zinc-500 uppercase tracking-widest mb-4 relative z-10">
              The archives are empty.
           </p>
           <p className="text-[10px] tracking-[0.3em] text-zinc-600 uppercase max-w-xs mx-auto leading-relaxed relative z-10">
              Your luxury journey is yet to begin. Discover the scent that speaks to your soul.
           </p>
           <Link href="/shop" className="relative z-10 inline-block mt-12 px-12 py-5 bg-primary text-primary-foreground text-[10px] tracking-[0.4em] font-black uppercase hover:scale-105 hover:bg-zinc-100 transition-all duration-700 shadow-2xl">
             Begin Exploration
           </Link>
        </div>
      ) : (
        <div className="space-y-12">
           {orders.map((order, index) => (
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: index * 0.1 }}
               key={order.id} 
               className="group bg-zinc-400/5 border border-border/10 hover:border-primary/30 transition-all duration-1000"
             >
                <div className="p-8 md:p-12 relative overflow-hidden">
                   {/* Background Decorative Element */}
                   <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                   
                   <div className="flex flex-col md:flex-row justify-between gap-10 mb-12 relative z-10">
                      <div className="space-y-4">
                         <div className="flex items-center gap-6">
                            <h3 className="text-sm md:text-md font-bold tracking-[0.3em] uppercase">DISPATCH #{order.order_number}</h3>
                            <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] ${
                               order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 
                               order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                               'bg-primary/20 text-primary ring-1 ring-primary/20'
                            }`}>
                               {order.status}
                            </span>
                         </div>
                         <div className="flex items-center gap-4 text-muted-foreground">
                            <p className="text-[10px] tracking-[0.2em] uppercase italic">
                              Manifested on {new Date(order.created_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                           </p>
                           <span className="w-1 h-1 bg-border/40 rounded-full" />
                           <p className="text-[10px] tracking-[0.2em] uppercase font-medium">Verified by Scêntia Customs</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl md:text-3xl font-playfair font-medium tracking-tight mb-1">{formatCurrency(order.total_amount)}</p>
                         <p className="text-[9px] tracking-[0.4em] text-zinc-500 uppercase font-black">PREMIUM COLLECTION VALUE</p>
                      </div>
                   </div>

                   <div className="space-y-0 relative z-10 border-y border-border/10">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-8 border-b border-border/10 last:border-0 group/item transition-colors duration-500 hover:bg-zinc-400/5 px-2">
                           <div className="flex gap-8 items-center">
                              <div className="w-20 h-20 bg-zinc-950 border border-border/20 flex items-center justify-center text-[10px] font-bold text-primary italic overflow-hidden relative">
                                 <div className="absolute inset-0 bg-primary/5 transform -skew-x-12 translate-x-full group-hover/item:translate-x-0 transition-transform duration-700" />
                                 <span className="relative z-10">{item.variant_size}ML</span>
                              </div>
                              <div className="space-y-2">
                                 <h4 className="text-sm tracking-[0.2em] uppercase font-black group-hover/item:text-primary transition-colors duration-500 text-zinc-200">
                                    {item.product_name}
                                 </h4>
                                 <div className="flex items-center gap-4 text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-bold">
                                    <span>QTY: {item.quantity}</span>
                                    <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                    <span className="italic">{formatCurrency(item.unit_price)} EA</span>
                                 </div>
                              </div>
                           </div>
                           <p className="text-sm font-bold tracking-[0.1em] text-zinc-300">
                              {formatCurrency(item.total_price)}
                           </p>
                        </div>
                      ))}
                   </div>
                   
                   <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                      <div className="flex items-center gap-10 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                         <div className="flex flex-col min-w-max">
                            <span className="text-[9px] tracking-[0.4em] text-zinc-500 uppercase font-black mb-1.5 flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                               SHIPPING LOGISTICS
                            </span>
                            <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-medium">Consignment Transferred</span>
                         </div>
                         <div className="w-px h-10 bg-border/20 hidden md:block" />
                         <div className="flex flex-col min-w-max">
                            <span className="text-[9px] tracking-[0.4em] text-zinc-500 uppercase font-black mb-1.5">ASSURANCE</span>
                            <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-medium italic">White-Glove Insured Delivery</span>
                         </div>
                      </div>
                      <Link href={`/profile/orders/${order.id}`} className="w-full md:w-auto">
                         <button className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-4 bg-zinc-950 border border-primary/20 text-[9px] tracking-[0.5em] font-black uppercase hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-700 group/btn shadow-xl">
                            OPEN DOSSIER
                            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform duration-500" />
                         </button>
                      </Link>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      )}
      
      <div className="pt-12 text-center">
         <p className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase font-bold">
            Scêntia Prestige &copy; 2024 — Curated Fragrance Journeys
         </p>
      </div>
    </div>
  );
}
