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
    const body = await request.json();
    const expense = await updateExpense(params.id, body);
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
    await deleteExpense(params.id);
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
