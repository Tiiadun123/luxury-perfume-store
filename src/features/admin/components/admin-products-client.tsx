"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteProduct } from "../actions";
import { ProductModal } from "./product-modal";
import { AnimatePresence } from "framer-motion";

import { Product } from "@/types/admin";

export function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredProducts = initialProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.brand?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to erase ${name} from existence?`)) {
      const res = await deleteProduct(id);
      if (!res.success) alert("Failed to delete: " + res.error);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
         <div className="space-y-2">
            <h1 className="font-playfair text-5xl uppercase font-medium">Collections</h1>
            <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Managing the Olfactory Vault</p>
         </div>
         <Button 
            variant="luxury" 
            size="lg" 
            className="h-14 px-8 text-[10px] tracking-widest font-black uppercase"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            CRAFT NEW ESSENCE
         </Button>
      </div>

      <div className="flex gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="SEARCH VAULT..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 text-[10px] tracking-widest uppercase border-border/20 bg-background/50 focus:bg-background transition-all" 
            />
         </div>
         <Button variant="outline" className="h-14 px-6 border-border/20">
            <Filter className="w-4 h-4 mr-2" />
            <span className="text-[10px] tracking-widest font-bold uppercase">FILTER</span>
         </Button>
      </div>

      <div className="overflow-hidden border border-border/10 bg-zinc-950/20 backdrop-blur-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-border/10">
                  <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary">SCENT</th>
                  <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary">BRAND</th>
                  <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary text-center">VARIANTS</th>
                  <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary text-right">BASE PRICE</th>
                  <th className="p-6 text-[10px] tracking-[0.4em] font-black uppercase text-primary text-right">ACTIONS</th>
               </tr>
            </thead>
            <tbody>
               {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border/5 group hover:bg-white/5 transition-colors">
                     <td className="p-6">
                        <div className="flex items-center gap-6">
                           <div className="relative w-16 aspect-[3/4] border border-border/10 overflow-hidden shadow-2xl">
                              <Image 
                                src={product.images?.[0]?.url || "/placeholder.png"} 
                                alt={product.name} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <p className="text-[11px] font-black tracking-[0.1em] uppercase">{product.name}</p>
                              <p className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase italic">{product.concentration}</p>
                           </div>
                        </div>
                     </td>
                     <td className="p-6 text-[10px] tracking-widest uppercase font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {product.brand?.name}
                     </td>
                     <td className="p-6 text-center">
                        <span className="px-3 py-1 bg-zinc-900 border border-border/10 text-[9px] font-black tracking-widest uppercase">
                           {product.variants?.length} Sizes
                        </span>
                     </td>
                     <td className="p-6 text-right text-[11px] font-bold font-sans tracking-tight">
                        {product.variants?.[0]?.price.toLocaleString("vi-VN")} VND
                     </td>
                     <td className="p-6 text-right">
                         <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              onClick={() => handleEdit(product)}
                              variant="ghost" 
                              size="icon" 
                              className="w-9 h-9 border border-border/5 hover:border-primary/20 hover:text-primary transition-all"
                            >
                               <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() => handleDelete(product.id, product.name)}
                              variant="ghost" 
                              size="icon" 
                              className="w-9 h-9 border border-border/5 hover:border-destructive/20 hover:text-destructive transition-all"
                            >
                               <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                     </td>
                  </tr>
               ))}
               {filteredProducts.length === 0 && (
                 <tr>
                   <td colSpan={5} className="p-20 text-center">
                      <p className="text-[10px] tracking-[0.5em] text-muted-foreground uppercase">Void - No scents matched your search</p>
                   </td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
