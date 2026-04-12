"use server";

import { createClient } from "@/utils/supabase/server";
import { ProductListItem } from "@/features/shop/actions";

interface QuizAnswers {
  mood: string;
  setting: string;
  personality: string;
}

interface QuizProductRow {
  id: string;
  name: string;
  slug: string;
  brand:
    | {
        name: string | null;
      }
    | {
        name: string | null;
      }[]
    | null;
  variants: {
    price: number | null;
  }[] | null;
  images: {
    url: string | null;
  }[] | null;
}

export async function getQuizRecommendations(answers: QuizAnswers): Promise<ProductListItem[]> {
  const supabase = await createClient();

  // Simple logic mapping answers to scent families
  let family = "Floral";
  if (answers.mood === "Powerful") family = "Woody";
  if (answers.mood === "Mysterious") family = "Oriental";
  if (answers.setting === "Night") family = "Leather";

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, 
      brand:brands(name),
      variants:product_variants(price),
      images:product_images(url)
    `)
    .eq("scent_family", family)
    .eq("is_active", true)
    .limit(3);

  if (error) return [];
  
  return (data as QuizProductRow[]).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: (Array.isArray(product.brand) ? product.brand[0]?.name : product.brand?.name) || "SCENTIA",
    price: product.variants?.[0]?.price || 0,
    image: product.images?.[0]?.url || "",
    notes: [],
  }));
}
