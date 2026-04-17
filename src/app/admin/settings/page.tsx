"use client";

import { Save, Globe, Shield, CreditCard, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useTransition } from "react";
import { getSiteSettings, updateSiteSettings } from "@/features/admin/actions";
import { toast } from "sonner";
import { SiteSettings } from "@/types/admin";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data) setSettings(data);
    });
  }, []);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSiteSettings(settings);
      if (result.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    });
  };

  if (!settings) return <div className="p-12 text-center uppercase tracking-widest text-[10px]">Loading Atmosphere...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-4xl pb-20">
      <div className="flex justify-between items-end border-b border-border/20 pb-8">
        <div className="space-y-2">
          <h1 className="font-playfair text-5xl uppercase font-medium">Sanctuary Controls</h1>
          <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Configure the Maison Scêntia atmosphere</p>
        </div>
        <Button 
          variant="luxury" 
          className="h-12 px-8" 
          onClick={handleSave}
          disabled={isPending}
        >
           <Save className="w-4 h-4 mr-2" />
           {isPending ? "SAVING..." : "SAVE CHANGES"}
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
                 <Input 
                   value={settings.store_name} 
                   onChange={e => setSettings({...settings, store_name: e.target.value})}
                   className="uppercase"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">Default Currency</label>
                 <select 
                   className="w-full bg-background border border-border/20 h-10 px-4 text-[10px] tracking-widest uppercase outline-none focus:border-primary"
                   value={settings.default_currency}
                   onChange={e => setSettings({...settings, default_currency: e.target.value})}
                 >
                    <option value="VND">VND (Vietnamese Dong)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">Free Shipping Threshold (VND)</label>
                 <Input 
                   type="number"
                   value={settings.free_shipping_threshold} 
                   onChange={e => setSettings({...settings, free_shipping_threshold: Number(e.target.value)})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">Tax Rate (Decimal: 0.1 = 10%)</label>
                 <Input 
                   type="number"
                   step="0.01"
                   value={settings.tax_rate} 
                   onChange={e => setSettings({...settings, tax_rate: Number(e.target.value)})}
                 />
              </div>
           </div>
        </section>

        {/* Email / SMTP */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-primary">
              <Mail className="w-5 h-5" />
              <h2 className="text-xs tracking-[0.4em] font-black uppercase">MAIL SANCTUARY (SMTP)</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-border/10 p-8 bg-zinc-50 dark:bg-zinc-950/20">
              <div className="space-y-2">
                 <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">SMTP Host</label>
                 <Input 
                   value={settings.smtp_host || ""} 
                   onChange={e => setSettings({...settings, smtp_host: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">SMTP Port</label>
                 <Input 
                   type="number"
                   value={settings.smtp_port || ""} 
                   onChange={e => setSettings({...settings, smtp_port: Number(e.target.value)})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">SMTP User</label>
                 <Input 
                   value={settings.smtp_user || ""} 
                   onChange={e => setSettings({...settings, smtp_user: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] tracking-[0.3em] font-bold text-muted-foreground uppercase">SMTP Password</label>
                 <Input 
                   type="password"
                   value={settings.smtp_pass || ""} 
                   onChange={e => setSettings({...settings, smtp_pass: e.target.value})}
                 />
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
                 <button 
                   onClick={() => setSettings({...settings, stripe_enabled: !settings.stripe_enabled})}
                   className={`w-12 h-6 rounded-full relative transition-colors ${settings.stripe_enabled ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.stripe_enabled ? 'right-1' : 'left-1'}`} />
                 </button>
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
                 <button 
                   onClick={() => setSettings({...settings, two_factor_required: !settings.two_factor_required})}
                   className={`w-12 h-6 rounded-full relative transition-colors ${settings.two_factor_required ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.two_factor_required ? 'right-1' : 'left-1'}`} />
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
