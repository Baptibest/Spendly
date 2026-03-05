import { NextRequest, NextResponse } from 'next/server';
import {
  getBudgetSettings,
  updateBudgetSettings,
} from '@/services/settings.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Non authentifié'),
        { status: 401 }
      );
    }

    let settings = await getBudgetSettings(userId);
    
    // Si l'utilisateur n'a pas de settings, créer des settings par défaut
    if (!settings) {
      settings = await updateBudgetSettings('category', 0, userId);
    }
    
    return NextResponse.json(createSuccessResponse(settings));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Non authentifié'),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { mode, monthly_income } = body;

    if (!mode || (mode !== 'category' && mode !== 'global' && mode !== 'automatic')) {
      return NextResponse.json(
        createErrorResponse('Mode invalide. Utilisez "category", "global" ou "automatic"'),
        { status: 400 }
      );
    }

    if (mode === 'global' && (!monthly_income || monthly_income < 0)) {
      return NextResponse.json(
        createErrorResponse('Revenu mensuel requis pour le mode global'),
        { status: 400 }
      );
    }

    const settings = await updateBudgetSettings(mode, monthly_income || 0, userId);
    return NextResponse.json(createSuccessResponse(settings));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
