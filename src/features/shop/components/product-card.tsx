"use client";

import { ScentiaImage } from "@/components/ui/scentia-image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Eye, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/features/cart/store";
import { useWishlist } from "@/features/wishlist/store";
import { useComparison } from "../context/comparison-context";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  defaultVariantId: string;
  name: string;
  brand: string;
  size: number;
  price: number;
  image: string;
  notes: string[];
  slug: string;
  concentration?: string;
  longevity?: string;
  sillage?: string;
}

export function ProductCard({ 
  id, defaultVariantId, size, name, brand, price, image, notes, slug,
  concentration, longevity, sillage 
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToCompare } = useComparison();

  const isWishlisted = isInWishlist(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id,
      variantId: defaultVariantId,
      name,
      brand,
      price,
      image,
      quantity: 1,
      size: size
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({ id, defaultVariantId, size, name, brand, price, image, slug });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="group relative flex flex-col gap-5 border border-transparent hover:border-border/40 p-1 transition-all duration-700 h-full"
    >
      {/* Invisible overlay link that covers the entire card except buttons */}
      <Link 
        href={`/product/${slug}`} 
        className="absolute inset-0 z-[1]" 
        aria-label={`View ${name}`}
      />

      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 group-hover:shimmer z-0">
        <ScentiaImage
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-background/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-4 z-20 pointer-events-none group-hover:pointer-events-auto">
          <Button 
            variant="luxury" 
            size="lg" 
            className="h-12 w-40 rounded-none bg-background text-foreground hover:bg-primary hover:text-background border-none pointer-events-auto shadow-2xl"
            onClick={handleAddToCart}
          >
            ADD TO BAG
          </Button>
          <div className="flex items-center gap-2 text-[10px] tracking-widest font-bold uppercase hover:text-primary transition-colors drop-shadow-md">
            <Eye className="w-3 h-3" />
            DISCOVER MORE
          </div>
        </div>
        
        {/* Notes Preview (Always present but subtle) */}
        <div className="absolute bottom-4 left-4 flex gap-1 z-10">
          {notes.slice(0, 3).map((note) => (
              <span key={note} className="px-3 py-0.5 bg-black/40 backdrop-blur-md text-[10px] tracking-widest text-white uppercase font-bold">
                {note}
              </span>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left px-2 z-0">
        <p className="text-xs tracking-[0.25em] text-primary/90 uppercase font-black">
          {brand}
        </p>
        <h3 className="font-playfair text-xl tracking-wide group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="font-sans text-sm tracking-widest font-medium mt-1">
          {price.toLocaleString("vi-VN")} VND
        </p>
      </div>

      {/* Action Buttons - High Z-Index to be clickable over the overlay link */}
      
      {/* Quick Add Button */}
      <button 
        onClick={handleAddToCart}
        className="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur-md border border-border/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-primary hover:text-background transition-all duration-300 shadow-sm z-30"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Compare Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          addToCompare({ 
            id, defaultVariantId, size, name, brand, price, image, notes, slug,
            concentration, longevity, sillage
          });
        }}
        className={cn(
          "absolute top-16 right-4 p-2 bg-background/80 backdrop-blur-md border border-border/10 rounded-full transition-all duration-300 shadow-sm z-30",
          "opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110"
        )}
        title="Compare Essence"
      >
        <ArrowRightLeft className="w-4 h-4 text-zinc-400 hover:text-primary transition-colors" />
      </button>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className={cn(
          "absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-md border border-border/10 rounded-full transition-all duration-300 shadow-sm z-30",
          "opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110",
          isWishlisted && "opacity-100 md:opacity-100 text-primary border-primary/20"
        )}
      >
        <Heart className={cn("w-4 h-4 transition-colors", isWishlisted ? "fill-primary text-primary" : "text-muted-foreground")} />
      </button>
    </motion.div>
  );
}
