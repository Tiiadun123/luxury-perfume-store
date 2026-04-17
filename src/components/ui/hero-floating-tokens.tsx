"use client";

import { motion } from "framer-motion";
import { Wind, Droplets, Sparkles } from "lucide-react";

const tokens = [
  { icon: Wind, label: "Bergamot", top: "15%", left: "12%", delay: 0 },
  { icon: Droplets, label: "Damask Rose", bottom: "25%", right: "15%", delay: 1.5 },
  { icon: Sparkles, label: "Silk Musk", top: "20%", right: "20%", delay: 0.8 },
];

export function HeroFloatingTokens() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden xl:block">
      {tokens.map((token, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { duration: 1.5, delay: token.delay },
            scale: { duration: 1.5, delay: token.delay },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: token.delay }
          }}
          style={{ 
            top: token.top, 
            left: token.left, 
            right: token.right, 
            bottom: token.bottom 
          }}
          className="absolute"
        >
          <div className="flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
            <token.icon className="w-4 h-4 text-primary" />
            <span className="text-[10px] tracking-[0.3em] font-black uppercase text-white/80">{token.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
