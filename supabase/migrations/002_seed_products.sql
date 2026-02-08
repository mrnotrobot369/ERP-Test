-- Migration: Seed data for products table
-- Description: Insert sample products for testing

-- Insert sample products
INSERT INTO public.products (
  name, 
  description, 
  reference, 
  sku, 
  cost_price, 
  selling_price, 
  stock_quantity, 
  min_stock_level, 
  max_stock_level, 
  category, 
  brand, 
  weight, 
  dimensions, 
  is_active
) VALUES 
-- Électronique
(
  'Laptop Pro 15"', 
  'Ordinateur portable haute performance pour professionnels', 
  'LAP-001', 
  'LP-PRO-15', 
  899.99, 
  1299.99, 
  15, 
  5, 
  50, 
  'Électronique', 
  'TechBrand', 
  1.8, 
  '35x25x2', 
  true
),
(
  'Smartphone X', 
  'Smartphone dernière génération avec écran AMOLED', 
  'TEL-001', 
  'SM-X-128', 
  499.99, 
  799.99, 
  32, 
  10, 
  100, 
  'Électronique', 
  'TechMobile', 
  0.180, 
  '15x7x0.8', 
  true
),
(
  'Tablet Air 10"', 
  'Tablette légère et performante pour travail et divertissement', 
  'TAB-001', 
  'TB-AIR-10', 
  299.99, 
  449.99, 
  8, 
  3, 
  30, 
  'Électronique', 
  'TechBrand', 
  0.450, 
  '25x20x0.6', 
  true
),

-- Bureautique
(
  'Clavier Mécanique RGB', 
  'Clavier mécanique avec rétroéclairage RGB personnalisable', 
  'KB-001', 
  'KB-MECH-RGB', 
  79.99, 
  129.99, 
  45, 
  15, 
  100, 
  'Bureautique', 
  'GameGear', 
  1.2, 
  '45x15x4', 
  true
),
(
  'Souris Gaming Pro', 
  'Souris gaming avec capteur haute précision', 
  'MOU-001', 
  'MS-GAME-PRO', 
  39.99, 
  69.99, 
  2, 
  5, 
  50, 
  'Bureautique', 
  'GameGear', 
  0.095, 
  '12x6x4', 
  true
),

-- Accessoires
(
  'Chargeur USB-C 65W', 
  'Chargeur rapide USB-C pour ordinateurs portables', 
  'CHG-001', 
  'CH-USB-C-65', 
  24.99, 
  39.99, 
  60, 
  20, 
  200, 
  'Accessoires', 
  'PowerTech', 
  0.150, 
  '8x5x3', 
  true
),
(
  'Câble HDMI 2m', 
  'Câble HDMI haute vitesse 4K', 
  'CAB-001', 
  'CB-HDMI-2M', 
  8.99, 
  14.99, 
  120, 
  30, 
  500, 
  'Accessoires', 
  'CableMaster', 
  0.200, 
  '200x2x1', 
  true
),

-- Produits avec stock faible pour tester les alertes
(
  'Casque Bluetooth Pro', 
  'Casque audio sans fil avec réduction de bruit', 
  'AUD-001', 
  'HS-BT-PRO', 
  89.99, 
  149.99, 
  2, 
  5, 
  30, 
  'Audio', 
  'SoundTech', 
  0.280, 
  '18x15x8', 
  true
),
(
  'Webcam HD 1080p', 
  'Webcam haute définition pour visioconférence', 
  'CAM-001', 
  'WC-HD-1080', 
  34.99, 
  59.99, 
  0, 
  10, 
  50, 
  'Accessoires', 
  'VisionTech', 
  0.120, 
  '8x8x4', 
  true
),

-- Produits inactifs pour tester les filtres
(
  'Ancien Modèle Smartphone', 
  'Ancienne génération de smartphone (non disponible)', 
  'OLD-001', 
  'SM-OLD-64', 
  199.99, 
  299.99, 
  5, 
  2, 
  20, 
  'Électronique', 
  'OldTech', 
  0.160, 
  '14x7x0.9', 
  false
),
(
  'Clavier Standard', 
  'Clavier standard filaire (modèle basique)', 
  'KB-OLD-001', 
  'KB-STD-BLK', 
  19.99, 
  29.99, 
  8, 
  3, 
  40, 
  'Bureautique', 
  'BasicOffice', 
  0.8, 
  '44x13x3', 
  false
);

-- Créer quelques catégories et marques supplémentaires pour les tests
INSERT INTO public.products (
  name, 
  description, 
  reference, 
  sku, 
  cost_price, 
  selling_price, 
  stock_quantity, 
  min_stock_level, 
  max_stock_level, 
  category, 
  brand, 
  weight, 
  dimensions, 
  is_active
) VALUES 
(
  'Moniteur 27" 4K', 
  'Moniteur UHD 27 pouces pour professionnels', 
  'MON-001', 
  'MN-4K-27', 
  299.99, 
  499.99, 
  12, 
  5, 
  40, 
  'Électronique', 
  'DisplayPro', 
  5.2, 
  '62x36x8', 
  true
),
(
  'Disque SSD 1TB', 
  'Disque SSD interne 1 To haute vitesse', 
  'SSD-001', 
  'SD-1TB-NVME', 
  79.99, 
  129.99, 
  25, 
  8, 
  80, 
  'Stockage', 
  'DataStore', 
  0.080, 
  '8x2x0.2', 
  true
),
(
  'Hub USB-C 7 ports', 
  'Hub USB-C multi-ports avec alimentation', 
  'HUB-001', 
  'HB-USB-C-7P', 
  34.99, 
  54.99, 
  18, 
  6, 
  60, 
  'Accessoires', 
  'ConnectPro', 
  0.250, 
  '15x8x2', 
  true
),
(
  'Sac à dos ordinateur 15"', 
  'Sac à dos rembourré pour ordinateur portable', 
  'BAG-001', 
  'SB-LAP-15', 
  29.99, 
  49.99, 
  35, 
  10, 
  100, 
  'Accessoires', 
  'CarryTech', 
  0.8, 
  '45x30x15', 
  true
),
(
  'Station d''accueil USB-C', 
  'Docking station USB-C avec double écran', 
  'DOC-001', 
  'DK-USB-C-2K', 
  149.99, 
  229.99, 
  6, 
  3, 
  25, 
  'Accessoires', 
  'WorkStation', 
  0.9, 
  '20x10x5', 
  true
);

-- Afficher un résumé des données insérées
DO $$
BEGIN
  RAISE NOTICE '=== Données de test produits insérées ===';
  RAISE NOTICE 'Total produits: %', (SELECT COUNT(*) FROM public.products);
  RAISE NOTICE 'Produits actifs: %', (SELECT COUNT(*) FROM public.products WHERE is_active = true);
  RAISE NOTICE 'Produits inactifs: %', (SELECT COUNT(*) FROM public.products WHERE is_active = false);
  RAISE NOTICE 'Produits en stock faible: %', (SELECT COUNT(*) FROM public.products WHERE stock_quantity <= min_stock_level);
  RAISE NOTICE 'Produits en rupture: %', (SELECT COUNT(*) FROM public.products WHERE stock_quantity = 0);
  RAISE NOTICE 'Catégories: %', (SELECT COUNT(DISTINCT category) FROM public_products WHERE category IS NOT NULL);
  RAISE NOTICE 'Marques: %', (SELECT COUNT(DISTINCT brand) FROM public_products WHERE brand IS NOT NULL);
END $$;
