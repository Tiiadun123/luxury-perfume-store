"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/features/auth/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CustomerProfile } from "@/types/admin";

export default function ProfileEditForm({ initialProfile }: { initialProfile: CustomerProfile }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    const result = await updateProfile({
      full_name: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    });

    setIsPending(false);

    if (result.success) {
      toast.success("Hồ sơ đã được cập nhật tinh hoa");
      router.push("/profile");
      router.refresh();
    } else {
      toast.error(result.error || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <Link href="/profile">
           <Button variant="ghost" className="gap-2 text-[10px] tracking-widest uppercase font-bold text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4" />
              Chỉnh sửa
           </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="font-playfair text-5xl uppercase font-medium">Personal Details</h1>
        <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Update your olfactory identity</p>
      </div>

      <form action={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
             <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary flex items-center gap-2">
                <User className="w-3 h-3" /> Full Name
             </label>
             <Input 
               name="fullName" 
               defaultValue={initialProfile?.full_name || ""} 
               placeholder="NAME OF THE RECIPIENT"
               className="h-14 bg-zinc-50 dark:bg-zinc-950 border-border/20 focus:border-primary/40"
               required 
             />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary flex items-center gap-2">
                <Phone className="w-3 h-3" /> Phone Number
             </label>
             <Input 
               name="phone" 
               defaultValue={initialProfile?.phone || ""} 
               placeholder="CONTACT NUMBER"
               className="h-14 bg-zinc-50 dark:bg-zinc-950 border-border/20 focus:border-primary/40"
             />
          </div>

          <div className="space-y-3">
             <label className="text-[10px] tracking-[0.2em] font-black uppercase text-primary flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Shipping Address
             </label>
             <Input 
               name="address" 
               defaultValue={initialProfile?.address || ""} 
               placeholder="STREET, CITY, COUNTRY"
               className="h-14 bg-zinc-50 dark:bg-zinc-950 border-border/20 focus:border-primary/40"
             />
          </div>
        </div>

        <div className="pt-8">
           <Button 
             type="submit" 
             variant="luxury" 
             className="w-full h-16 text-xs tracking-[0.4em] font-black"
             disabled={isPending}
           >
             {isPending ? "PRESERVING CHANGES..." : "SAVE MASTERPIECE"}
           </Button>
        </div>
      </form>
    </div>
  );
}
