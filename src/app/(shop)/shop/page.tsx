import { ShopSidebar } from "@/features/shop/components/shop-sidebar";
import { ProductCard } from "@/features/shop/components/product-card";
import { getProducts, getBrands, getCategories } from "@/features/shop/actions";
import { ShopControls } from "@/features/shop/components/shop-controls";
import { LoadMore } from "@/features/shop/components/load-more";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "The Vault | Curated Luxury Scents",
  description: "Explore our masterfully curated collection of rare perfumes and artisanal fragrances. Filter by scent family, concentration, or brand to find your signature essence.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const gender = typeof params.gender === 'string' ? params.gender : undefined;
  const scent_family = typeof params.family === 'string' ? params.family : undefined;
  const concentration = typeof params.concentration === 'string' ? params.concentration : undefined;
   const sortBy = typeof params.sort === 'string' ? params.sort : undefined;
  const is_featured = params.featured === 'true';
  const brand = typeof params.brand === 'string' ? params.brand : undefined;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 12;

  const products = await getProducts({ 
    category,
    gender, 
    scent_family,
    brand,
    concentration,
    is_featured,
    sortBy, 
    limit 
  });

  const brands = await getBrands();
  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-1000">
      {/* Immersive Shop Header */}
      <section className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80" 
          alt="Shop Essence" 
          fill 
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        
        <div className="relative z-10 text-center space-y-4 px-6 mt-12">
            <p className="text-[10px] tracking-[0.5em] text-primary font-black uppercase reveal-up italic">The Collection</p>
            <h1 className="font-playfair text-6xl md:text-7xl text-white tracking-tighter uppercase font-medium reveal-up delay-100 italic">
               The Vault
            </h1>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 py-20 flex flex-col lg:flex-row gap-16">
        <Suspense fallback={<div className="w-72 h-screen bg-zinc-100/10 animate-pulse" />}>
          {/* Sidebar Filters */}
          <ShopSidebar brands={brands} />
        </Suspense>

        {/* Main Content */}
        <div className="flex-1 space-y-16">
          <Suspense fallback={<div className="w-full h-20 bg-zinc-100/10 animate-pulse" />}>
            {/* Header / Toolbar */}
            <ShopControls totalFound={products.length} />
          </Suspense>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24 reveal-up delay-300">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
            
            {products.length === 0 && (
              <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000 relative">
                 <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none -rotate-6">
                    <span className="font-playfair text-[20vw] uppercase font-bold tracking-tighter italic">EMPTY</span>
                 </div>
                 
                 <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                       <h2 className="text-xs tracking-[0.8em] font-black uppercase text-primary">SEALED VAULT</h2>
                       <p className="font-playfair text-4xl md:text-5xl italic text-zinc-400 uppercase tracking-tighter max-w-xl mx-auto leading-[1.1]">
                         This specific essence remains hidden in our archives.
                       </p>
                    </div>

                    <div className="w-16 h-[1px] bg-primary/20 mx-auto" />

                    <div className="space-y-6">
                       <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase font-bold">Try alternative filters or seek a different path.</p>
                       <Link 
                          href="/shop" 
                          className="inline-flex items-center gap-4 text-xs tracking-[0.5em] text-primary font-black uppercase group"
                       >
                          <span>REFRESH VAULT</span>
                          <span className="w-12 h-[1px] bg-primary scale-x-50 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                       </Link>
                    </div>
                 </div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {products.length >= limit && (
            <LoadMore currentLimit={limit} />
          )}
        </div>
      </div>
    </div>
  );
}
