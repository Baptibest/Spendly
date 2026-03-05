-- Migration pour isoler les données de chaque utilisateur
-- Ajouter une colonne user_id à toutes les tables principales

-- 1. Ajouter user_id à la table expenses
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- 2. Ajouter user_id à la table budgets
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- 3. Ajouter user_id à la table categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- 4. Ajouter user_id à la table settings
ALTER TABLE settings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- 5. Créer des index pour améliorer les performances des requêtes filtrées par user_id
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);

-- Note: Après cette migration, vous devrez mettre à jour toutes les API routes
-- pour filtrer les données par user_id de l'utilisateur connecté
