"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const COLLECTIONS = [
  {
    title: "The Noir Series",
    desc: "Mysterious, dark, and profoundly elegant. For the midnight wanderer.",
    image: "/images/category-noir.png",
    href: "/shop?collection=noir"
  },
  {
    title: "The Blanc Essence",
    desc: "Pure, ethereal, and light. A breath of fresh Parisian morning air.",
    image: "/images/category-blanc.png",
    href: "/shop?collection=blanc"
  },
  {
    title: "Gold & Opulence",
    desc: "Rich, oriental, and strictly majestic. The scent of royalty.",
    image: "/images/category-or.png",
    href: "/shop?collection=or"
  }
];

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-6 md:px-12 py-24 space-y-24">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
         <h1 className="font-playfair text-6xl md:text-7xl uppercase font-medium">Collections</h1>
         <p className="text-[10px] tracking-[0.4em] text-primary font-black uppercase italic">Curated Olfactory Chapters</p>
         <div className="w-12 h-px bg-primary mx-auto mt-8" />
      </div>

      <div className="space-y-40">
        {COLLECTIONS.map((collection, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-32 items-center`}
          >
            <div className="relative w-full lg:w-1/2 aspect-[16/9] overflow-hidden group">
               <Image 
                 src={collection.image}
                 alt={collection.title}
                 fill
                 sizes="(max-width: 1024px) 100vw, 50vw"
                 priority={idx === 0}
                 className="object-cover transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
            </div>

            <div className="w-full lg:w-1/2 space-y-10 text-center lg:text-left">
               <div className="space-y-4">
                  <h2 className="font-playfair text-5xl md:text-6xl uppercase tracking-tighter">{collection.title}</h2>
                  <p className="text-sm tracking-widest text-muted-foreground uppercase leading-loose max-w-md mx-auto lg:mx-0">
                     {collection.desc}
                  </p>
               </div>
               
               <Link href={collection.href} className="inline-flex items-center gap-4 group">
                  <span className="text-[10px] tracking-[0.4em] font-black uppercase border-b border-primary/40 pb-2 group-hover:border-primary transition-all">
                     EXPLORE COLLECTION
                  </span>
                  <div className="p-2 border border-primary/20 rounded-full group-hover:bg-primary group-hover:text-background transition-all">
                     <ArrowRight className="w-4 h-4" />
                  </div>
               </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seasonal Spotlight */}
      <section className="bg-zinc-50 dark:bg-zinc-950 p-20 text-center space-y-10 border border-border/10">
         <div className="space-y-2">
            <p className="text-[8px] tracking-[0.4em] text-primary font-black uppercase">Seasonal Spotlight</p>
            <h3 className="font-playfair text-4xl uppercase">The Ethereal Winter</h3>
         </div>
         <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase max-w-sm mx-auto leading-relaxed">
            Discover our limited edition winter scents before the first spring bloom.
         </p>
         <Link href="/shop" className="block">
            <button className="h-14 px-10 border border-primary/20 text-[10px] tracking-[0.4em] font-black uppercase hover:bg-primary hover:text-background transition-all">
               VIEW LIMITED EDITIONS
            </button>
         </Link>
      </section>
    </div>
  );
}
