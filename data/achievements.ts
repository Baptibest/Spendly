import { Achievement } from '@/types/achievement.types';

export const ACHIEVEMENTS: Achievement[] = [
  // Succès Communs
  {
    id: 'first-expense',
    title: 'Première dépense',
    description: 'Enregistrez votre première dépense',
    icon: '💸',
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'first-budget',
    title: 'Premier budget',
    description: 'Créez votre premier budget',
    icon: '📊',
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'first-category',
    title: 'Organisé',
    description: 'Créez une catégorie personnalisée',
    icon: '📁',
    rarity: 'common',
    unlocked: false
  },
  {
    id: '7-days-streak',
    title: 'Une semaine',
    description: 'Connectez-vous 7 jours consécutifs',
    icon: '📅',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: '10-expenses',
    title: 'Actif',
    description: 'Enregistrez 10 dépenses',
    icon: '✅',
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'profile-complete',
    title: 'Profil complet',
    description: 'Complétez toutes les informations de votre profil',
    icon: '👤',
    rarity: 'common',
    unlocked: false
  },

  // Succès Rares
  {
    id: 'budget-respected',
    title: 'Budget respecté',
    description: 'Respectez un budget pendant un mois complet',
    icon: '🎯',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: '30-days-streak',
    title: 'Un mois',
    description: 'Connectez-vous 30 jours consécutifs',
    icon: '🔥',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: '50-expenses',
    title: 'Assidu',
    description: 'Enregistrez 50 dépenses',
    icon: '💪',
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'all-budgets-respected',
    title: 'Maîtrise totale',
    description: 'Respectez tous vos budgets pendant un mois',
    icon: '👑',
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'savings-goal',
    title: 'Épargnant',
    description: 'Atteignez un objectif d\'épargne de 500€',
    icon: '💰',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'expense-reduction',
    title: 'Économe',
    description: 'Réduisez vos dépenses de 20% par rapport au mois précédent',
    icon: '📉',
    rarity: 'rare',
    unlocked: false
  },

  // Succès Légendaires
  {
    id: '100-days-streak',
    title: 'Centenaire',
    description: 'Connectez-vous 100 jours consécutifs',
    icon: '🌟',
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: '6-months-budgets',
    title: 'Expert budgétaire',
    description: 'Respectez tous vos budgets pendant 6 mois',
    icon: '🏆',
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: '1000-euros-saved',
    title: 'Millionnaire en devenir',
    description: 'Économisez 1000€',
    icon: '💎',
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'all-achievements',
    title: 'Perfectionniste',
    description: 'Débloquez tous les autres succès',
    icon: '⭐',
    rarity: 'mythic',
    unlocked: false
  },
  {
    id: 'zero-debt',
    title: 'Liberté financière',
    description: 'Atteignez un solde positif de 5000€',
    icon: '🎊',
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'broke-500',
    title: 'C\'est la dèche',
    description: 'Terminez avec 500€ en négatif',
    icon: '💸',
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'no-expense-5-days',
    title: 'Vous êtes un Rat',
    description: 'Aucune dépense pendant 5 jours',
    icon: '🐀',
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'daily-expense-5-days',
    title: 'Cochon qui Flambe',
    description: 'Une dépense par jour pendant 5 jours',
    icon: '🔥',
    rarity: 'legendary',
    unlocked: false
  }
];
