-- =====================================================
-- BUDGET APP - SCHEMA SUPABASE
-- Phase 1 - MVP
-- =====================================================

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- =====================================================
-- TABLE: categories
-- =====================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(20) NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_categories_name ON categories(name);

-- =====================================================
-- TABLE: expenses
-- =====================================================

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    description VARCHAR(255) NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_date_category ON expenses(expense_date, category_id);

-- =====================================================
-- TABLE: budgets
-- =====================================================

CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2000),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, month, year)
);

-- Index pour optimiser les recherches
CREATE INDEX idx_budgets_month_year ON budgets(month, year);
CREATE INDEX idx_budgets_category ON budgets(category_id);

-- =====================================================
-- DONNÉES INITIALES: Catégories par défaut
-- =====================================================

INSERT INTO categories (name, color, icon) VALUES
    ('Logement', '#3b82f6', 'Home'),
    ('Alimentation', '#10b981', 'ShoppingCart'),
    ('Transport', '#f59e0b', 'Car'),
    ('Loisirs', '#8b5cf6', 'Gamepad2'),
    ('Santé', '#ef4444', 'Heart'),
    ('Abonnements', '#06b6d4', 'CreditCard'),
    ('Shopping', '#ec4899', 'ShoppingBag'),
    ('Autres', '#6b7280', 'MoreHorizontal');

-- =====================================================
-- POLITIQUES RLS (Row Level Security)
-- Note: Pour Phase 1 (mono-utilisateur), RLS désactivé
-- À activer pour Phase 2 (multi-utilisateurs)
-- =====================================================

-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Exemple de politique pour Phase 2:
-- CREATE POLICY "Users can view their own data"
--     ON expenses FOR SELECT
--     USING (auth.uid() = user_id);

-- =====================================================
-- VUES UTILES (Optionnel)
-- =====================================================

-- Vue pour obtenir les dépenses avec les informations de catégorie
CREATE OR REPLACE VIEW expenses_with_category AS
SELECT 
    e.id,
    e.amount,
    e.description,
    e.expense_date,
    e.created_at,
    c.id as category_id,
    c.name as category_name,
    c.color as category_color,
    c.icon as category_icon
FROM expenses e
JOIN categories c ON e.category_id = c.id;

-- Vue pour les totaux mensuels par catégorie
CREATE OR REPLACE VIEW monthly_category_totals AS
SELECT 
    c.id as category_id,
    c.name as category_name,
    c.color as category_color,
    EXTRACT(MONTH FROM e.expense_date) as month,
    EXTRACT(YEAR FROM e.expense_date) as year,
    SUM(e.amount) as total_spent,
    COUNT(e.id) as expense_count
FROM categories c
LEFT JOIN expenses e ON c.id = e.category_id
GROUP BY c.id, c.name, c.color, EXTRACT(MONTH FROM e.expense_date), EXTRACT(YEAR FROM e.expense_date);

-- =====================================================
-- FONCTIONS UTILES (Optionnel)
-- =====================================================

-- Fonction pour obtenir le résumé d'un mois
CREATE OR REPLACE FUNCTION get_month_summary(p_month INTEGER, p_year INTEGER)
RETURNS TABLE (
    category_id UUID,
    category_name VARCHAR,
    budget_amount NUMERIC,
    spent_amount NUMERIC,
    remaining NUMERIC,
    percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        COALESCE(b.amount, 0) as budget_amount,
        COALESCE(SUM(e.amount), 0) as spent_amount,
        COALESCE(b.amount, 0) - COALESCE(SUM(e.amount), 0) as remaining,
        CASE 
            WHEN COALESCE(b.amount, 0) > 0 
            THEN ROUND((COALESCE(SUM(e.amount), 0) / b.amount * 100)::numeric, 2)
            ELSE NULL
        END as percentage
    FROM categories c
    LEFT JOIN budgets b ON c.id = b.category_id 
        AND b.month = p_month 
        AND b.year = p_year
    LEFT JOIN expenses e ON c.id = e.category_id 
        AND EXTRACT(MONTH FROM e.expense_date) = p_month
        AND EXTRACT(YEAR FROM e.expense_date) = p_year
    GROUP BY c.id, c.name, b.amount;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS (Optionnel)
-- =====================================================

-- Trigger pour empêcher la suppression d'une catégorie avec des dépenses
CREATE OR REPLACE FUNCTION prevent_category_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM expenses WHERE category_id = OLD.id) THEN
        RAISE EXCEPTION 'Cannot delete category with existing expenses';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_category_deletion
    BEFORE DELETE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION prevent_category_deletion();

-- =====================================================
-- VÉRIFICATION DE L'INSTALLATION
-- =====================================================

-- Vérifier que les tables sont créées
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name IN ('categories', 'expenses', 'budgets')
ORDER BY table_name;

-- Vérifier que les catégories sont insérées
SELECT COUNT(*) as category_count FROM categories;

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================

-- 1. Assurez-vous d'avoir activé l'extension UUID si nécessaire:
--    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Pour Phase 2, activer RLS et créer les politiques appropriées

-- 3. Les index sont optimisés pour les requêtes fréquentes:
--    - Recherche par date
--    - Recherche par catégorie
--    - Recherche par mois/année

-- 4. Les contraintes CHECK garantissent l'intégrité des données:
--    - Montants positifs pour expenses
--    - Montants >= 0 pour budgets
--    - Mois entre 1 et 12
--    - Année >= 2000

-- 5. La contrainte UNIQUE sur budgets empêche les doublons
--    pour une même catégorie/mois/année

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
