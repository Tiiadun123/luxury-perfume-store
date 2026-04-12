"use client";

import { useTransition } from "react";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        alert(result.error);
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
          href="/forgot-password"
          className="block text-[10px] tracking-widest text-muted-foreground/60 uppercase hover:text-primary transition-colors"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
