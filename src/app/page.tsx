import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/features/shop/components/product-card";
import { getProducts } from "@/features/shop/actions";

export default async function HomePage() {
  const featuredProducts = await getProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Cinematic Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
           <Image 
             src="/images/hero-banner.png" 
             alt="Luxury Essence" 
             fill 
             sizes="100vw"
             priority
             className="object-cover scale-105 animate-slow-zoom"
           />
           <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
           
           <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl">
              <div className="space-y-4">
                 <p className="text-[10px] tracking-[0.5em] text-primary font-black uppercase reveal-up">EST. 2026 PARIS</p>
                 <h1 className="font-playfair text-7xl md:text-9xl text-white tracking-tighter leading-none reveal-up delay-100">
                    Maison <br /> <span className="italic">Scêntia</span>
                 </h1>
              </div>
              
              <p className="text-xs md:text-sm tracking-[0.3em] text-zinc-200 uppercase max-w-xl mx-auto leading-loose reveal-up delay-200">
                 Crafting liquid memories from the world&rsquo;s most rare and sacred olfactory foundations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 reveal-up delay-300">
                 <Link href="/shop">
                   <Button variant="luxury" size="lg" className="h-16 px-12 group">
                       <span className="flex items-center gap-3">
                         DISCOVER THE VAULT
                         <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                       </span>
                   </Button>
                 </Link>
                 <button className="flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white hover:text-primary transition-colors">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                       <Play className="w-4 h-4 fill-current ml-1" />
                    </div>
                    The Film
                 </button>
              </div>
           </div>

           {/* Scroll Indicator */}
           <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce">
              <span className="text-[8px] tracking-[0.4em] text-white/40 uppercase">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
           </div>
        </section>

        {/* Featured Collections */}
        <section className="py-32 px-6 md:px-12 bg-background">
           <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="space-y-4">
                 <h2 className="font-playfair text-5xl md:text-6xl uppercase tracking-tight">The 2026 Selection</h2>
                 <p className="text-[10px] tracking-[0.4em] text-primary font-black uppercase italic">Current Masterpieces</p>
              </div>
              <Link href="/shop" className="text-[10px] font-bold tracking-widest uppercase hover:underline">Explore All Essences</Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {featuredProducts.slice(0, 4).map((p) => (
                <ProductCard 
                  key={p.id} 
                  id={p.id}
                  name={p.name}
                  brand={p.brand}
                  price={p.price}
                  image={p.image}
                  notes={p.notes}
                  slug={p.slug}
                />
              ))}
           </div>
        </section>

        {/* Brand Philosophy - Parallax */}
        <section className="relative h-[80vh] w-full flex items-center">
           <Image 
             src="/images/hero-banner.png" 
             alt="Philosophy" 
             fill 
             sizes="100vw"
             className="object-cover opacity-20 filter grayscale"
           />
           <div className="container mx-auto px-6 md:px-12 relative z-10">
              <div className="max-w-3xl space-y-12">
                 <h3 className="font-playfair text-6xl md:text-7xl tracking-tighter italic leading-tight">
                    &quot;A fragrance is more than an essence; it is a portal to a time forgotten.&quot;
                 </h3>
                 <div className="space-y-4">
                    <p className="text-xl tracking-widest text-primary font-serif">— Aurélien Scêntia</p>
                    <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Master Perfumer & Founder</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Categories / Triptych */}
        <section className="grid grid-cols-1 md:grid-cols-3 h-[90vh]">
           {[
             { title: "THE NOIR", sub: "Deep & Mysterious", img: "/images/category-noir.png" },
             { title: "THE BLANC", sub: "Ethereal & Pure", img: "/images/category-blanc.png" },
             { title: "THE OR", sub: "Radiant & Opulent", img: "/images/category-or.png" }
           ].map((c, i) => (
             <div key={i} className="group relative overflow-hidden flex items-center justify-center">
                <Image 
                  src={c.img} 
                  alt={c.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-700" />
                <div className="relative text-center space-y-4">
                   <p className="text-[8px] tracking-[0.5em] text-primary font-black uppercase italic">{c.sub}</p>
                   <h4 className="font-playfair text-5xl text-white tracking-widest">{c.title}</h4>
                   <Button variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 mt-6 border-white/40 text-white rounded-none h-12">
                      DISCOVER
                   </Button>
                </div>
             </div>
           ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
