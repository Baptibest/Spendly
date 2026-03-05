import { NextRequest, NextResponse } from 'next/server';
import { AchievementService } from '@/lib/achievementService';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID requis' },
        { status: 400 }
      );
    }

    const service = new AchievementService(userId);
    
    // Vérifier tous les succès
    await service.checkAllAchievements();
    
    // Récupérer les succès débloqués
    const unlockedIds = await service.getUnlockedAchievements();

    return NextResponse.json({
      success: true,
      data: {
        unlockedCount: unlockedIds.length,
        unlockedIds
      }
    });
  } catch (error) {
    console.error('Erreur vérification succès:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
