# Guide de Déploiement - Budget App

Ce guide vous accompagne dans le déploiement de l'application Budget App.

## 📋 Prérequis

- Compte Supabase (gratuit)
- Node.js >= 18.17.0
- npm >= 9.0.0

## 🗄️ Configuration Supabase

### 1. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : Budget App
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche
5. Cliquez sur "Create new project"
6. Attendez que le projet soit créé (2-3 minutes)

### 2. Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Cliquez sur "New query"
3. Copiez tout le contenu du fichier `supabase-schema.sql`
4. Collez-le dans l'éditeur
5. Cliquez sur "Run" (ou Ctrl+Enter)
6. Vérifiez qu'il n'y a pas d'erreurs

### 3. Vérifier la création des tables

1. Allez dans **Table Editor**
2. Vous devriez voir 3 tables :
   - `categories` (8 lignes)
   - `expenses` (0 ligne)
   - `budgets` (0 ligne)

### 4. Récupérer les clés API

1. Allez dans **Settings** > **API**
2. Notez les informations suivantes :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** : `eyJhbGc...` (clé longue)

## 🚀 Installation locale

### 1. Cloner et installer

```bash
cd budget-app
npm install
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...votre_cle_anon
```

⚠️ **Important** : Remplacez par vos vraies valeurs !

### 3. Vérifier la configuration

```bash
# Tester la connexion
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

Si vous voyez la page d'accueil, c'est bon ! ✅

## 🧪 Tests de validation

### Test 1 : Ajouter une dépense

1. Sur la page d'accueil
2. Remplissez le formulaire :
   - Montant : 50.00
   - Description : Test dépense
   - Catégorie : Alimentation
   - Date : Aujourd'hui
3. Cliquez sur "Ajouter la dépense"
4. La dépense doit apparaître dans "Dernières dépenses"

### Test 2 : Définir un budget

1. Allez sur "Budgets"
2. Sélectionnez le mois en cours
3. Définissez un budget pour "Alimentation" : 500
4. Cliquez sur "Enregistrer les budgets"
5. Message de succès doit apparaître

### Test 3 : Consulter le dashboard

1. Allez sur "Dashboard"
2. Vous devriez voir :
   - Total dépensé : 50.00 €
   - Total budget : 500.00 €
   - Reste : 450.00 €
   - Graphique avec une barre

### Test 4 : Modifier une dépense

1. Sur la page d'accueil
2. Cliquez sur l'icône "Edit" de la dépense
3. Modifiez le montant : 75.00
4. Cliquez sur "Modifier"
5. Le montant doit être mis à jour

### Test 5 : Supprimer une dépense

1. Cliquez sur l'icône "Trash"
2. Confirmez la suppression
3. La dépense doit disparaître

## 🌐 Déploiement en production (Optionnel)

### Option 1 : Vercel (Recommandé)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Installez Vercel CLI :
   ```bash
   npm i -g vercel
   ```
3. Déployez :
   ```bash
   vercel
   ```
4. Suivez les instructions
5. Ajoutez les variables d'environnement dans Vercel Dashboard

### Option 2 : Netlify

1. Créez un compte sur [Netlify](https://netlify.com)
2. Connectez votre repository Git
3. Configurez :
   - Build command : `npm run build`
   - Publish directory : `.next`
4. Ajoutez les variables d'environnement

### Option 3 : Docker (Avancé)

Créez un `Dockerfile` :

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build et run :

```bash
docker build -t budget-app .
docker run -p 3000:3000 --env-file .env.local budget-app
```

## 🔒 Sécurité en production

### 1. Variables d'environnement

- ✅ Utilisez des variables d'environnement pour les clés
- ❌ Ne commitez JAMAIS `.env.local` dans Git
- ✅ Ajoutez `.env.local` au `.gitignore`

### 2. Supabase RLS (Phase 2)

Pour multi-utilisateurs, activez Row Level Security :

```sql
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
    ON expenses FOR SELECT
    USING (auth.uid() = user_id);
```

### 3. HTTPS

- Toujours utiliser HTTPS en production
- Vercel et Netlify fournissent HTTPS automatiquement

## 📊 Monitoring

### Supabase Dashboard

- **Database** : Voir les tables et données
- **API** : Voir les requêtes API
- **Logs** : Voir les logs en temps réel
- **Reports** : Statistiques d'utilisation

### Application Logs

Consultez les logs :

```bash
# Développement
npm run dev

# Production
npm start
```

## 🐛 Résolution de problèmes

### Erreur : "Cannot connect to Supabase"

**Solution** :
1. Vérifiez `.env.local`
2. Vérifiez que le projet Supabase est actif
3. Vérifiez votre connexion internet

### Erreur : "Table does not exist"

**Solution** :
1. Retournez dans SQL Editor
2. Réexécutez `supabase-schema.sql`
3. Vérifiez dans Table Editor

### Erreur : "Build failed"

**Solution** :
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Les calculs sont incorrects

**Solution** :
1. Vérifiez que les budgets sont définis
2. Vérifiez les dates des dépenses
3. Consultez la console navigateur (F12)

## 📈 Performance

### Optimisations recommandées

1. **Index Supabase** : Déjà créés dans le schéma
2. **Caching** : Next.js gère automatiquement
3. **Images** : Utilisez `next/image` si vous ajoutez des images
4. **Code splitting** : Automatique avec Next.js

### Monitoring des performances

```bash
npm run build
```

Vérifiez la taille des bundles dans le terminal.

## 🔄 Mises à jour

### Mettre à jour les dépendances

```bash
npm update
npm audit fix
```

### Déployer une nouvelle version

```bash
git add .
git commit -m "Update: description"
git push

# Si Vercel/Netlify : déploiement automatique
# Sinon : npm run build && npm start
```

## 📞 Support

### Problèmes courants

1. **Erreur de build** : Vérifiez Node.js version
2. **Erreur Supabase** : Vérifiez les clés API
3. **Erreur de calcul** : Vérifiez les données en base

### Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation TailwindCSS](https://tailwindcss.com/docs)

## ✅ Checklist de déploiement

- [ ] Projet Supabase créé
- [ ] Schéma SQL exécuté
- [ ] 8 catégories créées
- [ ] Variables d'environnement configurées
- [ ] Application démarre en local
- [ ] Test ajout dépense réussi
- [ ] Test définition budget réussi
- [ ] Dashboard affiche correctement
- [ ] Modification/suppression fonctionnent
- [ ] Aucune erreur dans la console

## 🎉 Félicitations !

Votre application Budget App est maintenant déployée et fonctionnelle !

---

**Version** : 1.0.0  
**Date** : Mars 2026
