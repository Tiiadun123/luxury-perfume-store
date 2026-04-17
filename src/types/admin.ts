export interface Brand {
  id: string;
  name: string;
  slug?: string;
  logo_url?: string;
  created_at?: string;
}

export interface ProductVariant {
  id?: string;
  product_id?: string;
  size: number;
  sku?: string;
  price: number;
  stock_quantity: number;
  created_at?: string;
}

export interface ProductImage {
  id?: string;
  product_id?: string;
  url: string;
  alt_text?: string;
  is_main?: boolean;
  display_order?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_id?: string;
  brand?: Brand;
  description?: string;
  concentration?: string;
  gender: "Men" | "Women" | "Unisex";
  scent_family?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_id?: string;
  product_name: string;
  variant_size: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  profile_id?: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  stripe_session_id?: string;
  shipping_address?: string;
  customer_name?: string;
  customer_email?: string;
  recipient_name?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface CustomerProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'manager' | 'customer';
  created_at: string;
  orders?: {
    total_amount: number;
    payment_status: string;
  }[];
  total_spent?: number;
}

export interface ShippingZone {
  id?: string;
  name: string;
  countries: string[];
  base_rate: number;
  free_shipping_threshold?: number;
  is_active: boolean;
}

export interface Banner {
  id?: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  button_text?: string;
  is_active: boolean;
  display_order: number;
}

export interface SiteSettings {
  id: number;
  store_name: string;
  default_currency: string;
  free_shipping_threshold: number;
  tax_rate: number;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  stripe_enabled: boolean;
  two_factor_required: boolean;
  updated_at?: string;
}
