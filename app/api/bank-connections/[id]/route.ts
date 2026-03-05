import { NextResponse } from 'next/server';
import { deleteBankConnection } from '@/services/bank.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteBankConnection(params.id);
    return NextResponse.json(
      createSuccessResponse({ message: 'Connexion supprimée' })
    );
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
