"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "../actions";

interface ProductReview {
   id: string;
   created_at: string;
   rating: number;
   comment: string;
   profile: {
      full_name: string | null;
   } | null;
}

interface ReviewSectionProps {
  productId: string;
   reviews: ProductReview[];
}

export function ReviewSection({ productId, reviews }: ReviewSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async () => {
    if (!comment) return;
    startTransition(async () => {
      const result = await submitReview({ productId, rating, comment });
      if (result.success) {
        setComment("");
        setRating(5);
        alert("The house thanks you for your testimony.");
      } else {
        alert(result.error);
      }
    });
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  return (
    <div className="space-y-24 py-32 border-t border-border/20">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-20">
        
        {/* Rating Summary & Distribution */}
        <div className="space-y-12 w-full lg:w-[400px]">
           <div className="space-y-6">
              <h2 className="font-playfair text-5xl uppercase tracking-tighter">The Testimony</h2>
              <div className="flex items-center gap-6">
                 <span className="text-6xl font-playfair italic leading-none">{averageRating}</span>
                 <div className="space-y-1">
                    <div className="flex text-primary">
                       {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={`w-3 h-3 ${Number(averageRating) >= i ? "fill-current" : "opacity-20"}`} />
                       ))}
                    </div>
                    <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase font-black">BASED ON {totalReviews} WHISPERS</p>
                 </div>
              </div>
           </div>

           {/* Distribution Bars */}
           <div className="space-y-4">
              {ratingCounts.map(({ star, count }) => {
                 const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                 return (
                    <div key={star} className="flex items-center gap-4 group">
                       <span className="text-[10px] tracking-widest font-bold w-12 uppercase">{star} STAR</span>
                       <div className="flex-1 h-[2px] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                          <div 
                             className="h-full bg-primary/40 transition-all duration-1000 group-hover:bg-primary"
                             style={{ width: `${percentage}%` }}
                          />
                       </div>
                       <span className="text-[10px] tracking-widest font-black text-zinc-500 w-8 text-right uppercase">{count}</span>
                    </div>
                 );
              })}
           </div>

           <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase leading-relaxed font-medium italic">
              Each testimony is a sacred record of an olfactory journey through our maison&rsquo;s heritage.
           </p>
        </div>

        {/* Submit Review Form - Luxury Styled */}
        <div className="flex-1 w-full space-y-10 bg-zinc-50/50 dark:bg-zinc-950/50 p-12 border border-border/10 backdrop-blur-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-primary/10 transition-all duration-700 group-hover:w-20 group-hover:h-20" />
           
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs tracking-[0.4em] font-black uppercase text-primary">ADD YOUR TESTIMONY</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex text-primary">
                       {[1, 2, 3, 4, 5].map((i) => (
                          <button key={i} onClick={() => setRating(i)}>
                             <Star className={`w-4 h-4 transition-all duration-300 ${rating >= i ? "fill-current scale-110" : "opacity-20"}`} />
                          </button>
                       ))}
                    </div>
                    <span className="text-[10px] tracking-widest uppercase font-black text-zinc-400">{rating}/5 RATING</span>
                 </div>
              </div>
              <Textarea 
                placeholder="DESCRIBE THE OLFACTORY JOURNEY..." 
                className="min-h-[160px] bg-transparent border-border/20 uppercase text-xs tracking-widest p-8 focus:border-primary/40 transition-colors placeholder:text-zinc-700 rounded-none resize-none leading-relaxed"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button 
                variant="luxury" 
                className="w-full h-16 text-xs tracking-[0.5em] font-black uppercase"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? "DOCUMENTING..." : "COMMIT TO HISTORY"}
              </Button>
           </div>
        </div>
      </div>

      {/* Review List - Artistic Masonry-like Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
         {reviews.length === 0 ? (
            <div className="col-span-full py-32 text-center border border-dashed border-border/10 group hover:border-primary/20 transition-colors">
               <p className="font-playfair text-2xl italic text-zinc-500 uppercase tracking-widest">
                  No testimonies have been whispered yet. Be the first explorer.
               </p>
            </div>
         ) : (
            reviews.map((review) => (
               <div key={review.id} className="space-y-8 p-12 border border-border/5 bg-zinc-50/30 dark:bg-zinc-950/10 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all duration-500 group">
                  <div className="flex justify-between items-start">
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <p className="text-xs font-black tracking-[0.3em] uppercase text-foreground">{review.profile?.full_name || "Anonymous Seeker"}</p>
                           <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
                        </div>
                        <p className="text-[10px] tracking-widest text-zinc-500 uppercase italic font-bold leading-none">
                           {new Date(review.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                     </div>
                     <div className="flex text-primary/40 group-hover:text-primary transition-colors">
                        {[1, 2, 3, 4, 5].map((i) => (
                           <Star key={i} className={`w-2.5 h-2.5 ${review.rating >= i ? "fill-current" : "opacity-0"}`} />
                        ))}
                     </div>
                  </div>
                  
                  <div className="relative">
                     <div className="absolute -left-6 top-0 text-3xl font-playfair text-primary/10 tracking-tighter italic select-none">&ldquo;</div>
                     <p className="text-xs tracking-widest text-zinc-300 uppercase leading-[2.2] font-medium pl-2 italic">
                        {review.comment}
                     </p>
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
