-- Migration: Create products table
-- Description: Table for managing products in the ERP system

-- Create products table
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
  CONSTRAINT products_weight_check CHECK (weight >= 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products (name);
CREATE INDEX IF NOT EXISTS idx_products_reference ON public.products (reference);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products (sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(
  to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(reference, '') || ' ' || COALESCE(sku, ''))
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can view all active products
CREATE POLICY "Users can view active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Policy: Users can view all products (including inactive) if they are authenticated
CREATE POLICY "Authenticated users can view all products" ON public.products
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Users can insert products
CREATE POLICY "Users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can update products they created
CREATE POLICY "Users can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Users can delete products
CREATE POLICY "Users can delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comments
COMMENT ON TABLE public.products IS 'Products table for ERP system';
COMMENT ON COLUMN public.products.id IS 'Unique identifier for the product';
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
COMMENT ON COLUMN public.products.is_active IS 'Whether the product is active';
