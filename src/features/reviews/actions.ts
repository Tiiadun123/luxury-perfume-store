"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProductReviews(productId: string) {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      profile:profiles(full_name)
    `)
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return reviews || [];
}

export async function submitReview(data: {
  productId: string;
  rating: number;
  comment: string;
  longevityRating?: number;
  sillageRating?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Please sign in to share your olfactory journey." };

  const { error } = await supabase
    .from("reviews")
    .insert({
      profile_id: user.id,
      product_id: data.productId,
      rating: data.rating,
      comment: data.comment,
      longevity_rating: data.longevityRating,
      sillage_rating: data.sillageRating,
      is_approved: true // Simplified for now, usually needs moderation
    });

  if (!error) revalidatePath(`/product/[slug]`, "layout");
  return { success: !error, error: error?.message };
}
