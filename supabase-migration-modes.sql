-- =====================================================
-- MIGRATION: Ajout des modes de gestion budgétaire
-- =====================================================

-- Table pour stocker la configuration du mode budgétaire
CREATE TABLE IF NOT EXISTS budget_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('category', 'global')),
    monthly_income NUMERIC(10, 2) DEFAULT 0 CHECK (monthly_income >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les scores mensuels
CREATE TABLE IF NOT EXISTS monthly_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2000),
    total_income NUMERIC(10, 2) NOT NULL CHECK (total_income >= 0),
    total_spent NUMERIC(10, 2) NOT NULL CHECK (total_spent >= 0),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(month, year)
);

-- Index pour optimiser les recherches
CREATE INDEX idx_monthly_scores_month_year ON monthly_scores(month, year);

-- Insérer une configuration par défaut (mode catégorie)
INSERT INTO budget_settings (mode, monthly_income) 
VALUES ('category', 0)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FONCTION: Calculer le score mensuel
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_monthly_score(
    p_month INTEGER,
    p_year INTEGER,
    p_income NUMERIC
) RETURNS INTEGER AS $$
DECLARE
    v_total_spent NUMERIC;
    v_score INTEGER;
    v_percentage NUMERIC;
BEGIN
    -- Calculer le total dépensé
    SELECT COALESCE(SUM(amount), 0)
    INTO v_total_spent
    FROM expenses
    WHERE EXTRACT(MONTH FROM expense_date) = p_month
      AND EXTRACT(YEAR FROM expense_date) = p_year;
    
    -- Calculer le pourcentage dépensé
    IF p_income > 0 THEN
        v_percentage := (v_total_spent / p_income) * 100;
        
        -- Calculer le score (100 - pourcentage dépensé)
        -- Score maximum si on dépense 0%, score 0 si on dépense 100% ou plus
        v_score := GREATEST(0, LEAST(100, 100 - v_percentage::INTEGER));
    ELSE
        v_score := 0;
    END IF;
    
    RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- NOTES
-- =====================================================

-- Mode 'category': Budget défini par catégorie (mode actuel)
-- Mode 'global': Budget global basé sur le revenu mensuel avec système de score

-- Le score est calculé comme suit:
-- Score = 100 - (total_dépensé / revenu_mensuel * 100)
-- Exemple: Revenu 2000€, Dépensé 1500€ → Score = 100 - 75 = 25
-- Exemple: Revenu 2000€, Dépensé 500€ → Score = 100 - 25 = 75
