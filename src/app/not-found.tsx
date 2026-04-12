import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-12">
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.5em] text-primary font-black uppercase italic">Error 404</p>
            <h1 className="font-playfair text-6xl md:text-8xl tracking-tighter leading-none">
              Lost in <br /> <span className="italic text-zinc-500">The Mist</span>
            </h1>
          </div>
          
          <div className="w-px h-24 bg-gradient-to-b from-primary/40 to-transparent mx-auto" />
          
          <p className="text-sm tracking-widest text-muted-foreground uppercase leading-relaxed max-w-sm mx-auto">
            The essence you seek has evaporated or never existed in our collection.
          </p>
          
          <div className="pt-8">
            <Link href="/">
              <Button variant="luxury" size="lg" className="h-16 px-12 group">
                <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
                RETURN TO THE MAISON
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
