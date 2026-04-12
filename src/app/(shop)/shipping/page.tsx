export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 space-y-12">
      <div className="space-y-4">
        <h1 className="font-playfair text-5xl uppercase">Shipping & Returns</h1>
        <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Expedited Elegance</p>
      </div>

      <div className="space-y-8 border-t border-border/10 pt-12">
        <section className="space-y-4">
          <h2 className="text-[11px] font-black tracking-widest uppercase text-primary">Global Concierge Shipping</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] leading-loose">
            Maison Scêntia offers complimentary express shipping on all domestic orders over $200. Every fragrance is encased in double-walled insulation to preserve the integrity of the essence during transit.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[11px] font-black tracking-widest uppercase text-primary">The Art of Return</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] leading-loose">
            Due to the delicate nature of artisanal perfumes, we only accept returns for unopened and sealed products within 14 days of receipt. Our signature 2ml discovery vials are included with every 50ml or 100ml purchase—we invite you to experience the scent via the vial before breaking the seal of the full bottle.
          </p>
        </section>

        <div className="bg-zinc-950 p-8 border border-border/5 space-y-4">
             <h3 className="text-[10px] tracking-widest uppercase font-bold">Delivery Times</h3>
             <div className="grid grid-cols-2 gap-4 text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                <div>Standard (France)</div>
                <div className="text-right">2-3 Business Days</div>
                <div>Express (International)</div>
                <div className="text-right">4-7 Business Days</div>
             </div>
        </div>
      </div>
    </div>
  );
}
