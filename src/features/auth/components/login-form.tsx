"use client";

import { useTransition, useState } from "react";
import { login, signInWithGoogle } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function LoginForm({ showResetSuccess }: { showResetSuccess?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setLoginError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setLoginError(result.error);
      }
    });
  };

  const handleGoogleSignIn = () => {
    setLoginError(null);
    startTransition(async () => {
      const result = await signInWithGoogle();
      if (result?.error) {
        setLoginError(result.error);
      }
    });
  };

  return (
    <div className="w-full max-w-sm space-y-10">
      <div className="space-y-2 text-center">
        <h1 className="font-playfair text-4xl font-semibold tracking-tight text-foreground uppercase">
          Welcome Back
        </h1>
        <p className="text-sm tracking-[0.15em] text-muted-foreground uppercase">
          Enter the sanctuary of scent
        </p>
      </div>

      <div className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="w-full h-14 text-[10px] tracking-[0.2em] font-bold uppercase border-border/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 group transition-all"
          disabled={isPending}
          onClick={handleGoogleSignIn}
        >
          <svg className="w-4 h-4 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-[8px] tracking-[0.3em] uppercase">
            <span className="bg-background px-4 text-muted-foreground font-black">Or sign in with email</span>
          </div>
        </div>

        <form action={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <Input
            name="email"
            type="email"
            placeholder="EMAIL ADDRESS"
            required
            disabled={isPending}
            className="uppercase text-xs"
          />
          <Input
            name="password"
            type="password"
            placeholder="PASSWORD"
            required
            disabled={isPending}
            className="uppercase text-xs"
          />
        </div>

        {loginError && (
          <div className="flex items-start gap-3 p-4 border border-red-500/30 bg-red-500/5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[10px] tracking-[0.15em] font-bold uppercase text-red-500">
              {loginError}
            </p>
          </div>
        )}

        {showResetSuccess && !loginError && (
          <div className="flex items-start gap-3 p-4 border border-green-500/30 bg-green-500/5">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p className="text-[10px] tracking-[0.15em] font-bold uppercase text-green-500">
              Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="luxury"
          className="w-full h-14"
          disabled={isPending}
        >
          {isPending ? "AUTHENTICATING..." : "SIGN IN"}
        </Button>
      </form>
      </div>
      <div className="text-center space-y-4 pt-4">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-bold hover:underline transition-all"
          >
            JOIN SCÊNTIA
          </Link>
        </p>
        <Link
          href="/auth/forgot-password"
          className="block text-[10px] tracking-widest text-muted-foreground/60 uppercase hover:text-primary transition-colors"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
