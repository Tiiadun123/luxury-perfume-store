# SCÊNTIA | Luxury Perfume & Fragrances

SCÊNTIA (Maison Scêntia) là một nền tảng thương mại điện tử cao cấp chuyên về nước hoa xa xỉ và các dòng sản phẩm mùi hương niche. Dự án được thiết kế với giao diện sang trọng, tối ưu trải nghiệm người dùng và tích hợp đầy đủ các tính năng của một cửa hàng trực tuyến hiện đại.

## 🚀 Công nghệ sử dụng

### Frontend & UI
- **Framework**: Next.js 16 (App Router) với Turbopack.
- **Ngôn ngữ**: TypeScript.
- **Styling**: Tailwind CSS 4, Framer Motion (hiệu ứng mượt mà).
- **Thư viện UI**: Lucide React, Sonner (thông báo), Radix UI (thông qua shadcn/ui).

### Backend & Dịch vụ
- **Database & Auth**: Supabase (PostgreSQL, Real-time).
- **Thanh toán**: Stripe (Tích hợp Checkout và Webhooks).
- **Email**: Resend (Gửi thông báo đơn hàng và xác thực).

### Quản lý dữ liệu
- **State Management**: Zustand.
- **Data Fetching**: TanStack Query (React Query).
- **Form Handling**: React Hook Form kết hợp với Zod để validate dữ liệu.

## 🛠 Cấu trúc dự án

Dự án tuân thủ cấu trúc thư mục theo tính năng (Feature-based structure):
- `src/features/`: Chứa các module logic chính như `admin`, `auth`, `cart`, `checkout`, `products`, `profile`, `reviews`, `shop`, `wishlist`.
- `src/components/`: Các UI components dùng chung (buttons, inputs, luxury cursor...).
- `src/lib/`: Cấu hình cho các dịch vụ bên thứ ba (Stripe, Supabase).
- `src/utils/`: Các hàm tiện ích bổ trợ.

## 💻 Cài đặt và Chạy Local

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env.local` dựa trên mẫu `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL` & `ANON_KEY`: Lấy từ bảng điều khiển Supabase.
- `STRIPE_SECRET_KEY` & `WEBHOOK_SECRET`: Lấy từ Stripe Dashboard.
- `RESEND_API_KEY`: Lấy từ Resend Dashboard.

### 3. Chạy môi trường phát triển
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📜 Các lệnh chính
- `npm run dev`: Khởi chạy server ở chế độ development.
- `npm run build`: Tạo bản build tối ưu cho production.
- `npm run start`: Chạy bản build đã tạo.
- `npm run lint`: Kiểm tra lỗi code theo quy tắc ESLint.

## 🔒 Ghi chú bảo mật
Dự án sử dụng Supabase RLS (Row Level Security) để bảo vệ dữ liệu người dùng. Mọi thay đổi quan trọng liên quan đến admin đều được xác thực qua server actions.

