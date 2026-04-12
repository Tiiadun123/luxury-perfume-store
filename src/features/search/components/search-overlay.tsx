"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchProducts } from "../actions";
import Image from "next/image";
import Link from "next/link";
import { SearchProductItem } from "@/features/search/actions";

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProductItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const visibleResults = query.length < 2 ? [] : results;

  useEffect(() => {
    if (query.length < 2) {
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await searchProducts(query);
        setResults(data);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, startTransition]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-2xl flex flex-col p-6 md:p-12"
        >
          <div className="flex justify-between items-center mb-12">
            <span className="font-playfair text-2xl tracking-[0.2em] font-bold">SCÊNTIA</span>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto w-full space-y-12">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/40 group-focus-within:text-primary transition-colors" />
              <input
                autoFocus
                type="text"
                placeholder="DISCOVER YOUR NEXT ESSENCE..."
                className="w-full bg-transparent border-b-2 border-primary/20 focus:border-primary px-16 py-8 text-2xl md:text-4xl font-playfair tracking-wider outline-none uppercase placeholder:text-muted-foreground/30 transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isPending && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 animate-spin text-primary" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {visibleResults.length > 0 ? (
                <div className="space-y-8">
                  <h3 className="text-[10px] tracking-[0.4em] font-black text-primary uppercase border-b border-primary/10 pb-4">SEARCH RESULTS</h3>
                  <div className="space-y-6">
                    {visibleResults.map((p) => (
                      <Link 
                        key={p.id} 
                        href={`/product/${p.slug}`} 
                        onClick={onClose}
                        className="flex gap-4 group cursor-pointer"
                      >
                        <div className="relative w-24 aspect-[3/4] overflow-hidden border border-border/20">
                          <Image src={p.image} alt={p.name} fill className="object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                          <p className="text-[8px] tracking-[0.3em] font-bold text-primary/80 uppercase">{p.brand}</p>
                          <h4 className="font-playfair text-lg leading-tight uppercase group-hover:text-primary transition-colors">{p.name}</h4>
                          <p className="text-xs font-sans tracking-widest">{p.price.toLocaleString("vi-VN")} VND</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : query.length > 2 && !isPending ? (
                 <div className="space-y-4">
                    <p className="font-playfair text-xl italic text-muted-foreground">No matches for &quot;{query}&quot; in our vault.</p>
                 </div>
              ) : (
                <div className="space-y-8">
                  <h3 className="text-[10px] tracking-[0.4em] font-black text-primary uppercase border-b border-primary/10 pb-4">TRENDING SEARCHES</h3>
                  <div className="flex flex-wrap gap-4">
                    {["BLEU DE CHANEL", "SAUVAGE", "AVENTUS", "OUD WOOD", "FLORAL"].map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => setQuery(tag)}
                        className="px-6 py-3 border border-border/40 text-[9px] tracking-widest font-bold uppercase transition-all hover:border-primary hover:text-primary"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="hidden md:block space-y-8">
                 <h3 className="text-[10px] tracking-[0.4em] font-black text-primary uppercase border-b border-primary/10 pb-4">EDITORIAL EDIT</h3>
                 <div className="relative aspect-video border border-border/10 overflow-hidden group">
                    <Image 
                      src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2004&auto=format&fit=crop" 
                      alt="editorial" 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-2">
                       <p className="text-[8px] tracking-[0.3em] font-black uppercase">Collection 2026</p>
                       <h4 className="font-playfair text-2xl uppercase">The Night Essence</h4>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
