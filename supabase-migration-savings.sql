-- =====================================================
-- MIGRATION: Ajout du compte épargne
-- =====================================================

-- Table pour stocker les mouvements d'épargne mensuels
CREATE TABLE IF NOT EXISTS savings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2000),
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
    target_amount NUMERIC(10, 2) DEFAULT 0 CHECK (target_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(month, year)
);

-- Index pour optimiser les recherches
CREATE INDEX idx_savings_month_year ON savings(month, year);

-- =====================================================
-- NOTES
-- =====================================================

-- Cette table stocke le montant épargné chaque mois
-- amount: Montant réellement épargné ce mois
-- target_amount: Objectif d'épargne pour ce mois (optionnel)

-- Exemple d'utilisation:
-- Revenu mensuel: 2000€
-- Dépenses: 1500€
-- Épargne: 500€ (automatiquement calculé ou saisi manuellement)
-- Score prend en compte: (Revenu - Dépenses - Épargne) / Revenu
