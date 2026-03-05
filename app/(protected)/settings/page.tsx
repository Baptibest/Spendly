'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BudgetSettings } from '@/types/settings.types';
import { Settings, LogOut, Sun, Moon, Monitor } from 'lucide-react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<BudgetSettings | null>(null);
  const [user, setUser] = useState<any>(null);
  // Page avec bouton de déconnexion

  useEffect(() => {
    fetchSettings();
    
    // Récupérer les informations de l'utilisateur
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetchWithAuth('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Erreur chargement paramètres:', err);
    }
  };

  const handleLogout = () => {
    // Vider le localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    // Rediriger vers la page de connexion
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings size={32} className="text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
      </div>

      <Card title="Apparence">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-3">
              🎨 Thème de l&apos;application
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <Sun className="mx-auto mb-2 text-yellow-500" size={24} />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Clair</p>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <Moon className="mx-auto mb-2 text-indigo-500" size={24} />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Sombre</p>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'system'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <Monitor className="mx-auto mb-2 text-gray-500 dark:text-gray-400" size={24} />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Système</p>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {theme === 'system'
                ? 'Le thème suit les préférences de votre système'
                : `Thème ${theme === 'light' ? 'clair' : 'sombre'} activé`}
            </p>
          </div>
        </div>
      </Card>

      <Card title="Compte utilisateur">
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <p className="font-semibold text-primary-900 mb-2">
              👤 Informations du compte
            </p>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Email :</strong> {user?.email || 'Non connecté'}
              </p>
              <p>
                <strong>Rôle :</strong>{' '}
                <span className={user?.role === 'admin' ? 'text-primary-600 font-semibold' : ''}>
                  {user?.role === 'admin' ? '👑 Administrateur' : '👤 Utilisateur'}
                </span>
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Se déconnecter
          </Button>
        </div>
      </Card>

      <Card title="Configuration actuelle">
        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-900 mb-3">
              📋 Informations de configuration
            </p>
            <div className="space-y-2">
              <p>
                <strong>Mode de gestion :</strong>{' '}
                {settings?.mode === 'category'
                  ? '📊 Budget par catégorie'
                  : '🏆 Budget global avec score'}
              </p>
              {settings?.mode === 'global' && (
                <p>
                  <strong>Revenu mensuel :</strong> {settings.monthly_income} €
                </p>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-2">Configurez les paramètres de l&apos;application, allez dans l&apos;onglet <strong>Budgets</strong>.</p>
        </div>
      </Card>

      <Card title="À propos">
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Application :</strong> Budget App
          </p>
          <p>
            <strong>Version :</strong> 1.0.0 - Phase 1 MVP
          </p>
          <p>
            <strong>Fonctionnalités :</strong>
          </p>
          <ul className="ml-4 space-y-1">
            <li>• Gestion des dépenses par catégorie</li>
            <li>• Deux modes de gestion budgétaire</li>
            <li>• Dashboard avec visualisations</li>
            <li>• Historique des mois précédents</li>
            <li>• Système de score (mode global)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
