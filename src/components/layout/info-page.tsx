import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GenericInfoPage({ 
  title, 
  subtitle, 
  content 
}: { 
  title: string, 
  subtitle: string, 
  content: React.ReactNode 
}) {
  return (
    <div className="container mx-auto px-6 py-32 max-w-4xl space-y-16 animate-in fade-in duration-1000">
      <div className="space-y-4 text-center">
         <Link href="/" className="inline-flex items-center gap-2 text-[8px] tracking-[0.4em] text-muted-foreground uppercase hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Return to Sanctuary
         </Link>
         <h1 className="font-playfair text-6xl md:text-8xl uppercase tracking-tighter">{title}</h1>
         <p className="text-[10px] tracking-[0.5em] text-primary font-black uppercase italic">{subtitle}</p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none font-playfair text-xl leading-relaxed italic text-muted-foreground">
         {content}
      </div>

      <div className="pt-20 border-t border-border/10 text-center opacity-40">
         <p className="text-[8px] tracking-[0.4em] uppercase">MAISON SCÊNTIA | ARTISANS DE PARFUM</p>
      </div>
    </div>
  );
}
