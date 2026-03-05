-- Script de nettoyage et correction de la base de données
-- À exécuter dans Supabase SQL Editor

-- 1. Supprimer toutes les données existantes (pour repartir à zéro)
DELETE FROM monthly_scores;
DELETE FROM budget_settings;
DELETE FROM budgets;
DELETE FROM expenses;
DELETE FROM categories;

-- 2. Supprimer la contrainte unique sur le nom des catégories
-- (car maintenant chaque utilisateur peut avoir ses propres catégories avec les mêmes noms)
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;

-- 3. Ajouter une contrainte unique sur (user_id, name) au lieu de juste (name)
-- Cela permet à chaque utilisateur d'avoir ses propres catégories
ALTER TABLE categories ADD CONSTRAINT categories_user_id_name_key UNIQUE (user_id, name);

-- 4. Vérifier que les utilisateurs existent
SELECT id, email FROM users;

-- Si vous ne voyez pas vos utilisateurs (test@spendly.com et admin), exécutez aussi :
-- INSERT INTO users (id, email, password_hash, role) 
-- VALUES 
--   ('875cfeef-3a24-4e1b-863e-56e496278f8f', 'test@spendly.com', 'test123', 'user'),
--   ('00000000-0000-0000-0000-000000000001', 'admin@spendly.com', 'admin123', 'admin')
-- ON CONFLICT (id) DO NOTHING;

-- 5. Vérifier que les colonnes user_id existent et ont les bonnes contraintes
-- (Normalement déjà fait par la migration précédente)
