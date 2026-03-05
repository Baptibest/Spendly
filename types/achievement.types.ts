export type AchievementRarity = 'common' | 'rare' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export const RARITY_COLORS = {
  common: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    badge: 'bg-gray-500'
  },
  rare: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    badge: 'bg-blue-500'
  },
  legendary: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    badge: 'bg-yellow-500'
  }
};

export const RARITY_LABELS = {
  common: 'Commune',
  rare: 'Rare',
  legendary: 'Légendaire'
};
