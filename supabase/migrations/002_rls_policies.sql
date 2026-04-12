-- 🔐 SUPABASE RLS POLICIES - LUXURY PERFUME E-COMMERCE
-- 002_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fragrance_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-----------------------------------------------------------
-- 1. PROFILES
-----------------------------------------------------------
-- Public can read limited profile info (if needed) but usually only owner
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles" ON profiles FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')));

-----------------------------------------------------------
-- 2. ADDRESSES
-----------------------------------------------------------
CREATE POLICY "Users can manage their own addresses" ON addresses FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Admins can view all addresses" ON addresses FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-----------------------------------------------------------
-- 3. PRODUCTS, BRANDS, CATEGORIES, VARIANTS (Catalog)
-----------------------------------------------------------
-- Everyone can view active products/brands/etc.
CREATE POLICY "Public can view active brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can view product categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public can view notes" ON fragrance_notes FOR SELECT USING (true);
CREATE POLICY "Public can view product_notes" ON product_notes FOR SELECT USING (true);

-- Admins can do everything
CREATE POLICY "Admins manage brands" ON brands FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage products" ON products FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage variants" ON product_variants FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-----------------------------------------------------------
-- 4. CART & WISHLIST
-----------------------------------------------------------
CREATE POLICY "Users manage their own cart" ON cart_items FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users manage their own wishlist" ON wishlists FOR ALL USING (auth.uid() = profile_id);

-----------------------------------------------------------
-- 5. ORDERS & TRANSACTIONS
-----------------------------------------------------------
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND profile_id = auth.uid()));
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE id = transactions.order_id AND profile_id = auth.uid()));

-- Admins manage all orders
CREATE POLICY "Admins manage all orders" ON orders FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')));
CREATE POLICY "Admins manage all order items" ON order_items FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')));

-----------------------------------------------------------
-- 6. REVIEWS
-----------------------------------------------------------
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Admins manage all reviews" ON reviews FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-----------------------------------------------------------
-- 7. COUPONS & FLASH SALES (Marketing)
-----------------------------------------------------------
CREATE POLICY "Users can view active coupons" ON coupons FOR SELECT USING (is_active = true AND (start_date <= NOW() OR start_date IS NULL) AND (end_date >= NOW() OR end_date IS NULL));
CREATE POLICY "Public can view active flash sales" ON flash_sales FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view banner" ON banners FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage marketing" ON coupons FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage banners" ON banners FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-----------------------------------------------------------
-- 8. SYSTEM LOGS
-----------------------------------------------------------
CREATE POLICY "Only admins view logs" ON activity_logs FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins view inventory logs" ON inventory_logs FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
