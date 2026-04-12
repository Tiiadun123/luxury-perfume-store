"use client";

import { useCart } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CartSidepad() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCart();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          />

          {/* Sidepad */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-background border-l border-border/40 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-border/20 flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-xs tracking-[0.4em] font-black uppercase text-primary">SHOPPING BAG</h2>
                <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{items.length} CREATIONS</p>
              </div>
              <button onClick={() => toggleCart(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                   <ShoppingBag className="w-12 h-12 text-zinc-200 dark:text-zinc-800" />
                   <p className="font-playfair text-xl italic text-muted-foreground">Your sanctuary of scent is empty.</p>
                   <Button variant="luxury" onClick={() => toggleCart(false)}>START DISCOVERY</Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 group">
                    <div className="relative w-24 aspect-[3/4] overflow-hidden border border-border/10">
                       <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-3">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <p className="text-[8px] tracking-[0.3em] font-bold text-primary/80 uppercase">{item.brand}</p>
                             <h4 className="font-playfair text-lg leading-tight uppercase">{item.name}</h4>
                             <p className="text-[9px] tracking-widest text-muted-foreground uppercase">{item.size}ML / EXTRAIT</p>
                          </div>
                          <button onClick={() => removeItem(item.variantId)} className="text-muted-foreground hover:text-destructive transition-colors">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       
                       <div className="flex justify-between items-center">
                          <div className="flex items-center border border-border/40">
                             <button 
                               onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                               className="p-2 hover:text-primary transition-colors"
                             >
                               <Minus className="w-3 h-3" />
                             </button>
                             <span className="w-8 text-center text-[10px] font-bold">{item.quantity}</span>
                             <button 
                               onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                               className="p-2 hover:text-primary transition-colors"
                             >
                               <Plus className="w-3 h-3" />
                             </button>
                          </div>
                          <p className="text-xs font-sans tracking-widest font-bold">
                            {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                          </p>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-border/20 space-y-6 bg-zinc-50 dark:bg-zinc-950/50">
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] tracking-widest uppercase">
                      <span className="text-muted-foreground">SUBTOTAL</span>
                      <span className="font-bold">{subtotal.toLocaleString("vi-VN")} VND</span>
                   </div>
                   <div className="flex justify-between text-[10px] tracking-widest uppercase">
                      <span className="text-muted-foreground">SHIPPING</span>
                      <span className="text-primary font-black">COMPLIMENTARY</span>
                   </div>
                </div>
                
                <div className="pt-4 space-y-3">
                   <Link href="/checkout" onClick={() => toggleCart(false)}>
                     <Button variant="luxury" className="w-full h-16 text-xs tracking-[0.4em] font-black">
                       PROCEED TO CHECKOUT
                     </Button>
                   </Link>
                   <p className="text-[8px] tracking-widest text-center text-muted-foreground uppercase">
                     Taxes and international duties calculated at checkout
                   </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
