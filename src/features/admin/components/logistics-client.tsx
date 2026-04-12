"use client";

import { useState } from "react";
import { Plus, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { upsertShippingZone, deleteShippingZone } from "../actions";

interface ShippingZone {
  id: string;
  name: string;
  city_name: string;
  base_cost: number;
  is_active: boolean;
}

export function LogisticsClient({ initialZones }: { initialZones: ShippingZone[] }) {
  const [zones, setZones] = useState(initialZones);
  const [isAdding, setIsAdding] = useState(false);
  const [newZone, setNewZone] = useState<Partial<ShippingZone>>({
    name: "",
    city_name: "",
    base_cost: 0,
    is_active: true
  });

  const handleToggle = async (zone: ShippingZone) => {
    const updated = { ...zone, is_active: !zone.is_active };
    await upsertShippingZone(updated);
    setZones(prev => prev.map(z => z.id === zone.id ? updated : z));
  };

  const handleSaveBatch = async () => {
    if (!newZone.name) return;
    const res = await upsertShippingZone(newZone);
    if (res.success) {
      window.location.reload(); // Simple refresh for now
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Evict this shipping zone?")) {
      const res = await deleteShippingZone(id);
      if (res.success) window.location.reload();
    }
  };

  return (
    <div className="space-y-16">
      {/* Editorial Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-primary font-body text-xs uppercase tracking-[0.3em] mb-4 block">Logistics Management</span>
          <h2 className="text-5xl font-playfair font-bold tracking-tight text-foreground">Shipping Zones</h2>
        </div>
        <Button 
          variant="luxury" 
          onClick={() => setIsAdding(!isAdding)}
          className="h-14 px-8 text-[10px] tracking-widest font-black uppercase"
        >
          {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {isAdding ? "Cancel Entry" : "Add New Zone"}
        </Button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 p-8 border border-primary/20 space-y-6"
        >
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Zone Name</label>
              <Input 
                value={newZone.name}
                onChange={e => setNewZone({...newZone, name: e.target.value})}
                placeholder="PROVINCE / COUNTRY" 
                className="bg-black border-white/5 h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Major City</label>
              <Input 
                value={newZone.city_name}
                onChange={e => setNewZone({...newZone, city_name: e.target.value})}
                placeholder="CITY CENTER" 
                className="bg-black border-white/5 h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Base Fee (VND)</label>
              <Input 
                type="number"
                value={newZone.base_cost}
                onChange={e => setNewZone({...newZone, base_cost: Number(e.target.value)})}
                className="bg-black border-white/5 h-12"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="luxury" onClick={handleSaveBatch} className="h-12 px-10">
              <Save className="w-4 h-4 mr-2" />
              Deploy Zone
            </Button>
          </div>
        </motion.div>
      )}

      {/* Data Grid */}
      <div className="bg-zinc-950/50 border border-border/20 shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/50">
              <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Zone Name</th>
              <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Cities & Regions</th>
              <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Shipping Fee</th>
              <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold text-right">Status</th>
              <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {zones.map((zone) => (
              <tr key={zone.id} className="group hover:bg-zinc-900/50 transition-colors">
                <td className="py-8 px-6 align-top">
                  <span className="text-lg font-playfair font-semibold block">{zone.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Regional Courier</span>
                </td>
                <td className="py-8 px-6 align-top">
                  <div className="flex flex-wrap gap-2 max-w-md">
                    <span className="bg-zinc-900 border border-border/20 px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      {zone.city_name}
                    </span>
                  </div>
                </td>
                <td className="py-8 px-6 align-top">
                  <span className="text-primary font-bold text-lg font-mono">
                    {zone.base_cost.toLocaleString()} VND
                  </span>
                </td>
                <td className="py-8 px-6 align-top text-right">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={zone.is_active} 
                      onChange={() => handleToggle(zone)}
                    />
                    <div className="w-10 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-primary peer-checked:bg-primary/20"></div>
                  </label>
                </td>
                <td className="py-8 px-6 align-top text-right">
                  <button 
                    onClick={() => handleDelete(zone.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {zones.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground uppercase text-[10px] tracking-[0.2em]">
                  No active logistics modules detected.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
