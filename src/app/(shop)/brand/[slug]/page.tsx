import { getBrandBySlug, getProductsByBrand } from "@/features/shop/actions";
import { ProductCard } from "@/features/shop/components/product-card";
import { notFound } from "next/navigation";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return notFound();
  }

  const products = await getProductsByBrand(brand.id);

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 space-y-20">
      {/* Brand Hero */}
      <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto py-10">
         <div className="w-24 h-[1px] bg-primary/40" />
         <div className="space-y-4">
            <h1 className="font-playfair text-6xl md:text-8xl tracking-tighter uppercase font-medium">
              {brand.name}
            </h1>
            <p className="text-xs tracking-[0.5em] text-primary font-bold uppercase">
              La Maison de Parfum
            </p>
         </div>
         <p className="text-sm leading-relaxed tracking-widest text-muted-foreground uppercase">
           {brand.description || "Discover the unparalleled excellence and heritage of our master perfumers. Each scent is a narrative of elegance and refined artistry."}
         </p>
         <div className="w-24 h-[1px] bg-primary/40" />
      </div>

      {/* Brand Products Grid */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b border-border/20 pb-8">
           <div className="space-y-1">
              <h2 className="text-[10px] tracking-[0.4em] text-primary/80 uppercase font-black font-sans">
                THE COLLECTION
              </h2>
           </div>
           <div className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground uppercase">
              {products.length} CREATIONS FOUND
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        {products.length === 0 && (
           <div className="py-40 text-center border border-dashed border-border/40">
              <p className="font-playfair text-2xl text-muted-foreground italic uppercase tracking-widest">
                The House has no public creations currently.
              </p>
           </div>
        )}
      </div>
    </div>
  );
}
