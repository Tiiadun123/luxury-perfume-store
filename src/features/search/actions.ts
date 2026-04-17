"use server";

import { createClient } from "@/utils/supabase/server";

interface SearchRpcRow {
  id: string;
  name: string;
  slug: string;
  brand_name: string | null;
  price: number | null;
  image_url: string | null;
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

  const { data, error } = await supabase.rpc("search_perfumes_v1", {
    search_query: query,
    limit_count: 8
  });

  if (error) {
    console.error("Search RPC Error:", error);
    return [];
  }
  
  return (data as SearchRpcRow[]).map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand_name || "SCENTIA",
    price: product.price || 0,
    image: product.image_url || "",
    slug: product.slug,
  }));
}
