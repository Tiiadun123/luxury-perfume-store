import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 py-24 px-6 md:px-12 mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <Link href="/" className="font-playfair text-3xl tracking-[0.4em] font-bold">
              SCÊNTIA
            </Link>
            <p className="text-xs leading-relaxed text-zinc-400 uppercase tracking-[0.2em] max-w-sm font-medium">
              Artisanal perfumery inspired by French heritage and the poetry of rare essences. Crafted for the olfactory voyagers.
            </p>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-6 pt-4">
             <h4 className="text-xs tracking-[0.4em] font-black uppercase text-primary">THE MAISON GAZETTE</h4>
             <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-bold">
                Subscribe to receive private invitations and olfactory revelations.
             </p>
             <form className="flex max-w-md group border-b border-border/40 focus-within:border-primary transition-colors duration-500">
               <input 
                  type="email" 
                  placeholder="E-MAIL ADDRESS" 
                  className="bg-transparent border-none py-4 text-[10px] tracking-[0.3em] font-bold uppercase w-full focus:outline-none placeholder:text-zinc-700"
               />
               <button 
                  type="submit"
                  className="px-6 text-[10px] tracking-[0.3em] font-black uppercase hover:text-primary transition-colors py-4"
               >
                  JOIN
               </button>
             </form>
          </div>
        </div>

        {/* Links Columns */}
        <div className="space-y-8">
          <h4 className="text-xs tracking-[0.4em] font-black uppercase text-primary">COLLECTIONS</h4>
          <ul className="space-y-4 text-xs tracking-[0.2em] font-bold text-zinc-400 uppercase">
             <li><Link href="/shop?category=rare" className="hover:text-primary transition-colors">RARE ESSENCE</Link></li>
             <li><Link href="/shop?category=exclusive" className="hover:text-primary transition-colors">EXCLUSIVE SCENTS</Link></li>
             <li><Link href="/shop?category=samples" className="hover:text-primary transition-colors">SAMPLES EDIT</Link></li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-xs tracking-[0.4em] font-black uppercase text-primary">CLIENT SERVICES</h4>
          <ul className="space-y-4 text-xs tracking-[0.2em] font-bold text-zinc-400 uppercase">
             <li><Link href="/shipping" className="hover:text-primary transition-colors">SHIPPING & RETURNS</Link></li>
             <li><Link href="/care" className="hover:text-primary transition-colors">FRAGRANCE CARE</Link></li>
             <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-xs tracking-[0.4em] font-black uppercase text-primary">THE HOUSE</h4>
          <ul className="space-y-4 text-xs tracking-[0.2em] font-bold text-zinc-400 uppercase">
             <li><Link href="/about" className="hover:text-primary transition-colors">OUR JOURNEY</Link></li>
             <li><Link href="/artisans" className="hover:text-primary transition-colors">OUR ARTISANS</Link></li>
             <li><Link href="/contact" className="hover:text-primary transition-colors">BOUTIQUES</Link></li>
          </ul>
        </div>
      </div>

      <div className="pt-20 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-8 mt-24">
        <p className="text-[9px] tracking-[0.3em] text-zinc-600 uppercase font-bold">
          © 2026 SCÊNTIA PARIS LUXE. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-10 text-[9px] tracking-[0.3em] text-zinc-600 uppercase font-bold">
           <Link href="/privacy" className="hover:text-foreground underline-offset-4 hover:underline">PRIVACY POLICY</Link>
           <Link href="/terms" className="hover:text-foreground underline-offset-4 hover:underline">TERMS OF USE</Link>
        </div>
      </div>
    </footer>
  );
}

