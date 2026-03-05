import { NextResponse } from 'next/server';
import { generateSimulatedTransactions } from '@/services/bank.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { connection_id, count = 10 } = body;

    if (!connection_id) {
      return NextResponse.json(
        createErrorResponse('ID de connexion requis'),
        { status: 400 }
      );
    }

    const transactions = await generateSimulatedTransactions(connection_id, count);
    
    return NextResponse.json(
      createSuccessResponse({
        transactions,
        count: transactions.length,
        message: `${transactions.length} transactions importées avec succès`,
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
