"use client";

import { ChevronRight } from "lucide-react";

const CATEGORIES = ["ALL FRAGRANCES", "MEN", "WOMEN", "UNISEX", "EXCLUSIVE", "SAMPLES"];
const NOTES = ["FLORAL", "WOODY", "ORIENTAL", "FRESH", "LEATHER", "SPICED"];

export function ShopSidebar() {
  return (
    <aside className="w-72 hidden lg:flex flex-col gap-12 sticky top-32 h-fit pr-8">
      {/* Categories Section */}
      <div className="space-y-6">
        <h3 className="text-xs tracking-[0.3em] font-bold text-primary uppercase border-b border-primary/20 pb-4">
          CATEGORIES
        </h3>
        <ul className="space-y-4">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button className="flex items-center justify-between w-full group text-[10px] tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-all">
                {cat}
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Olfactory Notes Section */}
      <div className="space-y-6">
        <h3 className="text-xs tracking-[0.3em] font-bold text-primary uppercase border-b border-primary/20 pb-4">
          OLFACTORY NOTES
        </h3>
        <div className="flex flex-wrap gap-2">
          {NOTES.map((note) => (
            <button
              key={note}
              className="px-3 py-2 border border-border text-[9px] tracking-widest hover:border-primary hover:text-primary transition-all uppercase"
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Luxury Filter - Price/Concentration (Visual only for now) */}
      <div className="space-y-6">
        <h3 className="text-xs tracking-[0.3em] font-bold text-primary uppercase border-b border-primary/20 pb-4">
          CONCENTRATION
        </h3>
        <div className="space-y-3">
          {["PARFUM", "EAU DE PARFUM", "EAU DE TOILETTE"].map((conc) => (
             <label key={conc} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-3 h-3 rounded-none border border-border group-hover:border-primary transition-colors" />
                <span className="text-[9px] tracking-widest text-muted-foreground group-hover:text-foreground transition-colors uppercase">
                  {conc}
                </span>
             </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
