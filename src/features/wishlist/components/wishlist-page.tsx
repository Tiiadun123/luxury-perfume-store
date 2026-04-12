"use client";

import { useWishlist } from "../store";
import { ProductCard } from "@/features/shop/components/product-card";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 space-y-16">
      <div className="text-center space-y-4">
         <h1 className="font-playfair text-6xl md:text-7xl uppercase font-medium">My Sanctuary</h1>
         <p className="text-[10px] tracking-[0.4em] text-primary font-black uppercase italic">Where your desires rest</p>
      </div>

      <AnimatePresence mode="wait">
        {items.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 space-y-8 border border-dashed border-border/40"
          >
             <Heart className="w-12 h-12 text-zinc-200 dark:text-zinc-800" />
             <p className="font-playfair text-xl italic text-muted-foreground">Your sanctuary is currently a blank canvas.</p>
             <Link href="/shop">
               <Button variant="luxury" size="lg" className="h-16 px-12">
                 BEGIN YOUR DISCOVERY
               </Button>
             </Link>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12"
          >
            {items.map((item) => (
              <ProductCard 
                key={item.id} 
                {...item} 
                notes={[]} // Simplified for wishlist view
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
