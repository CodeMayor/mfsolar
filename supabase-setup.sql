-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('panels', 'batteries', 'inverters', 'generators', 'streetlights', 'charge-controllers')),
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read products
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to insert products (you can restrict this further)
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update products
CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete products
CREATE POLICY "Allow authenticated delete" ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Grant table-level privileges to roles
-- NOTE: RLS policies alone are not enough; explicit GRANTs are also required.
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.products_id_seq TO authenticated;

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Insert initial products data
INSERT INTO products (name, category, description, price, image_url) VALUES
  ('High-Efficiency Monocrystalline Panel', 'panels', 'A durable and highly efficient solar panel with excellent low-light performance.', 250, '/sp1.jpg'),
  ('Lithium-Ion Solar Battery (5 kWh)', 'batteries', 'Long-lasting and reliable battery for residential energy storage.', 1800, 'https://placehold.co/400x300/fde047/000000.png?text=Solar+Battery'),
  ('Pure Sine Wave Inverter (3 kW)', 'inverters', 'Converts DC power from panels to AC power for household use with high efficiency.', 550, '/iv1.jpg'),
  ('Deep Cycle AGM Battery (100 Ah)', 'batteries', 'Robust and maintenance-free battery for off-grid systems and backups.', 320, 'https://placehold.co/400x300/fde047/000000.png?text=AGM+Battery'),
  ('Polycrystalline Solar Panel (300W)', 'panels', 'An economical option for solar power generation with good performance.', 180, '/sp2.jpg'),
  ('Hybrid Solar Inverter (5 kW)', 'inverters', 'Combines a charge controller and an inverter for simplified system setup.', 900, '/iv2.jpg'),
  ('Portable Solar Generator', 'generators', 'Portable solar generator for backup power.', 120000, '/sg1.jpg'),
  ('Solar Streetlight', 'streetlights', 'Solar-powered streetlight for outdoor lighting.', 35000, '/sl1.jpg'),
  ('Solar Charge Controller', 'charge-controllers', 'Efficient charge controller for solar systems.', 18000, '/cc1.jpg')
ON CONFLICT (id) DO NOTHING;
