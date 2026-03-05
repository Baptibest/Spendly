import { NextResponse } from 'next/server';
import { deleteCategory } from '@/services/category.service';
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
    await deleteCategory(params.id);
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
