-- 🗄️ SUPABASE INITIAL SCHEMA - LUXURY PERFUME E-COMMERCE
-- 001_initial_schema.sql

-- 1. PROFILES & AUTHENTICATION
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADDRESSES
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Home', -- Home, Office, etc.
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Vietnam',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BRANDS
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES (Scent Families, Gender, etc.)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS (Luxury Specialized)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    
    -- Fragrance Specs
    concentration TEXT, -- EDT, EDP, Parfum, etc.
    gender TEXT CHECK (gender IN ('Men', 'Women', 'Unisex')),
    longevity TEXT, -- 4-6h, 8-12h, etc.
    sillage TEXT, -- Heavy, Moderate, Soft
    scent_family TEXT, -- Woody, Floral, Oriental, etc.
    
    -- Stats
    avg_rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title TEXT,
    meta_description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FRAGRANCE NOTES (Top, Heart, Base)
CREATE TABLE fragrance_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT
);

-- 7. PRODUCT NOTES (Many-to-Many with Note Type)
CREATE TABLE product_notes (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    note_id UUID REFERENCES fragrance_notes(id) ON DELETE CASCADE,
    note_type TEXT CHECK (note_type IN ('Top', 'Heart', 'Base')),
    PRIMARY KEY (product_id, note_id, note_type)
);

-- 8. PRODUCT IMAGES
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_main BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0
);

-- 9. PRODUCT VARIANTS (Sizes/Bottles)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size INTEGER NOT NULL, -- in ml
    sku TEXT UNIQUE,
    price NUMERIC(12,2) NOT NULL,
    sale_price NUMERIC(12,2),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INVENTORY LOGS
CREATE TABLE inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    change_amount INTEGER NOT NULL,
    reason TEXT, -- purchase, restock, manual adjustment
    admin_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CART ITEMS
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, variant_id)
);

-- 12. WISHLISTS
CREATE TABLE wishlists (
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (profile_id, product_id)
);

-- 13. COUPONS
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value NUMERIC(12,2) NOT NULL,
    min_order_value NUMERIC(12,2) DEFAULT 0,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SHIPPING ZONES
CREATE TABLE shipping_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city_name TEXT,
    postcode_prefix TEXT,
    base_cost NUMERIC(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 15. ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL, -- ORD-YYYYMMDD-XXXX
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partially_paid', 'refunded')),
    payment_method TEXT, -- Stripe, COD, VNPay
    
    -- Address Snapshot
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    
    -- Costs
    subtotal NUMERIC(12,2) NOT NULL,
    shipping_cost NUMERIC(12,2) DEFAULT 0,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    
    -- Gift Options
    is_gift BOOLEAN DEFAULT FALSE,
    gift_message TEXT,
    gift_wrap_cost NUMERIC(12,2) DEFAULT 0,
    
    tracking_number TEXT,
    notes TEXT,
    coupon_id UUID REFERENCES coupons(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_size INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL
);

-- 17. TRANSACTIONS (Payments)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    provider TEXT, -- Stripe, PayPal, etc.
    provider_id TEXT, -- Transaction ID from provider
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'VND',
    status TEXT,
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. REVIEWS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    image_urls TEXT[],
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. FLASH SALES
CREATE TABLE flash_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. FLASH SALE ITEMS
CREATE TABLE flash_sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flash_sale_id UUID REFERENCES flash_sales(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    sale_price NUMERIC(12,2) NOT NULL,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0
);

-- 21. BANNERS
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. ADMIN ACTIVITY LOGS
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL, -- create, update, delete
    entity_type TEXT NOT NULL, -- product, order, coupon
    entity_id TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. PRODUCT_CATEGORIES (Linking products to multiple categories)
CREATE TABLE product_categories (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- 24. ROLES / PERMISSIONS (Optional but good for 24-table vision)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-----------------------------------------------------------
-- TRIGGERS & FUNCTIONS
-----------------------------------------------------------

-- Function to Update Average Rating
CREATE OR REPLACE FUNCTION update_product_stats() 
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET 
        avg_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE)
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_product_stats();

-- Function to Auto-generate Order Number
-- Format: ORD-YYYYMMDD-XXXX
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    today_date TEXT;
    seq_number TEXT;
BEGIN
    today_date := TO_CHAR(NOW(), 'YYYYMMDD');
    -- Simple sequence approach
    SELECT LPAD(COUNT(*)::TEXT, 4, '0') INTO seq_number 
    FROM orders 
    WHERE created_at::DATE = NOW()::DATE;
    
    NEW.order_number := 'ORD-' || today_date || '-' || seq_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gen_order_no
BEFORE INSERT ON orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION generate_order_number();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_set_updated_at_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_set_updated_at_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();
