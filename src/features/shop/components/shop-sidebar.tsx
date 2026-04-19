"use client";

import { ChevronRight, X, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

const CATEGORIES = [
  { label: "ALL FRAGRANCES", value: null },
  { label: "MEN", value: "Men" },
  { label: "WOMEN", value: "Women" },
  { label: "UNISEX", value: "Unisex" },
];

const NOTES = ["Floral", "Woody", "Oriental", "Fresh", "Leather", "Spiced", "Citrus", "Amber Floral"];

const CONCENTRATIONS = [
  { label: "PARFUM", value: "Parfum" },
  { label: "EAU DE PARFUM", value: "Eau de Parfum" },
  { label: "EAU DE TOILETTE", value: "Eau de Toilette" },
];

interface ShopSidebarProps {
  brands?: { name: string; slug: string }[];
}

export function ShopSidebar({ brands = [] }: ShopSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [brandSearch, setBrandSearch] = useState("");

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const activeGender = searchParams.get("gender");
  const activeFamily = searchParams.get("family");
  const activeConcentration = searchParams.get("concentration");
  const activeBrand = searchParams.get("brand");

  const clearFilters = () => {
    router.push("/shop");
  };

  const hasFilters = activeGender || activeFamily || activeConcentration || activeBrand;

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filterContent = (
    <>
      {/* Header with Clear Filter */}
      <div className="flex items-center justify-between border-b border-primary/20 pb-4">
        <h3 className="text-xs tracking-[0.3em] font-bold text-primary uppercase">
          FILTERS
        </h3>
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-1 text-[8px] tracking-[0.2em] font-black text-primary hover:text-white transition-colors"
          >
            CLEAR <X className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {/* Categories / Gender */}
      <div className="space-y-6">
        <h4 className="text-[10px] tracking-[0.3em] font-black text-muted-foreground uppercase">
          CATEGORIES
        </h4>
        <ul className="space-y-4">
          {CATEGORIES.map((cat) => (
            <li key={cat.label}>
              <button 
                onClick={() => router.push(`/shop?${createQueryString("gender", cat.value)}`)}
                className={cn(
                  "flex items-center justify-between w-full group text-[10px] tracking-[0.2em] font-medium transition-all uppercase",
                  (activeGender === cat.value || (!activeGender && !cat.value)) 
                    ? "text-primary border-r-2 border-primary pr-2" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.label}
                <ChevronRight className={cn(
                  "w-3 h-3 transition-all",
                  (activeGender === cat.value || (!activeGender && !cat.value)) ? "opacity-100 translate-x-1" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                )} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Olfactory Notes / Families */}
      <div className="space-y-6">
        <h4 className="text-[10px] tracking-[0.3em] font-black text-muted-foreground uppercase">
          OLFACTORY NOTES
        </h4>
        <div className="flex flex-wrap gap-2">
          {NOTES.map((note) => (
            <button
              key={note}
              onClick={() => router.push(`/shop?${createQueryString("family", activeFamily === note ? null : note)}`)}
              className={cn(
                "px-3 py-2 border text-[9px] tracking-widest transition-all uppercase",
                activeFamily === note 
                  ? "border-primary bg-primary text-white" 
                  : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Concentration */}
      <div className="space-y-6">
        <h4 className="text-[10px] tracking-[0.3em] font-black text-muted-foreground uppercase">
          CONCENTRATION
        </h4>
        <div className="space-y-4">
          {CONCENTRATIONS.map((conc) => (
             <button 
                key={conc.value} 
                onClick={() => router.push(`/shop?${createQueryString("concentration", activeConcentration === conc.value ? null : conc.value)}`)}
                className="flex items-center gap-4 group cursor-pointer w-full"
             >
                <div className={cn(
                  "w-3 h-3 border transition-all duration-500",
                  activeConcentration === conc.value 
                    ? "border-primary bg-primary rotate-45" 
                    : "border-border group-hover:border-primary"
                )} />
                <span className={cn(
                  "text-[9px] tracking-widest transition-colors uppercase",
                  activeConcentration === conc.value ? "text-primary font-bold" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {conc.label}
                </span>
             </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] tracking-[0.3em] font-black text-muted-foreground uppercase">
            BRANDS
          </h4>
          {brandSearch && (
            <button 
              onClick={() => setBrandSearch("")}
              className="text-[8px] tracking-widest text-primary hover:text-white transition-colors"
            >
              RESET
            </button>
          )}
        </div>
        
        <div className="relative group">
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="SEARCH BRANDS..." 
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="h-8 text-[9px] tracking-[0.2em] placeholder:text-[8px] border-primary/10 hover:border-primary/30"
          />
        </div>

        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-4 custom-scrollbar">
          {filteredBrands.map((b) => (
            <button 
              key={b.slug}
              onClick={() => router.push(`/shop?${createQueryString("brand", activeBrand === b.slug ? null : b.slug)}`)}
              className={cn(
                "block text-[9px] tracking-[0.2em] transition-colors text-left font-medium uppercase w-full",
                activeBrand === b.slug 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {b.name}
            </button>
          ))}
          {filteredBrands.length === 0 && (
            <p className="text-[8px] tracking-widest text-muted-foreground italic py-4">
              NO BRANDS FOUND
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-[10px] tracking-[0.3em] font-black uppercase shadow-2xl hover:scale-105 transition-transform"
      >
        <SlidersHorizontal className="w-4 h-4" />
        FILTERS
      </button>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-background overflow-y-auto p-8 pt-12 lg:hidden"
          >
            <div className="flex justify-between items-center mb-10 border-b border-primary/20 pb-6">
              <h3 className="text-xs tracking-[0.3em] font-bold text-primary uppercase">REFINE SELECTION</h3>
              <button onClick={() => setIsMobileOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-12">
              {filterContent}
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-full mt-10 h-14 bg-primary text-primary-foreground text-[10px] tracking-[0.4em] font-black uppercase"
            >
              VIEW RESULTS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-72 hidden lg:flex flex-col gap-12 sticky top-32 h-fit pr-8">
        {filterContent}
      </aside>
    </>
  );
}
