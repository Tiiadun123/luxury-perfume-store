import { getAdminStats, getAllOrders } from "../actions";
import { BarChart3, Package, ShoppingCart, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RevenueChart } from "./revenue-chart";

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const orders = await getAllOrders();

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
         <div className="space-y-2">
            <h1 className="font-playfair text-5xl uppercase font-medium">House Dashboard</h1>
            <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Maison SCÊNTIA Operations</p>
         </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Revenue", value: `${stats.revenue.toLocaleString("vi-VN")} VND`, icon: BarChart3, trend: stats.revenueTrend || "0%", trendColor: stats.revenueTrend?.startsWith('+') ? "text-green-500" : "text-red-500" },
           { label: "Orders", value: stats.orderCount, icon: ShoppingCart, trend: stats.orderTrend || "0", trendColor: "text-green-500" },
           { label: "Collections", value: stats.productCount, icon: Package },
           { label: "Low Stock", value: stats.lowStock.length, icon: AlertTriangle, color: stats.lowStock.length > 0 ? "text-destructive" : "" }
         ].map((card, i) => (
           <div key={i} className="p-8 bg-zinc-950/20 border border-border/10 space-y-4 hover:border-primary/20 transition-all group">
              <div className="flex justify-between items-start">
                 <div className="p-2 bg-primary/10 rounded-sm text-primary group-hover:scale-110 transition-transform">
                    <card.icon className="w-5 h-5" />
                 </div>
                 {card.trend && (
                   <span className={cn("flex items-center text-[10px] font-bold", card.trendColor)}>
                      {card.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
                   </span>
                 )}
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{card.label}</p>
                 <h3 className={cn("text-2xl font-sans font-bold", card.color)}>{card.value}</h3>
              </div>
           </div>
         ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
             <RevenueChart data={stats.monthlyRevenue || {}} />
          </div>

          {/* Stock Alerts */}
          <div className="p-8 bg-zinc-950/20 border border-border/10 space-y-6 h-full">
             <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <h2 className="text-xs tracking-[0.4em] font-black uppercase text-primary">VAULT ALERTS</h2>
             </div>
             <div className="space-y-6">
                {stats.lowStock.length === 0 ? (
                  <div className="p-10 border border-dashed border-border/30 text-center uppercase tracking-[0.4em] text-[8px] text-muted-foreground">
                    All essences fully stocked
                  </div>
                ) : (
                  stats.lowStock.slice(0, 4).map((variant) => (
                    <div key={variant.id} className="space-y-3">
                       <div className="flex justify-between items-end">
                          <div className="space-y-1">
                             <h4 className="text-[10px] font-bold tracking-widest uppercase truncate max-w-[150px]">
                                {variant.product?.name}
                             </h4>
                             <p className="text-[8px] text-muted-foreground uppercase">{variant.size}ML - {variant.sku}</p>
                          </div>
                          <span className="text-[10px] font-black text-destructive">{variant.stock_quantity} IN VAULT</span>
                       </div>
                       <div className="h-[2px] bg-zinc-900 overflow-hidden">
                          <div 
                            className="h-full bg-destructive transition-all duration-1000" 
                            style={{ width: `${(variant.stock_quantity / 10) * 100}%` }} 
                          />
                       </div>
                    </div>
                  ))
                )}
             </div>
             {stats.lowStock.length > 4 && (
                <Link href="/admin/products" className="block text-center text-[8px] tracking-widest uppercase font-bold text-muted-foreground hover:text-primary pt-4">
                   View {stats.lowStock.length - 4} More Alerts
                </Link>
             )}
          </div>
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-6">
         <div className="flex justify-between items-center border-b border-border/20 pb-4">
            <h2 className="text-xs tracking-[0.4em] font-black uppercase text-primary">RECENT VOYAGES</h2>
            <Link href="/admin/orders" className="text-[10px] font-bold tracking-widest uppercase hover:underline">Registry Archives</Link>
         </div>
         <div className="overflow-x-auto border border-border/10">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-zinc-900/40">
                     <th className="p-6 text-[10px] tracking-widest uppercase text-muted-foreground font-black">VOYAGER</th>
                     <th className="p-6 text-[10px] tracking-widest uppercase text-muted-foreground font-black text-center">ERA</th>
                     <th className="p-6 text-[10px] tracking-widest uppercase text-muted-foreground font-black text-center">ARTIFACTS</th>
                     <th className="p-6 text-[10px] tracking-widest uppercase text-muted-foreground font-black text-right">VALUE</th>
                     <th className="p-6 text-[10px] tracking-widest uppercase text-muted-foreground font-black text-right">MANIFEST</th>
                  </tr>
               </thead>
               <tbody>
                  {orders.slice(0, 8).map((order) => (
                     <tr key={order.id} className="border-b border-border/5 group hover:bg-white/5 transition-colors">
                        <td className="p-6">
                           <p className="text-[10px] font-bold tracking-widest uppercase">#{order.order_number}</p>
                           <p className="text-[8px] text-muted-foreground uppercase">{order.customer_name || 'Anonymous'}</p>
                        </td>
                        <td className="p-6 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                           {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-6 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                           {order.items?.length || 0}
                        </td>
                        <td className="p-6 text-right text-[10px] font-bold font-sans">
                           {order.total_amount.toLocaleString("vi-VN")} VND
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex flex-col items-end gap-1">
                              <span className={cn(
                                "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border",
                                order.status === 'pending' ? "border-amber-500/50 text-amber-500" : 
                                order.status === 'processing' ? "border-blue-500/50 text-blue-500" :
                                "border-primary/50 text-primary"
                              )}>
                                 {order.status}
                              </span>
                              <span className={cn(
                                "text-[7px] font-bold uppercase tracking-widest opacity-60",
                                order.payment_status === 'paid' ? "text-green-500" : "text-amber-500"
                              )}>
                                {order.payment_status || 'UNPAID'}
                              </span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
