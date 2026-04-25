"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/features/cart/store";
import { verifyStripeSession } from "@/features/checkout/actions";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    
    // Clear cart on successful payment session
    if (sessionId) {
      verifyStripeSession(sessionId).then((result) => {
        if (result.success && result.paymentStatus === "paid") {
          clearCart();
        }
      });
    }

    return () => cancelAnimationFrame(id);
  }, [sessionId, clearCart]);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-6 py-32 md:py-48 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl w-full text-center space-y-12"
      >
        {/* Subtle Luxury Decoration */}
        <div className="flex justify-center mb-8 relative">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 flex items-center justify-center opacity-10"
           >
              <Snowflake className="w-40 h-40 text-primary" />
           </motion.div>
           <div className="relative z-10 p-6 bg-primary/10 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-primary" />
           </div>
        </div>

        <div className="space-y-6">
           <h1 className="font-playfair text-6xl md:text-8xl uppercase tracking-tighter leading-none">
              The Journey Is <br /> Underway
           </h1>
           <p className="text-[10px] tracking-[0.5em] text-primary font-black uppercase">PAYMENT CONFIRMED | SCÊNTIA PARIS</p>
        </div>

        <div className="max-w-xl mx-auto border-t border-b border-border/20 py-12 space-y-8">
           <p className="font-playfair text-xl italic leading-relaxed text-muted-foreground">
             &quot;Your selection will now begin its meticulous preparation by our house artisans. We thank you for choosing the essence of Maison Scêntia.&quot;
           </p>
           <div className="flex flex-col items-center gap-2">
              <p className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground font-bold">SESSION IDENTIFIER</p>
              <p className="text-[10px] font-mono tracking-widest bg-zinc-900 border border-border/10 px-4 py-1 truncate max-w-xs uppercase">
                 {sessionId || "MANUAL_RESERVATION"}
              </p>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
           <Link href="/profile/orders">
              <Button variant="outline" size="lg" className="h-16 px-12 text-[10px] tracking-[0.3em] font-black uppercase border-primary/20 hover:border-primary transition-all">
                 <ShoppingBag className="w-4 h-4 mr-3" />
                 Track My Selection
              </Button>
           </Link>
           <Link href="/shop">
              <Button variant="luxury" size="lg" className="h-16 px-12 text-[10px] tracking-[0.3em] font-black uppercase">
                 Explore More Essences
                 <ArrowRight className="w-4 h-4 ml-3" />
              </Button>
           </Link>
        </div>

        <div className="pt-20 opacity-40">
           <p className="text-[8px] tracking-[0.4em] uppercase text-muted-foreground">EST. 2026 | MAISON SCÊNTIA | ARTISANS DE PARFUM</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-6 py-32 flex justify-center"><div className="animate-pulse w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
