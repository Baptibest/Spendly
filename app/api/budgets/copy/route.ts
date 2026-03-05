import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromMonth, fromYear, toMonth, toYear } = body;

    if (!fromMonth || !fromYear || !toMonth || !toYear) {
      return NextResponse.json(
        createErrorResponse('Mois et année source et destination requis'),
        { status: 400 }
      );
    }

    const { data: sourceBudgets, error: fetchError } = await supabase
      .from('budgets')
      .select('category_id, amount')
      .eq('month', fromMonth)
      .eq('year', fromYear);

    if (fetchError) throw fetchError;

    if (!sourceBudgets || sourceBudgets.length === 0) {
      return NextResponse.json(
        createErrorResponse('Aucun budget trouvé pour le mois source'),
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from('budgets')
      .delete()
      .eq('month', toMonth)
      .eq('year', toYear);

    if (deleteError) throw deleteError;

    const newBudgets = sourceBudgets.map((budget) => ({
      category_id: budget.category_id,
      amount: budget.amount,
      month: toMonth,
      year: toYear,
    }));

    const { error: insertError } = await supabase
      .from('budgets')
      .insert(newBudgets);

    if (insertError) throw insertError;

    return NextResponse.json(
      createSuccessResponse({
        message: 'Budgets copiés avec succès',
        count: newBudgets.length,
      }),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
