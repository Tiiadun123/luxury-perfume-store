import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { getOrderReceiptHtml } from "@/lib/emails/order-receipt-email";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed.", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Initialize Supabase. For webhooks background processing, 
  // if SERVICE_ROLE is available, use it; otherwise fallback to ANON_KEY.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as any;
        const orderId = session.metadata?.orderId;
        const paymentIntentId = session.payment_intent as string;
        
        if (orderId) {
          console.log(`Payment successful for order ${orderId}`);
          
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
               amount: session.amount_total, // Stripe keeps VND amounts unmodified normally, but typically it depends on minor units.
               currency: session.currency?.toUpperCase() || "VND",
               status: "completed",
               raw_response: session,
            });

          if (txError) {
             console.error("Failed to record transaction in Supabase:", txError);
             // Non-blocking error: we updated the order successfully.
          }

          // 3. Fetch Order Details to Send Email
          const { data: orderDetails } = await supabase
            .from("orders")
            .select(`
              order_number,
              customer_name,
              customer_email,
              total_amount,
              items:order_items (
                product_name,
                variant_size,
                quantity,
                total_price
              )
            `)
            .eq("id", orderId)
            .single();

          // 4. Send Confirmation Email via Resend
          if (orderDetails) {
             const htmlContent = getOrderReceiptHtml({
               customerName: orderDetails.customer_name,
               orderNumber: orderDetails.order_number,
               totalAmount: orderDetails.total_amount,
               items: orderDetails.items,
             });

             if (resend) {
               try {
                 // NOTE: When using the free Resend plan with "onboarding@resend.dev":
                 // - You can ONLY send to the email address registered on your Resend account
                 // - To send to any email, you must verify your own domain at https://resend.com/domains
                 // - Then change the "from" field to "Maison Scêntia <noreply@yourdomain.com>"
                 const emailResult = await resend.emails.send({
                   from: "Maison Scêntia <onboarding@resend.dev>",
                   to: [orderDetails.customer_email],
                   subject: `Maison Scêntia - Xác Nhận Đơn Hàng #${orderDetails.order_number}`,
                   html: htmlContent
                 });
                 console.log("✅ Confirmation email sent to", orderDetails.customer_email, "| Resend ID:", emailResult);
               } catch (emailError: any) {
                 console.error("❌ Failed to send confirmation email:", emailError?.message || emailError);
                 console.error("📧 Recipient was:", orderDetails.customer_email);
                 console.error("💡 TIP: Free Resend accounts can only send to your registered email.");
                 console.error("   To send to any email, verify your domain at https://resend.com/domains");
               }
             } else {
               console.log("--- MOCK EMAIL HTML ---\n");
               console.log(`To: ${orderDetails.customer_email}\nSubject: Maison Scêntia - Xác Nhận Đơn Hàng #${orderDetails.order_number}`);
               console.log("--- (Set RESEND_API_KEY environment variable to send real emails)");
             }
          }
        }
        break;
      
      // Handle other required events...
      case "payment_intent.payment_failed":
        const failedIntent = event.data.object as any;
        console.error("Payment failed for intent:", failedIntent.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Stripe Webhook Handler Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
