"use client";

import { Search, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export function CustomerSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue || "");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams();
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, 300);

  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <input 
        type="text" 
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="SEARCH BY NAME OR EMAIL..." 
        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-border/10 h-16 px-12 text-[10px] tracking-widest uppercase outline-none focus:border-primary/40 transition-all font-bold"
      />
      {value && (
        <button 
           onClick={() => {
             setValue("");
             handleSearch("");
           }}
           className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
           <X className="w-3 h-3" />
        </button>
      )}
      {isPending && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
           <div className="w-3 h-3 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        </div>
      )}
    </div>
  );
}
