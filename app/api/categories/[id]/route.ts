import { NextRequest, NextResponse } from 'next/server';
import { deleteCategory } from '@/services/category.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

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

    await deleteCategory(params.id, userId);
    return NextResponse.json(
      createSuccessResponse({ message: 'Catégorie supprimée avec succès' })
    );
  } catch (error) {
    const errorMessage = handleSupabaseError(error);
    if (errorMessage.includes('foreign key')) {
      return NextResponse.json(
        createErrorResponse(
          'Impossible de supprimer cette catégorie car elle contient des dépenses'
        ),
        { status: 400 }
      );
    }
    return NextResponse.json(createErrorResponse(errorMessage), {
      status: 500,
    });
  }
}
