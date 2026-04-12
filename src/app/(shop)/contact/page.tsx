export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="font-playfair text-6xl uppercase">The Boutiques</h1>
        <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Global Presence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-12 border border-border/10 bg-zinc-950/20 backdrop-blur-sm space-y-6">
          <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-primary">Parisian Flagship</h2>
          <div className="space-y-4 text-[10px] tracking-widest uppercase text-muted-foreground leading-relaxed">
             <p>24 Rue de la Paix<br/>75002 Paris, France</p>
             <p>Mon - Sat: 10:00 - 19:00</p>
             <p>Tel: +33 1 42 61 57 43</p>
          </div>
        </div>

        <div className="p-12 border border-border/10 bg-zinc-950/20 backdrop-blur-sm space-y-6">
          <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-primary">Digital Concierge</h2>
          <div className="space-y-4 text-[10px] tracking-widest uppercase text-muted-foreground leading-relaxed">
             <p>Email: concierge@scentia.fr</p>
             <p>For wholesale inquiries:<br/>orders@scentia.fr</p>
             <p>Response within 24 hours</p>
          </div>
        </div>
      </div>

      <div className="pt-12 text-center">
         <p className="text-[9px] tracking-[0.5em] text-muted-foreground uppercase italic">Crafted by Hand, Scented by Memory</p>
      </div>
    </div>
  );
}
