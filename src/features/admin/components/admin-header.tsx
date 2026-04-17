"use client";

import React from "react";
import Link from "next/link";
import { Bell, Search, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function AdminHeader() {
  const pathname = usePathname();
  
  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Dashboard Overview";
    if (path === "/admin/orders") return "Operations Control";
    if (path === "/admin/products") return "Inventory Management";
    if (path === "/admin/customers") return "Client Registry";
    if (path === "/admin/settings") return "System Configuration";
    return "Admin Control";
  };

  const pathParts = pathname.split("/").filter(p => p !== "");

  const handleLogout = async () => {
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="h-20 border-b border-border/10 px-12 flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-40">
      <div className="flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[8px] tracking-[0.2em] text-muted-foreground uppercase font-black mb-1">
           <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
             <Home className="w-2.5 h-2.5" />
             <span>MAISON</span>
           </Link>
           <span className="text-[6px] opacity-40">/</span>
           {pathParts.map((part, index) => (
             <React.Fragment key={part}>
               <Link 
                 href={`/${pathParts.slice(0, index + 1).join("/")}`}
                 className={cn(
                   "hover:text-primary transition-colors",
                   index === pathParts.length - 1 ? "text-primary/60 pointer-events-none" : ""
                 )}
               >
                 {part.replace("-", " ")}
               </Link>
               {index < pathParts.length - 1 && <span className="text-[6px] opacity-40">/</span>}
             </React.Fragment>
           ))}
        </div>
        <p className="font-playfair text-xl uppercase tracking-widest italic">
          {getPageTitle(pathname)}
        </p>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative hidden xl:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="SEARCH COMMANDS..." 
            className="w-64 pl-12 h-11 text-[9px] tracking-widest uppercase border-border/10 focus:border-primary/40 bg-zinc-950/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative hover:bg-primary/5">
            <Bell className="w-5 h-5 stroke-[1.5]" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="flex items-center gap-4 pl-4 border-l border-border/10 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black tracking-widest uppercase">Admin Artisan</p>
                  <p className="text-[8px] text-muted-foreground uppercase">Privileged Access</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center overflow-hidden">
                   <User className="w-5 h-5 text-primary" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-border/20">
              <DropdownMenuLabel className="text-[10px] tracking-widest uppercase opacity-60">System Operator</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/10" />
              <DropdownMenuItem className="text-[11px] font-bold tracking-widest uppercase cursor-pointer py-3 hover:bg-primary/10">
                <Link href="/profile" className="flex w-full items-center">
                  Private Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[11px] font-bold tracking-widest uppercase cursor-pointer py-3 hover:bg-primary/10">
                System Log
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/10" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-[11px] font-bold tracking-widest uppercase cursor-pointer py-3 text-red-500 hover:bg-red-500/10 focus:text-red-500"
              >
                Terminate Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
