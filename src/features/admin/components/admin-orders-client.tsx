"use client";

import { useState } from "react";
import { updateOrderStatus } from "../actions";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  Search,
  ChevronDown
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AdminOrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'processing': return <Package className="w-3 h-3" />;
      case 'shipped': return <Truck className="w-3 h-3" />;
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="SEARCH REGISTRY..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-14 text-[10px] tracking-widest uppercase border-border/20" 
        />
      </div>

      <div className="overflow-hidden border border-border/10 bg-zinc-950/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-border/10">
              <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary">VOYAGE #</th>
              <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary">RECIPIENT</th>
              <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary">DESTINATION</th>
              <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary text-right">VALUE</th>
              <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary text-center">STATUS</th>
              <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-border/5 group hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <span className="text-[10px] font-black tracking-widest uppercase">#{order.order_number}</span>
                  <p className="text-[8px] text-muted-foreground uppercase mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </td>
                <td className="p-6">
                  <p className="text-[10px] font-bold tracking-widest uppercase">{order.customer_name}</p>
                  <p className="text-[8px] text-muted-foreground uppercase">{order.customer_email}</p>
                </td>
                <td className="p-6">
                   <p className="text-[8px] tracking-[0.2em] text-muted-foreground uppercase truncate max-w-[200px]">
                      {order.shipping_address}
                   </p>
                </td>
                <td className="p-6 text-right text-[10px] font-bold font-sans">
                  {order.total_amount.toLocaleString("vi-VN")} VND
                </td>
                <td className="p-6 text-center">
                  <span className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 text-[8px] font-black uppercase tracking-widest border border-current",
                    order.status === 'pending' && "text-amber-500",
                    order.status === 'processing' && "text-blue-500",
                    order.status === 'shipped' && "text-primary",
                    order.status === 'completed' && "text-green-500",
                  )}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-primary transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-border/20">
                      <DropdownMenuItem 
                        onClick={() => handleStatusUpdate(order.id, 'processing')}
                        className="text-[9px] tracking-[0.2em] uppercase font-bold cursor-pointer hover:bg-primary/10"
                      >
                        MARK AS PROCESSING
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusUpdate(order.id, 'shipped')}
                        className="text-[9px] tracking-[0.2em] uppercase font-bold cursor-pointer hover:bg-primary/10"
                      >
                        MARK AS SHIPPED
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        className="text-[9px] tracking-[0.2em] uppercase font-bold cursor-pointer hover:bg-primary/10"
                      >
                        MARK AS COMPLETED
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-20 text-center uppercase tracking-[0.5em] text-muted-foreground text-[8px]">
                   The registry returns no records of such voyages.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
