"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        quantity,
        unit_price,
        total_price,
        product_name,
        variant_size,
        variant:product_variants(
           product:products(name, slug)
        )
      )
    `)
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch orders error:", error);
    return [];
  }

  return orders;
}
