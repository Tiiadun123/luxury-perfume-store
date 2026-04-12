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

  return (
    <div className="space-y-16 py-20 border-t border-border/20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-4 max-w-sm">
           <h2 className="font-playfair text-4xl uppercase">The Testimony</h2>
           <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase leading-relaxed">
                   Share your olfactory soul&rsquo;s interpretation of this essence. Your words guide other seekers.
           </p>
        </div>

        {/* Submit Review Form */}
        <div className="flex-1 w-full space-y-6 bg-zinc-50 dark:bg-zinc-950 p-8 border border-border/10">
           <div className="flex items-center gap-4">
              <div className="flex text-primary">
                 {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} onClick={() => setRating(i)}>
                       <Star className={`w-4 h-4 ${rating >= i ? "fill-current" : "opacity-20"}`} />
                    </button>
                 ))}
              </div>
              <span className="text-[10px] tracking-widest uppercase font-black">{rating}/5 RATING</span>
           </div>
           <Textarea 
             placeholder="DESCRIBE THE JOURNEY..." 
             className="min-h-[120px] bg-transparent border-border/20 uppercase text-[10px] tracking-widest p-6"
             value={comment}
             onChange={(e) => setComment(e.target.value)}
           />
           <Button 
             variant="luxury" 
             className="w-full h-14 text-[10px] tracking-[0.4em] font-black uppercase"
             onClick={handleSubmit}
             disabled={isPending}
           >
             {isPending ? "DOCUMENTING..." : "SHARE YOUR TESTIMONY"}
           </Button>
        </div>
      </div>

      {/* Review List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         {reviews.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-border/20">
               <p className="font-playfair text-xl italic text-muted-foreground uppercase tracking-widest">
                  No testimonies have been whispered yet.
               </p>
            </div>
         ) : (
            reviews.map((review) => (
               <div key={review.id} className="space-y-6 p-8 border border-border/5 bg-zinc-50 dark:bg-zinc-950/20">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <p className="text-[10px] font-black tracking-widest uppercase">{review.profile?.full_name || "Anonymous Seeker"}</p>
                           <ShieldCheck className="w-3 h-3 text-primary/60" />
                        </div>
                        <p className="text-[8px] tracking-widest text-muted-foreground uppercase italic">{new Date(review.created_at).toLocaleDateString()}</p>
                     </div>
                     <div className="flex text-primary">
                        {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                     </div>
                  </div>
                  <p className="text-xs leading-loose tracking-widest text-muted-foreground uppercase italic underline decoration-primary/10 underline-offset-4">
                              &quot;{review.comment}&quot;
                  </p>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
