"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function LuxuryCursor() {
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
      {/* Outer Ring */}
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: isHovering ? 2 : 1,
          borderColor: isHovering ? "rgba(193, 163, 97, 1)" : "rgba(255, 255, 255, 0.2)",
        }}
        className="w-8 h-8 rounded-full border border-white/20"
      />
      {/* Inner Dot */}
      <motion.div
        style={{ 
          x: cursorX, 
          y: cursorY, 
          translateX: "12px", 
          translateY: "12px" 
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          backgroundColor: "#C1A361",
        }}
        className="absolute w-2 h-2 rounded-full bg-primary"
      />
    </div>
  );
}
