"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWishlist, isInWishlist } from "../actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  variant?: "icon" | "full";
}

export function WishlistButton({ productId, className, variant = "icon" }: WishlistButtonProps) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isInWishlist(productId).then(setActive);
  }, [productId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    const result = await toggleWishlist(productId);
    setLoading(false);

    if (result.success) {
      setActive(result.action === "added");
      toast.success(
        result.action === "added" 
          ? "Added to your sanctuary" 
          : "Removed from your sanctuary",
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            fontFamily: "var(--font-playfair)"
          }
        }
      );
    } else {
      toast.error(result.error || "Please login to save scents");
    }
  };

  if (variant === "full") {
    return (
      <Button
        onClick={handleToggle}
        disabled={loading}
        variant="outline"
        className={cn(
          "w-full py-6 uppercase tracking-[0.2em] text-[10px] font-bold border-primary/20 hover:border-primary transition-all",
          active && "bg-primary text-primary-foreground border-primary",
          className
        )}
      >
        <Heart className={cn("w-4 h-4 mr-2", active && "fill-current")} />
        {active ? "In Your Sanctuary" : "Add to Sanctuary"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "p-3 rounded-full bg-background/80 backdrop-blur-md border border-border/40 hover:scale-110 active:scale-95 transition-all group",
        active ? "text-primary border-primary/40" : "text-muted-foreground hover:text-primary",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active ? "active" : "inactive"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-colors", 
              active ? "fill-current" : "group-hover:text-primary"
            )} 
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
