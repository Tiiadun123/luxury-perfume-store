"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

export function LuxuryMist() {
  const { scrollY } = useScroll();
  
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -400]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* Interactive Mist Layer 1 */}
      <motion.div
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
        className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen"
      />

      {/* Background Floating Orbs */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-zinc-400/10 rounded-full blur-[100px] animate-pulse" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" 
      />

      {/* Grainy Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
