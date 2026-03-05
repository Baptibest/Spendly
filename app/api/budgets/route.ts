import { NextRequest, NextResponse } from 'next/server';
import {
  createOrUpdateBudget,
  getBudgetsByMonth,
} from '@/services/budget.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';
import { validateBudgetInput } from '@/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateBudgetInput(body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(validation.error.errors[0].message),
        { status: 400 }
      );
    }

    const budget = await createOrUpdateBudget(validation.data);
    return NextResponse.json(createSuccessResponse(budget), { status: 201 });
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

    if (!month || !year) {
      return NextResponse.json(
        createErrorResponse('Paramètres manquants: month et year'),
        { status: 400 }
      );
    }

    const budgets = await getBudgetsByMonth(
      parseInt(month, 10),
      parseInt(year, 10)
    );
    return NextResponse.json(createSuccessResponse(budgets));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
