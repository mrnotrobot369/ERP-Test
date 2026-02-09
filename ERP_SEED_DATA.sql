-- ========================================
-- ERP SEED DATA - DONNÉES EXEMPLES
-- GTBP - Vite + Supabase
-- ========================================
-- Usage: Copier-coller ce script dans le dashboard Supabase > SQL Editor
-- ========================================

-- 1. INSÉRER CATÉGORIES DE TEST
-- ========================================

INSERT INTO public.products (name, description, category, brand, reference, sku, cost_price, selling_price, stock_quantity, min_stock_level, is_active, created_at, updated_at) VALUES
-- Catégorie: Électronique
('MacBook Pro 14"', 'Ordinateur portable professionnel avec puce M2 Pro, 16GB RAM, 512GB SSD', 'Électronique', 'Apple', 'MBP14-2023', 'MBP14-2023-001', 1899.00, 2299.00, 5, 3, true, NOW(), NOW()),
('iPhone 15 Pro', 'Smartphone haut de gamme avec titane, 256GB, appareil photo 48MP', 'Électronique', 'Apple', 'IP15P-2023', 'IP15P-2023-001', 899.00, 1199.00, 12, 5, true, NOW(), NOW()),
('iPad Air', 'Tablette 10.9 pouces, Wi-Fi 256GB, Apple M1', 'Électronique', 'Apple', 'IPA-2023', 'IPA-2023-001', 549.00, 749.00, 8, 4, true, NOW(), NOW()),
('AirPods Pro 2', 'Écouteurs sans fil avec réduction de bruit active', 'Électronique', 'Apple', 'APP2-2023', 'APP2-2023-001', 199.00, 299.00, 25, 10, true, NOW(), NOW()),

-- Catégorie: Mobilier
('Bureau Réglable', 'Bureau électrique hauteur réglable 120x60cm, bois clair', 'Mobilier', 'ErgoDesk', 'BR-2023', 'BR-2023-001', 299.00, 449.00, 3, 2, true, NOW(), NOW()),
('Chaise Ergonomique', 'Chaise de bureau avec soutien lombaire, réglable', 'Mobilier', 'ComfortSeat', 'CE-2023', 'CE-2023-001', 189.00, 299.00, 7, 3, true, NOW(), NOW()),
('Étagère Modulaire', 'Étagère 5 niveaux 80x180cm, métal et bois', 'Mobilier', 'ModuloRack', 'EM-2023', 'EM-2023-001', 89.00, 149.00, 15, 5, true, NOW(), NOW()),

-- Catégorie: Services
('Abonnement ERP Pro', 'Solution ERP complète pour PME, support 24/7 inclus', 'Services', 'GTBP', 'ERP-PRO-2023', 'ERP-PRO-2023-001', 49.00, 99.00, 999, 10, true, NOW(), NOW()),
('Formation ERP', 'Formation personnalisée 2 jours sur site', 'Services', 'GTBP', 'FORM-ERP-2023', 'FORM-ERP-2023-001', 800.00, 1200.00, 50, 5, true, NOW(), NOW()),
('Maintenance Annuelle', 'Contrat de maintenance et mises à jour', 'Services', 'GTBP', 'MAINT-2023', 'MAINT-2023-001', 299.00, 499.00, 100, 20, true, NOW(), NOW());

-- 2. INSÉRER CLIENTS DE TEST
-- ========================================

INSERT INTO public.clients (name, email, phone, address, city, postal_code, country, vat_number, is_active, created_at, updated_at) VALUES
('Société Informatique SA', 'contact@informatique.ch', '+41 22 123 45 67', 'Rue de la Tech 15', 'Genève', '1201', 'Suisse', 'CHE-123.456.789', true, NOW(), NOW()),
('Bureau Design Sàrl', 'info@design.ch', '+41 21 987 65 43', 'Avenue du Créatif 8', 'Lausanne', '1003', 'Suisse', 'CHE-987.654.321', true, NOW(), NOW()),
('Entreprise Construction AG', 'admin@construction.ch', '+41 44 555 66 77', 'Route du Bâtiment 42', 'Zurich', '8001', 'Suisse', 'CHE-555.666.777', true, NOW(), NOW()),
('Café Central', 'bonjour@cafe.ch', '+41 31 222 33 44', 'Place Centrale 1', 'Berne', '3000', 'Suisse', 'CHE-222.333.444', true, NOW(), NOW()),
('Librairie Moderne', 'contact@librairie.ch', '+41 27 888 99 00', 'Rue des Livres 25', 'Sion', '1950', 'Suisse', 'CHE-888.999.000', true, NOW(), NOW());

-- 3. INSÉRER FACTURES DE TEST
-- ========================================

INSERT INTO public.factures (client_id, invoice_number, issue_date, due_date, status, subtotal, vat_rate, vat_amount, total_ttc, notes, created_at, updated_at) VALUES
-- Factures pour Société Informatique SA
(1, 'INV-2023-001', '2023-12-01', '2023-12-31', 'sent', 4598.00, 7.7, 354.05, 4952.05, 'Livraison MacBook Pro et iPad Air', NOW(), NOW()),
(1, 'INV-2023-002', '2023-12-15', '2024-01-15', 'draft', 299.00, 7.7, 23.02, 322.02, 'Commande AirPods Pro en attente', NOW(), NOW()),

-- Factures pour Bureau Design Sàrl
(2, 'INV-2023-003', '2023-12-05', '2024-01-05', 'paid', 748.00, 7.7, 57.60, 805.60, 'Bureau et chaise ergonomique', NOW(), NOW()),
(2, 'INV-2023-004', '2023-12-20', '2024-01-20', 'sent', 1200.00, 7.7, 92.40, 1292.40, 'Formation ERP sur site', NOW(), NOW()),

-- Factures pour Entreprise Construction AG
(3, 'INV-2023-005', '2023-12-10', '2024-01-10', 'sent', 149.00, 7.7, 11.47, 160.47, 'Étagère modulaire', NOW(), NOW()),

-- Factures pour Café Central
(4, 'INV-2023-006', '2023-12-12', '2024-01-12', 'draft', 1199.00, 7.7, 92.32, 1291.32, 'iPhone 15 Pro en préparation', NOW(), NOW()),

-- Factures pour Librairie Moderne
(5, 'INV-2023-007', '2023-12-18', '2024-01-18', 'sent', 499.00, 7.7, 38.42, 537.42, 'Maintenance annuelle ERP', NOW(), NOW());

-- 4. INSÉRER LIGNES DE FACTURES
-- ========================================

INSERT INTO public.invoice_items (invoice_id, product_id, quantity, unit_price, total_price, created_at, updated_at) VALUES
-- Lignes pour INV-2023-001 (Société Informatique SA)
(1, 1, 2, 2299.00, 4598.00, NOW(), NOW()),

-- Lignes pour INV-2023-002 (Société Informatique SA)
(2, 4, 1, 299.00, 299.00, NOW(), NOW()),

-- Lignes pour INV-2023-003 (Bureau Design Sàrl)
(3, 5, 1, 449.00, 449.00, NOW(), NOW()),
(3, 6, 1, 299.00, 299.00, NOW(), NOW()),

-- Lignes pour INV-2023-004 (Bureau Design Sàrl)
(4, 9, 1, 1200.00, 1200.00, NOW(), NOW()),

-- Lignes pour INV-2023-005 (Entreprise Construction AG)
(5, 7, 1, 149.00, 149.00, NOW(), NOW()),

-- Lignes pour INV-2023-006 (Café Central)
(6, 2, 1, 1199.00, 1199.00, NOW(), NOW()),

-- Lignes pour INV-2023-007 (Librairie Moderne)
(7, 10, 1, 499.00, 499.00, NOW(), NOW());

-- 5. CRÉER PROFIL UTILISATEUR (si votre ID est connu)
-- ========================================
-- NOTE: Remplacez 'YOUR_USER_ID' par votre véritable ID utilisateur Supabase
-- Vous pouvez trouver votre ID dans la table auth.users ou via les logs de connexion

-- Décommentez et adaptez cette ligne après avoir trouvé votre ID:
-- INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at) 
-- VALUES ('YOUR_USER_ID', 'Administrateur ERP', null, NOW(), NOW());

-- 6. VÉRIFICATION DES DONNÉES INSÉRÉES
-- ========================================

-- Vérifier les produits insérés
SELECT COUNT(*) as total_products, category, COUNT(*) as products_by_category 
FROM public.products 
GROUP BY category 
ORDER BY category;

-- Vérifier les clients
SELECT COUNT(*) as total_clients FROM public.clients;

-- Vérifier les factures par statut
SELECT status, COUNT(*) as count FROM public.factures GROUP BY status;

-- Vérifier le stock par catégorie
SELECT category, SUM(stock_quantity) as total_stock, SUM(min_stock_level) as min_stock_needed
FROM public.products 
GROUP BY category
ORDER BY category;

-- ========================================
-- FIN DU SCRIPT SEED
-- ========================================
