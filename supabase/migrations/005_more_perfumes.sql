-- 005_more_perfumes.sql
-- Thêm các nhãn hiệu mới
INSERT INTO brands (name, slug, description) VALUES 
('MAISON FRANCIS KURKDJIAN', 'mfk', 'Parisian luxury fragrance house known for its sophisticated and luminous scents.'),
('LE LABO', 'le-labo', 'Cult NYC born luxury perfume brand known for soulful fragrances.'),
('KILIAN', 'kilian', 'Echoing luxury, elegance, and extreme sophistication.');

-- Thêm Nước hoa
INSERT INTO products (brand_id, name, slug, description, concentration, gender, longevity, sillage, scent_family)
VALUES 
-- Baccarat Rouge 540
((SELECT id FROM brands WHERE name = 'MAISON FRANCIS KURKDJIAN'), 'Baccarat Rouge 540', 'baccarat-rouge-540', 'Luminous and sophisticated, it lays on the skin like an amber, floral, and woody breeze.', 'Eau de Parfum', 'Unisex', '12h+', 'Heavy', 'Oriental'),
-- Santal 33
((SELECT id FROM brands WHERE name = 'LE LABO'), 'Santal 33', 'santal-33', 'An intoxicating blend of cardamom, iris, violet, and ambrox which crackle in the formula.', 'Eau de Parfum', 'Unisex', '10-12h', 'Moderate', 'Woody'),
-- Oud Wood
((SELECT id FROM brands WHERE name = 'TOM FORD'), 'Oud Wood', 'oud-wood', 'Rare. Exotic. Distinctive. One of the most rare, precious, and expensive ingredients in a perfumer''s arsenal.', 'Eau de Parfum', 'Unisex', '8-10h', 'Moderate', 'Woody'),
-- Black Phantom
((SELECT id FROM brands WHERE name = 'KILIAN'), 'Black Phantom', 'black-phantom', 'A seductive, sensual and dark fragrance with notes of rum, coffee, and cyanide.', 'Eau de Parfum', 'Unisex', '10h+', 'Heavy', 'Oriental'),
-- Libre
((SELECT id FROM brands WHERE name = 'DIOR'), 'Gris Dior', 'gris-dior', 'The olfactory expression of the Dior gray, the now-iconic color that Christian Dior loved to celebrate.', 'Eau de Parfum', 'Unisex', '8h+', 'Moderate', 'Floral');

-- Thêm giá (Variants)
INSERT INTO product_variants (product_id, size, sku, price, stock_quantity)
VALUES 
((SELECT id FROM products WHERE slug = 'baccarat-rouge-540'), 70, 'MFK-BR540-70', 8200000, 25),
((SELECT id FROM products WHERE slug = 'santal-33'), 100, 'LL-SANTAL33-100', 7500000, 40),
((SELECT id FROM products WHERE slug = 'oud-wood'), 50, 'TF-OUD-50', 5800000, 15),
((SELECT id FROM products WHERE slug = 'black-phantom'), 50, 'KILIAN-BP-50', 7900000, 10),
((SELECT id FROM products WHERE slug = 'gris-dior'), 125, 'DIOR-GRIS-125', 7200000, 20);

-- Thêm Ảnh (Sử dụng Unsplash làm placeholder sang trọng)
INSERT INTO product_images (product_id, url, is_main) VALUES 
((SELECT id FROM products WHERE slug = 'baccarat-rouge-540'), 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1974&auto=format&fit=crop', true),
((SELECT id FROM products WHERE slug = 'santal-33'), 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1974&auto=format&fit=crop', true),
((SELECT id FROM products WHERE slug = 'oud-wood'), 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2004&auto=format&fit=crop', true),
((SELECT id FROM products WHERE slug = 'black-phantom'), 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop', true),
((SELECT id FROM products WHERE slug = 'gris-dior'), 'https://images.unsplash.com/photo-1615397323608-f1cbf2165b4c?q=80&w=1974&auto=format&fit=crop', true);
