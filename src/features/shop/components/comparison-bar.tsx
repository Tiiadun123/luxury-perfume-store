"use client";

import React from "react";
import { useComparison } from "../context/comparison-context";
import { X, ArrowRightLeft, Trash2 } from "lucide-react";
import { ScentiaImage } from "@/components/ui/scentia-image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ComparisonBar() {
  const { compareList, removeFromCompare, clearCompare, setIsComparing } = useComparison();

  if (compareList.length === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-4xl"
    >
      <div className="bg-background/80 backdrop-blur-xl border border-primary/20 p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full hidden sm:block">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.4em] font-black uppercase text-primary">COLLECTION COMPARISON</h4>
            <p className="text-[9px] tracking-widest text-zinc-500 uppercase font-bold">{compareList.length}/4 ESSENCES SELECTED</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 overflow-x-auto py-2 px-1 scrollbar-hide flex-1 justify-center md:justify-start">
          <AnimatePresence>
            {compareList.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative group flex-shrink-0"
              >
                <div className="w-16 h-20 border border-border/10 overflow-hidden bg-zinc-900/50">
                  <ScentiaImage 
                    src={product.image} 
                    alt={product.name}
                    width={64}
                    height={80}
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <button 
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -top-2 -right-2 bg-background border border-border/40 p-1 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                >
                  <X className="w-3 h-3 text-zinc-400 group-hover:text-red-500" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={clearCompare}
            className="p-3 text-zinc-500 hover:text-red-500 transition-colors hidden sm:block"
            title="Clear All"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Button 
            onClick={() => setIsComparing(true)}
            className="h-12 px-8 text-[10px] tracking-[0.4em] font-black uppercase bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={compareList.length < 2}
          >
            {compareList.length < 2 ? "ADD MORE" : "COMPARE NOW"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
