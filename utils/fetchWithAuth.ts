// Fonction helper pour faire des requêtes avec l'ID utilisateur
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Récupérer l'utilisateur depuis localStorage
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || !user.id) {
    throw new Error('Utilisateur non authentifié');
  }

  // Ajouter l'ID utilisateur dans les headers
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'x-user-id': user.id,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
