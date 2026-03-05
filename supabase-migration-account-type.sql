-- =====================================================
-- MIGRATION: Ajout du type de compte pour les dépenses
-- =====================================================

-- Ajouter une colonne pour indiquer de quel compte provient la dépense
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'checking' CHECK (account_type IN ('checking', 'savings'));

-- Index pour optimiser les recherches par type de compte
CREATE INDEX IF NOT EXISTS idx_expenses_account_type ON expenses(account_type);

-- Mettre à jour les dépenses existantes pour qu'elles soient du compte courant par défaut
UPDATE expenses SET account_type = 'checking' WHERE account_type IS NULL;

-- =====================================================
-- NOTES
-- =====================================================

-- account_type peut être:
-- - 'checking' : Compte courant (par défaut)
-- - 'savings' : Compte épargne

-- Cela permet de savoir si une dépense vient du compte courant ou de l'épargne
-- Utile en mode global pour différencier les sources de dépenses
