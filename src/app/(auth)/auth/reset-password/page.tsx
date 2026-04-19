import { hasVerifiedRecoverySession } from "@/features/auth/actions";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hasVerifiedSession = await hasVerifiedRecoverySession();

  if (!user || !hasVerifiedSession) {
    redirect("/auth/forgot-password");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="relative w-full max-w-lg overflow-hidden border border-border/40 p-1 bg-background">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/40" />

        <div className="bg-background/80 backdrop-blur-sm p-12 md:p-16 border border-border/20">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
