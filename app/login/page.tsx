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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Stocker les informations de l'utilisateur
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.data));
        
        // Rediriger vers la page des dépenses
        router.push('/expenses');
      } else {
        alert(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
      alert('Erreur de connexion');
    }
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
