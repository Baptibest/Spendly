-- Script pour ajouter la contrainte unique manquante sur la table budgets
-- Cette contrainte est nécessaire pour que l'upsert fonctionne correctement

-- 1. Supprimer l'ancienne contrainte unique si elle existe (sans user_id)
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_category_month_year_key;

-- 2. Ajouter la nouvelle contrainte unique incluant user_id
-- Cela permet à chaque utilisateur d'avoir un budget par catégorie/mois/année
ALTER TABLE budgets ADD CONSTRAINT budgets_category_month_year_user_key 
  UNIQUE (category_id, month, year, user_id);

-- 3. Vérifier que la contrainte a été créée
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'budgets'::regclass 
  AND conname = 'budgets_category_month_year_user_key';
