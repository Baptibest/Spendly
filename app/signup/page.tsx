'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        router.push('/login');
      } else {
        alert(data.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Erreur signup:', error);
      alert('Erreur lors de la création du compte');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Créer un compte <span className="text-primary-600">Spendly</span>
          </h1>
          <p className="text-gray-600">
            Rejoignez Spendly pour gérer vos finances
          </p>
        </div>

        <Card>
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
            
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" className="w-full">
              Créer mon compte
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-primary-600 hover:underline font-medium">
              Se connecter
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
