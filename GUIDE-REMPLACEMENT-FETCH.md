# Guide de remplacement des fetch() par fetchWithAuth()

## Fichiers à modifier

### Pages protégées
1. `app/(protected)/expenses/page.tsx`
2. `app/(protected)/dashboard/page.tsx`
3. `app/(protected)/budgets/page.tsx`
4. `app/(protected)/categories/page.tsx`
5. `app/(protected)/history/page.tsx`
6. `app/(protected)/settings/page.tsx`
7. `app/(protected)/bank-sync/page.tsx`

### Composants
1. `components/layout/Navbar.tsx`
2. `components/forms/ExpenseForm.tsx`
3. `components/lists/ExpenseList.tsx` (si existe)

## Étapes de remplacement

### 1. Ajouter l'import en haut du fichier

```typescript
import { fetchWithAuth } from '@/utils/fetchWithAuth';
```

### 2. Remplacer tous les appels fetch()

**Avant :**
```typescript
const res = await fetch('/api/expenses');
```

**Après :**
```typescript
const res = await fetchWithAuth('/api/expenses');
```

**Avant (avec options) :**
```typescript
const res = await fetch('/api/budgets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

**Après (avec options) :**
```typescript
const res = await fetchWithAuth('/api/budgets', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

Note: `fetchWithAuth` ajoute automatiquement les headers nécessaires (Content-Type et x-user-id).

## Cas particuliers

### Promise.all avec plusieurs fetch
```typescript
// Avant
const [res1, res2] = await Promise.all([
  fetch('/api/expenses'),
  fetch('/api/budgets'),
]);

// Après
const [res1, res2] = await Promise.all([
  fetchWithAuth('/api/expenses'),
  fetchWithAuth('/api/budgets'),
]);
```

### Gestion d'erreur 401 (non authentifié)
Ajouter après chaque fetchWithAuth :

```typescript
const res = await fetchWithAuth('/api/expenses');
const data = await res.json();

if (res.status === 401) {
  // Rediriger vers login
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
  window.location.href = '/login';
  return;
}
```
