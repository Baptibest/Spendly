'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { BudgetSettings } from '@/types/settings.types';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<BudgetSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Erreur chargement paramètres:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings size={32} className="text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
      </div>

      <Card title="Configuration actuelle">
        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-900 mb-3">
              � Informations de configuration
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
