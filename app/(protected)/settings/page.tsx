'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BudgetSettings } from '@/types/settings.types';
import { Settings, LogOut, Camera } from 'lucide-react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<BudgetSettings | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<string>('/default-avatar.png');
  // Page avec bouton de déconnexion

  useEffect(() => {
    fetchSettings();
    
    // Récupérer les informations de l'utilisateur
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    
    // Récupérer la photo de profil
    const savedPicture = localStorage.getItem('profilePicture');
    if (savedPicture) {
      setProfilePicture(savedPicture);
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

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePicture(base64String);
        localStorage.setItem('profilePicture', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings size={32} className="text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
      </div>

      <Card title="Compte utilisateur">
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
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
              
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-200 bg-gray-100">
                    {profilePicture !== '/default-avatar.png' ? (
                      <Image
                        src={profilePicture}
                        alt="Photo de profil"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                        👤
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile-picture-input"
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-primary-700 transition-colors"
                  >
                    <Camera size={16} />
                  </label>
                  <input
                    id="profile-picture-input"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 text-center max-w-[96px]">
                  Changer la photo
                </p>
              </div>
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
            <strong>Version :</strong> Close Alpha Test - Phase 1 MVP
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
