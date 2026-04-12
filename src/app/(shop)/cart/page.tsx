"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/features/cart/store";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000000 ? 0 : 50000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center gap-8 animate-in fade-in transition-all duration-1000">
        <div className="relative">
          <ShoppingBag className="w-24 h-24 text-muted-foreground/20 stroke-[1]" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold"
          >
            0
          </motion.div>
        </div>
        <div className="text-center space-y-4">
          <h1 className="font-playfair text-5xl md:text-7xl tracking-tighter uppercase italic">Your Bag is Empty</h1>
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase font-medium">The collection is waiting for your discovery.</p>
        </div>
        <Link 
          href="/shop" 
          className={cn(
            buttonVariants({ variant: "luxury", size: "lg" }),
            "h-14 px-10 text-[10px] tracking-[0.4em] font-black flex items-center justify-center"
          )}
        >
          CONTINUE EXPLORING
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 md:pt-48 md:pb-40 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/10 pb-12">
          <div className="space-y-4">
            <h1 className="font-playfair text-6xl md:text-8xl tracking-tighter leading-none uppercase">SHOPPING BAG</h1>
            <p className="text-[10px] tracking-[0.4em] text-primary font-black uppercase">
              {items.length} {items.length === 1 ? 'ELIXIR' : 'ELIXIRS'} IN YOUR COLLECTION
            </p>
          </div>
          <Link 
            href="/shop" 
            className="flex items-center gap-3 text-[10px] tracking-[0.4em] font-black text-muted-foreground hover:text-primary transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
            BACK TO CONCESSUION
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-12">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.variantId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex flex-col sm:flex-row gap-8 sm:items-center py-8 border-b border-border/10 group"
                >
                  <div className="relative aspect-[3/4] w-full sm:w-40 overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-border/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-6">
                    <div className="space-y-2">
                      <p className="text-[9px] tracking-[0.3em] text-primary font-black uppercase">{item.brand}</p>
                      <h3 className="font-playfair text-3xl tracking-wide uppercase">{item.name}</h3>
                      <p className="text-[10px] tracking-[0.2em] text-muted-foreground font-medium uppercase">{item.size}ML / EXTRAIT DE PARFUM</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-8">
                      <div className="flex items-center border border-border/20 p-1">
                        <button 
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-12 text-center text-[11px] font-bold tracking-widest">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-12">
                        <p className="text-xl tracking-widest font-light">
                          {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                        </p>
                        <button 
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <button 
              onClick={clearCart}
              className="text-[9px] tracking-[0.4em] font-black text-muted-foreground/40 hover:text-destructive uppercase transition-colors pt-8"
            >
              PURGE COLLECTION
            </button>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4 h-fit sticky top-40 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm border border-border/10 p-12 space-y-12">
            <h3 className="text-[10px] tracking-[0.5em] font-black text-primary uppercase border-b border-primary/10 pb-8">
              ORDER SUMMARY
            </h3>

            <div className="space-y-6">
              <div className="flex justify-between text-[11px] tracking-widest uppercase text-muted-foreground font-medium">
                <span>SUBTOTAL</span>
                <span className="text-foreground">{subtotal.toLocaleString("vi-VN")} VND</span>
              </div>
              <div className="flex justify-between text-[11px] tracking-widest uppercase text-muted-foreground font-medium">
                <span>SHIPPING</span>
                <span className="text-foreground">{shipping === 0 ? "GRATIS" : `${shipping.toLocaleString("vi-VN")} VND`}</span>
              </div>
              <div className="flex justify-between text-[11px] tracking-widest uppercase text-muted-foreground font-medium">
                <span>TAXES</span>
                <span className="text-foreground font-bold italic">CONSIDERED</span>
              </div>
            </div>

            <div className="pt-8 border-t border-border/20">
              <div className="flex justify-between items-end">
                <span className="text-[10px] tracking-[0.4em] font-black uppercase text-primary">TOTAL ESTATE</span>
                <span className="text-4xl font-sans tracking-tighter font-light">
                  {total.toLocaleString("vi-VN")} VND
                </span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className={cn(
                buttonVariants({ variant: "luxury", size: "lg" }),
                "w-full h-16 text-xs tracking-[0.4em] font-black flex items-center justify-center"
              )}
            >
              PROCEED TO ACQUISITION
            </Link>

            <div className="pt-8 space-y-4">
              <p className="text-[9px] tracking-[0.2em] leading-loose text-muted-foreground uppercase text-center font-medium italic">
                Our elixirs are crafted with the finest essences and delivered in discreet, secured packaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
