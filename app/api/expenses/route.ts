import { NextRequest, NextResponse } from 'next/server';
import {
  createExpense,
  getExpensesByMonth,
  getRecentExpenses,
} from '@/services/expense.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';
import { validateExpenseInput } from '@/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateExpenseInput(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    const expense = await createExpense(validation.data);
    return NextResponse.json(createSuccessResponse(expense), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const recent = searchParams.get('recent');

    if (recent) {
      const limit = parseInt(recent, 10) || 10;
      const expenses = await getRecentExpenses(limit);
      return NextResponse.json(createSuccessResponse(expenses));
    }

    if (month && year) {
      const expenses = await getExpensesByMonth(
        parseInt(month, 10),
        parseInt(year, 10)
      );
      return NextResponse.json(createSuccessResponse(expenses));
    }

    return NextResponse.json(
      createErrorResponse('Paramètres manquants: month et year ou recent'),
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
