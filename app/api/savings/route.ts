import { NextResponse } from 'next/server';
import { getSavings, upsertSavings } from '@/services/savings.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month') || '0');
    const year = parseInt(searchParams.get('year') || '0');

    if (!month || !year) {
      return NextResponse.json(
        createErrorResponse('Mois et année requis'),
        { status: 400 }
      );
    }

    const savings = await getSavings(month, year);
    return NextResponse.json(createSuccessResponse(savings));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { month, year, amount, target_amount } = body;

    if (!month || !year || amount === undefined) {
      return NextResponse.json(
        createErrorResponse('Mois, année et montant requis'),
        { status: 400 }
      );
    }

    if (amount < 0) {
      return NextResponse.json(
        createErrorResponse('Le montant doit être positif'),
        { status: 400 }
      );
    }

    const savings = await upsertSavings(
      month,
      year,
      amount,
      target_amount || 0
    );
    return NextResponse.json(createSuccessResponse(savings), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
