import { NextRequest, NextResponse } from 'next/server';
import { seedDefaultCategories } from '@/services/category.service';

// API route pour initialiser les catégories par défaut d'un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Créer les catégories par défaut pour cet utilisateur
    await seedDefaultCategories(userId);

    return NextResponse.json({
      success: true,
      message: 'Catégories par défaut créées',
    });
  } catch (error) {
    console.error('Erreur initialisation utilisateur:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
