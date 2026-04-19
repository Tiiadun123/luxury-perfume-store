"use client";

import { useTransition } from "react";
import { signout } from "../actions";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signout();
    });
  };

  return (
    <Button 
      type="button"
      variant="outline" 
      onClick={handleSignOut}
      disabled={isPending}
      className="h-14 px-8 text-[10px] tracking-widest font-bold uppercase border-border/40 hover:bg-destructive hover:text-destructive-foreground"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4 mr-2" />
      )}
      {isPending ? "Exiting..." : "Sign Out"}
    </Button>
  );
}
