"use client";

import { useTransition, useState } from "react";
import { login } from "../actions";
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
