import { ApiResponse } from '@/types/api.types';

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  };
}

export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  return 'Une erreur est survenue. Veuillez réessayer.';
}
