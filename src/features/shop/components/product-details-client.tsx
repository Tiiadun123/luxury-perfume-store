"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/store";
import { ProductDetail, ProductVariant } from "@/features/shop/actions";
import { toast } from "sonner";

interface ProductDetailsClientProps {
  product: Pick<ProductDetail, "id" | "name" | "brand" | "images">;
  variants: ProductVariant[];
}

export function ProductDetailsClient({ product, variants }: ProductDetailsClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      brand: product.brand?.name || "SCENTIA",
      price: selectedVariant.price,
      image: product.images.find((img) => img.is_main)?.url || product.images[0]?.url || "",
      quantity: 1,
      size: selectedVariant.size
    });

    toast.success(`${product.name} added to your collection`, {
      description: `Size: ${selectedVariant.size}ml — ${selectedVariant.price.toLocaleString("vi-VN")} VND`,
      action: {
        label: "View Bag",
        onClick: () => window.location.href = "/cart"
      }
    });
  };

  return (
    <div className="space-y-10">
      <p className="text-3xl font-sans tracking-widest font-light">
        {selectedVariant.price.toLocaleString("vi-VN")} VND
      </p>

      {/* Size Selection */}
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.4em] font-bold uppercase">SELECT SIZE</h4>
        <div className="flex gap-4">
          {variants.map((v) => (
            <button 
              key={v.id} 
              onClick={() => setSelectedVariant(v)}
              className={`min-w-24 h-12 border px-6 text-[10px] tracking-widest font-bold uppercase transition-all ${
                selectedVariant.id === v.id ? "border-primary text-primary" : "border-border hover:border-primary"
              }`}
            >
              {v.size}ml
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-border/20">
        <Button 
          variant="luxury" 
          size="lg" 
          className="h-16 flex-1 text-xs tracking-[0.4em] font-black"
          onClick={handleAddToCart}
        >
          ADD TO SHOPPING BAG
        </Button>
      </div>
    </div>
  );
}
