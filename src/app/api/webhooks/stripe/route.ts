import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";
import { getOrderReceiptHtml } from "@/lib/emails/order-receipt-email";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    const err = error as Error;
    console.error("Webhook signature verification failed.", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Initialize Supabase. For webhooks background processing, 
  // if SERVICE_ROLE is available, use it; otherwise fallback to ANON_KEY.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        const paymentIntentId = session.payment_intent as string;
        
        if (orderId) {
          console.info("Payment successful for order.");
          
          // 1. Update order status to processing and payment_status to paid
          const { error: orderError } = await supabase
            .from("orders")
            .update({ 
               status: "processing", 
               payment_status: "paid" 
            })
            .eq("id", orderId);

          if (orderError) {
            console.error("Failed to update order status in Supabase:", orderError);
            throw new Error("Supabase order update failed");
          }
          
          // 2. Record the transaction
          const { error: txError } = await supabase
            .from("transactions")
            .insert({
               order_id: orderId,
               provider: "stripe",
               provider_id: paymentIntentId || session.id,
               amount: (session.currency?.toLowerCase() === "vnd" 
                 ? session.amount_total 
                 : (session.amount_total || 0) / 100) || 0, // Handle non-zero-decimal currencies
               currency: session.currency?.toUpperCase() || "VND",
               status: "completed",
               raw_response: session,
            });

          if (txError) {
             console.error("Failed to record transaction in Supabase:", txError);
             // Non-blocking error: we updated the order successfully.
          }

          // 3. Fetch Order Details for Email and Inventory
          const { data: orderDetails } = await supabase
            .from("orders")
            .select(`
              order_number,
              customer_name,
              customer_email,
              total_amount,
              recipient_name,
              items:order_items (
                variant_id,
                product_name,
                variant_size,
                quantity,
                total_price
              )
            `)
            .eq("id", orderId)
            .single();

          // 4. Stock Management: Explicitly decrement inventory
          if (orderDetails?.items) {
            for (const item of orderDetails.items) {
              if (item.variant_id) {
                await supabase.rpc("decrement_stock_by_variant", {
                  p_variant_id: item.variant_id,
                  p_quantity: item.quantity
                });
              }
            }
          }

          // 5. Send Confirmation Email via Resend
          if (orderDetails) {
             const customerName = orderDetails.customer_name || orderDetails.recipient_name || "MEMBER";
             const customerEmail = orderDetails.customer_email || session.customer_details?.email;

             if (!customerEmail) {
               console.error("No email address found to send receipt.");
               return new NextResponse("No email found", { status: 200 });
             }

             const htmlContent = getOrderReceiptHtml({
               customerName: customerName,
               orderNumber: orderDetails.order_number,
               totalAmount: orderDetails.total_amount,
               items: orderDetails.items,
             });

              if (resend) {
                try {
                  const adminEmail = "hungtran2005lucky@gmail.com"; 
                  
                  await resend.emails.send({
                    from: "Maison Scêntia <hungtran2003lucky@gmail.com>",
                    to: [customerEmail], // Use the validated email with fallback
                    bcc: [adminEmail], 
                    subject: `Maison Scêntia - Xác Nhận Đơn Hàng #${orderDetails.order_number}`,
                    html: htmlContent
                  });
                  
                  console.info("Receipt email sent successfully.");
                } catch (emailError) {
                  const err = emailError as Error;
                  console.error("❌ RESEND ERROR:", err.message || err);
                  console.error("🔍 DEBUG INFO:", {
                    recipient: orderDetails.customer_email,
                    apiKeyStatus: process.env.RESEND_API_KEY ? "Present" : "Missing",
                    fromAddress: "hungtran2003lucky@gmail.com"
                  });
                }
              } else {
                console.warn("⚠️ RESEND NOT INITIALIZED: Check RESEND_API_KEY in .env.local");
              }
          }
        }
        break;
      }
      
      // Handle other required events...
      case "payment_intent.payment_failed": {
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        console.error("Payment failed for intent:", failedIntent.id);
        break;
      }

      default:
        console.info(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Stripe Webhook Handler Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
