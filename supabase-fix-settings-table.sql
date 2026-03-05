-- Fix pour la table budget_settings
-- La migration précédente utilisait "settings" au lieu de "budget_settings"

-- 1. Ajouter user_id à la table budget_settings (nom correct)
ALTER TABLE budget_settings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- 2. Ajouter user_id à la table monthly_scores aussi
ALTER TABLE monthly_scores ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- 3. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_budget_settings_user_id ON budget_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_scores_user_id ON monthly_scores(user_id);

-- 4. Supprimer la contrainte unique sur budget_settings si elle existe
-- Pour permettre plusieurs utilisateurs d'avoir des settings
ALTER TABLE budget_settings DROP CONSTRAINT IF EXISTS budget_settings_pkey;

-- 5. Ajouter une nouvelle contrainte unique sur (user_id)
-- Un utilisateur ne peut avoir qu'un seul ensemble de settings
ALTER TABLE budget_settings ADD CONSTRAINT budget_settings_user_id_unique UNIQUE (user_id);
