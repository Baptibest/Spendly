import { NextRequest, NextResponse } from 'next/server';
import { categorizeTransaction } from '@/services/bank.service';
import { supabase } from '@/lib/supabase';
import { createErrorResponse, createSuccessResponse } from '@/utils/errorHandler';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { category_id } = await request.json();

    if (!category_id) {
      return NextResponse.json(
        createErrorResponse('category_id est requis'),
        { status: 400 }
      );
    }

    const data = await categorizeTransaction(params.id, category_id);

    return NextResponse.json(createSuccessResponse(data));
  } catch (err) {
    console.error('Erreur serveur:', err);
    return NextResponse.json(
      createErrorResponse('Erreur serveur'),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('bank_transactions')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Erreur suppression transaction:', error);
      return NextResponse.json(
        createErrorResponse('Erreur lors de la suppression de la transaction'),
        { status: 500 }
      );
    }

    return NextResponse.json(createSuccessResponse({ id: params.id }));
  } catch (err) {
    console.error('Erreur serveur:', err);
    return NextResponse.json(
      createErrorResponse('Erreur serveur'),
      { status: 500 }
    );
  }
}
