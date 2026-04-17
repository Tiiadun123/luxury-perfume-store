"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchOverlay } from "@/features/search/components/search-overlay";
import { useCart } from "@/features/cart/store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toggleCart, items } = useCart();

  useEffect(() => {
    // Schedule hydration state to avoid cascading renders warning
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const cartCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-20">
               <span className="font-playfair text-2xl tracking-[0.3em] font-bold">SCÊNTIA</span>
               <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-8 h-8" />
               </button>
            </div>
            
            <nav className="flex flex-col gap-12">
               {[
                 { label: "SHOP", href: "/shop" },
                 { label: "COLLECTIONS", href: "/collections" },
                 { label: "THE ESSENCE", href: "/essence" },
                 { label: "MY SANCTUARY", href: "/wishlist" },
                 { label: "PROFILE", href: "/profile" },
               ].map((item) => (
                 <Link 
                   key={item.href} 
                   href={item.href} 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="text-4xl font-playfair uppercase tracking-tighter italic hover:text-primary transition-colors"
                 >
                   {item.label}
                 </Link>
               ))}
            </nav>
            
            <div className="mt-auto border-t border-border/20 pt-12 space-y-4">
               <p className="text-[10px] tracking-[0.4em] font-black uppercase text-primary">SCÊNTIA PARIS</p>
               <p className="text-[8px] tracking-widest text-muted-foreground uppercase">EST. 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 h-20 flex items-center justify-between",
          isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/40 h-16" : "bg-transparent h-24"
        )}
      >
        <div className="flex items-center gap-8 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-[10px] tracking-[0.25rem] font-semibold uppercase hover:text-primary transition-colors">
              SHOP
            </Link>
            <Link href="/collections" className="text-[10px] tracking-[0.25rem] font-semibold uppercase hover:text-primary transition-colors">
              COLLECTIONS
            </Link>
            <Link href="/essence" className="text-[10px] tracking-[0.25rem] font-semibold uppercase hover:text-primary transition-colors">
              THE ESSENCE
            </Link>
          </div>
        </div>

        <Link href="/" className="flex flex-col items-center group">
          <span className="font-playfair text-2xl md:text-3xl tracking-[0.3em] font-bold group-hover:scale-105 transition-transform duration-700">
            SCÊNTIA
          </span>
          <span className="text-[8px] tracking-[0.4em] text-primary/80 uppercase font-medium mt-1">
            PARIS
          </span>
        </Link>

        <div className="flex items-center justify-end gap-6 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:text-primary"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </Button>
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="hover:text-primary hidden md:flex">
              <Heart className="w-5 h-5 stroke-[1.5]" />
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="hover:text-primary hidden md:flex">
              <User className="w-5 h-5 stroke-[1.5]" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:text-primary"
            onClick={() => toggleCart(true)}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-[8px] text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center font-bold animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </nav>
    </>
  );
}
