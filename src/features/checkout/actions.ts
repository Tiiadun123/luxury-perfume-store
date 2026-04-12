import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(orderId: string, items: CartItem[], totalAmount: number) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "vnd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price, // VND is a zero-decimal currency
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      metadata: {
        orderId,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe Session Error:", error);
    return { error: "Failed to create payment session." };
  }
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
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Create Order record
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id || null,
      shipping_address: data.shippingAddress,
      customer_name: data.fullName,
      customer_email: data.email,
      customer_phone: data.phone,
      total_amount: data.totalAmount,
      is_gift_wrapped: data.isGiftWrapped,
      gift_message: data.giftMessage,
      order_notes: data.orderNotes,
      status: "pending"
    })
    .select()
    .single();

  if (orderError) {
    console.error("Order Creation Error:", orderError);
    return { error: "Failed to place order. Please try again." };
  }

  // 2. Insert Order Items
  const orderItems = data.items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    variant_id: item.variantId,
    quantity: item.quantity,
    price_at_purchase: item.price
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Order Items Error:", itemsError);
    return { error: "Order placed, but items failed to register." };
  }

  // 3. Create Stripe Session
  const stripeResult = await createCheckoutSession(order.id, data.items, data.totalAmount);
  
  if (stripeResult.error) {
    // If stripe fails, we still have the order record but return an error OR allow them to retry.
    // In a luxury store, we should probably handle this gracefully.
    return { success: true, orderId: order.id, orderNumber: order.order_number, stripeError: stripeResult.error };
  }

  revalidatePath("/profile/orders");
  return { success: true, orderId: order.id, orderNumber: order.order_number, checkoutUrl: stripeResult.url };
}
