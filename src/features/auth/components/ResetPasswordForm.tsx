"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { resetPassword } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MessageState = { type: "success" | "error"; text: string } | null;

export function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<MessageState>(null);

  const handleReset = (formData: FormData) => {
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 8 ký tự" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(password);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }

      setMessage({ type: "success", text: (result?.data as string) ?? "Đổi mật khẩu thành công" });
      router.push("/login?reset=success");
    });
  };

  return (
    <div className="w-full max-w-sm space-y-10">
      <div className="space-y-2 text-center">
        <h1 className="font-playfair text-4xl font-semibold tracking-tight text-foreground uppercase">
          Reset Password
        </h1>
        <p className="text-sm tracking-[0.15em] text-muted-foreground uppercase">
          Set your new secure password
        </p>
      </div>

      <form action={handleReset} className="space-y-10">
        <div className="space-y-10 pt-4">
          <div className="relative group">
            <Input
              name="password"
              type="password"
              placeholder="NEW PASSWORD"
              required
              disabled={isPending}
              className="bg-transparent border-border/20 focus:border-primary transition-all duration-500"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-focus-within:w-full transition-all duration-700" />
          </div>

          <div className="relative group">
            <Input
              name="confirmPassword"
              type="password"
              placeholder="CONFIRM NEW PASSWORD"
              required
              disabled={isPending}
              className="bg-transparent border-border/20 focus:border-primary transition-all duration-500"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-focus-within:w-full transition-all duration-700" />
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`flex items-start gap-3 p-4 border ${
                message.type === "success"
                  ? "border-primary/30 bg-primary/5"
                  : "border-red-500/30 bg-red-500/5"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              )}
              <p
                className={`text-[10px] tracking-[0.15em] font-bold uppercase ${
                  message.type === "success" ? "text-primary" : "text-red-500"
                }`}
              >
                {message.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" variant="luxury" className="w-full h-14" disabled={isPending}>
          {isPending ? "UPDATING..." : "RESET PASSWORD"}
        </Button>
      </form>
    </div>
  );
}
