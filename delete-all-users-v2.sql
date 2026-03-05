-- Script pour supprimer TOUS les utilisateurs et leurs données
-- Version 2 : Supprime uniquement les tables qui existent
-- ATTENTION : Cette action est irréversible !

-- 1. Supprimer toutes les dépenses
DELETE FROM expenses;

-- 2. Supprimer tous les budgets
DELETE FROM budgets;

-- 3. Supprimer toutes les catégories
DELETE FROM categories;

-- 4. Supprimer toutes les connexions bancaires (si la table existe)
DELETE FROM bank_connections;

-- 5. Supprimer toutes les économies (si la table existe)
DELETE FROM savings;

-- 6. Supprimer tous les utilisateurs
DELETE FROM users;

-- Vérifier que tout est vide
SELECT 'expenses' as table_name, COUNT(*) as count FROM expenses
UNION ALL
SELECT 'budgets', COUNT(*) FROM budgets
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'bank_connections', COUNT(*) FROM bank_connections
UNION ALL
SELECT 'savings', COUNT(*) FROM savings
UNION ALL
SELECT 'users', COUNT(*) FROM users;
