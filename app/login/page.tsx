'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pour l'instant, connexion simple sans authentification réelle
    // On stocke juste un flag dans le localStorage
    localStorage.setItem('isAuthenticated', 'true');
    
    // Rediriger vers la page des dépenses (l'ancienne page d'accueil)
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenue sur <span className="text-primary-600">Spendly</span>
          </h1>
          <p className="text-gray-600">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <Card>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Se connecter
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            En vous connectant, vous acceptez nos conditions d&apos;utilisation
          </p>
        </div>
      </div>
    </div>
  );
}
