import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, createCategory } from '@/services/category.service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleSupabaseError,
} from '@/utils/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Non authentifié'),
        { status: 401 }
      );
    }

    const categories = await getAllCategories(userId);
    return NextResponse.json(createSuccessResponse(categories));
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        createErrorResponse('Non authentifié'),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, color, icon } = body;

    if (!name || !color) {
      return NextResponse.json(
        createErrorResponse('Le nom et la couleur sont requis'),
        { status: 400 }
      );
    }

    const category = await createCategory(name, color, userId, icon);
    return NextResponse.json(createSuccessResponse(category), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      createErrorResponse(handleSupabaseError(error)),
      { status: 500 }
    );
  }
}
