'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import { Trophy } from 'lucide-react';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Achievement, RARITY_COLORS, RARITY_LABELS } from '@/types/achievement.types';

export default function SuccesPage() {
  // Séparer les succès par statut
  const unlockedAchievements = useMemo(() => 
    ACHIEVEMENTS.filter(a => a.unlocked),
    []
  );
  
  const lockedAchievements = useMemo(() => 
    ACHIEVEMENTS.filter(a => !a.unlocked),
    []
  );

  // 3 objectifs aléatoires parmi les non réalisés
  const randomObjectives = useMemo(() => {
    const shuffled = [...lockedAchievements].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [lockedAchievements]);

  // 3 meilleurs succès réalisés (mythique > légendaires > rares > communs)
  const topAchievements = useMemo(() => {
    const rarityOrder = { mythic: 4, legendary: 3, rare: 2, common: 1 };
    return [...unlockedAchievements]
      .sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity])
      .slice(0, 3);
  }, [unlockedAchievements]);

  // Statistiques par rareté
  const stats = useMemo(() => {
    const common = ACHIEVEMENTS.filter(a => a.rarity === 'common');
    const rare = ACHIEVEMENTS.filter(a => a.rarity === 'rare');
    const legendary = ACHIEVEMENTS.filter(a => a.rarity === 'legendary');

    return {
      common: {
        unlocked: common.filter(a => a.unlocked).length,
        total: common.length
      },
      rare: {
        unlocked: rare.filter(a => a.unlocked).length,
        total: rare.length
      },
      legendary: {
        unlocked: legendary.filter(a => a.unlocked).length,
        total: legendary.length
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          🏆 Succès
        </h1>
        <p className="text-gray-600 mt-2">
          Suivez vos accomplissements et objectifs atteints
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Objectifs - 3 succès aléatoires non réalisés */}
        <Card title="🎯 Objectifs">
          <div className="space-y-3 h-full">
            {randomObjectives.length > 0 ? (
              randomObjectives.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 h-24 flex items-center ${RARITY_COLORS[achievement.rarity].border} ${RARITY_COLORS[achievement.rarity].bg}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs text-white ${RARITY_COLORS[achievement.rarity].badge}`}>
                        {RARITY_LABELS[achievement.rarity]}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Tous les succès débloqués ! 🎉</p>
            )}
          </div>
        </Card>

        {/* Statistiques par rareté */}
        <Card title="📊 Statistiques">
          <div className="space-y-3 h-full">
            <div className="p-3 rounded-lg border-2 border-gray-300 bg-gray-100 h-24 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Communes</p>
                <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded">Commune</span>
              </div>
              <p className="text-2xl font-bold text-gray-700 mt-1">
                {stats.common.unlocked}/{stats.common.total}
              </p>
            </div>
            
            <div className="p-3 rounded-lg border-2 border-blue-300 bg-blue-100 h-24 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-700">Rares</p>
                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded">Rare</span>
              </div>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {stats.rare.unlocked}/{stats.rare.total}
              </p>
            </div>

            <div className="p-3 rounded-lg border-2 border-yellow-300 bg-yellow-100 h-24 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-yellow-700">Légendaires</p>
                <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded">Légendaire</span>
              </div>
              <p className="text-2xl font-bold text-yellow-700 mt-1">
                {stats.legendary.unlocked}/{stats.legendary.total}
              </p>
            </div>
          </div>
        </Card>

        {/* Meilleurs succès - 3 meilleurs réalisés */}
        <Card title="🎖️ Meilleurs Succès">
          <div className="space-y-3 h-full">
            {topAchievements.length > 0 ? (
              topAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 h-24 flex items-center ${RARITY_COLORS[achievement.rarity].border} ${RARITY_COLORS[achievement.rarity].bg}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs text-white ${RARITY_COLORS[achievement.rarity].badge}`}>
                        {RARITY_LABELS[achievement.rarity]}
                      </span>
                    </div>
                    <Trophy className="text-yellow-500" size={24} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Aucun succès débloqué pour le moment</p>
            )}
          </div>
        </Card>
      </div>

      {/* Tous les succès */}
      <Card title="� Tous les Succès">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 ${
                achievement.rarity === 'mythic'
                  ? 'border-purple-500'
                  : RARITY_COLORS[achievement.rarity].border
              } ${
                achievement.rarity === 'mythic'
                  ? ''
                  : RARITY_COLORS[achievement.rarity].bg
              } ${
                achievement.unlocked ? '' : 'opacity-60'
              }`}
              style={
                achievement.rarity === 'mythic'
                  ? {
                      background: 'linear-gradient(to right, #1e3a8a, #581c87)',
                    }
                  : undefined
              }
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold ${achievement.rarity === 'mythic' ? 'text-white' : ''}`}>{achievement.title}</p>
                    {achievement.unlocked && (
                      <Trophy className="text-yellow-500" size={20} />
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${achievement.rarity === 'mythic' ? 'text-purple-200' : 'text-gray-600'}`}>{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span 
                      className={`px-2 py-0.5 rounded text-xs text-white ${
                        achievement.unlocked && achievement.rarity !== 'mythic'
                          ? RARITY_COLORS[achievement.rarity].badge
                          : achievement.rarity !== 'mythic' ? 'bg-gray-400' : ''
                      }`}
                      style={
                        achievement.rarity === 'mythic'
                          ? {
                              background: 'linear-gradient(to right, #1d4ed8, #7e22ce)',
                            }
                          : undefined
                      }
                    >
                      {RARITY_LABELS[achievement.rarity]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {achievement.unlocked ? '✓ Débloqué' : 'Verrouillé'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
