"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { upsertProduct, getBrands } from "../actions";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  brand_id: z.string().min(1, "Brand is required"),
  concentration: z.string().optional(),
  gender: z.enum(["Men", "Women", "Unisex"]),
  scent_family: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  variants: z.array(z.object({
    id: z.string().optional(),
    size: z.coerce.number().min(1),
    sku: z.string().optional(),
    price: z.coerce.number().min(0),
    stock_quantity: z.coerce.number().min(0),
  })).min(1, "At least one variant is required"),
  images: z.array(z.object({
    url: z.string().url("Must be a valid URL"),
  })).min(1, "At least one image is required")
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductModal({ 
  product, 
  onClose 
}: { 
  product?: any; 
  onClose: () => void;
}) {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product?.id,
      name: product?.name || "",
      slug: product?.slug || "",
      brand_id: product?.brand_id || product?.brand?.id || "",
      concentration: product?.concentration || "",
      gender: product?.gender || "Unisex",
      scent_family: product?.scent_family || "",
      description: product?.description || "",
      is_active: product?.is_active ?? true,
      is_featured: product?.is_featured ?? false,
      variants: product?.variants?.map((v: any) => ({
        id: v.id,
        size: v.size,
        sku: v.sku || "",
        price: v.price,
        stock_quantity: v.stock_quantity
      })) || [{ size: 50, sku: "", price: 0, stock_quantity: 10 }],
      images: product?.images?.map((img: any) => ({ url: img.url })) || [{ url: "" }]
    }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants"
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images"
  });

  useEffect(() => {
    getBrands().then(setBrands);
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    // Map brand_id back for action
    const payload = {
      ...data,
      brand: { id: data.brand_id }
    };
    const result = await upsertProduct(payload);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-zinc-950 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/30">
          <div>
            <h2 className="font-playfair text-3xl uppercase tracking-wider">
              {product ? "Edit Essence" : "Craft New Essence"}
            </h2>
            <p className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase mt-1">
              Defining the Olfactory Signature
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 p-8 space-y-12">
          {/* Section: Basic Info */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary">Name</label>
                <Input {...register("name")} placeholder="e.g. SANTAL 33" className="border-white/5 bg-white/5" />
                {errors.name && <p className="text-red-500 text-[10px] uppercase">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary">Slug</label>
                <Input {...register("slug")} placeholder="e.g. santal-33" className="border-white/5 bg-white/5" />
                {errors.slug && <p className="text-red-500 text-[10px] uppercase">{errors.slug.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary">Brand</label>
                <select 
                  {...register("brand_id")} 
                  className="w-full bg-white/5 border border-white/5 h-10 px-3 outline-none focus:border-primary/50 text-sm"
                >
                  <option value="" disabled>Select Brand</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {errors.brand_id && <p className="text-red-500 text-[10px] uppercase">{errors.brand_id.message}</p>}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary">Concentration</label>
                  <Input {...register("concentration")} placeholder="Eau de Parfum" className="border-white/5 bg-white/5" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary">Gender</label>
                  <select 
                    {...register("gender")}
                    className="w-full bg-white/5 border border-white/5 h-10 px-3 outline-none focus:border-primary/50 text-sm"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary">Scent Family</label>
                <Input {...register("scent_family")} placeholder="Woody, Leather" className="border-white/5 bg-white/5" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary">Description</label>
                <Textarea {...register("description")} className="border-white/5 bg-white/5 min-h-[100px]" />
              </div>
            </div>
          </div>

          {/* Section: Images */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[12px] font-black tracking-[0.3em] uppercase">Visual Assets (URLs)</h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => appendImage({ url: "" })} className="text-[9px] tracking-widest uppercase">
                <Plus className="w-3 h-3 mr-1" /> Add Image
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {imageFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <Input {...register(`images.${index}.url`)} placeholder="https://..." className="border-white/5 bg-white/5 text-xs" />
                  </div>
                  <button type="button" onClick={() => removeImage(index)} className="p-2 text-muted-foreground hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Variants */}
          <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h3 className="text-[12px] font-black tracking-[0.3em] uppercase">Inventory & Sizes</h3>
               <Button type="button" variant="ghost" size="sm" onClick={() => appendVariant({ size: 100, price: 0, stock_quantity: 0 })} className="text-[9px] tracking-widest uppercase">
                 <Plus className="w-3 h-3 mr-1" /> Add Size
               </Button>
             </div>
             
             <div className="space-y-4">
               {variantFields.map((field, index) => (
                 <div key={field.id} className="grid grid-cols-5 gap-4 items-end bg-white/5 p-4 border border-white/5">
                    <div className="space-y-2">
                      <label className="text-[8px] tracking-[0.2em] font-bold uppercase text-muted-foreground">Size (ml)</label>
                      <Input type="number" {...register(`variants.${index}.size`)} className="border-white/5 bg-zinc-900 h-9" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[8px] tracking-[0.2em] font-bold uppercase text-muted-foreground">SKU / Code</label>
                      <Input {...register(`variants.${index}.sku`)} className="border-white/5 bg-zinc-900 h-9" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[8px] tracking-[0.2em] font-bold uppercase text-muted-foreground">Price (VND)</label>
                       <Input type="number" {...register(`variants.${index}.price`)} className="border-white/5 bg-zinc-900 h-9" />
                    </div>
                    <div className="flex gap-2 items-center">
                       <div className="space-y-2 flex-1">
                          <label className="text-[8px] tracking-[0.2em] font-bold uppercase text-muted-foreground">Stock</label>
                          <Input type="number" {...register(`variants.${index}.stock_quantity`)} className="border-white/5 bg-zinc-900 h-9" />
                       </div>
                       <button type="button" onClick={() => removeVariant(index)} className="p-2 text-muted-foreground hover:text-red-500 mt-6">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-zinc-900/30">
          <Button variant="outline" onClick={onClose} disabled={loading} className="text-[10px] tracking-widest uppercase font-black px-8 h-12">
            Abort
          </Button>
          <Button 
            variant="luxury" 
            onClick={handleSubmit(onSubmit)} 
            disabled={loading}
            className="text-[10px] tracking-widest uppercase font-black px-8 h-12"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Seal Essence
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
