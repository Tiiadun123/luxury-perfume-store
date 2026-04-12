export default function CarePage() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="font-playfair text-6xl uppercase">Fragrance Care</h1>
        <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Preserving the Essence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Temperature", text: "Maintain a stable 15-20°C. Extreme heat or cold can shatter the molecular balance of delicate Top Notes." },
          { title: "Luminosity", text: "UVA/UVB rays act as catalysts for oxidation. Keep your bottle in its original box or a dark drawer." },
          { title: "Application", text: "Pulse points are traditional, but spraying on hair and natural fabrics like silk of wool provides the most authentic longevity." }
        ].map((item, i) => (
          <div key={i} className="p-8 border border-border/5 bg-zinc-950 space-y-4">
            <h2 className="text-[11px] font-black tracking-widest uppercase text-primary">{item.title}</h2>
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
