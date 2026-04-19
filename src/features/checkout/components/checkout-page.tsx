"use client";

import { useCart } from "@/features/cart/store";
import { createOrder, getShippingZones } from "../actions";
import { ShippingZone } from "@/types/admin";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Truck, Gift, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{ id: string, number: string } | null>(null);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");

  useEffect(() => {
    getShippingZones().then(zones => {
      setShippingZones(zones);
      if (zones.length > 0) setSelectedZoneId(zones[0].id);
    });
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const selectedZone = shippingZones.find(z => z.id === selectedZoneId);
  const shippingCost = selectedZone 
    ? (subtotal >= (selectedZone.free_shipping_threshold || Infinity) ? 0 : Number(selectedZone.base_rate || 0))
    : 0;

  const total = subtotal + (isGiftWrapped ? 150000 : 0) + shippingCost;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await createOrder({
          items,
          fullName: formData.get("fullName") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          shippingAddress: formData.get("address") as string,
          orderNotes: formData.get("notes") as string,
          isGiftWrapped,
          giftMessage: formData.get("giftMessage") as string,
          totalAmount: total,
          shippingCost: shippingCost,
          shippingZoneId: selectedZoneId
        });

        if (result.success) {
          if (result.checkoutUrl) {
            // Redirect to Stripe - this is the intended luxury flow
            window.location.href = result.checkoutUrl;
          } else {
            // Backup success flow (e.g. for non-Stripe methods or if redirect fails)
            setSuccessOrder({ id: result.orderId!, number: result.orderNumber! });
            clearCart();
          }
        } else {
          // Display the specific error from the server (Stripe failure or DB failure)
          toast.error(result.error || "An unexpected error occurred during reservation.", {
            description: "Please verify your details and try again.",
          });
        }
      } catch (err) {
        console.error("Submission error:", err);
        toast.error("The reservation system is currently under maintenance.", {
          description: "Please try again shortly.",
        });
      }
    });
  };

  if (successOrder) {
    return (
      <div className="container mx-auto px-6 py-40 flex flex-col items-center text-center space-y-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-6 bg-primary/10 rounded-full">
           <CheckCircle2 className="w-16 h-16 text-primary" />
        </motion.div>
        <div className="space-y-4">
          <h1 className="font-playfair text-6xl uppercase">Your Journey Begins</h1>
          <p className="text-xs tracking-[0.4em] text-primary font-black uppercase">Order #{successOrder.number}</p>
        </div>
        <p className="max-w-md text-sm leading-relaxed tracking-widest text-muted-foreground uppercase">
          Your selected essences have been reserved. Our house artisans are currently preparing your collection for its voyage.
        </p>
        <Link href="/shop">
          <Button variant="luxury" size="lg" className="h-16 px-12">
            CONTINUE EXPLORING
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Information Form */}
        <div className="space-y-12">
           <div className="space-y-2">
              <h1 className="font-playfair text-5xl uppercase font-medium">Checkout</h1>
              <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Finalize your olfactory selection</p>
           </div>

           <form action={handleSubmit} className="space-y-10">
              <div className="space-y-6">
                 <h3 className="text-[10px] tracking-[0.4em] font-black uppercase text-primary border-b border-primary/20 pb-4">Personal Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input name="fullName" placeholder="FULL NAME" required />
                    <Input name="email" type="email" placeholder="EMAIL ADDRESS" required />
                 </div>
                 <Input name="phone" placeholder="PHONE NUMBER" required />
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] tracking-[0.4em] font-black uppercase text-primary border-b border-primary/20 pb-4">Shipping Destination</h3>
                 <div className="space-y-4">
                    <Input name="address" placeholder="STREET ADDRESS, CITY, COUNTRY" required />
                    <div className="space-y-2">
                       <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">Shipping Zone</label>
                       <select 
                         className="w-full bg-background border border-border/20 h-14 px-4 text-[10px] tracking-widest uppercase outline-none focus:border-primary transition-colors"
                         value={selectedZoneId}
                         onChange={(e) => setSelectedZoneId(e.target.value)}
                         required
                       >
                          {shippingZones.map(zone => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name} - {Number(zone.base_rate || 0).toLocaleString("vi-VN")} VND
                            </option>
                          ))}
                       </select>
                       <p className="text-[8px] tracking-widest text-muted-foreground uppercase italic px-1">
                          {selectedZone?.free_shipping_threshold 
                            ? `Free shipping for orders over ${Number(selectedZone.free_shipping_threshold).toLocaleString("vi-VN")} VND`
                            : "Priority global handling applied"}
                       </p>
                    </div>
                    <Input name="notes" placeholder="DELIVERY INSTRUCTIONS (OPTIONAL)" />
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] tracking-[0.4em] font-black uppercase text-primary border-b border-primary/20 pb-4">Luxury Services</h3>
                 <div className="flex flex-col gap-6 p-6 border border-border/20 bg-zinc-50 dark:bg-zinc-950/50 relative overflow-hidden">
                    <div className="flex items-center gap-4">
                       <Checkbox 
                         id="gift" 
                         checked={isGiftWrapped} 
                         onCheckedChange={(checked) => setIsGiftWrapped(!!checked)}
                       />
                       <label htmlFor="gift" className="flex items-center gap-2 cursor-pointer">
                          <Gift className="w-4 h-4 text-primary" />
                          <span className="text-[10px] tracking-[0.2em] font-bold uppercase">Complimentary Artisan Gift Wrapping (+150k VND)</span>
                       </label>
                    </div>
                    {isGiftWrapped && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <Input name="giftMessage" placeholder="PERSONAL MESSAGE FOR THE RECIPIENT" className="mt-4" />
                      </motion.div>
                    )}
                 </div>
              </div>

              <div className="pt-8">
                 <Button 
                   type="submit" 
                   variant="luxury" 
                   size="lg" 
                   className="w-full h-16 text-xs tracking-[0.4em] font-black"
                   disabled={isPending || items.length === 0}
                 >
                   {isPending ? "RESERVING..." : "COMPLETE RESERVATION"}
                 </Button>
              </div>
           </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:sticky lg:top-32 h-fit space-y-8 bg-zinc-50 dark:bg-zinc-950 p-10 border border-border/10">
           <h3 className="text-[10px] tracking-[0.4em] font-black uppercase text-primary border-b border-primary/20 pb-4">Order Summary</h3>
           
           <div className="space-y-6 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <div className="relative w-16 aspect-[3/4] border border-border/10">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-[10px] font-bold tracking-widest uppercase">{item.name}</h4>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{item.quantity} x {item.price.toLocaleString("vi-VN")} VND</p>
                  </div>
                  <p className="text-[10px] font-bold">{(item.price * item.quantity).toLocaleString("vi-VN")} VND</p>
                </div>
              ))}
           </div>

           <div className="space-y-4 pt-6 border-t border-border/20">
              <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase">
                 <span className="text-muted-foreground">SUBTOTAL</span>
                 <span>{subtotal.toLocaleString("vi-VN")} VND</span>
              </div>
              {isGiftWrapped && (
                <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase">
                   <span className="text-muted-foreground">GIFT WRAPPING</span>
                   <span>150,000 VND</span>
                </div>
              )}
              <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase">
                 <span className="text-muted-foreground">SHIPPING ({selectedZone?.name || "ESTIMATING"})</span>
                 {shippingCost === 0 ? (
                   <span className="text-primary font-black">COMPLIMENTARY</span>
                 ) : (
                   <span>{shippingCost.toLocaleString("vi-VN")} VND</span>
                 )}
              </div>
              <div className="flex justify-between pt-4 border-t border-border/10 font-sans text-xl tracking-widest font-bold">
                 <span>TOTAL</span>
                 <span className="text-primary">{total.toLocaleString("vi-VN")} VND</span>
              </div>
           </div>

           <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-[8px] tracking-[0.2em] text-muted-foreground uppercase">
                 <ShieldCheck className="w-4 h-4 text-primary/60" />
                 <span>Secure Checkout with AES-256 Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-[8px] tracking-[0.2em] text-muted-foreground uppercase">
                 <Truck className="w-4 h-4 text-primary/60" />
                 <span>Priority Global Dispatch across all zones</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
