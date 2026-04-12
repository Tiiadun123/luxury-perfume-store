"use server";

import { createClient } from "@/utils/supabase/server";

interface SearchProductRow {
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

export interface SearchProductItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  image: string;
}

export async function searchProducts(query: string): Promise<SearchProductItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, 
      brand:brands(name),
      variants:product_variants(price),
      images:product_images(url)
    `)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq("is_active", true)
    .eq("product_images.is_main", true)
    .limit(5);

  if (error) return [];
  
  return (data as SearchProductRow[]).map((product) => ({
    id: product.id,
    name: product.name,
    brand: (Array.isArray(product.brand) ? product.brand[0]?.name : product.brand?.name) || "SCENTIA",
    price: product.variants?.[0]?.price || 0,
    image: product.images?.[0]?.url || "",
    slug: product.slug,
  }));
}
