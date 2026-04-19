import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/features/shop/components/product-card";
import { getProducts } from "@/features/shop/actions";
import { SectionReveal } from "@/components/ui/section-reveal";
import { LuxuryMist } from "@/components/ui/luxury-mist";
import { HeroFloatingTokens } from "@/components/ui/hero-floating-tokens";

export default async function HomePage() {
  const featuredProducts = await getProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Cinematic Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
           <LuxuryMist />
           <HeroFloatingTokens />
           
           <Image 
             src="/images/hero-banner.png" 
             alt="Luxury Essence" 
             fill 
             sizes="100vw"
             priority
             className="object-cover opacity-60 scale-105 animate-slow-zoom"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-[2]" />
           
           <div className="relative z-10 text-center space-y-12 px-6 max-w-5xl">
              <div className="space-y-6">
                 <p className="text-[10px] tracking-[0.8em] text-primary font-black uppercase italic reveal-up">
                    L&rsquo;art de la Parfumerie
                 </p>
                 <h1 className="font-playfair text-5xl sm:text-7xl md:text-[10rem] text-white tracking-tighter leading-[0.85] uppercase">
                    Maison <br /> 
                    <span className="italic font-light text-primary/80">Scêntia</span>
                 </h1>
              </div>
              
              <div className="space-y-10">
                <p className="text-[11px] md:text-xs tracking-[0.5em] text-zinc-400 uppercase max-w-2xl mx-auto leading-loose font-medium">
                   Crafting liquid memories from the world&rsquo;s most rare and <br/>sacred olfactory foundations since 2026.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-4">
                   <Link href="/shop" className="group">
                     <div className="h-16 px-14 bg-white text-black text-[10px] font-black tracking-[0.5em] uppercase hover:bg-primary hover:text-white transition-all duration-700 relative overflow-hidden flex items-center justify-center">
                        <span className="relative z-10 flex items-center gap-4">
                          THE COLLECTION
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                        </span>
                        <div className="absolute inset-x-0 bottom-0 h-0 bg-black group-hover:h-full transition-all duration-700 opacity-10" />
                     </div>
                   </Link>
                   <button className="flex items-center gap-6 text-[10px] tracking-[0.5em] font-black uppercase text-white hover:text-primary transition-all group">
                      <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-xl group-hover:border-primary/40 group-hover:scale-110 transition-all duration-700 overflow-hidden relative">
                         <Play className="w-4 h-4 fill-current ml-1 relative z-10" />
                         <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full" />
                      </div>
                      <span className="border-b border-white/20 pb-1 group-hover:border-primary transition-colors">The Experience</span>
                   </button>
                </div>
              </div>
           </div>

           {/* Scroll Indicator */}
           <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8">
              <div className="w-[1px] h-24 bg-gradient-to-b from-primary via-primary/20 to-transparent relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll-down" />
              </div>
              <span className="text-[9px] tracking-[0.4em] text-zinc-500 uppercase font-bold">Infinite Journey</span>
           </div>
        </section>

        {/* Featured Collections */}
        <section className="py-40 px-6 md:px-12 bg-background overflow-hidden">
           <SectionReveal className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="space-y-4">
                 <h2 className="font-playfair text-5xl md:text-7xl uppercase tracking-tighter max-w-xl leading-[1.1]">The Curator&rsquo;s <br/>Selection</h2>
                 <p className="text-xs tracking-[0.4em] text-primary font-black uppercase italic">Limited Masterpieces</p>
              </div>
              <Link href="/shop" className="text-xs font-bold tracking-[0.2em] uppercase hover:text-primary transition-colors flex items-center gap-3 group">
                EXPLORE ALL
                <div className="w-8 h-[1px] bg-zinc-800 scale-x-50 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
           </SectionReveal>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {featuredProducts.slice(0, 4).map((p, i) => (
                <SectionReveal key={p.id} delay={i * 0.1}>
                  <ProductCard {...p} />
                </SectionReveal>
              ))}
           </div>
        </section>

        {/* Brand Philosophy - Parallax */}
        <section className="relative h-screen w-full flex items-center overflow-hidden">
           <Image 
             src="https://images.unsplash.com/photo-1557827983-012eb6ea8dc1?auto=format&fit=crop&q=80" 
             alt="Philosophy" 
             fill 
             sizes="100vw"
             className="object-cover opacity-10 filter grayscale"
           />
           <div className="container mx-auto px-6 md:px-12 relative z-10">
              <SectionReveal className="max-w-4xl space-y-16">
                 <h3 className="font-playfair text-6xl md:text-8xl tracking-tighter italic leading-[1.05] text-zinc-200">
                    &quot;A fragrance is the most intense form of memory, a spectral bridge between what is and what was.&quot;
                 </h3>
                 <div className="space-y-4 pt-12">
                    <p className="text-2xl tracking-[0.2em] text-primary font-serif italic">— Aurélien Scêntia</p>
                    <p className="text-xs tracking-[0.6em] text-zinc-500 uppercase font-black">Founder & Artistic Director</p>
                 </div>
              </SectionReveal>
           </div>
        </section>

        {/* Categories / Triptych */}
        <section className="grid grid-cols-1 md:grid-cols-3 h-screen">
           {[
             { 
               title: "THE NOIR", 
               sub: "Deep & Mysterious", 
               img: "/images/category-noir.png",
               href: "/shop?family=Woody"
             },
             { 
               title: "THE BLANC", 
               sub: "Ethereal & Pure", 
               img: "/images/category-blanc.png",
               href: "/shop?family=Fresh"
             },
             { 
               title: "THE OR", 
               sub: "Radiant & Opulent", 
               img: "/images/the-or.png",
               href: "/shop?is_featured=true"
             }
           ].map((c, i) => (
             <SectionReveal key={i} direction="none" delay={i * 0.2} className="h-full">
               <Link href={c.href} className="group relative h-full overflow-hidden flex items-center justify-center cursor-pointer">
                  <Image 
                    src={c.img} 
                    alt={c.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-primary/20 transition-colors duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
                  
                  <div className="relative text-center space-y-6 p-12 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                     <p className="text-[10px] tracking-[0.6em] text-primary font-black uppercase italic drop-shadow-lg">{c.sub}</p>
                     <h4 className="font-playfair text-6xl text-white tracking-widest uppercase drop-shadow-2xl">{c.title}</h4>
                     
                     <div className="pt-8 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                        <span className="inline-block border border-white/40 text-white backdrop-blur-md px-10 py-4 text-[10px] tracking-[0.4em] font-black uppercase hover:bg-white hover:text-black transition-all">
                           DISCOVER
                        </span>
                     </div>
                  </div>
               </Link>
             </SectionReveal>
           ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
