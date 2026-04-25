"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const RECOVERY_COOKIE_NAME = "password_recovery_verified";
const RECOVERY_COOKIE_MAX_AGE = 60 * 10;

function mapRecoveryError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("expired") || normalized.includes("invalid")) {
    return "Mã OTP không chính xác hoặc đã hết hạn";
  }

  if (normalized.includes("rate") || normalized.includes("too many")) {
    return "Bạn đã thao tác quá nhanh. Vui lòng thử lại sau ít phút";
  }

  if (normalized.includes("password") && normalized.includes("weak")) {
    return "Mật khẩu chưa đủ mạnh. Vui lòng chọn mật khẩu khác";
  }

  return "Đã có lỗi xảy ra. Vui lòng thử lại";
}

function mapSupabaseError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email hoặc mật khẩu không đúng";
  if (m.includes("email not confirmed")) return "Vui lòng xác nhận email trước khi đăng nhập";
  if (m.includes("user already registered")) return "Email này đã được đăng ký";
  if (m.includes("rate limit")) return "Bạn thao tác quá nhanh. Vui lòng thử lại sau";
  return "Đã có lỗi xảy ra. Vui lòng thử lại";
}

export async function hasVerifiedRecoverySession() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(RECOVERY_COOKIE_NAME));
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const schema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  });

  const parsed = schema.safeParse({
    email: formData.get("email") || "",
    password: formData.get("password") || "",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: mapSupabaseError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const schema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"]
  });

  const parsed = schema.safeParse({
    email: formData.get("email") || "",
    password: formData.get("password") || "",
    confirmPassword: formData.get("confirmPassword") || "",
    fullName: formData.get("fullName") || "",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { email, password, fullName } = parsed.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: mapSupabaseError(error.message) };
  }

  return { success: true, data: "Hãy kiểm tra email để xác nhận tài khoản!" };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: mapSupabaseError(error.message) };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Email không hợp lệ" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  });

  if (error) {
    return { success: false, error: mapRecoveryError(error.message) };
  }

  return { success: true, data: "Mã OTP đã được gửi về email của bạn" };
}

export async function verifyResetOtp(email: string, token: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });

  if (error) {
    return { success: false, error: mapRecoveryError(error.message) };
  }

  const cookieStore = await cookies();
  cookieStore.set(RECOVERY_COOKIE_NAME, "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: RECOVERY_COOKIE_MAX_AGE,
  });

  return { success: true, data: "Xác thực OTP thành công" };
}

export async function resetPassword(newPassword: string) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  const hasRecoveryCookie = Boolean(cookieStore.get(RECOVERY_COOKIE_NAME));
  if (!hasRecoveryCookie) {
    return { success: false, error: "Phiên khôi phục không hợp lệ. Vui lòng xác thực OTP lại" };
  }

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return { success: false, error: "Phiên đăng nhập đã hết hạn. Vui lòng xác thực OTP lại" };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { success: false, error: mapRecoveryError(error.message) };
  }

  cookieStore.delete(RECOVERY_COOKIE_NAME);
  await supabase.auth.signOut();

  return { success: true, data: "Đặt lại mật khẩu thành công" };
}


