# Isolation des données par utilisateur - Guide complet

## 🎯 Objectif
Chaque utilisateur doit avoir ses propres données complètement isolées (dépenses, budgets, catégories, paramètres).

## ✅ Ce qui a été fait

### 1. Services modifiés
- ✅ `expense.service.ts` - Toutes les fonctions acceptent maintenant `userId`
- ✅ `budget.service.ts` - Toutes les fonctions acceptent maintenant `userId`
- ✅ `category.service.ts` - Toutes les fonctions acceptent maintenant `userId`
- ✅ `settings.service.ts` - Toutes les fonctions acceptent maintenant `userId`

### 2. Helpers créés
- ✅ `utils/auth.ts` - Fonctions pour récupérer user_id
- ✅ `utils/fetchWithAuth.ts` - Fonction pour faire des requêtes avec authentification

### 3. API Routes modifiées
- ✅ `/api/expenses` (GET et POST)

## 🔧 Ce qu'il reste à faire

### ÉTAPE 1 : Migration SQL dans Supabase (CRITIQUE)
Exécutez le fichier `supabase-migration-user-isolation.sql` dans Supabase SQL Editor :

```sql
-- Ajouter user_id à toutes les tables
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE budget_settings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE monthly_scores ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Créer des index
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON budget_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON monthly_scores(user_id);
```

### ÉTAPE 2 : Modifier les API routes restantes

Toutes les routes doivent :
1. Extraire `user_id` depuis les headers : `const userId = request.headers.get('x-user-id');`
2. Vérifier l'authentification : `if (!userId) return 401`
3. Passer `userId` aux fonctions de service

Routes à modifier :
- `/api/expenses/[id]` (PUT, DELETE)
- `/api/budgets` (GET, POST)
- `/api/budgets/copy` (POST)
- `/api/categories` (GET, POST)
- `/api/categories/[id]` (DELETE)
- `/api/settings` (GET, POST)
- `/api/savings` (GET, POST)
- `/api/bank-*` (toutes les routes bancaires)

### ÉTAPE 3 : Modifier les composants frontend

Tous les appels `fetch()` doivent être remplacés par `fetchWithAuth()` :

```typescript
// Avant
const res = await fetch('/api/expenses');

// Après
import { fetchWithAuth } from '@/utils/fetchWithAuth';
const res = await fetchWithAuth('/api/expenses');
```

Fichiers à modifier :
- Tous les composants dans `app/(protected)/`
- Tous les formulaires qui font des requêtes API

### ÉTAPE 4 : Initialisation des catégories par défaut

Quand un nouvel utilisateur se connecte pour la première fois, créer ses catégories par défaut :
- Appeler `seedDefaultCategories(userId)` après la première connexion

## 🧪 Tests à effectuer

1. Connectez-vous avec `admin@spendly.com`
2. Créez des dépenses, budgets, catégories
3. Déconnectez-vous
4. Connectez-vous avec `test@spendly.com`
5. Vérifiez que vous ne voyez AUCUNE donnée de l'admin
6. Créez vos propres données
7. Reconnectez-vous avec admin → vérifiez que ses données sont toujours là

## ⚠️ IMPORTANT

**SANS la migration SQL, l'application ne fonctionnera PAS !**
La migration SQL doit être exécutée AVANT de déployer les changements de code.
