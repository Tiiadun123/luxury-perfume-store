"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScentiaImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  luxuryPlaceholder?: boolean;
}

export function ScentiaImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "/images/luxury-placeholder.png", 
  luxuryPlaceholder = true,
  ...props 
}: ScentiaImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Gốc của lỗi hình ảnh sẽ dẫn đến hiển thị placeholder sang trọng
  const currentSrc = error ? fallbackSrc : src;

  return (
    <div className={cn(
      "relative overflow-hidden bg-zinc-900/50", 
      props.fill && "h-full w-full",
      loading && "animate-pulse",
      className
    )}>
      <Image
        {...props}
        src={currentSrc}
        alt={alt}
        className={cn(
          "object-cover transition-all duration-700",
          loading ? "scale-110 blur-xl opacity-0" : "scale-100 blur-0 opacity-100",
          className
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      />
      {error && luxuryPlaceholder && (
         <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 border border-primary/10">
            <span className="font-playfair text-[10px] tracking-[0.4em] text-primary/40 uppercase">
               Maison Scêntia
            </span>
         </div>
      )}
    </div>
  );
}
