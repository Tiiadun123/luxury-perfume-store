"use client";

import { motion, Variants } from "framer-motion";

interface FragrancePyramidProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

export function FragrancePyramid({ topNotes, heartNotes, baseNotes }: FragrancePyramidProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative max-w-lg mx-auto py-12"
    >
      <div className="flex flex-col items-center">
        
        {/* TOP NOTES - Apex */}
        <motion.div 
          variants={sectionVariants}
          className="relative z-30 w-full flex flex-col items-center mb-2"
        >
          <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[80px] border-b-primary/20 flex items-center justify-center relative">
             <div className="absolute top-12 flex flex-col items-center text-center px-4 w-40">
                <span className="text-[9px] tracking-[0.4em] font-black text-primary uppercase mb-2">TOP</span>
                <p className="text-[10px] tracking-widest text-foreground font-bold leading-tight">{topNotes.join(", ")}</p>
             </div>
          </div>
        </motion.div>

        {/* HEART NOTES - Middle Tier */}
        <motion.div 
          variants={sectionVariants}
          className="relative z-20 w-full flex flex-col items-center -mt-4 mb-2"
        >
          <div className="w-[280px] h-[100px] bg-primary/10 clip-path-trapezoid flex flex-col items-center justify-center border-x border-primary/5">
             <style jsx>{`
                .clip-path-trapezoid {
                  clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
                }
             `}</style>
             <div className="flex flex-col items-center text-center px-8">
                <span className="text-[9px] tracking-[0.4em] font-black text-primary uppercase mb-2">HEART</span>
                <p className="text-[10px] tracking-widest text-foreground font-bold leading-tight max-w-[180px]">{heartNotes.join(", ")}</p>
             </div>
          </div>
        </motion.div>

        {/* BASE NOTES - Foundation */}
        <motion.div 
          variants={sectionVariants}
          className="relative z-10 w-full flex flex-col items-center -mt-4"
        >
          <div className="w-[400px] h-[120px] bg-primary/5 clip-path-trapezoid-large flex flex-col items-center justify-center border-x border-primary/5">
             <style jsx>{`
                .clip-path-trapezoid-large {
                  clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
                }
             `}</style>
             <div className="flex flex-col items-center text-center px-12 pt-4">
                <span className="text-[9px] tracking-[0.4em] font-black text-primary uppercase mb-2">BASE</span>
                <p className="text-[10px] tracking-widest text-foreground font-bold leading-tight max-w-[280px]">{baseNotes.join(", ")}</p>
             </div>
          </div>
        </motion.div>

        {/* Decorative Ground Shadow */}
        <div className="w-[420px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-4" />
      </div>
    </motion.div>
  );
}
