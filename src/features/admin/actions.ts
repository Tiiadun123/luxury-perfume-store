"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { Product, CustomerProfile, ShippingZone, Banner, Brand, SiteSettings } from "@/types/admin";
import { createClient } from "@/utils/supabase/server";

async function verifyAdminRole(): Promise<{ authorized: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) return { authorized: false, error: "Yêu cầu đăng nhập" };
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  if (!profile || !["admin", "manager"].includes(profile.role)) {
    return { authorized: false, error: "Không có quyền truy cập" };
  }
  
  return { authorized: true };
}

export async function getAdminStats() {
  const supabase = supabaseAdmin;

  // 1. Fetch Total Orders
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // 2. Fetch Total Revenue
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("payment_status", "paid");
  
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

  // Calculate Month-over-Month growth
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  
  const { data: currentMonthOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", currentMonthStart)
    .eq("payment_status", "paid");

  const { data: lastMonthOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", lastMonthStart)
    .lt("created_at", currentMonthStart)
    .eq("payment_status", "paid");

  const currentRevenue = currentMonthOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;
  const lastRevenue = lastMonthOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;
  const revenueTrend = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1) : "0";

  const monthlyRevenue: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const m = d.toLocaleString('en-US', { month: 'short' });
    monthlyRevenue[m] = 0;
  }

  trendData?.forEach(order => {
    const month = new Date(order.created_at).toLocaleString('en-US', { month: 'short' });
    if (monthlyRevenue.hasOwnProperty(month)) {
      monthlyRevenue[month] += order.total_amount;
    }
  });

  return {
    orderCount: orderCount || 0,
    productCount: productCount || 0,
    revenue,
    revenueTrend: `${Number(revenueTrend) >= 0 ? '+' : ''}${revenueTrend}%`,
    orderTrend: `+${currentMonthOrders?.length || 0}`,
    lowStock: lowStock || [],
    monthlyRevenue
  };
}

export async function getAllOrders() {
  const supabase = supabaseAdmin;
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

import { resend } from "@/lib/resend";
import { getOrderShippedHtml } from "@/lib/emails/order-shipped-email";

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = supabaseAdmin;
  
  // 1. Update the status
  const { error } = await supabase
    .from("orders")
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };

  // 2. Trigger automated email if status is "shipped"
  if (status === "shipped") {
    try {
      const { data: order } = await supabase
        .from("orders")
        .select("order_number, customer_name, customer_email, recipient_name, tracking_number")
        .eq("id", orderId)
        .single();
      
      if (order && (order.customer_email || order.customer_name)) {
        const email = order.customer_email;
        const name = order.customer_name || order.recipient_name || "MEMBER";
        
        await resend.emails.send({
          from: "Maison Scêntia <noreply@maison-scentia.com>",
          to: [email],
          subject: `Maison Scêntia - Đơn hàng #${order.order_number} đang được giao`,
          html: getOrderShippedHtml({
            customerName: name,
            orderNumber: order.order_number,
            trackingNumber: order.tracking_number
          })
        });
      }
    } catch (emailErr) {
      console.error("Failed to send shipping email:", emailErr);
      // We don't fail the whole action if email fails
    }
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function getAllAdminProducts() {
  const supabase = supabaseAdmin;
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      brand:brands(name),
      variants:product_variants(*),
      images:product_images(*)
    `)
    .order("created_at", { ascending: false });

  return products || [];
}

export async function deleteProduct(productId: string) {
  const auth = await verifyAdminRole();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = supabaseAdmin;
  
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (!error) revalidatePath("/admin/products");
  return { success: !error, error };
}

export async function toggleProductStatus(productId: string, isActive: boolean) {
  const supabase = supabaseAdmin;
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId);

  if (!error) revalidatePath("/admin/products");
  return { success: !error, error };
}

export async function getBrands() {
  const supabase = supabaseAdmin;
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("name");
  
  return brands || [];
}

export async function upsertBrand(data: Partial<Brand>) {
  const supabase = supabaseAdmin;
  const { id, name, ...rest } = data;
  
  const slug = data.slug || (name ? name.toLowerCase().replace(/\s+/g, '-') : '');

  const { error } = await supabase
    .from("brands")
    .upsert({
      ...(id ? { id } : {}),
      name,
      slug,
      ...rest,
      updated_at: new Date().toISOString()
    });

  if (!error) revalidatePath("/admin/products");
  return { success: !error, error };
}

export async function deleteBrand(id: string) {
  const auth = await verifyAdminRole();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = supabaseAdmin;
  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("id", id);
  
  if (!error) revalidatePath("/admin/products");
  return { success: !error, error };
}

export async function upsertProduct(data: Omit<Partial<Product>, 'brand'> & { brand?: { id: string } }) {
  const supabase = supabaseAdmin;
  const { id, variants, images, brand, ...productData } = data;

  try {
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

    if (variants) {
      const { data: existingVariants } = await supabase
        .from("product_variants")
        .select("id")
        .eq("product_id", product.id);
      
      const existingIds = existingVariants?.map(v => v.id) || [];
      const newIds = variants.map((v) => v.id).filter(Boolean);
      
      const toDelete = existingIds.filter(id => !newIds.includes(id));
      if (toDelete.length > 0) {
        await supabase.from("product_variants").delete().in("id", toDelete);
      }

      for (const variant of variants) {
        await supabase.from("product_variants").upsert({
          ...variant,
          product_id: product.id
        });
      }
    }

    if (images) {
      await supabase.from("product_images").delete().eq("product_id", product.id);
      
      const imagesToInsert = images.map((img, index: number) => ({
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
  } catch (error) {
    console.error("Upsert failed:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getAdminCustomers(search?: string) {
  const supabase = supabaseAdmin;
  
  let query = supabase
    .from('profiles')
    .select(`
      *,
      orders(total_amount, payment_status)
    `)
    .order('created_at', { ascending: false });

  if (search) {
    const safeSearch = search.replace(/[%_]/g, '\\$&');
    query = query.or(`full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  return (data || []).map((customer) => {
    const totalSpent = (customer.orders as { total_amount: number, payment_status: string }[])
      ?.filter((o) => o.payment_status === 'paid')
      .reduce((sum: number, o) => sum + (o.total_amount || 0), 0) || 0;
    
    return {
      ...customer,
      total_spent: totalSpent
    } as CustomerProfile;
  });
}

// --- Logistics & Shipping ---

export async function getShippingZones() {
  const supabase = supabaseAdmin;
  const { data: zones } = await supabase
    .from("shipping_zones")
    .select("*")
    .order("name");
  return zones || [];
}

export async function upsertShippingZone(data: Partial<ShippingZone>) {
  const supabase = supabaseAdmin;
  const { id, ...rest } = data;
  const { error } = await supabase
    .from("shipping_zones")
    .upsert({
      ...rest,
      ...(id ? { id } : {})
    });
  
  if (!error) revalidatePath("/admin/logistics");
  return { success: !error, error };
}

export async function deleteShippingZone(id: string) {
  const auth = await verifyAdminRole();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = supabaseAdmin;
  const { error } = await supabase
    .from("shipping_zones")
    .delete()
    .eq("id", id);
  
  if (!error) revalidatePath("/admin/logistics");
  return { success: !error, error };
}

// --- CMS & Banners ---

export async function getBanners() {
  const supabase = supabaseAdmin;
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("display_order");
  return banners || [];
}

export async function upsertBanner(data: Partial<Banner>) {
  const supabase = supabaseAdmin;
  const { id, ...rest } = data;
  const { error } = await supabase
    .from("banners")
    .upsert({
      ...rest,
      ...(id ? { id } : {})
    });
  
  if (!error) {
    revalidatePath("/admin/cms");
    revalidatePath("/");
  }
  return { success: !error, error };
}

export async function deleteBanner(id: string) {
  const auth = await verifyAdminRole();
  if (!auth.authorized) return { success: false, error: auth.error };

  const supabase = supabaseAdmin;
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
// --- Site Settings ---

export async function getSiteSettings() {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
  return data;
}

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  const supabase = supabaseAdmin;
  const { error } = await supabase
    .from("site_settings")
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq("id", 1);

  if (!error) revalidatePath("/admin/settings");
  return { success: !error, error };
}
