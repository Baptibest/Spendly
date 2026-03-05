import { useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Achievement } from '@/types/achievement.types';
import { AchievementService } from '@/lib/achievementService';

export function useAchievements(userId: string | null) {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadAchievements = async () => {
      try {
        const service = new AchievementService(userId);
        
        // Vérifier tous les succès
        await service.checkAllAchievements();
        
        // Récupérer les succès débloqués
        const unlockedIds = await service.getUnlockedAchievements();
        
        // Mettre à jour l'état des succès
        const updatedAchievements = ACHIEVEMENTS.map(achievement => ({
          ...achievement,
          unlocked: unlockedIds.includes(achievement.id)
        }));
        
        setAchievements(updatedAchievements);
      } catch (error) {
        console.error('Erreur chargement succès:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [userId]);

  const refreshAchievements = async () => {
    if (!userId) return;
    
    setLoading(true);
    const service = new AchievementService(userId);
    await service.checkAllAchievements();
    const unlockedIds = await service.getUnlockedAchievements();
    
    const updatedAchievements = ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id)
    }));
    
    setAchievements(updatedAchievements);
    setLoading(false);
  };

  return { achievements, loading, refreshAchievements };
}
