"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ProductListItem } from "../shop/actions";

interface ProductBrandRow {
  name: string | null;
}

interface ProductVariantRow {
  id: string;
  size: number;
  price: number | null;
}

interface ProductImageRow {
  url: string | null;
  is_main?: boolean | null;
}

interface ProductNoteRow {
  note: { name: string | null } | null;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  concentration: string | null;
  longevity: string | null;
  sillage: string | null;
  brand: ProductBrandRow | null;
  variants: ProductVariantRow[] | null;
  images: ProductImageRow[] | null;
  product_notes: ProductNoteRow[] | null;
}

// Helper to match the ProductListItem type
const toProductListItem = (p: ProductRow): ProductListItem => {
  return {
    id: p.id,
    defaultVariantId: p.variants?.[0]?.id || "",
    size: p.variants?.[0]?.size || 0,
    name: p.name,
    slug: p.slug,
    brand: p.brand?.name || "SCENTIA",
    price: p.variants?.[0]?.price || 0,
    image: p.images?.find((img) => img.is_main)?.url || p.images?.[0]?.url || "",
    notes: p.product_notes?.map((n) => n.note?.name).filter((name): name is string => Boolean(name)) || [],
    concentration: p.concentration || "Extrait de Parfum",
    longevity: p.longevity || "8-12 Hours",
    sillage: p.sillage || "Strong"
  };
};

export async function getWishlist(): Promise<ProductListItem[]> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("wishlists")
    .select(`
      product:products(
        id, name, slug, 
        concentration, longevity, sillage,
        brand:brands(name),
        variants:product_variants(id, size, price),
        images:product_images(url),
        product_notes:product_notes(note:fragrance_notes(name))
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }

  const rows = (data as unknown) as { product: ProductRow }[];
  return rows.map(item => toProductListItem(item.product));
}

export async function toggleWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("id", existing.id);
    
    if (error) return { success: false, error: error.message };
    revalidatePath("/wishlist");
    revalidatePath(`/product/${productId}`);
    return { success: true, action: "removed" };
  } else {
    const { error } = await supabase
      .from("wishlists")
      .insert({
        user_id: user.id,
        product_id: productId
      });

    if (error) return { success: false, error: error.message };
    revalidatePath("/wishlist");
    revalidatePath(`/product/${productId}`);
    return { success: true, action: "added" };
  }
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  return !!data;
}
