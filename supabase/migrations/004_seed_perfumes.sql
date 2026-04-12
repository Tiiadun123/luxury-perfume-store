-- 🌸 SEED DATA - LUXURY PERFUME E-COMMERCE
-- 004_seed_perfumes.sql

-- 1. Brands
INSERT INTO brands (name, slug, description) VALUES 
('CHANEL', 'chanel', 'French luxury fashion house founded in 1910.'),
('DIOR', 'dior', 'Iconic French luxury brand renowned for its timeless elegance.'),
('CREED', 'creed', 'Multi-national niche perfume house based in Paris.'),
('TOM FORD', 'tom-ford', 'Modern luxury branding with provocative and elegant scents.');

-- 2. Categories
INSERT INTO categories (name, slug) VALUES 
('Men', 'men'),
('Women', 'women'),
('Unisex', 'unisex'),
('Floral', 'floral'),
('Woody', 'woody'),
('Oriental', 'oriental');

-- 3. Notes
INSERT INTO fragrance_notes (name) VALUES 
('Bergamot'), ('Rose'), ('Jasmine'), ('Patchouli'), ('Oud'), ('Vanilla'), ('Sandalwood'), ('Musk'), ('Amber');

-- 4. Products
-- Product 1: Bleu de Chanel
INSERT INTO products (brand_id, name, slug, description, concentration, gender, longevity, sillage, scent_family)
VALUES (
    (SELECT id FROM brands WHERE name = 'CHANEL'),
    'Bleu de Chanel', 'bleu-de-chanel',
    'A woody, aromatic fragrance for men, emphasizing freedom and power.',
    'Parfum', 'Men', '8-12h', 'Heavy', 'Woody'
);

-- Product 2: Sauvage
INSERT INTO products (brand_id, name, slug, description, concentration, gender, longevity, sillage, scent_family)
VALUES (
    (SELECT id FROM brands WHERE name = 'DIOR'),
    'Sauvage', 'sauvage',
    'A radically fresh composition, both raw and noble.',
    'Eau de Parfum', 'Men', '8-10h', 'Moderate', 'Woody'
);

-- Product 3: Aventus
INSERT INTO products (brand_id, name, slug, description, concentration, gender, longevity, sillage, scent_family)
VALUES (
    (SELECT id FROM brands WHERE name = 'CREED'),
    'Aventus', 'aventus',
    'Inspired by the dramatic life of a historic emperor who waged war, peace and romance.',
    'Millésime', 'Men', '10-14h', 'Heavy', 'Oriental'
);

-- 5. Variants (Prices)
INSERT INTO product_variants (product_id, size, sku, price, stock_quantity)
VALUES 
((SELECT id FROM products WHERE slug = 'bleu-de-chanel'), 100, 'CHANEL-BDC-100', 3850000, 50),
((SELECT id FROM products WHERE slug = 'sauvage'), 100, 'DIOR-SAUVAGE-100', 3450000, 30),
((SELECT id FROM products WHERE slug = 'aventus'), 100, 'CREED-AVENTUS-100', 8500000, 10);

-- 6. Images (Placeholders)
INSERT INTO product_images (product_id, url, is_main) VALUES 
((SELECT id FROM products WHERE slug = 'bleu-de-chanel'), 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1974&auto=format&fit=crop', true),
((SELECT id FROM products WHERE slug = 'sauvage'), 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2004&auto=format&fit=crop', true),
((SELECT id FROM products WHERE slug = 'aventus'), 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2053&auto=format&fit=crop', true);

-- 7. Notes Mapping
INSERT INTO product_notes (product_id, note_id, note_type) VALUES 
((SELECT id FROM products WHERE slug = 'bleu-de-chanel'), (SELECT id FROM fragrance_notes WHERE name = 'Bergamot'), 'Top'),
((SELECT id FROM products WHERE slug = 'bleu-de-chanel'), (SELECT id FROM fragrance_notes WHERE name = 'Sandalwood'), 'Base'),
((SELECT id FROM products WHERE slug = 'sauvage'), (SELECT id FROM fragrance_notes WHERE name = 'Bergamot'), 'Top'),
((SELECT id FROM products WHERE slug = 'sauvage'), (SELECT id FROM fragrance_notes WHERE name = 'Vanilla'), 'Base');
