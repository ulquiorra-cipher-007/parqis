-- =============================================================================
-- PARQIS SOCIAL COMMERCE - SUPABASE DATABASE SCHEMA
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Stores user info linked to phone/auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  email VARCHAR(100),
  username VARCHAR(50) UNIQUE,
  dob DATE,
  gender VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE (Curated catalog from PARQIS)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  discount_percent INT,
  image_url TEXT NOT NULL,
  stock INT DEFAULT 100,
  rating NUMERIC(2, 1) DEFAULT 4.5,
  reviews_count INT DEFAULT 120,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REELS TABLE (Short shopping videos for /trends)
CREATE TABLE IF NOT EXISTS public.reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  creator_handle VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  poster_url TEXT,
  likes INT DEFAULT 0,
  shares INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ADDRESSES TABLE (Delivery addresses)
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_name VARCHAR(100) NOT NULL,
  apartment_no VARCHAR(100),
  street_colony TEXT NOT NULL,
  landmark TEXT,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE (Order placements)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id),
  address_id UUID REFERENCES public.addresses(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  payment_method VARCHAR(50) DEFAULT 'dummy_online',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INT NOT NULL DEFAULT 1,
  size VARCHAR(10) DEFAULT 'M',
  price NUMERIC(10, 2) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public read policies for products and reels
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to reels" ON public.reels FOR SELECT USING (true);
