-- Phase 1 Migration: Addressing schema mismatches found in project audit

-- 1. Add missing customer fields to orders
ALTER TABLE orders ADD COLUMN customer_name TEXT;
ALTER TABLE orders ADD COLUMN customer_email TEXT;

-- 2. Add button_text to banners
ALTER TABLE banners ADD COLUMN button_text TEXT;

-- 3. Sync shipping_zones with TypeScript definitions
ALTER TABLE shipping_zones ADD COLUMN countries TEXT[];
ALTER TABLE shipping_zones ADD COLUMN base_rate NUMERIC(12,2);
ALTER TABLE shipping_zones ADD COLUMN free_shipping_threshold NUMERIC(12,2);

-- 4. Add rating dimensions to reviews
ALTER TABLE reviews ADD COLUMN longevity_rating INTEGER;
ALTER TABLE reviews ADD COLUMN sillage_rating INTEGER;

-- 5. Create the decrement_stock_by_variant RPC missing from initial schema
CREATE OR REPLACE FUNCTION decrement_stock_by_variant(p_variant_id UUID, p_quantity INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE product_variants
  SET stock_quantity = stock_quantity - p_quantity,
      updated_at = NOW()
  WHERE id = p_variant_id AND stock_quantity >= p_quantity;
END;
$$ LANGUAGE plpgsql;
