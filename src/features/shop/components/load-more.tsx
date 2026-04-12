"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function LoadMore({ currentLimit }: { currentLimit: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", (currentLimit + 12).toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="pt-32 flex justify-center border-t border-border/5 reveal-up delay-400">
      <button 
        onClick={handleLoadMore}
        className="group relative h-16 px-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/5 transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
        <div className="relative border border-primary/20 h-full w-full flex items-center justify-center px-12 transition-colors group-hover:border-primary">
          <span className="text-foreground text-[10px] tracking-[0.4em] font-black uppercase">
            REVEAL MORE
          </span>
        </div>
      </button>
    </div>
  );
}
