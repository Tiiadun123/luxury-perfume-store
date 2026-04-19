"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { requestPasswordReset, verifyResetOtp } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OtpVerificationFormProps {
  email: string;
  onBack: () => void;
}

type MessageState = { type: "success" | "error"; text: string } | null;

const COOLDOWN_SECONDS = 60;

export function OtpVerificationForm({ email, onBack }: OtpVerificationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<MessageState>(null);
  const storageKey = `otp-resend-${email.toLowerCase()}`;
  const [cooldownUntil, setCooldownUntil] = useState<number>(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    const stored = window.sessionStorage.getItem(storageKey);
    const parsed = stored ? Number(stored) : 0;

    return !Number.isNaN(parsed) && parsed > Date.now() ? parsed : 0;
  });
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (cooldownUntil > now) {
      window.sessionStorage.setItem(storageKey, String(cooldownUntil));
      return;
    }

    window.sessionStorage.removeItem(storageKey);
  }, [cooldownUntil, now, storageKey]);

  const secondsLeft = cooldownUntil > now ? Math.ceil((cooldownUntil - now) / 1000) : 0;

  const handleVerify = (formData: FormData) => {
    const token = String(formData.get("otp") ?? "").trim();
    setMessage(null);

    if (!token || token.length !== 6 || !/^\d{6}$/.test(token)) {
      setMessage({ type: "error", text: "Vui lòng nhập mã OTP gồm 6 chữ số" });
      return;
    }

    startTransition(async () => {
      const result = await verifyResetOtp(email, token);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }

      setMessage({ type: "success", text: (result?.data as string) ?? "Xác thực OTP thành công" });
      setTimeout(() => {
        router.push("/auth/reset-password");
      }, 1500);
    });
  };

  const handleResend = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }

      const current = Date.now();
      const nextCooldown = current + COOLDOWN_SECONDS * 1000;
      setNow(current);
      setCooldownUntil(nextCooldown);
      setMessage({ type: "success", text: "OTP mới đã được gửi về email" });
    });
  };

  return (
    <div className="w-full max-w-sm space-y-10">
      <div className="space-y-2 text-center">
        <h1 className="font-playfair text-4xl font-semibold tracking-tight text-foreground uppercase">
          Verify OTP
        </h1>
        <p className="text-sm tracking-[0.15em] text-muted-foreground uppercase">
          Enter 6-digit code sent to {email}
        </p>
      </div>

      <form action={handleVerify} className="space-y-10">
        <div className="space-y-10 pt-4">
          <div className="relative group">
            <Input
              name="otp"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="OTP CODE"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              disabled={isPending}
              className="bg-transparent border-border/20 focus:border-primary transition-all duration-500 text-center tracking-[0.45em] font-semibold"
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

        <div className="space-y-4">
          <Button type="submit" variant="luxury" className="w-full h-14" disabled={isPending}>
            {isPending ? "VERIFYING..." : "VERIFY OTP"}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" className="h-12" onClick={onBack} disabled={isPending}>
              BACK
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12"
              onClick={handleResend}
              disabled={isPending || secondsLeft > 0}
            >
              {secondsLeft > 0 ? `RESEND ${secondsLeft}s` : "RESEND OTP"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
