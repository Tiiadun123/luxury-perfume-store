"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
  const supabase = await createClient();

  // 1. Fetch Total Orders
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // 2. Fetch Total Revenue
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_amount");
  
  const revenue = revenueData?.reduce((sum, o) => sum + o.total_amount, 0) || 0;

  // 3. Fetch Low Stock Variants
  const { data: lowStock } = await supabase
    .from("product_variants")
    .select(`
      *,
      product:products(name)
    `)
    .lt("stock_quantity", 5);

  // 4. Monthly Revenue for Charts (Last 6 Months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const { data: trendData } = await supabase
    .from("orders")
    .select("total_amount, created_at")
    .gte("created_at", sixMonthsAgo.toISOString())
    .eq("payment_status", "paid");

  const monthlyRevenue: Record<string, number> = {};
  trendData?.forEach(order => {
    const month = new Date(order.created_at).toLocaleString('en-US', { month: 'short' });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total_amount;
  });

  return {
    orderCount,
    revenue,
    lowStock: lowStock || [],
    monthlyRevenue
  };
}

export async function getAllOrders() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        product_name, variant_size, quantity, unit_price, total_price
      )
    `)
    .order("created_at", { ascending: false });

  return orders || [];
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (!error) revalidatePath("/admin/orders");
  return { success: !error };
}

export async function getAllAdminProducts() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      brand:brands(name),
      variants:product_variants(*)
    `)
    .order("created_at", { ascending: false });

  return products || [];
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  
  // Due to foreign key cascades, deleting the product should clean up variants/images if configured,
  // otherwise we delete them manually. Let's assume standard cascade.
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (!error) revalidatePath("/admin/products");
  return { success: !error, error };
}

export async function toggleProductStatus(productId: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId);

  if (!error) revalidatePath("/admin/products");
  return { success: !error, error };
}

export async function getBrands() {
  const supabase = await createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("name");
  
  return brands || [];
}

export async function upsertProduct(data: any) {
  const supabase = await createClient();
  const { id, variants, images, brand, ...productData } = data;

  try {
    // 1. Upsert Product
    const { data: product, error: pError } = await supabase
      .from("products")
      .upsert({
        id: id || undefined,
        ...productData,
        brand_id: brand?.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (pError) throw pError;

    // 2. Handle Variants
    if (variants) {
      // Get existing variant IDs
      const { data: existingVariants } = await supabase
        .from("product_variants")
        .select("id")
        .eq("product_id", product.id);
      
      const existingIds = existingVariants?.map(v => v.id) || [];
      const newIds = variants.map((v: any) => v.id).filter(Boolean);
      
      // Delete variants not in the new list
      const toDelete = existingIds.filter(id => !newIds.includes(id));
      if (toDelete.length > 0) {
        await supabase.from("product_variants").delete().in("id", toDelete);
      }

      // Upsert current variants
      for (const variant of variants) {
        await supabase.from("product_variants").upsert({
          ...variant,
          product_id: product.id
        });
      }
    }

    // 3. Handle Images
    if (images) {
      // Simplest approach: delete and re-insert images
      await supabase.from("product_images").delete().eq("product_id", product.id);
      
      const imagesToInsert = images.map((img: any, index: number) => ({
        product_id: product.id,
        url: img.url,
        alt_text: img.alt_text || product.name,
        is_main: index === 0,
        display_order: index
      }));
      
      await supabase.from("product_images").insert(imagesToInsert);
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Upsert failed:", error);
    return { success: false, error: error.message };
  }
}

// --- Logistics & Shipping ---

export async function getShippingZones() {
  const supabase = await createClient();
  const { data: zones } = await supabase
    .from("shipping_zones")
    .select("*")
    .order("name");
  return zones || [];
}

export async function upsertShippingZone(data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("shipping_zones")
    .upsert({
      ...data,
      id: data.id || undefined
    });
  
  if (!error) revalidatePath("/admin/logistics");
  return { success: !error, error };
}

export async function deleteShippingZone(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("shipping_zones")
    .delete()
    .eq("id", id);
  
  if (!error) revalidatePath("/admin/logistics");
  return { success: !error, error };
}

// --- CMS & Banners ---

export async function getBanners() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("display_order");
  return banners || [];
}

export async function upsertBanner(data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("banners")
    .upsert({
      ...data,
      id: data.id || undefined
    });
  
  if (!error) {
    revalidatePath("/admin/cms");
    revalidatePath("/"); // Home page usually shows banners
  }
  return { success: !error, error };
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("banners")
    .delete()
    .eq("id", id);
  
  if (!error) {
    revalidatePath("/admin/cms");
    revalidatePath("/");
  }
  return { success: !error, error };
}
