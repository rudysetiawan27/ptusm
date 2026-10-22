-- =====================================================
-- SEED DATA - Demo Data for Testing
-- ⚠️ Hanya untuk development/testing
-- =====================================================

-- =====================================================
-- 1. CATEGORIES
-- =====================================================

INSERT INTO categories (id, slug, status, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'infrared-heaters', 'active', 1),
  ('22222222-2222-2222-2222-222222222222', 'band-heaters', 'active', 2),
  ('33333333-3333-3333-3333-333333333333', 'cartridge-heaters', 'active', 3),
  ('44444444-4444-4444-4444-444444444444', 'tubular-heaters', 'active', 4);

INSERT INTO category_translations (category_id, locale, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'id', 'Pemanas Infrared', 'Pemanas infrared berkualitas tinggi'),
  ('11111111-1111-1111-1111-111111111111', 'en', 'Infrared Heaters', 'High-quality infrared heaters'),
  ('22222222-2222-2222-2222-222222222222', 'id', 'Pemanas Band', 'Band heater untuk berbagai aplikasi'),
  ('22222222-2222-2222-2222-222222222222', 'en', 'Band Heaters', 'Band heaters for various applications'),
  ('33333333-3333-3333-3333-333333333333', 'id', 'Pemanas Kartrid', 'Cartridge heater industri'),
  ('33333333-3333-3333-3333-333333333333', 'en', 'Cartridge Heaters', 'Industrial cartridge heaters'),
  ('44444444-4444-4444-4444-444444444444', 'id', 'Pemanas Tubular', 'Tubular heater fleksibel'),
  ('44444444-4444-4444-4444-444444444444', 'en', 'Tubular Heaters', 'Flexible tubular heaters');

-- =====================================================
-- 2. PRODUCTS
-- =====================================================

INSERT INTO products (id, sku, slug, category_id, status, unit, price, stock) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DEMO-CIH-001', 'ceramic-infrared-heater', '11111111-1111-1111-1111-111111111111', 'active', 'pcs', 1500000, 50),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'DEMO-NBH-002', 'nozzle-band-heater', '22222222-2222-2222-2222-222222222222', 'active', 'pcs', 850000, 75),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'DEMO-CH-003', 'cartridge-heater', '33333333-3333-3333-3333-333333333333', 'active', 'pcs', 650000, 100),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'DEMO-TH-004', 'tubular-heater', '44444444-4444-4444-4444-444444444444', 'active', 'pcs', 1200000, 60);

INSERT INTO product_translations (product_id, locale, name, short_description, long_description) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'id', 'Ceramic Infrared Heater', 'Pemanas infrared keramik untuk aplikasi industri dengan efisiensi tinggi', 'Ceramic Infrared Heater dirancang untuk memberikan pemanasan yang efisien dan merata pada berbagai aplikasi industri. Menggunakan teknologi keramik berkualitas tinggi yang tahan lama dan efisien energi.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'en', 'Ceramic Infrared Heater', 'High-efficiency ceramic infrared heater for industrial applications', 'Ceramic Infrared Heater is designed to provide efficient and uniform heating for various industrial applications. Uses high-quality ceramic technology that is durable and energy efficient.'),
  
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'id', 'Nozzle Band Heater', 'Band heater khusus untuk nozzle mesin injeksi plastik', 'Nozzle Band Heater dirancang khusus untuk pemanasan nozzle pada mesin injeksi plastik. Memberikan distribusi panas yang optimal dan kontrol suhu yang presisi untuk hasil produksi terbaik.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'en', 'Nozzle Band Heater', 'Specialized band heater for plastic injection machine nozzles', 'Nozzle Band Heater is specifically designed for heating nozzles in plastic injection machines. Provides optimal heat distribution and precise temperature control for best production results.'),
  
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'id', 'Cartridge Heater', 'Pemanas kartrid untuk aplikasi die casting dan hot runner', 'Cartridge Heater adalah solusi pemanasan yang kompak dan powerful untuk aplikasi die casting, hot runner, dan berbagai kebutuhan pemanasan industri lainnya. Desain tubular memungkinkan instalasi yang mudah dan transfer panas yang efisien.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'en', 'Cartridge Heater', 'Cartridge heater for die casting and hot runner applications', 'Cartridge Heater is a compact and powerful heating solution for die casting, hot runner, and various other United Heater needs. Tubular design allows easy installation and efficient heat transfer.'),
  
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'id', 'Tubular Heater', 'Pemanas tubular serbaguna untuk oven dan aplikasi pemanasan udara', 'Tubular Heater adalah elemen pemanas yang fleksibel dan serbaguna, cocok untuk berbagai aplikasi seperti oven industri, pemanasan udara, dan sistem HVAC. Dapat dibentuk sesuai kebutuhan dengan performa pemanasan yang handal.'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'en', 'Tubular Heater', 'Versatile tubular heater for ovens and air heating applications', 'Tubular Heater is a flexible and versatile heating element, suitable for various applications such as industrial ovens, air heating, and HVAC systems. Can be formed as needed with reliable heating performance.');

-- Product Specifications
INSERT INTO product_specifications (product_id, attribute, value_id, value_en, sort_order) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Power', '500W - 2000W', '500W - 2000W', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Voltage', '220V - 380V', '220V - 380V', 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Material', 'Keramik', 'Ceramic', 3),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Max Temperature', '650°C', '650°C', 4),
  
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Power', '300W - 1500W', '300W - 1500W', 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Voltage', '220V', '220V', 2),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Material', 'Mica', 'Mica', 3),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Max Temperature', '450°C', '450°C', 4),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Diameter', '25mm - 100mm', '25mm - 100mm', 5),
  
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Power', '200W - 1000W', '200W - 1000W', 1),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Voltage', '220V', '220V', 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Diameter', '6mm - 16mm', '6mm - 16mm', 3),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Length', '50mm - 300mm', '50mm - 300mm', 4),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Max Temperature', '800°C', '800°C', 5),
  
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Power', '1000W - 5000W', '1000W - 5000W', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Voltage', '220V - 380V', '220V - 380V', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Diameter', '8mm - 16mm', '8mm - 16mm', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Material', 'Stainless Steel 304/316', 'Stainless Steel 304/316', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Max Temperature', '600°C', '600°C', 5);

-- Product Images
INSERT INTO product_images (product_id, url, alt_id, alt_en, is_primary, sort_order) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://placehold.co/600x400/172B3A/E87524?text=Ceramic+Infrared+Heater', 'Ceramic Infrared Heater', 'Ceramic Infrared Heater', true, 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://placehold.co/600x400/172B3A/E87524?text=Nozzle+Band+Heater', 'Nozzle Band Heater', 'Nozzle Band Heater', true, 1),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://placehold.co/600x400/172B3A/E87524?text=Cartridge+Heater', 'Cartridge Heater', 'Cartridge Heater', true, 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'https://placehold.co/600x400/172B3A/E87524?text=Tubular+Heater', 'Tubular Heater', 'Tubular Heater', true, 1);

-- =====================================================
-- 3. TEST COMPANY & USER
-- =====================================================

-- ⚠️ CATATAN: User harus dibuat melalui Supabase Auth signup
-- Setelah signup, jalankan query berikut untuk membuat company:

-- INSERT INTO companies (id, legal_name, trade_name, address, city, phone, email, status) VALUES
--   ('test-company-id', 'PT Test Company', 'Test Company', 'Jl. Test No. 123', 'Jakarta', '+62211234567', 'test@company.com', 'approved');

-- INSERT INTO company_members (company_id, user_id, role, status) VALUES
--   ('test-company-id', 'user-id-from-auth', 'owner', 'active');
