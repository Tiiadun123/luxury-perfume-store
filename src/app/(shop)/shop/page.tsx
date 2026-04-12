import { ShopSidebar } from "@/features/shop/components/shop-sidebar";
import { ProductCard } from "@/features/shop/components/product-card";
import { getProducts } from "@/features/shop/actions";
import { ShopControls } from "@/features/shop/components/shop-controls";
import { LoadMore } from "@/features/shop/components/load-more";
import Image from "next/image";
import { Metadata } from "next";

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
  const sortBy = typeof params.sort === 'string' ? params.sort : undefined;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 12;

  const products = await getProducts({ 
    category,
    gender, 
    scent_family, 
    sortBy, 
    limit 
  });

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
        {/* Sidebar Filters */}
        <ShopSidebar />

        {/* Main Content */}
        <div className="flex-1 space-y-16">
          {/* Header / Toolbar */}
          <ShopControls totalFound={products.length} />

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24 reveal-up delay-300">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
            
            {products.length === 0 && (
              <div className="col-span-full py-60 text-center space-y-8 animate-in zoom-in-95 duration-700">
                 <div className="w-20 h-20 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-10">
                    <span className="text-primary/20 text-4xl">?</span>
                 </div>
                 <p className="font-playfair text-3xl text-muted-foreground italic tracking-tight">
                   The vault is currently sealed for this selection.
                 </p>
                 <a href="/shop" className="text-[10px] tracking-[0.4em] text-primary font-black uppercase hover:underline">Return to All</a>
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
