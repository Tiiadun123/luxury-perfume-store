"use client";

import React from "react";
import { useComparison } from "../context/comparison-context";
import { X } from "lucide-react";
import { ScentiaImage } from "@/components/ui/scentia-image";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

export function ComparisonView() {
  const { compareList, isComparing, setIsComparing, removeFromCompare } = useComparison();

  if (!isComparing) return null;

  const attributes = [
    { label: "HOUSE / BRAND", key: "brand" },
    { label: "CONCENTRATION", key: "concentration" },
    { label: "BEST BEFORE", value: "36 MONTHS" },
    { label: "OLFACTORY NOTES", key: "notes" },
    { label: "SIGNATURE SILLAGE", key: "sillage" },
    { label: "LONGEVITY", key: "longevity" },
    { label: "PRICE", key: "price", format: (v: number) => formatCurrency(v) },
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex flex-col pt-24 pb-12 px-6 overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto w-full relative">
          <button 
            onClick={() => setIsComparing(false)}
            className="fixed top-8 right-8 z-[110] p-4 bg-zinc-900 border border-border/40 text-zinc-300 hover:text-primary hover:border-primary/50 transition-all duration-300 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <header className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-12 duration-1000">
             <h2 className="text-[12px] tracking-[0.8em] font-black uppercase text-primary">COLLECTION COMPARISON</h2>
             <p className="font-playfair text-5xl md:text-7xl italic tracking-tighter uppercase">Side-by-Side Analysis</p>
          </header>

          <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-8 min-w-[1200px] pb-24">
             {/* Labels Column */}
             <div className="flex flex-col">
                <div className="h-[440px]" /> {/* Header Spacer */}
                <div className="flex flex-col gap-10 border-r border-border/10 pr-6">
                   {attributes.map((attr) => (
                      <span key={attr.label} className="text-[10px] tracking-[0.4em] font-black uppercase text-zinc-600 h-10 flex items-center">{attr.label}</span>
                   ))}
                </div>
             </div>

             {/* Products Columns */}
             {[0, 1, 2, 3].map((index) => {
               const product = compareList[index];
               if (!product) {
                 return (
                   <div key={index} className="flex flex-col">
                      <div className="h-[440px] flex flex-col items-center justify-center border border-dashed border-border/10 bg-zinc-400/5 group hover:bg-zinc-400/10 transition-colors">
                        <LayoutGrid className="w-8 h-8 text-zinc-800 group-hover:text-zinc-700 transition-colors mb-4" />
                        <p className="text-[10px] tracking-widest text-zinc-700 uppercase font-black">SLOT AVAILABLE</p>
                      </div>
                   </div>
                 );
               }

               return (
                 <div key={product.id} className="flex flex-col group">
                    {/* Consistent Header Height */}
                    <div className="h-[440px] flex flex-col bg-zinc-900/10 border border-border/10 transition-all duration-500 hover:border-primary/20 mb-8 overflow-hidden">
                       <div className="relative flex-1 overflow-hidden border-b border-border/10">
                          <ScentiaImage 
                            src={product.image} 
                            alt={product.name}
                            width={400}
                            height={533}
                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.02] group-hover:scale-105"
                          />
                          <button 
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute top-4 right-4 bg-background/50 border border-border/20 p-2 hover:bg-red-500 transition-colors text-zinc-400 hover:text-white z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                       </div>

                       <div className="p-6 space-y-2 text-center">
                          <h3 className="text-xs font-playfair tracking-[0.2em] font-black uppercase truncate">{product.name}</h3>
                          <p className="text-[8px] tracking-[0.4em] text-primary uppercase font-black">{product.brand}</p>
                       </div>
                    </div>

                    <div className="flex flex-col gap-10 px-8 pb-10 text-center items-center">
                       {attributes.map((attr) => (
                          <div key={attr.label} className="h-10 flex items-center justify-center w-full">
                             <div className="text-[10px] tracking-widest uppercase font-bold text-zinc-400 leading-relaxed">
                                {attr.format 
                                  ? attr.format(product[attr.key as keyof typeof product] as never)
                                  : attr.value || (Array.isArray(product[attr.key as keyof typeof product]) 
                                      ? (product[attr.key as keyof typeof product] as string[]).join(", ") 
                                      : (product[attr.key as keyof typeof product] as string | number) || "—")
                                }
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function LayoutGrid({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
