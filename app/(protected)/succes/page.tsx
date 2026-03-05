'use client';

import Card from '@/components/ui/Card';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';

export default function SuccesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          🏆 Succès
        </h1>
        <p className="text-gray-600 mt-2">
          Suivez vos accomplissements et objectifs atteints
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="🎯 Objectifs">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium">Premier budget créé</p>
                  <p className="text-sm text-gray-500">Débloqué</p>
                </div>
              </div>
              <Trophy className="text-yellow-500" size={24} />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="flex items-center gap-3">
                <Star className="text-gray-400" size={24} />
                <div>
                  <p className="font-medium">Budget respecté</p>
                  <p className="text-sm text-gray-500">À débloquer</p>
                </div>
              </div>
              <Trophy className="text-gray-300" size={24} />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-gray-400" size={24} />
                <div>
                  <p className="font-medium">Épargne atteinte</p>
                  <p className="text-sm text-gray-500">À débloquer</p>
                </div>
              </div>
              <Trophy className="text-gray-300" size={24} />
            </div>
          </div>
        </Card>

        <Card title="📊 Statistiques">
          <div className="space-y-4">
            <div className="p-3 bg-primary-50 rounded-lg">
              <p className="text-sm text-gray-600">Jours consécutifs</p>
              <p className="text-3xl font-bold text-primary-700">7</p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Budgets respectés</p>
              <p className="text-3xl font-bold text-success">3</p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Succès débloqués</p>
              <p className="text-3xl font-bold text-yellow-600">1/10</p>
            </div>
          </div>
        </Card>

        <Card title="🎖️ Badges">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg">
              <Trophy className="text-yellow-500" size={32} />
              <p className="text-xs mt-2 text-center">Débutant</p>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg opacity-50">
              <Trophy className="text-gray-300" size={32} />
              <p className="text-xs mt-2 text-center">Expert</p>
            </div>

            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg opacity-50">
              <Trophy className="text-gray-300" size={32} />
              <p className="text-xs mt-2 text-center">Maître</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="🎯 Défis du mois">
        <div className="space-y-3">
          <div className="p-4 border-l-4 border-primary-500 bg-primary-50 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Respecter tous les budgets</p>
                <p className="text-sm text-gray-600">Progression: 60%</p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
            <div className="mt-2 bg-white rounded-full h-2">
              <div className="bg-primary-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Épargner 500€</p>
                <p className="text-sm text-gray-600">Progression: 30%</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
            <div className="mt-2 bg-white rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
