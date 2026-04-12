import { createClient } from "@/utils/supabase/server";
import { Users, Search, Mail, Calendar } from "lucide-react";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  
  // Real apps would fetch from auth.users or a public.profiles table
  // Here we'll fetch from profiles assume it exists linked to auth.uid
  const { data: customers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end border-b border-border/20 pb-8">
        <div className="space-y-2">
          <h1 className="font-playfair text-5xl uppercase font-medium">Customer Registry</h1>
          <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Managing your distinguished clientele</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
           <input 
             type="text" 
             placeholder="SEARCH BY NAME OR EMAIL..." 
             className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-border/10 h-16 px-12 text-[10px] tracking-widest uppercase outline-none focus:border-primary/40 transition-all"
           />
        </div>

        <div className="border border-border/10 overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-border/10">
                    <th className="p-6 text-[8px] tracking-[0.3em] font-black uppercase text-muted-foreground">CUSTOMER</th>
                    <th className="p-6 text-[8px] tracking-[0.3em] font-black uppercase text-muted-foreground">CONTACT</th>
                    <th className="p-6 text-[8px] tracking-[0.3em] font-black uppercase text-muted-foreground">JOINED</th>
                    <th className="p-6 text-[8px] tracking-[0.3em] font-black uppercase text-muted-foreground text-right">TOTAL SPENT</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border/5">
                 {customers && customers.length > 0 ? customers.map((customer: any) => (
                    <tr key={customer.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-4 h-4 text-primary" />
                             </div>
                             <span className="text-xs font-bold tracking-widest uppercase">{customer.full_name || "VALUED CLIENT"}</span>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground tracking-widest uppercase">
                             <Mail className="w-3 h-3" />
                             {customer.email || "N/A"}
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground tracking-widest uppercase">
                             <Calendar className="w-3 h-3" />
                             {new Date(customer.created_at).toLocaleDateString()}
                          </div>
                       </td>
                       <td className="p-6 text-right">
                          <span className="text-[10px] font-bold tracking-widest">--- VND</span>
                       </td>
                    </tr>
                 )) : (
                    <tr>
                       <td colSpan={4} className="p-20 text-center">
                          <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                          <p className="font-playfair italic text-muted-foreground">The registry is currently empty.</p>
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
