-- ==============================================================================
-- LEAFNEST.LK SUPABASE DATABASE SCHEMA
-- Sri Lanka's Premier Artificial Plants, Pots & Accessories Store
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('artificial-plants', 'pots-planters', 'accessories-decor')),
    price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2) DEFAULT NULL,
    stock TEXT NOT NULL DEFAULT 'in' CHECK (stock IN ('in', 'low', 'out')),
    size TEXT DEFAULT '',
    material TEXT DEFAULT '',
    description TEXT DEFAULT '',
    features JSONB DEFAULT '[]'::jsonb,
    care JSONB DEFAULT '[]'::jsonb,
    image TEXT DEFAULT '/images/cat-artificial.webp',
    images JSONB DEFAULT '[]'::jsonb,
    badge TEXT DEFAULT NULL,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by category and slug
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT DEFAULT '',
    customer_city TEXT DEFAULT '',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'WhatsApp Order',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- 4. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    whatsapp_number TEXT NOT NULL DEFAULT '94775835445',
    free_delivery_threshold NUMERIC(10, 2) DEFAULT 5000,
    announcement_text TEXT DEFAULT 'Bring Nature Home — Free Delivery on Orders Over Rs. 5,000',
    announcement_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Seed Initial Products (Artificial plants, pots, accessories)
INSERT INTO public.products (slug, name, category, price, old_price, stock, size, material, description, features, care, image, badge, featured)
VALUES
(
    'artificial-monstera-deliciosa',
    'Artificial Monstera Deliciosa Plant',
    'artificial-plants',
    3800,
    4500,
    'in',
    'Approx. 65 cm tall, in weighted pot base',
    'Textured silk-polymer leaves, lifelike stems, weighted base',
    'The iconic split-leaf Swiss Cheese plant in an ultra-realistic artificial finish. Handcrafted leaves with natural gloss that never need watering, misting, or sunlight.',
    '["Zero watering or care required", "Realistic embossed leaf veins", "Weighted pot base for stability", "Fade resistant polymer"]'::jsonb,
    '["Dust leaves occasionally with a soft dry cloth", "Keep away from harsh direct outdoor rain"]'::jsonb,
    '/images/products/monstera.jpg',
    'Best Seller',
    true
),
(
    'artificial-fiddle-leaf-fig',
    'Artificial Fiddle Leaf Fig Tree',
    'artificial-plants',
    5500,
    6500,
    'in',
    'Approx. 90 cm tall',
    'Textured polymer leaves with realistic trunk and weighted pot',
    'The stately elegance of a fiddle leaf fig tree without any of the finicky maintenance. Natural veined leaves and lifelike branches suit living rooms and offices.',
    '["No watering or sunlight needed", "Handcrafted lifelike foliage", "Weighted base for stability", "Evergreen appearance"]'::jsonb,
    '["Dust leaves occasionally with a soft dry cloth", "Keep away from prolonged outdoor sun exposure"]'::jsonb,
    '/images/products/fiddle-leaf.jpg',
    'Popular',
    true
),
(
    'artificial-hanging-ivy',
    'Artificial Trailing Ivy Vines',
    'artificial-plants',
    1400,
    NULL,
    'in',
    'Approx. 120 cm length',
    'Silk-blend leaves and flexible wired stem',
    'Cascading botanical greenery to drape over bookshelves, wall brackets, or hanging planters for an instant lush green waterfall effect.',
    '["Trailing cascade effect", "Lightweight and flexible", "Ready to hang anywhere", "Zero maintenance"]'::jsonb,
    '["Gently wipe with a damp microfiber cloth when dusty"]'::jsonb,
    '/images/products/ivy.jpg',
    NULL,
    false
),
(
    'artificial-snake-plant',
    'Artificial Sansevieria Snake Plant',
    'artificial-plants',
    2400,
    2900,
    'in',
    'Approx. 50 cm tall',
    'High-density polymer with yellow variegated margins',
    'Architectural upright artificial snake plant with striking yellow-green banded foliage. Adds modern clean lines to desks and corners without any watering.',
    '["No watering needed", "Distinctive variegated pattern", "Compact modern look", "Zero care"]'::jsonb,
    '["Wipe clean with a dry cloth"]'::jsonb,
    '/images/products/snake-plant.jpg',
    NULL,
    false
),
(
    'artificial-succulent-set',
    'Minimalist Potted Succulent Trio',
    'artificial-plants',
    1650,
    NULL,
    'in',
    'Set of 3, approx. 10 cm each',
    'Matte ceramic pots with lifelike artificial succulents',
    'A charming trio of potted artificial succulents for study desks, bedside tables, bathroom counters, and coffee tables.',
    '["Curated set of 3 distinct varieties", "White ceramic pots included", "Compact tabletop size", "Ready to display"]'::jsonb,
    '["Dust with a soft brush as needed"]'::jsonb,
    '/images/products/succulent.jpg',
    NULL,
    false
),
(
    'minimal-ceramic-pot-white',
    'Minimal Ceramic Pot – Matte White',
    'pots-planters',
    1800,
    NULL,
    'in',
    'Approx. 15 cm diameter × 14 cm height',
    'High-fired ceramic with matte satin glaze',
    'A timeless, minimalist ceramic pot with a seamless profile that puts your greenery at center stage. Includes a matching drainage saucer.',
    '["Handcrafted ceramic", "Matte satin glaze finish", "Suits artificial and decorative plants", "Clean minimalist lines"]'::jsonb,
    '["Wipe clean with a damp cloth"]'::jsonb,
    '/images/products/ceramic-pot.jpg',
    NULL,
    true
),
(
    'modern-indoor-planter',
    'Modern Ribbed Cylinder Planter',
    'pots-planters',
    2400,
    2800,
    'low',
    'Approx. 22 cm diameter × 20 cm height',
    'Textured ceramic with subtle architectural ribs',
    'A substantial architectural planter with tactile ribbing, crafted for medium-to-large statement plants like artificial Monsteras and Ficus trees.',
    '["Statement architectural shape", "Heavyweight stable base", "Subtle ribbed texture", "Designer neutral tone"]'::jsonb,
    '["Wipe clean with warm water and a soft sponge"]'::jsonb,
    '/images/products/modern-planter.jpg',
    'Low Stock',
    false
),
(
    'hanging-planter',
    'Nordic Ceramic Hanging Planter',
    'pots-planters',
    1200,
    NULL,
    'in',
    'Approx. 14 cm diameter, with 60 cm suspension cord',
    'Glazed stoneware with natural cotton suspension rope',
    'Free up shelf space and bring dynamic vertical greenery into your room with this Scandinavian-inspired hanging planter for artificial trailing plants.',
    '["Heavy-duty adjustable suspension rope", "Seamless stoneware bowl", "Ideal for trailing artificial ivy", "Easy to hang"]'::jsonb,
    '["Wipe stoneware with a damp cloth"]'::jsonb,
    '/images/products/hanging-planter.jpg',
    NULL,
    false
),
(
    'metal-watering-can',
    'Matte Black Precision Watering Can',
    'accessories-decor',
    2100,
    NULL,
    'in',
    'Approx. 1.5 L capacity',
    'Stainless steel with powder-coated matte finish',
    'An elegant slim-necked watering can that doubles as a sculptural design object for shelves and sideboards.',
    '["Long slender spout", "Ergonomic wooden handle", "Rust-resistant matte powder coating", "Sculptural home décor piece"]'::jsonb,
    '["Wipe dry with a soft cloth"]'::jsonb,
    '/images/products/watering-can.jpg',
    NULL,
    false
),
(
    'plant-stand-wooden',
    'Solid Teak Adjustable Plant Stand',
    'accessories-decor',
    3200,
    NULL,
    'in',
    'Approx. 35 cm height, adjusts from 20cm to 30cm pot width',
    'Sustainably sourced Sri Lankan natural teak wood',
    'Elevate your potted artificial plants into striking statement pieces. Handcrafted from solid teak with a water-resistant matte oil finish.',
    '["Solid natural teak construction", "Adjustable width mechanism", "Elevates plants to optimal display height", "Floor protection pads"]'::jsonb,
    '["Wipe with a clean dry cloth"]'::jsonb,
    '/images/products/plant-stand.jpg',
    'Crafted in SL',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- 6. Seed Default Store Settings
INSERT INTO public.store_settings (id, whatsapp_number, free_delivery_threshold, announcement_text, announcement_active)
VALUES ('default', '94775835445', 5000, 'Bring Nature Home — Free Delivery on Orders Over Rs. 5,000', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Row Level Security (RLS) Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Public can read products and store settings
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);

-- Authenticated (Admins) or service role can manage everything
CREATE POLICY "Full access to products for authenticated users" ON public.products
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Full access to orders for authenticated users" ON public.orders
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
