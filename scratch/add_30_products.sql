-- SQL to add 30 new products and fix 3 existing ones

-- 1. Fix existing 3 products (mapping to local images)
UPDATE public.product_images
SET url = '/images/products/ck-one.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'ck-one-unisex');

UPDATE public.product_images
SET url = '/images/products/kilian-love.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'kilian-love-dont-be-shy');

UPDATE public.product_images
SET url = '/images/products/versace-bright-crystal.png'
WHERE product_id IN (SELECT id FROM public.products WHERE slug = 'versace-bright-crystal');

-- 2. Add 30 New Products
DO $$
DECLARE
    -- Brands
    b_chanel UUID := '0bec72f1-84f0-4ac3-9ab9-697c94ddf335';
    b_lv UUID := '765d570f-0ecd-416c-a6af-da85129aa797';
    b_dior UUID := 'f57fcbb7-40cc-47cd-b5f1-f383aad76d7f';
    b_ysl UUID := '32200f94-9710-4ca3-a4e7-f40d7d893ac0';
    b_guerlain UUID := 'f252e11a-311f-4346-ab77-3c09d9a61f6c';
    b_amouage UUID := 'f9a2c58a-a6da-47c4-8fcd-b6d473649f03';
    b_pdm UUID := '466f3066-23a5-4c1b-a067-c95408e6a1f3';
    b_ch UUID := 'ba1f204a-654d-4baa-9c80-42c18a7512c9';
    b_lancome UUID := 'a945b2b6-3442-4f74-afec-3da623fb4114';
    b_bvlgari UUID := 'dee3f694-ade0-4c5f-935a-f3eea35e249d';
    b_vr UUID := '3c8e4388-458d-479d-9dcf-e79ef5476b7c';
    b_dg UUID := '45eaa8e0-6e01-40b4-8c52-62ef945f4468';
    b_pr UUID := '52671b42-d037-4385-b214-17b35ffc5943';
    b_prada UUID := 'ea9687fe-a0fb-40ca-8407-4c411d97b67f';
    b_jm UUID := '1b6d9c1d-aeff-4297-a6ac-3deadbd081c8';
    b_byredo UUID := 'eda717c8-8bdf-4631-ab1f-e7174e6552a8';
    b_tf UUID := '98f80554-0822-4695-a170-b9890aad4bc6';
    b_creed UUID := '44b56de4-b2cb-4e26-a10f-b717c281d346';
    b_armani UUID := '65aa4c56-a2c7-4687-bcdd-785908532bcf';
    b_lelabo UUID := 'fc244c31-0eb6-40b9-a573-82b715352673';
    b_mfk UUID := 'fc258f9f-c68b-4d52-87cf-1fe68fba9f45';
    b_ms UUID := '845f9c2e-e958-452b-b0b1-6b1ec9314043';

    -- Gender Categories
    cat_men UUID := 'b7bf6c7d-0ef4-40fa-a6ff-5b9c96e01388';
    cat_women UUID := '54fe5829-9efb-431d-93e0-6c91ef6c8332';
    cat_unisex UUID := 'fdf6df6d-6b4d-4acc-bff8-e78f17150cc8';

    -- Scent Categories
    cat_floral UUID := '84de31f0-ac27-4c96-a443-137b9f73b1a3';
    cat_woody UUID := '470d73fb-0b9d-4332-92c5-87342c43081a';
    cat_oriental UUID := '01f1d0b8-331f-40af-931e-59dafa3c808a';
    cat_citrus UUID := '88a3111e-beb0-4e8b-9607-c6b2bc171f5a';
    cat_fresh UUID := '8300a657-7032-4b7f-ab53-555841b0512e';
    cat_leather UUID := '5a185fa2-4110-4ee2-a9df-eaa2cdc86f2e';
    cat_spiced UUID := '5c81e12b-6780-45ba-a3d9-47dadbf08245';

    new_prod_id UUID;
BEGIN
    -- 1. Bleu de Chanel
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Bleu de Chanel', 'bleu-de-chanel-parfum', 'A sophisticated and contemporary fragrance that reveals the spirit of a man who chooses his own destiny.', b_chanel, 165.00, 185.00, true, 50)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/bleu-de-chanel.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_men), (new_prod_id, cat_fresh);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '50ml', 135.00, 25), (new_prod_id, '100ml', 165.00, 25);

    -- 2. Black Opium
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Black Opium', 'ysl-black-opium-edp', 'A glam rock fragrance full of mystery and energy. An addictive floral oriental.', b_ysl, 155.00, 175.00, true, 40)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/black-opium.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_oriental);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '50ml', 125.00, 20), (new_prod_id, '90ml', 155.00, 20);

    -- 3. Layton
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Layton', 'pdm-layton-edp', 'A paroxysm of elegance. A woody and spicy oriental fragrance.', b_pdm, 280.00, 310.00, true, 30)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/layton.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_men), (new_prod_id, cat_oriental);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '75ml', 210.00, 15), (new_prod_id, '125ml', 280.00, 15);

    -- 4. Delina
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Delina', 'pdm-delina-edp', 'A charming and firmly modern floral bouquet.', b_pdm, 290.00, 320.00, true, 35)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/delina.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_floral);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '75ml', 290.00, 35);

    -- 5. Lost Cherry
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Lost Cherry', 'tf-lost-cherry-edp', 'A full-bodied journey into the once-forbidden.', b_tf, 395.00, 450.00, true, 20)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/lost-cherry.jpg', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_oriental);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '50ml', 395.00, 20);

    -- 6. Tobacco Vanille
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Tobacco Vanille', 'tf-tobacco-vanille-edp', 'A modern take on an old-world gentleman’s club.', b_tf, 285.00, 325.00, false, 25)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/tobacco-vanille.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_spiced);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '50ml', 285.00, 25);

    -- 7. Ombre Leather
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Ombre Leather', 'tf-ombre-leather-edp', 'Vast and untethered. A floral leather fragrance.', b_tf, 160.00, 185.00, false, 30)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/ombre-leather.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_leather);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '50ml', 130.00, 15), (new_prod_id, '100ml', 160.00, 15);

    -- 8. Tuscan Leather
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Tuscan Leather', 'tf-tuscan-leather-edp', 'Animalic facet of leather and its smooth, voluptuous qualities.', b_tf, 285.00, 325.00, false, 15)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/tuscan-leather.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_leather);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '50ml', 285.00, 15);

    -- 9. Silver Mountain Water
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Silver Mountain Water', 'creed-smw-edp', 'Captures the purity of the mountains.', b_creed, 320.00, 365.00, true, 25)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/silver-mountain-water.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_fresh);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 320.00, 25);

    -- 10. Afternoon Swim
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Afternoon Swim', 'lv-afternoon-swim-edp', 'A plunge into an ocean of sensations.', b_lv, 320.00, 350.00, true, 20)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/afternoon-swim.jpg', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_citrus);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 320.00, 20);

    -- 11. Interlude Man
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Interlude Man', 'amouage-interlude-edp', 'Inspired by chaos and disorder.', b_amouage, 260.00, 300.00, false, 15)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/interlude-man.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_men), (new_prod_id, cat_oriental);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 260.00, 15);

    -- 12. Shalimar
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Shalimar', 'guerlain-shalimar-edp', 'The first oriental perfume in history.', b_guerlain, 145.00, 165.00, false, 30)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/shalimar.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_oriental);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '90ml', 145.00, 30);

    -- 13. Santal Royal
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Santal Royal', 'guerlain-santal-royal-edp', 'Inspired by the treasures of the East.', b_guerlain, 195.00, 220.00, false, 20)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/santal-royal.jpg', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_woody);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '125ml', 195.00, 20);

    -- 14. Oud de Minuit
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Oud de Minuit', 'ms-oud-de-minuit-exclusive', 'Dark oud and midnight roses.', b_ms, 450.00, 500.00, true, 10)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/oud-de-minuit.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_woody);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 450.00, 10);

    -- (Repeat process for 15-30 with generic placeholder mapping info if needed, but I will fill them all)
    -- 15. La Vie Est Belle
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('La Vie Est Belle', 'lancome-lavie-est-belle', 'A choice to break free from convention.', b_lancome, 140.00, 160.00, true, 45)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/lavie-belle.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_floral);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 140.00, 45);

    -- 16. Flowerbomb
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Flowerbomb', 'vr-flowerbomb-edp', 'A floral explosion.', b_vr, 165.00, 185.00, false, 30)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/flowerbomb.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_floral);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 165.00, 30);

    -- 17. Si Passione
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Si Passione', 'armani-si-passione-edp', 'A powerful reinvention of signature Armani.', b_armani, 150.00, 170.00, false, 25)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/si-passione.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_floral);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 150.00, 25);

    -- 18. Good Girl
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Good Girl', 'ch-good-girl-edp', 'A weapon of seduction.', b_ch, 135.00, 155.00, true, 40)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/good-girl.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_floral);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '80ml', 135.00, 40);

    -- 19. Light Blue Pour Homme
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Light Blue Pour Homme', 'dg-light-blue-homme-edt', 'Joy of life and seduction.', b_dg, 110.00, 130.00, false, 50)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/dg-light-blue.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_men), (new_prod_id, cat_fresh);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '125ml', 110.00, 50);

    -- 20. 1 Million
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('1 Million', 'pr-one-million-edt', 'The scent of success.', b_pr, 115.00, 135.00, true, 60)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/one-million.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_men), (new_prod_id, cat_spiced);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 115.00, 60);

    -- 21. Sauvage Elixir (New Edition)
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Sauvage Elixir Special', 'dior-sauvage-elixir-special', 'Extraordinarily concentrated fragrance.', b_dior, 230.00, 260.00, true, 20)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/sauvage-elixir.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_men), (new_prod_id, cat_spiced);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '60ml', 230.00, 20);

    -- 24. Santal 33 Limited
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Santal 33 Limited', 'lelabo-santal33-limited', 'Iconic Woody Aromatic fragrance in limited bottle.', b_lelabo, 320.00, 350.00, true, 15)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/santal33-limited.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_woody);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 320.00, 15);

    -- 25. Libre
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Libre', 'ysl-libre-parfum', 'The fragrance of freedom.', b_ysl, 165.00, 185.00, false, 30)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/ysl-libre.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_floral);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '90ml', 165.00, 30);

    -- 26. Aqva Pour Homme
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Aqva Pour Homme', 'bvlgari-aqva-homme-edt', 'Evokes the power and beauty of the sea.', b_bvlgari, 115.00, 135.00, false, 40)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/bvlgari-aqva.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_men), (new_prod_id, cat_fresh);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 115.00, 40);

    -- 27. Fucking Fabulous
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Fucking Fabulous', 'tf-fucking-fabulous-edp', 'A decadent oriental leather.', b_tf, 395.00, 450.00, true, 10)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/tf-fabulous.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_leather);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '50ml', 395.00, 10);

    -- 28. Paradoxe
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Paradoxe', 'prada-paradoxe-edp', 'Capturing the essence of the undefinable.', b_prada, 155.00, 175.00, false, 35)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/prada-paradoxe.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_floral);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '90ml', 155.00, 35);

    -- 29. Bal d''Afrique
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Bal d''Afrique', 'byredo-bal-afrique-edp', 'A warm and romantic vetiver.', b_byredo, 205.00, 230.00, true, 25)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/byredo-bal.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_woody);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 290.00, 25);

    -- 30. English Pear & Freesia
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('English Pear & Freesia', 'jm-english-pear-freesia', 'The essence of autumn.', b_jm, 155.00, 175.00, true, 40)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/jm-pear.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_floral);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '100ml', 155.00, 40);

    -- Remaining (Filling up to 30)
    -- 22. Aventus For Her
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Aventus For Her', 'creed-aventus-her-edp', 'Feminine counterpart to legendary Aventus.', b_creed, 360.00, 410.00, true, 15)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/aventus-her.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_women), (new_prod_id, cat_floral);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '75ml', 360.00, 15);

    -- 23. Baccarat Rouge 540 Extrait
    INSERT INTO public.products (name, slug, description, brand_id, price, original_price, is_featured, stock_quantity)
    VALUES ('Baccarat Rouge 540 Extrait', 'mfk-br540-extrait-parfum', 'Ultimate manifestation of the original scent.', b_mfk, 435.00, 480.00, true, 10)
    RETURNING id INTO new_prod_id;
    INSERT INTO public.product_images (product_id, url, is_main) VALUES (new_prod_id, '/images/products/br540-extrait.png', true);
    INSERT INTO public.product_categories (product_id, category_id) VALUES (new_prod_id, cat_unisex), (new_prod_id, cat_oriental);
    INSERT INTO public.product_variants (product_id, size, price, stock_quantity) VALUES (new_prod_id, '70ml', 435.00, 10);

END $$;
