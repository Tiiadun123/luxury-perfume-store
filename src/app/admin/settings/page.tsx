import { Settings, Save, Globe, Shield, CreditCard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-4xl">
      <div className="flex justify-between items-end border-b border-border/20 pb-8">
        <div className="space-y-2">
          <h1 className="font-playfair text-5xl uppercase font-medium">Sanctuary Controls</h1>
          <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Configure the Maison Scêntia atmosphere</p>
        </div>
        <Button variant="luxury" className="h-12 px-8">
           <Save className="w-4 h-4 mr-2" />
           SAVE CHANGES
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* General Settings */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-primary">
              <Globe className="w-5 h-5" />
              <h2 className="text-xs tracking-[0.4em] font-black uppercase">GLOBAL PREFERENCES</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-border/10 p-8 bg-zinc-50 dark:bg-zinc-950/20">
              <div className="space-y-2">
                 <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">Store Name</label>
                 <input type="text" defaultValue="MAISON SCÊNTIA" className="w-full bg-background border border-border/20 h-12 px-4 text-[10px] tracking-widest uppercase outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">Default Currency</label>
                 <select className="w-full bg-background border border-border/20 h-12 px-4 text-[10px] tracking-widest uppercase outline-none focus:border-primary">
                    <option>VND (Vietnamese Dong)</option>
                    <option>EUR (Euro)</option>
                    <option>USD (US Dollar)</option>
                 </select>
              </div>
           </div>
        </section>

        {/* Payment & Stripe */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-primary">
              <CreditCard className="w-5 h-5" />
              <h2 className="text-xs tracking-[0.4em] font-black uppercase">FINANCIAL INTEGRATION</h2>
           </div>
           <div className="space-y-4 border border-border/10 p-8 bg-zinc-50 dark:bg-zinc-950/20">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest uppercase">Stripe Checkout</p>
                    <p className="text-[8px] text-muted-foreground tracking-widest uppercase">Enable real-time secure payments</p>
                 </div>
                 <div className="w-12 h-6 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                 </div>
              </div>
           </div>
        </section>

        {/* Security */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-primary">
              <Shield className="w-5 h-5" />
              <h2 className="text-xs tracking-[0.4em] font-black uppercase">SECURITY VAULT</h2>
           </div>
           <div className="space-y-4 border border-border/10 p-8 bg-zinc-50 dark:bg-zinc-950/20">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest uppercase">Two-Factor Authentication</p>
                    <p className="text-[8px] text-muted-foreground tracking-widest uppercase">Require 2FA for all administrative access</p>
                 </div>
                 <div className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
