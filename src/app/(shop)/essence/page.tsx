"use client";

import { motion } from "framer-motion";
import { Snowflake, Wind, Droplets, Sparkles } from "lucide-react";
import Image from "next/image";

export default function EssencePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero: The Philosophy */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-banner.png" // Reusing high quality asset
            alt="The Essence"
            fill
            sizes="100vw"
            priority
            className="object-cover scale-110 blur-[2px] opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        </div>
        
        <div className="relative z-10 text-center space-y-8 max-w-4xl px-6">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1 }}
           >
              <h1 className="font-playfair text-7xl md:text-9xl uppercase tracking-tighter leading-none mb-6">
                The <br /> Essence
              </h1>
              <p className="text-[10px] tracking-[0.5em] text-primary font-black uppercase">The Soul of Maison Scêntia</p>
           </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-6 md:px-12 py-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
         <div className="relative aspect-square overflow-hidden border border-border/10">
            <Image 
               src="/images/category-noir.png"
               alt="Crafting Process"
               fill
               sizes="(max-width: 1024px) 100vw, 50vw"
               className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
         </div>
         <div className="space-y-12">
            <div className="space-y-4">
               <h2 className="font-playfair text-5xl uppercase italic">Olfactory Poetry</h2>
               <div className="w-20 h-px bg-primary" />
            </div>
            <p className="font-playfair text-2xl leading-relaxed text-muted-foreground">
               At Scêntia, we believe that a perfume is not merely a scent, but a silent language of the soul. Each drop is a verse, each bottle a volume of memories waiting to be opened.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
               <div className="space-y-2">
                  <h4 className="text-[10px] font-black tracking-widest text-primary uppercase">Sourcing</h4>
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase">Rare botanicals from Grasse to the Orient.</p>
               </div>
               <div className="space-y-2">
                  <h4 className="text-[10px] font-black tracking-widest text-primary uppercase">Aging</h4>
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase">Matured in dark vaults for optimal depth.</p>
               </div>
            </div>
         </div>
      </section>

      {/* The Pillars */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-32">
         <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-20 space-y-4">
               <h2 className="font-playfair text-5xl uppercase">The Four Pillars</h2>
               <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Our foundations of excellence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
               {[
                 { title: "PURITY", icon: Droplets, desc: "Undistilled essences of the highest concentration." },
                 { title: "ARTISANRY", icon: Wind, desc: "Hand-blended by third-generation master perfumers." },
                 { title: "ETERNITY", icon: Snowflake, desc: "Scents designed to linger far beyond the sunset." },
                 { title: "MYSTIQUE", icon: Sparkles, desc: "Secret accords known only to our house." }
               ].map((pillar, idx) => (
                 <motion.div 
                   key={idx}
                   whileHover={{ y: -10 }}
                   className="p-10 border border-border/10 text-center space-y-6 hover:bg-background transition-colors duration-500"
                 >
                    <pillar.icon className="w-8 h-8 mx-auto text-primary/60" />
                    <h3 className="text-[10px] font-black tracking-[0.3em] uppercase">{pillar.title}</h3>
                    <p className="text-[10px] tracking-widest text-muted-foreground uppercase leading-relaxed">{pillar.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-48 text-center bg-background">
         <div className="max-w-2xl mx-auto space-y-12">
            <h2 className="font-playfair text-6xl uppercase leading-tight italic">Discover Your <br /> Personal Essence</h2>
            <div className="flex justify-center flex-wrap gap-6">
               <a href="/essence/quiz">
                  <button className="h-16 px-12 bg-primary text-primary-foreground text-[10px] tracking-[0.4em] font-black uppercase hover:opacity-90 transition-all">
                     START PERSONALITY QUIZ
                  </button>
               </a>
               <a href="/shop">
                  <button className="h-16 px-12 border border-primary/20 text-[10px] tracking-[0.4em] font-black uppercase hover:bg-primary/5 transition-all">
                     BROWSE THE VAULT
                  </button>
               </a>
            </div>
         </div>
      </section>
    </div>
  );
}
