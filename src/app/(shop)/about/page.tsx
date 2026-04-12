import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 space-y-16">
      <div className="space-y-4 text-center">
        <h1 className="font-playfair text-6xl uppercase tracking-tighter">Our Journey</h1>
        <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase italic">Heritage & Artistry</p>
      </div>

      <div className="aspect-[21/9] relative bg-zinc-900 border border-border/10 overflow-hidden">
        {/* Placeholder for a beautiful heritage image */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-zinc-900/50 to-background">
          <p className="text-[10px] tracking-[1em] text-white/20 font-black uppercase">Established 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-playfair text-3xl uppercase">The Olfactory Vision</h2>
          <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest text-justify">
            Founded in the heart of Paris, Maison Scêntia was born from a singular vision: to treat fragrance not as a commodity, but as a living poem. We collaborate with master artisans who understand the silent language of rare woods, delicate florals, and ancient resins.
          </p>
        </div>
        <div className="space-y-6 bg-zinc-950/50 p-12 border border-border/5">
             <h3 className="text-[10px] tracking-[0.3em] font-black uppercase text-primary">Our Ethos</h3>
             <ul className="space-y-4 text-[10px] tracking-widest uppercase text-muted-foreground">
                <li>• 100% Artisanal Sourcing</li>
                <li>• Sustainable Luxury</li>
                <li>• Cultural Preservation</li>
                <li>• Olfactory Innovation</li>
             </ul>
        </div>
      </div>

      <div className="text-center pt-12">
        <Link 
          href="/shop" 
          className={cn(
            buttonVariants({ variant: "luxury", size: "lg" }),
            "text-[10px] tracking-widest flex items-center justify-center mx-auto w-fit px-12"
          )}
        >
          EXPLORE THE COLLECTION
        </Link>
      </div>
    </div>
  );
}
