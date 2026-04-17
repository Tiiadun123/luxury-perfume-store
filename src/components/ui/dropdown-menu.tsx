"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function useDropdown() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("useDropdown must be used within DropdownMenu");
  return context;
}

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  
  // Close on click outside
  React.useEffect(() => {
    if (!open) return;
    const handleDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) setOpen(false);
    };
    window.addEventListener("mousedown", handleDown);
    return () => window.removeEventListener("mousedown", handleDown);
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" data-dropdown>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen, open } = useDropdown();
  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer">
      {children}
    </div>
  );
};

const DropdownMenuContent = ({ children, className, align = "end" }: { children: React.ReactNode; className?: string; align?: "start" | "end" }) => {
  const { open } = useDropdown();
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "absolute z-50 mt-2 min-w-[12rem] overflow-hidden border border-border/10 bg-zinc-950 p-2 shadow-2xl backdrop-blur-xl",
            align === "end" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DropdownMenuItem = ({ 
  children, 
  onClick, 
  className 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string 
}) => {
  const { setOpen } = useDropdown();
  
  return (
    <div
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      className={cn(
        "relative flex cursor-default select-none items-center px-4 py-3 text-[10px] tracking-widest uppercase font-bold outline-none transition-colors hover:bg-primary/10 hover:text-primary",
        className
      )}
    >
      {children}
    </div>
  );
};

const DropdownMenuLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("px-4 py-2 text-[8px] tracking-[0.3em] font-black uppercase text-muted-foreground", className)}>
    {children}
  </div>
);

const DropdownMenuSeparator = ({ className }: { className?: string }) => (
  <div className={cn("-mx-2 my-2 h-px bg-border/10", className)} />
);

const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
};
