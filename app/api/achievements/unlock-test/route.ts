import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Route de test pour débloquer manuellement le succès "Première dépense"
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID requis' },
        { status: 400 }
      );
    }

    // Débloquer le succès "Première dépense"
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: 'first-expense'
      })
      .select();

    if (error) {
      console.error('Erreur débloquage:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Succès "Première dépense" débloqué !',
      data
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
