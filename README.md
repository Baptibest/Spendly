# Budget App - Application de Gestion Budgétaire

Application web moderne pour gérer vos dépenses et budgets mensuels de manière simple et efficace.

## 🚀 Fonctionnalités

- ✅ Ajout et modification de dépenses
- ✅ Gestion de budgets mensuels par catégorie
- ✅ Dashboard avec visualisations graphiques
- ✅ Calculs automatiques (totaux, restes, pourcentages)
- ✅ Historique des mois précédents
- ✅ Interface responsive et moderne
- ✅ 8 catégories pré-définies

## 🛠️ Technologies

- **Frontend** : Next.js 14 (App Router), React 18, TypeScript
- **Styling** : TailwindCSS
- **Graphiques** : Recharts
- **Base de données** : Supabase (PostgreSQL)
- **Validation** : Zod
- **Icônes** : Lucide React

## 📋 Prérequis

- Node.js >= 18.17.0
- npm >= 9.0.0
- Compte Supabase (gratuit)

## 🔧 Installation

### 1. Cloner le projet

```bash
cd budget-app
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Exécutez le script SQL fourni dans `supabase-schema.sql`
4. Récupérez votre URL et clé API

### 4. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 5. Lancer l'application

```bash
# Mode développement
npm run dev

# Build production
npm run build
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
budget-app/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # Routes API
│   │   ├── categories/
│   │   ├── expenses/
│   │   └── budgets/
│   ├── dashboard/         # Page dashboard
│   ├── budgets/           # Page gestion budgets
│   ├── history/           # Page historique
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants UI génériques
│   ├── forms/            # Formulaires
│   ├── dashboard/        # Composants dashboard
│   └── layout/           # Composants layout
├── services/             # Services métier
│   ├── category.service.ts
│   ├── expense.service.ts
│   └── budget.service.ts
├── types/                # Types TypeScript
│   ├── category.types.ts
│   ├── expense.types.ts
│   ├── budget.types.ts
│   └── api.types.ts
├── utils/                # Utilitaires
│   ├── calculations.ts   # Calculs budgétaires
│   ├── date.utils.ts     # Gestion dates
│   ├── validation.ts     # Validation données
│   └── errorHandler.ts   # Gestion erreurs
└── lib/                  # Configuration externe
    └── supabase.ts       # Client Supabase
```

## 🎯 Utilisation

### Ajouter une dépense

1. Sur la page d'accueil, remplissez le formulaire
2. Sélectionnez le montant, description, catégorie et date
3. Cliquez sur "Ajouter la dépense"

### Définir des budgets

1. Allez sur la page "Budgets"
2. Sélectionnez le mois et l'année
3. Définissez un montant pour chaque catégorie
4. Cliquez sur "Enregistrer les budgets"

### Consulter le dashboard

1. Allez sur la page "Dashboard"
2. Visualisez vos dépenses vs budgets
3. Consultez les graphiques et statistiques

### Voir l'historique

1. Allez sur la page "Historique"
2. Sélectionnez un mois passé
3. Consultez les données du mois sélectionné

## 🎨 Catégories par défaut

- 🏠 Logement
- 🛒 Alimentation
- 🚗 Transport
- 🎮 Loisirs
- ❤️ Santé
- 💳 Abonnements
- 🛍️ Shopping
- ➕ Autres

## 🔒 Sécurité

- Toutes les clés Supabase sont stockées en variables d'environnement
- Aucune clé exposée côté client
- Toutes les requêtes passent par l'API backend
- Validation double (frontend + backend)

## 📊 Architecture

L'application suit une architecture en couches :

```
Interface (React)
    ↓
API Routes (Next.js)
    ↓
Services Métier
    ↓
Supabase Client
    ↓
PostgreSQL
```

**Principes** :
- Séparation stricte des responsabilités
- Pas de logique métier dans les composants
- Pas d'accès direct à Supabase depuis le frontend
- Calculs centralisés
- Code maintenable et évolutif

## 🧪 Tests

Pour tester l'application :

1. Ajoutez 10-20 dépenses de test
2. Définissez des budgets pour le mois en cours
3. Vérifiez les calculs sur le dashboard
4. Testez la modification et suppression de dépenses
5. Consultez l'historique

## 🚧 Limitations (Phase 1)

- Application mono-utilisateur
- Pas d'authentification
- Pas d'IA ou recommandations
- Pas de gamification
- Pas de chatbot

## 🔮 Évolutions futures

- Multi-utilisateurs avec authentification
- Classification automatique par IA
- Recommandations personnalisées
- Chatbot d'assistance
- Gamification
- Export PDF/Excel
- Notifications
- Application mobile

## 📝 Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Formatage code
npm run format
```

## 🐛 Résolution de problèmes

### Erreur de connexion Supabase

- Vérifiez vos variables d'environnement dans `.env.local`
- Assurez-vous que le projet Supabase est actif
- Vérifiez que les tables sont créées

### Erreur de build

- Supprimez `node_modules` et `.next`
- Réinstallez : `npm install`
- Rebuild : `npm run build`

### Les calculs sont incorrects

- Vérifiez que les budgets sont définis
- Assurez-vous que les dépenses ont la bonne date
- Consultez la console pour les erreurs

## 📄 Licence

MIT

## 👨‍💻 Auteur

Développé dans le cadre du projet Bachelor - Entreprenariat

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, consultez la documentation ou créez une issue sur le repository.

---

**Version** : 1.0.0 - Phase 1 MVP  
**Date** : Mars 2026
