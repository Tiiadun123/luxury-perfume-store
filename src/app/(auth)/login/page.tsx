import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="relative w-full max-w-lg overflow-hidden border border-border/40 p-1 bg-background">
        {/* Subtle Luxury Corner Decorative Ornaments (CSS purely) */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/40" />
        
        <div className="bg-background/80 backdrop-blur-sm p-12 md:p-16 border border-border/20">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
