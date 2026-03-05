-- =====================================================
-- MIGRATION: Mode Suivi Automatique
-- =====================================================

-- Table pour stocker les connexions bancaires (simulées)
CREATE TABLE IF NOT EXISTS bank_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_type VARCHAR(20) DEFAULT 'checking' CHECK (account_type IN ('checking', 'savings')),
    balance NUMERIC(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les transactions bancaires importées
CREATE TABLE IF NOT EXISTS bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_connection_id UUID REFERENCES bank_connections(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('debit', 'credit')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_categorized BOOLEAN DEFAULT false,
    is_imported_to_expenses BOOLEAN DEFAULT false,
    expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_bank_transactions_connection ON bank_transactions(bank_connection_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON bank_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_categorized ON bank_transactions(is_categorized);

-- Modifier la table budget_settings pour ajouter le mode automatique
ALTER TABLE budget_settings 
DROP CONSTRAINT IF EXISTS budget_settings_mode_check;

ALTER TABLE budget_settings 
ADD CONSTRAINT budget_settings_mode_check 
CHECK (mode IN ('category', 'global', 'automatic'));

-- =====================================================
-- NOTES
-- =====================================================

-- Mode automatique :
-- - bank_connections : Stocke les comptes bancaires connectés (simulés)
-- - bank_transactions : Stocke toutes les transactions importées
-- - Les transactions peuvent être catégorisées automatiquement ou manuellement
-- - Une fois catégorisées, elles peuvent être importées comme dépenses

-- Workflow :
-- 1. Utilisateur "connecte" son compte bancaire (simulation)
-- 2. Transactions sont importées automatiquement
-- 3. IA/Règles catégorisent les transactions
-- 4. Utilisateur valide et importe dans expenses
