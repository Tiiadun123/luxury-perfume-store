import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 py-20 px-6 md:px-12 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="font-playfair text-2xl tracking-[0.3em] font-bold">
            SCÊNTIA
          </Link>
          <p className="text-xs leading-relaxed text-muted-foreground uppercase tracking-widest max-w-xs">
            Artisanal perfumery inspired by French heritage and the poetry of rare essences.
          </p>
        </div>

        {/* Links Columns */}
        <div className="space-y-6">
          <h4 className="text-[10px] tracking-[0.3em] font-bold uppercase text-primary">COLLECTIONS</h4>
          <ul className="space-y-4 text-[10px] tracking-[0.2em] font-medium text-muted-foreground uppercase">
             <li><Link href="/shop?category=rare" className="hover:text-foreground">RARE ESSENCE</Link></li>
             <li><Link href="/shop?category=exclusive" className="hover:text-foreground">EXCLUSIVE SCENTS</Link></li>
             <li><Link href="/shop?category=samples" className="hover:text-foreground">SAMPLES EDIT</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] tracking-[0.3em] font-bold uppercase text-primary">CLIENT SERVICES</h4>
          <ul className="space-y-4 text-[10px] tracking-[0.2em] font-medium text-muted-foreground uppercase">
             <li><Link href="/shipping" className="hover:text-foreground">SHIPPING & RETURNS</Link></li>
             <li><Link href="/care" className="hover:text-foreground">FRAGRANCE CARE</Link></li>
             <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] tracking-[0.3em] font-bold uppercase text-primary">THE HOUSE</h4>
          <ul className="space-y-4 text-[10px] tracking-[0.2em] font-medium text-muted-foreground uppercase">
             <li><Link href="/about" className="hover:text-foreground">OUR JOURNEY</Link></li>
             <li><Link href="/artisans" className="hover:text-foreground">OUR ARTISANS</Link></li>
             <li><Link href="/contact" className="hover:text-foreground">BOUTIQUES</Link></li>
          </ul>
        </div>
      </div>

      <div className="pt-20 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-6 mt-20">
        <p className="text-[8px] tracking-[0.2em] text-muted-foreground uppercase">
          © 2026 SCÊNTIA PARIS LUXE. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8 text-[8px] tracking-[0.2em] text-muted-foreground uppercase">
           <Link href="/privacy" className="hover:text-foreground">PRIVACY POLICY</Link>
           <Link href="/terms" className="hover:text-foreground">TERMS OF USE</Link>
        </div>
      </div>
    </footer>
  );
}
