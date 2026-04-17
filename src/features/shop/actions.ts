"use server";

import { createClient } from "@/utils/supabase/server";

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
  concentration: string | null;
  longevity: string | null;
  sillage: string | null;
  brand: ProductBrandRow | ProductBrandRow[] | null;
  variants: ProductVariantRow[] | null;
  images: ProductImageRow[] | null;
  product_notes: ProductNoteRow[] | null;
}

export interface ProductListItem {
  id: string;
  defaultVariantId: string;
  size: number;
  name: string;
  slug: string;
  brand: string;
  price: number;
  image: string;
  notes: string[];
  concentration?: string;
  longevity?: string;
  sillage?: string;
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
  brand_id: string;
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
    defaultVariantId: product.variants?.[0]?.id || "",
    size: product.variants?.[0]?.size || 0,
    name: product.name,
    slug: product.slug,
    brand: brandName || "SCENTIA",
    price: product.variants?.[0]?.price || 0,
    image: product.images?.[0]?.url || "",
    notes,
    concentration: product.concentration || "Extrait de Parfum",
    longevity: product.longevity || "8-10 Hours",
    sillage: product.sillage || "Moderate",
  };
}

export async function getProducts(filters?: {
  category?: string;
  gender?: string;
  brand?: string;
  scent_family?: string;
  concentration?: string;
  is_featured?: boolean;
  sortBy?: string;
  limit?: number;
  query?: string;
}): Promise<ProductListItem[]> {
  const supabase = await createClient();

  const brandSelect = filters?.brand ? "brand:brands!inner(name, slug)" : "brand:brands(name, slug)";

  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      concentration,
      longevity,
      sillage,
      ${brandSelect},
      variants:product_variants(id, size, price),
      images:product_images(url),
      product_notes:product_notes(note:fragrance_notes(name))
    `)
    .eq("is_active", true)
    .eq("product_images.is_main", true);

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.gender) {
    query = query.eq("gender", filters.gender);
  }
  
  if (filters?.scent_family) {
    query = query.eq("scent_family", filters.scent_family);
  }

  if (filters?.brand) {
    query = query.eq("brands.slug", filters.brand);
  }

   if (filters?.concentration) {
    query = query.eq("concentration", filters.concentration);
  }

  if (filters?.is_featured) {
    query = query.eq("is_featured", true);
  }

  if (filters?.query) {
    const searchTerm = `%${filters.query}%`;
    query = query.or(`name.ilike.${searchTerm},slug.ilike.${searchTerm}`);
  }

  // Sorting logic
  if (filters?.sortBy === "price_low") {
    query = query.order('price', { foreignTable: 'product_variants', ascending: true });
  } else if (filters?.sortBy === "price_high") {
    query = query.order('price', { foreignTable: 'product_variants', ascending: false });
  } else if (filters?.sortBy === "newest") {
    query = query.order('created_at', { ascending: false });
  } else if (filters?.sortBy === "name") {
    query = query.order('name', { ascending: true });
  } else {
    // Default sorting
    query = query.order('name', { ascending: true });
  }
  
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  const results = (data as ProductListRow[]).map(toProductListItem);

  return results;
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
      concentration, longevity, sillage,
      brand:brands(name),
      variants:product_variants(id, size, price),
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
      concentration, longevity, sillage,
      brand:brands(name),
      variants:product_variants(id, size, price),
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

export async function getBrands() {
  const supabase = await createClient();
  
  // Fetch brands that have at least one active product
  const { data, error } = await supabase
    .from("brands")
    .select(`
      name, 
      slug,
      products!inner(id)
    `)
    .eq("is_active", true)
    .eq("products.is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }

  const uniqueBrands = Array.from(new Map(data.map(item => [item.slug, { name: item.name, slug: item.slug }])).values());
  
  return uniqueBrands;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}
