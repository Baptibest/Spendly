'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Afficher le message de succès
        setSuccess(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      setError('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
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
            Commencez à gérer votre budget dès maintenant
          </p>
        </div>

        <Card>
          {success ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Inscription réussie ! 🎉
              </h2>
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
                <p className="font-medium mb-2">📧 Vérifiez votre email</p>
                <p className="text-sm">
                  Nous vous avons envoyé un email de confirmation. Cliquez sur le lien dans l&apos;email pour activer votre compte.
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Vous ne voyez pas l&apos;email ? Vérifiez vos spams ou attendez quelques minutes.
              </p>
              <Button onClick={() => router.push('/login')} className="w-full">
                Aller à la page de connexion
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

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
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Au moins 6 caractères
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Inscription en cours...' : 'Créer mon compte'}
            </Button>

            <div className="text-center">
              <div className="mt-4 text-center text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <a href="/login" className="text-primary-600 hover:underline font-medium">
                  Se connecter
                </a>
              </div>
            </div>
          </form>
          )}
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            En créant un compte, vous acceptez nos conditions d&apos;utilisation
          </p>
        </div>
      </div>
    </div>
  );
}
