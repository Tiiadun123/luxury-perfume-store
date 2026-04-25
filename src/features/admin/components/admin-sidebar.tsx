"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, Truck, Image, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "OVERVIEW", icon: LayoutDashboard, href: "/admin" },
  { label: "ORDERS", icon: ShoppingBag, href: "/admin/orders" },
  { label: "PRODUCTS", icon: Package, href: "/admin/products" },
  { label: "CUSTOMERS", icon: Users, href: "/admin/customers" },
  { label: "LOGISTICS", icon: Truck, href: "/admin/logistics" },
  { label: "CMS", icon: Image, href: "/admin/cms" },
  { label: "SETTINGS", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-[110] p-2 bg-background border border-border/20 rounded-md"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-background border-r border-border/20 flex flex-col z-[100] transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-24 px-8 flex flex-col justify-center border-b border-border/20 mt-10 lg:mt-0">
           <span className="font-playfair text-xl tracking-[0.3em] font-bold">SCÊNTIA</span>
           <span className="text-[8px] tracking-[0.4em] text-primary/80 uppercase">MAISON ADMIN</span>
        </div>

        <nav className="flex-1 p-8 space-y-4 overflow-y-auto custom-scrollbar">
           {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-4 p-4 text-[10px] tracking-[0.3em] font-black uppercase transition-all group",
                    isActive ? "bg-primary/10 text-primary border-r-2 border-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                  {item.label}
                </Link>
              );
           })}
        </nav>

        <div className="p-8 border-t border-border/20 space-y-4">
           <Link 
             href="/" 
             className="flex items-center justify-center gap-3 w-full py-4 text-[9px] tracking-[0.3em] font-black uppercase text-background bg-primary hover:bg-primary/90 transition-all rounded-sm shadow-lg shadow-primary/20"
           >
              <LogOut className="w-3 h-3 scale-x-[-1]" />
              VIEW STOREFRONT
           </Link>
           <p className="text-[8px] text-center text-muted-foreground/40 uppercase tracking-widest italic">
             Connected to Production
           </p>
        </div>
      </aside>
    </>
  );
}
