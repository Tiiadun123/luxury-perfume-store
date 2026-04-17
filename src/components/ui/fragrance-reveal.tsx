"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function FragranceReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const bgColor = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7],
    ["#0a0a0a", "#fdfcf9", "#fdfcf9"]
  );
  const textColor = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7],
    ["#ffffff", "#1a1a1a", "#1a1a1a"]
  );

  return (
    <motion.section
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
      className="relative min-h-[150vh] flex flex-col items-center justify-center overflow-hidden transition-colors duration-700"
    >
      {/* Decorative Text background */}
      <motion.div 
        style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 0.05]) }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
      >
        <span className="text-[20vw] font-black tracking-tighter text-black uppercase">ESSENCE</span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-20">
        <div className="max-w-xl space-y-10">
          <motion.div style={{ color: textColor }}>
            <motion.p 
              className="text-[10px] tracking-[0.5em] font-black uppercase mb-6 text-primary"
            >
              The Alchemy of Scent
            </motion.p>
            <motion.h2 
              className="font-playfair text-6xl md:text-8xl tracking-tighter leading-[0.9] italic"
            >
              A Fragrance Born from <br /> 
              <span className="not-italic font-bold">Pure Precision</span>
            </motion.h2>
          </motion.div>

          <motion.p 
            style={{ color: textColor, opacity: 0.6 }}
            className="text-sm md:text-base tracking-wide leading-relaxed font-medium max-w-md"
          >
            We don&rsquo;t just mix ingredients; we capture moments in glass. 
            Each bottle is a testament to the patient art of olfactory balance, 
            sourced from the world&rsquo;s most remote sanctuaries.
          </motion.p>

          <motion.div className="pt-6">
            <button className="group relative px-10 py-5 bg-black text-white text-[10px] font-black tracking-[0.4em] uppercase overflow-hidden transition-all hover:pr-14">
              <span className="relative z-10">Explore the Process</span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </motion.div>
        </div>

        <motion.div 
          style={{ scale, opacity, y }}
          className="relative w-full max-w-md aspect-[3/4]"
        >
          {/* Main Reveal Image - High quality bottle */}
          <div className="relative w-full h-full p-12 bg-white/50 backdrop-blur-3xl rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80"
              alt="Artisanal Bottle"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
          </div>
          
          {/* Floating Ingredient Detail */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-white shadow-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 rounded-2xl"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-xs italic">01</span>
            </div>
            <p className="text-[9px] font-black tracking-[0.2em] uppercase text-black">Organic Iris</p>
            <p className="text-[8px] text-zinc-400 uppercase tracking-widest leading-tight">Harvested in <br/> Tuscany</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
