import { getProductBySlug, getRelatedProducts } from "@/features/shop/actions";
import { getProductReviews } from "@/features/reviews/actions";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "@/features/shop/components/product-details-client";
import { ProductCard } from "@/features/shop/components/product-card";
import { RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";

interface ProductReview {
   id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Not Found | SCÊNTIA" };

  return {
    title: `${product.name} | ${product.brand?.name} | SCÊNTIA`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images?.[0]?.url || ""],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }   const reviews = (await getProductReviews(product.id)) as ProductReview[];
   const relatedProducts = await getRelatedProducts(product.id, product.brand_id || "");

   const mainImage =
      product.images.find((image) => image.is_main)?.url || product.images[0]?.url || "";
  
   const topNotes = product.product_notes
      .filter((noteItem) => noteItem.note_type === "Top")
      .map((noteItem) => noteItem.note?.name)
      .filter((noteName): noteName is string => Boolean(noteName));

   const heartNotes = product.product_notes
      .filter((noteItem) => noteItem.note_type === "Heart")
      .map((noteItem) => noteItem.note?.name)
      .filter((noteName): noteName is string => Boolean(noteName));

   const baseNotes = product.product_notes
      .filter((noteItem) => noteItem.note_type === "Base")
      .map((noteItem) => noteItem.note?.name)
      .filter((noteName): noteName is string => Boolean(noteName));

  return (
    <div className="container mx-auto px-6 md:px-12 pt-32 pb-12 md:pt-40 md:pb-24 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
        {/* Left: Product Gallery */}
        <div className="space-y-6">
           <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-border/10 shadow-sm group">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
              />
              <div className="absolute top-8 left-8 px-5 py-2 bg-background/60 backdrop-blur-xl border border-white/10 text-[9px] tracking-[0.4em] text-foreground font-black uppercase">
                 {product.concentration}
              </div>
           </div>
           
           {/* Gallery Thumbs */}
           <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative aspect-square border border-border/10 overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-500 group">
                   <Image src={img.url} alt={`detail-${idx}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              ))}
           </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col gap-12 py-4">
           <div className="space-y-6">
              <div className="space-y-2">
                 <p className="text-[10px] tracking-[0.5em] text-primary font-black uppercase reveal-up">
                   {product.brand?.name}
                 </p>
                 <h1 className="font-playfair text-5xl md:text-7xl tracking-tighter leading-none reveal-up delay-100 uppercase">
                   {product.name}
                 </h1>
              </div>
              
              <div className="flex items-center gap-6 reveal-up delay-200">
                 <div className="flex text-primary/80">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                 </div>
                 <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase font-medium">
                   ({reviews.length} VERIFIED REVIEWS)
                 </span>
              </div>
           </div>

           <div className="reveal-up delay-300">
             <ProductDetailsClient product={product} variants={product.variants} />
           </div>

           <div className="space-y-8 reveal-up delay-400">
              <p className="text-xs leading-relaxed tracking-widest text-muted-foreground uppercase max-w-xl font-medium">
                {product.description}
              </p>
              
              <div className="grid grid-cols-2 gap-x-12 gap-y-6 pt-8 border-t border-border/10">
                 <div className="space-y-2">
                    <p className="text-[9px] tracking-[0.4em] font-black text-muted-foreground/60 uppercase">LONGEVITY</p>
                    <p className="text-[11px] tracking-[0.2em] font-bold uppercase text-foreground">{product.longevity}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[9px] tracking-[0.4em] font-black text-muted-foreground/60 uppercase">SILLAGE</p>
                    <p className="text-[11px] tracking-[0.2em] font-bold uppercase text-foreground">{product.sillage}</p>
                 </div>
              </div>
           </div>

           {/* Olfactory Pyramid Section - Elegant Glassmorphism */}
           <div className="space-y-10 p-12 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm border border-border/10 relative overflow-hidden group reveal-up delay-500">
              <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-primary/10 transition-all duration-[1000ms] group-hover:w-32 group-hover:h-32" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-primary/10 transition-all duration-[1000ms] group-hover:w-32 group-hover:h-32" />
              
              <h3 className="text-[10px] tracking-[0.5em] font-black uppercase text-primary border-b border-primary/10 pb-6">
                 OLFACTORY PYRAMID
              </h3>
              
              <div className="grid grid-cols-1 gap-10">
                 <div className="space-y-3">
                    <h4 className="text-[10px] tracking-[0.4em] font-black uppercase text-foreground">TOP NOTES</h4>
                    <p className="text-[11px] tracking-widest text-muted-foreground uppercase leading-loose font-medium">{topNotes?.join(", ") || "Sparkling Essences"}</p>
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-[10px] tracking-[0.4em] font-black uppercase text-foreground">HEART NOTES</h4>
                    <p className="text-[11px] tracking-widest text-muted-foreground uppercase leading-loose font-medium">{heartNotes?.join(", ") || "Eternal Blooms"}</p>
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-[10px] tracking-[0.4em] font-black uppercase text-foreground">BASE NOTES</h4>
                    <p className="text-[11px] tracking-widest text-muted-foreground uppercase leading-loose font-medium">{baseNotes?.join(", ") || "Sacred Foundations"}</p>
                 </div>
              </div>
           </div>

           {/* Trust Badges */}
           <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border/10 reveal-up delay-600">
              <div className="flex flex-col items-center gap-3 text-center transition-colors hover:text-primary group">
                 <div className="p-3 rounded-full bg-zinc-50 dark:bg-zinc-950 group-hover:bg-primary/5 transition-colors">
                    <Truck className="w-5 h-5 text-primary/40 stroke-[1.5]" />
                 </div>
                 <span className="text-[8px] tracking-[0.3em] uppercase font-black text-muted-foreground">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-3 text-center transition-colors hover:text-primary group">
                 <div className="p-3 rounded-full bg-zinc-50 dark:bg-zinc-950 group-hover:bg-primary/5 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-primary/40 stroke-[1.5]" />
                 </div>
                 <span className="text-[8px] tracking-[0.3em] uppercase font-black text-muted-foreground">Authentic Only</span>
              </div>
              <div className="flex flex-col items-center gap-3 text-center transition-colors hover:text-primary group">
                 <div className="p-3 rounded-full bg-zinc-50 dark:bg-zinc-950 group-hover:bg-primary/5 transition-colors">
                    <RotateCcw className="w-5 h-5 text-primary/40 stroke-[1.5]" />
                 </div>
                 <span className="text-[8px] tracking-[0.3em] uppercase font-black text-muted-foreground">Easy Returns</span>
              </div>
           </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-60 space-y-20 reveal-up">
         <div className="text-center space-y-4">
            <h3 className="text-[10px] tracking-[0.6em] font-black text-primary uppercase">YOU MAY ALSO SEEK</h3>
            <p className="font-playfair text-5xl md:text-6xl uppercase tracking-tighter italic">Related Essences</p>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {relatedProducts.length > 0 ? (
               relatedProducts.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    {...p}
                  />
               ))
            ) : (
               [1, 2, 3, 4].map((i) => (
                 <div key={i} className="border border-border/10 p-4 aspect-[3/4] bg-zinc-50/50 dark:bg-zinc-950/50 animate-pulse" />
               ))
            )}
         </div>
      </div>
    </div>
  );
}

