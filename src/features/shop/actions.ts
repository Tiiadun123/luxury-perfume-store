"use server";

import { createClient } from "@/utils/supabase/server";

interface ProductBrandRow {
  name: string | null;
}

interface ProductVariantRow {
  price: number | null;
}

interface ProductImageRow {
  url: string | null;
}

interface ProductNoteRow {
  note:
    | {
        name: string | null;
      }
    | {
        name: string | null;
      }[]
    | null;
}

interface ProductListRow {
  id: string;
  name: string;
  slug: string;
  brand: ProductBrandRow | ProductBrandRow[] | null;
  variants: ProductVariantRow[] | null;
  images: ProductImageRow[] | null;
  product_notes: ProductNoteRow[] | null;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  image: string;
  notes: string[];
}

export interface ProductVariant {
  id: string;
  size: number;
  price: number;
}

export interface ProductImage {
  url: string;
  is_main?: boolean | null;
}

export interface ProductNote {
  note_type: string;
  note: {
    name: string;
  } | null;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  concentration: string;
  longevity: string;
  sillage: string;
  brand: {
    name: string;
  } | null;
  variants: ProductVariant[];
  images: ProductImage[];
  product_notes: ProductNote[];
}

function toProductListItem(product: ProductListRow): ProductListItem {
  const brandName = Array.isArray(product.brand)
    ? product.brand[0]?.name
    : product.brand?.name;

  const notes =
    product.product_notes
      ?.map((productNote) => {
        const note = Array.isArray(productNote.note)
          ? productNote.note[0]?.name
          : productNote.note?.name;
        return note || null;
      })
      .filter((noteName): noteName is string => Boolean(noteName)) || [];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: brandName || "SCENTIA",
    price: product.variants?.[0]?.price || 0,
    image: product.images?.[0]?.url || "",
    notes,
  };
}

export async function getProducts(filters?: { 
  category?: string; 
  gender?: string; 
  brand?: string;
  scent_family?: string;
  sortBy?: string 
}): Promise<ProductListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      brand:brands(name),
      variants:product_variants(price),
      images:product_images(url),
      product_notes:product_notes(note:fragrance_notes(name))
    `)
    .eq("is_active", true)
    .eq("product_images.is_main", true);

  if (filters?.gender) {
    query = query.eq("gender", filters.gender);
  }
  
  if (filters?.scent_family) {
    query = query.eq("scent_family", filters.scent_family);
  }

  // Sorting logic
  if (filters?.sortBy === "price_asc") {
    // This is bit trickier with nested variants, usually better to handle sorting via RPC or specific view
    // For now, simple created_at sort
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data as ProductListRow[]).map(toProductListItem);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      brand:brands(*),
      variants:product_variants(*),
      images:product_images(*),
      product_notes:product_notes(
        note_type,
        note:fragrance_notes(*)
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Error fetching product:", error);
    return null;
  }

  const product = data as unknown as ProductDetail;

  return {
    ...product,
    variants: product.variants || [],
    images: product.images || [],
    product_notes: product.product_notes || [],
  };
}

export async function getBrandBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getProductsByBrand(brandId: string): Promise<ProductListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, 
      brand:brands(name),
      variants:product_variants(price),
      images:product_images(url),
      product_notes:product_notes(note:fragrance_notes(name))
    `)
    .eq("brand_id", brandId)
    .eq("is_active", true)
    .eq("product_images.is_main", true);

  if (error) return [];
  
  return (data as ProductListRow[]).map(toProductListItem);
}

export async function getRelatedProducts(productId: string, brandId: string, limit: number = 4): Promise<ProductListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, 
      brand:brands(name),
      variants:product_variants(price),
      images:product_images(url),
      product_notes:product_notes(note:fragrance_notes(name))
    `)
    .eq("brand_id", brandId)
    .neq("id", productId)
    .eq("is_active", true)
    .eq("product_images.is_main", true)
    .limit(limit);

  if (error) return [];
  
  return (data as ProductListRow[]).map(toProductListItem);
}
