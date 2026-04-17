"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RevenueChartProps {
  data: Record<string, number>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const entries = Object.entries(data);
  if (entries.length === 0) return null;

  const values = entries.map(([, v]) => v);
  const maxVal = Math.max(...values) || 1;
  const minVal = Math.min(...values) || 0;
  const range = maxVal - minVal || 1;

  // Chart Dimensions
  const width = 800;
  const height = 300;
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Generate Path
  const points = entries.map(([, val], i) => {
    const x = padding + (i / (entries.length - 1)) * graphWidth;
    const y = height - padding - ((val - minVal) / range) * graphHeight;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  return (
    <div className="w-full space-y-8">
      <div className="relative group bg-zinc-950/40 border border-white/5 p-12 backdrop-blur-xl overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-primary/10 transition-all duration-700 group-hover:w-40 group-hover:h-40" />
        
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-1">
             <h2 className="text-xs tracking-[0.4em] font-black uppercase text-primary">VALUATION FLOW</h2>
             <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-medium italic">Temporal progression of house revenue</p>
          </div>
          <div className="text-right">
             <p className="text-[8px] tracking-[0.3em] text-zinc-500 uppercase font-bold mb-1">PEAK PERFORMANCE</p>
             <p className="text-xl font-sans font-bold text-primary">{maxVal.toLocaleString()} VND</p>
          </div>
        </div>

        <div className="relative h-[300px] w-full">
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <line
                key={p}
                x1={padding}
                y1={height - padding - p * graphHeight}
                x2={width - padding}
                y2={height - padding - p * graphHeight}
                stroke="currentColor"
                className="text-white/5"
                strokeWidth="1"
              />
            ))}

            {/* Gradient Area */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
              fill="url(#chartGradient)"
            />

            {/* Main Path */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={pathData}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interaction Points */}
            {entries.map((_, i) => {
              const [x, y] = points[i].split(",").map(Number);
              return (
                <g 
                  key={i} 
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={hoveredIndex === i ? 6 : 4}
                    className={cn(
                      "fill-background stroke-primary stroke-2 transition-all duration-300",
                      hoveredIndex === i ? "scale-125" : "opacity-0 group-hover:opacity-100"
                    )}
                  />
                  {/* Tooltip Overlay (Invisible trigger) */}
                  <rect
                    x={x - 20}
                    y={0}
                    width={40}
                    height={height}
                    fill="transparent"
                  />
                </g>
              );
            })}
          </svg>

          {/* Tooltip HTML */}
          {hoveredIndex !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bg-zinc-900 border border-primary/20 p-4 shadow-2xl z-20 pointer-events-none"
              style={{ 
                left: `${(hoveredIndex / (entries.length - 1)) * 100}%`,
                top: '10%',
                transform: 'translateX(-50%)' 
              }}
            >
              <p className="text-[8px] tracking-[0.3em] text-zinc-500 uppercase font-black mb-1">{entries[hoveredIndex][0]}</p>
              <p className="text-sm font-sans font-bold text-white">{entries[hoveredIndex][1].toLocaleString()} VND</p>
            </motion.div>
          )}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between items-center mt-6 px-[40px]">
          {entries.map(([month], i) => (
             <span 
               key={i} 
               className={cn(
                 "text-[9px] tracking-widest font-black uppercase transition-colors duration-300",
                 hoveredIndex === i ? "text-primary" : "text-zinc-600"
               )}
             >
               {month.substring(0, 3)}
             </span>
          ))}
        </div>
      </div>
    </div>
  );
}
