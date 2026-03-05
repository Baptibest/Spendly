# 🚀 Guide de Démarrage Rapide - Budget App

## ⚡ Configuration en 5 minutes

### Étape 1 : Créer un compte Supabase (2 min)

1. Allez sur **https://supabase.com**
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub, Google ou Email
4. Cliquez sur **"New Project"**
5. Remplissez :
   - **Name** : `Budget App`
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : `Europe West (Frankfurt)` ou le plus proche
6. Cliquez sur **"Create new project"**
7. ⏳ Attendez 2-3 minutes que le projet soit créé

### Étape 2 : Créer les tables (1 min)

1. Dans votre projet Supabase, cliquez sur **"SQL Editor"** dans le menu gauche
2. Cliquez sur **"New query"**
3. Ouvrez le fichier `supabase-schema.sql` de ce projet
4. **Copiez tout le contenu** (Ctrl+A puis Ctrl+C)
5. **Collez** dans l'éditeur SQL de Supabase
6. Cliquez sur **"Run"** (ou appuyez sur Ctrl+Enter)
7. ✅ Vous devriez voir "Success. No rows returned"

### Étape 3 : Vérifier les tables (30 sec)

1. Cliquez sur **"Table Editor"** dans le menu gauche
2. Vous devriez voir 3 tables :
   - ✅ **categories** (8 lignes)
   - ✅ **expenses** (0 ligne)
   - ✅ **budgets** (0 ligne)

### Étape 4 : Récupérer les clés API (30 sec)

1. Cliquez sur **"Settings"** (icône engrenage en bas à gauche)
2. Cliquez sur **"API"**
3. Vous verrez deux informations importantes :

**Project URL** :
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon public** (clé longue) :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

4. **Copiez ces deux valeurs** (vous en aurez besoin à l'étape suivante)

### Étape 5 : Configurer l'application (1 min)

1. Dans le dossier `budget-app`, créez un nouveau fichier nommé **`.env.local`**
2. Ouvrez-le et collez ceci :

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

3. **Remplacez** les valeurs par celles que vous avez copiées à l'étape 4
4. **Sauvegardez** le fichier (Ctrl+S)

### Étape 6 : Redémarrer l'application (30 sec)

1. Dans le terminal où tourne `npm run dev` :
   - Appuyez sur **Ctrl+C** pour arrêter
   - Tapez **`npm run dev`** pour redémarrer
2. Attendez que "Ready" s'affiche
3. Ouvrez **http://localhost:3000**

## 🎉 C'est prêt !

Votre application est maintenant **100% fonctionnelle** !

## ✅ Test rapide

### Test 1 : Ajouter une dépense

1. Sur la page d'accueil
2. Remplissez :
   - **Montant** : `50`
   - **Description** : `Courses Carrefour`
   - **Catégorie** : `Alimentation`
   - **Date** : Aujourd'hui
3. Cliquez sur **"Ajouter la dépense"**
4. ✅ La dépense apparaît dans "Dernières dépenses"

### Test 2 : Définir un budget

1. Cliquez sur **"Budgets"** dans le menu
2. Sélectionnez le mois en cours
3. Définissez :
   - **Alimentation** : `500`
   - **Transport** : `200`
   - **Loisirs** : `150`
4. Cliquez sur **"Enregistrer les budgets"**
5. ✅ Message "Budgets enregistrés avec succès !"

### Test 3 : Voir le dashboard

1. Cliquez sur **"Dashboard"** dans le menu
2. Vous devriez voir :
   - ✅ Total budget : 850.00 €
   - ✅ Dépensé : 50.00 €
   - ✅ Reste : 800.00 €
   - ✅ Graphique avec barres
   - ✅ Cartes par catégorie

## 🎨 Fonctionnalités disponibles

- ✅ **Ajouter** des dépenses
- ✅ **Modifier** des dépenses (icône crayon)
- ✅ **Supprimer** des dépenses (icône poubelle)
- ✅ **Définir** des budgets mensuels
- ✅ **Visualiser** le dashboard avec graphiques
- ✅ **Consulter** l'historique des 6 derniers mois
- ✅ **Calculs automatiques** en temps réel

## 🐛 Problèmes courants

### "Cannot connect to Supabase"

**Solution** :
- Vérifiez que `.env.local` existe
- Vérifiez que les clés sont correctes (pas d'espaces)
- Redémarrez l'application (Ctrl+C puis `npm run dev`)

### "Table does not exist"

**Solution** :
- Retournez dans Supabase SQL Editor
- Réexécutez le script `supabase-schema.sql`
- Vérifiez dans Table Editor que les 3 tables existent

### Les dépenses n'apparaissent pas

**Solution** :
- Ouvrez la console du navigateur (F12)
- Regardez les erreurs dans l'onglet Console
- Vérifiez que la date de la dépense est correcte

## 📚 Documentation complète

Pour plus d'informations, consultez :
- **README.md** - Documentation complète
- **DEPLOYMENT.md** - Guide de déploiement détaillé
- **supabase-schema.sql** - Schéma de base de données

## 🎯 Prochaines étapes

1. Ajoutez vos vraies dépenses
2. Définissez vos budgets mensuels
3. Consultez le dashboard régulièrement
4. Explorez l'historique

## 💡 Astuces

- Les **couleurs** des barres de progression changent selon le pourcentage :
  - 🟢 Vert : < 75%
  - 🟠 Orange : 75-100%
  - 🔴 Rouge : > 100%

- Vous pouvez **modifier** une dépense en cliquant sur l'icône crayon

- L'**historique** vous permet de voir les 6 derniers mois

- Les **calculs** sont automatiques et en temps réel

## 🚀 Bon usage !

Votre application Budget App est maintenant prête à l'emploi !

---

**Besoin d'aide ?** Consultez README.md ou DEPLOYMENT.md
