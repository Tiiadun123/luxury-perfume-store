export default function ArtisansPage() {
  const artisans = [
    { name: "Lucille Voisin", role: "Master Nez", specialty: "Rare Botanicals" },
    { name: "Marc-Antoine", role: "Glass Artisan", specialty: "Hand-Blown Flacons" },
    { name: "Sébastien Chen", role: "Ethnobotanist", specialty: "Sustainable Sourcing" }
  ];

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="font-playfair text-6xl uppercase">The Artisans</h1>
        <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">The Souls Behind the Scents</p>
      </div>

      <div className="space-y-24">
        {artisans.map((a, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center gap-12 group">
            <div className="w-full md:w-1/2 aspect-square bg-zinc-900 border border-border/10 overflow-hidden relative">
               {/* Visual placeholder */}
               <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
               <h2 className="font-playfair text-3xl uppercase tracking-tighter">{a.name}</h2>
               <div className="space-y-4">
                 <p className="text-[10px] tracking-[0.3em] font-black uppercase text-primary">{a.role}</p>
                 <p className="text-xs text-muted-foreground tracking-widest uppercase italic">{a.specialty}</p>
                 <p className="text-sm text-muted-foreground uppercase tracking-widest leading-loose">
                   Bringing decades of heritage and precision to every drop. Their expertise ensures that Maison Scêntia remains at the pinnacle of luxury perfumery.
                 </p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
