"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface CartItem {
  id: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: number;
}

export async function createCheckoutSession(orderId: string, items: CartItem[], shippingCost: number = 0, isGiftWrapped: boolean = false) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    
    // Prepare line items
    const lineItems = items.map((item) => {
      // Ensure absolute URL for images
      let imageUrl = item.image;
      if (imageUrl && !imageUrl.startsWith('http')) {
        // If it starts with /storage, it's likely Supabase, we need a full URL
        // If it starts with /images, it's a local public asset
        imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }

      return {
        price_data: {
          currency: "vnd",
          product_data: {
            name: item.name,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(item.price), 
        },
        quantity: item.quantity,
      };
    });

    // Add Shipping Cost if positive
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "vnd",
          product_data: {
            name: "Priority Shipping & Handling",
            images: [],
          },
          unit_amount: Math.round(shippingCost),
        },
        quantity: 1,
      });
    }

    // Add Gift Wrapping if enabled
    if (isGiftWrapped) {
      lineItems.push({
        price_data: {
          currency: "vnd",
          product_data: {
            name: "Artisan Gift Wrapping",
            images: [],
          },
          unit_amount: 150000,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      metadata: {
        orderId,
      },
      // Vietnamese is not natively supported by Stripe UI labels yet, but VND is.
    });

    return { url: session.url };
  } catch (error: unknown) {
    console.error("Stripe Session Error:", error);
    const message = error instanceof Error ? error.message : "Failed to create payment session.";
    return { error: message };
  }
}

export async function getShippingZones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipping_zones")
    .select("*")
    .eq("is_active", true);

  if (error) return [];
  return data;
}

export async function createOrder(data: {
  items: CartItem[];
  shippingAddress: string;
  fullName: string;
  phone: string;
  email: string;
  orderNotes?: string;
  isGiftWrapped: boolean;
  giftMessage?: string;
  totalAmount: number;
  shippingCost?: number;
  shippingZoneId?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Vui lòng đăng nhập để tiến hành thanh toán." };
  }

  // Verify prices from database
  const variantIds = data.items.map(i => i.variantId);
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, price")
    .in("id", variantIds);

  if (variantsError || !variants) {
    console.error("Price verification error:", variantsError);
    return { success: false, error: "Lỗi hệ thống khi xác thực giá sản phẩm." };
  }

  let verifiedSubtotal = 0;
  for (const item of data.items) {
    const variant = variants.find(v => v.id === item.variantId);
    if (!variant || variant.price === null) {
      return { success: false, error: `Sản phẩm ${item.name} không tồn tại hoặc đã thay đổi thông tin.` };
    }
    verifiedSubtotal += variant.price * item.quantity;
  }

  const verifiedGiftCost = data.isGiftWrapped ? 150000 : 0;
  
  // Verify shipping cost from DB (do not trust client)
  let verifiedShippingCost = 0;
  if (data.shippingZoneId) {
    const { data: zone } = await supabase
      .from("shipping_zones")
      .select("base_rate, free_shipping_threshold")
      .eq("id", data.shippingZoneId)
      .eq("is_active", true)
      .single();
    
    if (zone) {
      if (zone.free_shipping_threshold && verifiedSubtotal >= zone.free_shipping_threshold) {
        verifiedShippingCost = 0;
      } else {
        verifiedShippingCost = zone.base_rate || 0;
      }
    }
  }

  const verifiedTotalAmount = verifiedSubtotal + verifiedGiftCost + verifiedShippingCost;

  // Generate a robust luxury order number: MS-YYYYMMDD-UUID
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomUUID().split("-")[0].toUpperCase();
  const orderNumber = `MS-${datePart}-${randomPart}`;

  // 1. Create Order record
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      profile_id: user.id,
      shipping_address: data.shippingAddress,
      recipient_name: data.fullName,
      customer_name: data.fullName,
      customer_email: data.email,
      recipient_phone: data.phone,
      total_amount: verifiedTotalAmount,
      shipping_cost: verifiedShippingCost,
      subtotal: verifiedSubtotal,
      is_gift: data.isGiftWrapped,
      gift_message: data.giftMessage,
      notes: data.orderNotes,
      status: "pending",
      payment_status: "unpaid",
      payment_method: "stripe"
    })
    .select()
    .single();

  if (orderError) {
    console.error("Order Creation Error detall:", orderError);
    return { success: false, error: "Failed to place order. Infrastructure mismatch or permission denied." };
  }

  // 2. Insert Order Items - Correcting schema mismatch
  const orderItems = data.items.map(item => {
    const variant = variants.find(v => v.id === item.variantId);
    const unitPrice = variant?.price || item.price;
    return {
      order_id: order.id,
      variant_id: item.variantId,
      product_name: item.name,
      variant_size: item.size,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: unitPrice * item.quantity
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Order Items Error detail:", itemsError);
    // Even if items fail, we have the order. But for integrity, we should report it.
    return { success: false, error: "Security/Schema failure in order items registration." };
  }

  // Prepare verified items for Stripe
  const verifiedItemsForStripe = data.items.map(item => {
    const dbVariant = variants.find(v => v.id === item.variantId);
    return {
      ...item,
      price: dbVariant?.price || item.price,
    };
  });

  // 3. Create Stripe Session with full cost breakdown
  const stripeResult = await createCheckoutSession(
    order.id, 
    verifiedItemsForStripe, 
    verifiedShippingCost,
    data.isGiftWrapped || false
  );
  
  if (stripeResult.error) {
    console.error("Stripe Session Creation Failed:", stripeResult.error);
    // CRITICAL FIX: Return success: false if Stripe fails so client doesn't show success screen
    return { 
      success: false, 
      error: `Payment Initialisation Failed: ${stripeResult.error}. Please retry checkout.` 
    };
  }

  revalidatePath("/profile/orders");
  revalidatePath("/admin/orders");
  
  return { 
    success: true, 
    orderId: order.id, 
    orderNumber: order.order_number, 
    checkoutUrl: stripeResult.url 
  };
}
