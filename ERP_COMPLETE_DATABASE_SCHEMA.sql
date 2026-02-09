-- ========================================
-- ERP COMPLETE DATABASE SCHEMA
-- GTBP - Vite + Supabase
-- ========================================
-- Usage: Copier-coller ce script dans le dashboard Supabase > SQL Editor
-- ========================================

-- 1. DROP EXISTING OBJECTS (Clean Reset)
-- ========================================

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS public.invoice_items CASCADE;
DROP TABLE IF EXISTS public.factures CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_invoice_total() CASCADE;
DROP FUNCTION IF EXISTS public.public_user_profile() CASCADE;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for owners" ON public.profiles;
DROP POLICY IF EXISTS "Users can view active products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can view all products" ON public.products;
DROP POLICY IF EXISTS "Users can insert products" ON public.products;
DROP POLICY IF EXISTS "Users can update products" ON public.products;
DROP POLICY IF EXISTS "Users can delete products" ON public.products;
DROP POLICY IF EXISTS "Users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view factures" ON public.factures;
DROP POLICY IF EXISTS "Users can insert factures" ON public.factures;
DROP POLICY IF EXISTS "Users can update factures" ON public.factures;
DROP POLICY IF EXISTS "Users can delete factures" ON public.factures;
DROP POLICY IF EXISTS "Users can view invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can insert invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can update invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can delete invoice_items" ON public.invoice_items;

-- Drop existing triggers
DROP TRIGGER IF EXISTS handle_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS handle_factures_updated_at ON public.factures;
DROP TRIGGER IF EXISTS handle_clients_updated_at ON public.clients;
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS handle_invoice_items_total ON public.invoice_items;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. CREATE TABLES
-- ========================================

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY,
  updated_at timestamptz DEFAULT now() NOT NULL,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  website text,
  
  CONSTRAINT profiles_username_length CHECK (char_length(username) >= 3),
  CONSTRAINT profiles_username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Product information
  name text NOT NULL,
  description text,
  reference text UNIQUE,
  sku text UNIQUE,
  
  -- Pricing
  cost_price numeric(10,2) DEFAULT 0 NOT NULL,
  selling_price numeric(10,2) DEFAULT 0 NOT NULL,
  
  -- Inventory
  stock_quantity integer DEFAULT 0 NOT NULL,
  min_stock_level integer DEFAULT 0 NOT NULL,
  max_stock_level integer DEFAULT 1000 NOT NULL,
  
  -- Product details
  category text,
  brand text,
  weight numeric(8,3), -- in kg
  dimensions text, -- format: "LxWxH" in cm
  
  -- Status
  is_active boolean DEFAULT true NOT NULL,
  
  -- Constraints
  CONSTRAINT products_cost_price_check CHECK (cost_price >= 0),
  CONSTRAINT products_selling_price_check CHECK (selling_price >= 0),
  CONSTRAINT products_price_relationship_check CHECK (selling_price >= cost_price),
  CONSTRAINT products_stock_quantity_check CHECK (stock_quantity >= 0),
  CONSTRAINT products_min_stock_check CHECK (min_stock_level >= 0),
  CONSTRAINT products_max_stock_check CHECK (max_stock_level >= 0),
  CONSTRAINT products_stock_range_check CHECK (max_stock_level >= min_stock_level),
  CONSTRAINT products_weight_check CHECK (weight >= 0),
  CONSTRAINT products_name_length CHECK (char_length(name) >= 2)
);

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  name text NOT NULL,
  email text UNIQUE,
  phone text,
  address text,
  
  -- Constraints
  CONSTRAINT clients_name_length CHECK (char_length(name) >= 2),
  CONSTRAINT clients_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR email IS NULL)
);

-- Factures (Invoices) table
CREATE TABLE IF NOT EXISTS public.factures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid')),
  
  -- Financial
  total_ht numeric(12,2) DEFAULT 0 NOT NULL,
  total_ttc numeric(12,2) DEFAULT 0 NOT NULL,
  tva_rate numeric(5,2) DEFAULT 8.0 NOT NULL,
  
  -- Dates
  issue_date timestamptz DEFAULT now() NOT NULL,
  due_date timestamptz,
  
  -- Constraints
  CONSTRAINT factures_total_positive CHECK (total_ht >= 0),
  CONSTRAINT factures_total_ttc_positive CHECK (total_ttc >= 0),
  CONSTRAINT factures_tva_rate_valid CHECK (tva_rate >= 0),
  CONSTRAINT factures_number_format CHECK (number ~ '^[A-Z]{2}-\d{4}-\d{3}$')
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  facture_id uuid NOT NULL REFERENCES public.factures(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  
  -- Item details
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  
  -- Calculated fields
  total_ht numeric(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  
  -- Constraints
  CONSTRAINT invoice_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT invoice_items_unit_price_positive CHECK (unit_price >= 0),
  CONSTRAINT invoice_items_total_price_check CHECK (total_ht >= 0)
);

-- 3. CREATE INDEXES
-- ========================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles (id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products (name);
CREATE INDEX IF NOT EXISTS idx_products_reference ON public.products (reference);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products (sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at);
CREATE INDEX IF NOT EXISTS idx_products_stock_low ON public.products (stock_quantity) WHERE stock_quantity <= min_stock_level;

-- Full-text search index for products
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(
  to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(reference, '') || ' ' || COALESCE(sku, ''))
);

-- Clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients (name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients (email);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients (created_at);

-- Factures indexes
CREATE INDEX IF NOT EXISTS idx_factures_client_id ON public.factures (client_id);
CREATE INDEX IF NOT EXISTS idx_factures_number ON public.factures (number);
CREATE INDEX IF NOT EXISTS idx_factures_status ON public.factures (status);
CREATE INDEX IF NOT EXISTS idx_factures_issue_date ON public.factures (issue_date);
CREATE INDEX IF NOT EXISTS idx_factures_due_date ON public.factures (due_date);

-- Invoice items indexes
CREATE INDEX IF NOT EXISTS idx_invoice_items_facture_id ON public.invoice_items (facture_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product_id ON public.invoice_items (product_id);

-- 4. CREATE FUNCTIONS
-- ========================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Invoice total calculation function
CREATE OR REPLACE FUNCTION public.handle_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.factures 
  SET 
    total_ht = (
      SELECT COALESCE(SUM(total_ht), 0) 
      FROM public.invoice_items 
      WHERE facture_id = NEW.facture_id
    ),
    total_ttc = (
      SELECT COALESCE(SUM(total_ht), 0) * (1 + tva_rate / 100) 
      FROM public.factures 
      WHERE id = NEW.facture_id
    )
  WHERE id = NEW.facture_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profile creation function for new users
CREATE OR REPLACE FUNCTION public.public_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CREATE TRIGGERS
-- ========================================

-- Updated_at triggers
CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_factures_updated_at
  BEFORE UPDATE ON public.factures
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Invoice total calculation trigger
CREATE TRIGGER handle_invoice_items_total
  AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_invoice_total();

-- Profile creation trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.public_user_profile();

-- 6. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES
-- ========================================

-- Profiles policies
CREATE POLICY "Enable insert for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for owners" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Users can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all products" ON public.products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Clients policies
CREATE POLICY "Users can view clients" ON public.clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert clients" ON public.clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update clients" ON public.clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete clients" ON public.clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Factures policies
CREATE POLICY "Users can view factures" ON public.factures
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert factures" ON public.factures
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update factures" ON public.factures
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete factures" ON public.factures
  FOR DELETE USING (auth.role() = 'authenticated');

-- Invoice items policies
CREATE POLICY "Users can view invoice_items" ON public.invoice_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert invoice_items" ON public.invoice_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update invoice_items" ON public.invoice_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete invoice_items" ON public.invoice_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- 8. INSERT SAMPLE DATA (Optional - for testing)
-- ========================================

-- Sample products
INSERT INTO public.products (name, description, reference, sku, cost_price, selling_price, stock_quantity, min_stock_level, category, brand) VALUES
('Laptop Pro 15"', 'High-performance laptop for professionals', 'LP-001', 'LP-001-15', 1200.00, 1899.00, 15, 5, 'Electronics', 'TechBrand'),
('Wireless Mouse', 'Ergonomic wireless mouse', 'WM-001', 'WM-001-BLK', 25.00, 49.00, 50, 10, 'Electronics', 'TechBrand'),
('Office Chair Deluxe', 'Comfortable office chair with lumbar support', 'OC-001', 'OC-001-GRY', 150.00, 299.00, 8, 3, 'Furniture', 'ComfortPlus'),
('USB-C Hub', '7-in-1 USB-C hub with HDMI', 'UH-001', 'UH-001-7IN1', 35.00, 69.00, 25, 8, 'Electronics', 'ConnectPro'),
('Desk Lamp LED', 'Adjustable LED desk lamp', 'DL-001', 'DL-001-WHT', 20.00, 39.00, 30, 10, 'Lighting', 'BrightLight');

-- Sample clients
INSERT INTO public.clients (name, email, phone, address) VALUES
('Tech Solutions SA', 'contact@techsolutions.ch', '+41 22 123 45 67', 'Rue du Commerce 123, 1201 Genève'),
('Bureau Modern', 'info@bureaumodern.ch', '+41 21 987 65 43', 'Avenue de la Paix 45, 1003 Lausanne'),
('Digital Agency', 'hello@digitalagency.ch', '+41 44 555 11 22', 'Bahnhofstrasse 78, 8001 Zürich');

-- 9. ADD COMMENTS
-- ========================================

COMMENT ON TABLE public.profiles IS 'User profiles linked to auth.users';
COMMENT ON TABLE public.products IS 'Products catalog with inventory management';
COMMENT ON TABLE public.clients IS 'Client information for invoicing';
COMMENT ON TABLE public.factures IS 'Invoices/bills for clients';
COMMENT ON TABLE public.invoice_items IS 'Line items for invoices';

COMMENT ON COLUMN public.products.id IS 'Unique identifier for product';
COMMENT ON COLUMN public.products.name IS 'Product name';
COMMENT ON COLUMN public.products.description IS 'Product description';
COMMENT ON COLUMN public.products.reference IS 'Internal reference number';
COMMENT ON COLUMN public.products.sku IS 'Stock Keeping Unit';
COMMENT ON COLUMN public.products.cost_price IS 'Cost price (purchase price)';
COMMENT ON COLUMN public.products.selling_price IS 'Selling price (retail price)';
COMMENT ON COLUMN public.products.stock_quantity IS 'Current stock quantity';
COMMENT ON COLUMN public.products.min_stock_level IS 'Minimum stock level for alerts';
COMMENT ON COLUMN public.products.max_stock_level IS 'Maximum stock level';
COMMENT ON COLUMN public.products.category IS 'Product category';
COMMENT ON COLUMN public.products.brand IS 'Product brand';
COMMENT ON COLUMN public.products.weight IS 'Product weight in kg';
COMMENT ON COLUMN public.products.dimensions IS 'Product dimensions (LxWxH) in cm';
COMMENT ON COLUMN public.products.is_active IS 'Whether product is active';

-- 10. VERIFICATION
-- ========================================

-- Verify tables exist
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verify policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- ========================================
-- SUCCESS: Database schema created successfully!
-- ========================================
