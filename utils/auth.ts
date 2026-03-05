import { NextRequest } from 'next/server';

export function getUserIdFromRequest(request: NextRequest): string | null {
  // Récupérer le user_id depuis les headers
  const userId = request.headers.get('x-user-id');
  return userId;
}

export function getUserFromLocalStorage(): { id: string; email: string; role: string } | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}
