import { NextRequest, NextResponse } from 'next/server';
import { updateExpense, deleteExpense } from '@/services/expense.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Non authentifié'),
        { status: 401 }
      );
    }

    const body = await request.json();
    const expense = await updateExpense(params.id, body, userId);
    return NextResponse.json(createSuccessResponse(expense));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Non authentifié'),
        { status: 401 }
      );
    }

    await deleteExpense(params.id, userId);
    return NextResponse.json(
      createSuccessResponse({ message: 'Dépense supprimée' })
    );
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
