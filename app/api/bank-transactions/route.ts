import { NextResponse } from 'next/server';
import { getBankTransactions, categorizeTransaction } from '@/services/bank.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connection_id') || undefined;
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

    const transactions = await getBankTransactions(connectionId, month, year);
    return NextResponse.json(createSuccessResponse(transactions));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { transaction_id, category_id } = body;

    if (!transaction_id || !category_id) {
      return NextResponse.json(
        createErrorResponse('ID de transaction et catégorie requis'),
        { status: 400 }
      );
    }

    const transaction = await categorizeTransaction(transaction_id, category_id);
    return NextResponse.json(createSuccessResponse(transaction));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
