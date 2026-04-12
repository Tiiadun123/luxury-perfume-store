"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function ShopControls({ totalFound }: { totalFound: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 border-b border-border/10 pb-12 reveal-up delay-200">
      <div className="space-y-3">
        <h2 className="text-[10px] tracking-[0.4em] text-primary font-black uppercase italic">
          Curated Selections
        </h2>
        <p className="font-playfair text-4xl md:text-5xl uppercase tracking-tight italic">
          {searchParams.get("gender") ? `${searchParams.get("gender")}'s Sacred Scents` : 'All Olfactory Rarities'}
        </p>
      </div>
      
      <div className="flex items-center gap-8 text-[11px] tracking-[0.1em] font-black text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-950 px-8 py-3 border border-border/10 rounded-full">
        <div className="relative group cursor-pointer">
          <span className="flex items-center gap-2">
            SORT BY: <span className="text-foreground font-black underline underline-offset-4 decoration-primary/40 uppercase">{currentSort}</span>
            <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
          </span>
          
          <div className="absolute top-full left-0 mt-4 bg-zinc-900 border border-white/10 p-4 min-w-[160px] hidden group-hover:block z-50 shadow-2xl">
             <div className="space-y-3">
                <button onClick={() => handleSort("newest")} className="block hover:text-primary transition-colors">NEWEST</button>
                <button onClick={() => handleSort("name_asc")} className="block hover:text-primary transition-colors">NAME (A-Z)</button>
                <button onClick={() => handleSort("name_desc")} className="block hover:text-primary transition-colors">NAME (Z-A)</button>
             </div>
          </div>
        </div>
        <span className="w-px h-3 bg-border/40" />
        <span>{totalFound} ESSENCES FOUND</span>
      </div>
    </div>
  );
}
