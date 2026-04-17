"use client";

import { useState } from "react";
import { Eye, Save, Trash2, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertBanner, deleteBanner } from "../actions";
import Image from "next/image";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

export function CMSClient({ initialBanners }: { initialBanners: Banner[] }) {
  const banners = initialBanners;
  const [selectedBanner, setSelectedBanner] = useState<Partial<Banner>>({
    title: "",
    subtitle: "",
    image_url: "",
    link_url: "/shop",
    is_active: true,
    display_order: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await upsertBanner(selectedBanner);
    setLoading(false);
    if (res.success) window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Erase this campaign banner?")) {
      await deleteBanner(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
           <h2 className="font-playfair text-5xl mb-2 text-foreground uppercase">Campaigns</h2>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
             <span>Protocol</span>
             <span>/</span>
             <span className="text-primary tracking-widest">Visual Strategy</span>
           </div>
        </div>
        <Button variant="luxury" onClick={() => setSelectedBanner({ title: "New Campaign", subtitle: "", image_url: "", link_url: "/shop", is_active: true, display_order: 0 })} className="h-14 px-8">
           <Plus className="w-4 h-4 mr-2" />
           New Campaign
        </Button>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Section */}
        <section className="lg:col-span-7 space-y-12">
          {/* Active Banners List */}
          <div className="space-y-4">
             <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Active Fleet</label>
             <div className="grid gap-4">
               {banners.map(b => (
                 <div key={b.id} className="flex items-center gap-4 bg-zinc-900/50 p-4 border border-white/5 group hover:border-primary/30 transition-all">
                    <div className="relative w-16 h-16 overflow-hidden">
                       <Image 
                         src={b.image_url} 
                         alt={b.title}
                         fill
                         sizes="64px"
                         className="object-cover grayscale group-hover:grayscale-0 transition-all" 
                       />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-playfair font-bold uppercase">{b.title}</p>
                       <p className="text-[10px] text-muted-foreground uppercase">{b.subtitle.substring(0, 40)}...</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setSelectedBanner(b)} className="p-2 hover:text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(b.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 </div>
               ))}
               {banners.length === 0 && <p className="text-[10px] uppercase text-muted-foreground italic">No banners deployed.</p>}
             </div>
          </div>

          <div className="space-y-8 bg-zinc-900/30 p-8 border border-white/5">
             <h3 className="text-[12px] font-black uppercase tracking-[0.2em] border-b border-primary/20 pb-4">Configuration</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Creative URL</label>
                  <Input 
                    value={selectedBanner.image_url} 
                    onChange={e => setSelectedBanner({...selectedBanner, image_url: e.target.value})}
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-black border-white/5" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title</label>
                  <Input 
                    value={selectedBanner.title} 
                    onChange={e => setSelectedBanner({...selectedBanner, title: e.target.value})}
                    className="bg-black border-white/5 font-playfair text-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subtitle</label>
                  <textarea 
                    value={selectedBanner.subtitle} 
                    onChange={e => setSelectedBanner({...selectedBanner, subtitle: e.target.value})}
                    className="w-full bg-black border border-white/5 p-3 text-sm min-h-[80px]" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Destination Link</label>
                     <Input 
                        value={selectedBanner.link_url} 
                        onChange={e => setSelectedBanner({...selectedBanner, link_url: e.target.value})}
                        className="bg-black border-white/5" 
                      />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order</label>
                     <Input 
                        type="number"
                        value={selectedBanner.display_order} 
                        onChange={e => setSelectedBanner({...selectedBanner, display_order: Number(e.target.value)})}
                        className="bg-black border-white/5" 
                      />
                   </div>
                </div>
             </div>
             
             <div className="flex gap-4 pt-4">
                <Button variant="luxury" onClick={handleSave} disabled={loading} className="h-12 px-10">
                   {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                   DEPLOY CAMPAIGN
                </Button>
             </div>
          </div>
        </section>

        {/* Live Preview Render */}
        <section className="lg:col-span-5">
           <div className="sticky top-24 space-y-6">
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" /> LIVE PROTOCOL PREVIEW
              </label>
              
              <div className="relative aspect-[4/5] bg-zinc-900 overflow-hidden border border-white/10 group">
                {selectedBanner.image_url ? (
                  <Image 
                    src={selectedBanner.image_url} 
                    alt={selectedBanner.title || "Preview"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground uppercase text-[10px] tracking-widest">No Creative Selected</div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col items-center justify-end text-center p-8">
                   <span className="text-[8px] font-black uppercase tracking-[0.5em] text-primary mb-2">Exclusive Release</span>
                   <h3 className="font-playfair text-3xl uppercase text-white mb-4 leading-tight">{selectedBanner.title || "Untiled Narrative"}</h3>
                   <p className="text-[10px] text-zinc-400 uppercase tracking-widest max-w-xs">{selectedBanner.subtitle || "Your story begins here..."}</p>
                   <div className="mt-8 px-6 py-3 border border-primary/50 text-white text-[9px] font-black uppercase tracking-widest">Discover Now</div>
                </div>
              </div>

              <div className="p-6 bg-zinc-950 border border-white/5 text-[10px] space-y-2 uppercase tracking-widest">
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Target Root</span>
                   <span className="text-primary italic">{selectedBanner.link_url}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Visibility</span>
                   <span className={selectedBanner.is_active ? "text-green-500" : "text-yellow-500"}>
                     {selectedBanner.is_active ? "PUBLIC" : "STAGED"}
                   </span>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
