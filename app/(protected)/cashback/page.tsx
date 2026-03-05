'use client';

import Card from '@/components/ui/Card';
import { Gift, TrendingUp, Calendar, Award } from 'lucide-react';

export default function CashbackPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          💰 Cashback
        </h1>
        <p className="text-gray-600 mt-2">
          Gagnez des récompenses sur vos dépenses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Solde Cashback */}
        <Card title="💵 Solde Cashback">
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-primary-600">0,00 €</p>
            <p className="text-sm text-gray-500 mt-2">Cashback disponible</p>
          </div>
        </Card>

        {/* Cashback du mois */}
        <Card title="📅 Ce mois-ci">
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-green-600">0,00 €</p>
            <p className="text-sm text-gray-500 mt-2">Cashback gagné</p>
          </div>
        </Card>

        {/* Cashback total */}
        <Card title="🏆 Total gagné">
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-yellow-600">0,00 €</p>
            <p className="text-sm text-gray-500 mt-2">Depuis le début</p>
          </div>
        </Card>
      </div>

      {/* Offres Cashback */}
      <Card title="🎁 Offres Cashback">
        <div className="space-y-4">
          <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="text-green-600" size={32} />
                <div>
                  <p className="font-semibold text-gray-900">Alimentation</p>
                  <p className="text-sm text-gray-600">2% de cashback sur vos courses</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                2%
              </span>
            </div>
          </div>

          <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-600" size={32} />
                <div>
                  <p className="font-semibold text-gray-900">Transport</p>
                  <p className="text-sm text-gray-600">1.5% de cashback sur vos déplacements</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                1.5%
              </span>
            </div>
          </div>

          <div className="p-4 border-2 border-purple-200 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="text-purple-600" size={32} />
                <div>
                  <p className="font-semibold text-gray-900">Loisirs</p>
                  <p className="text-sm text-gray-600">3% de cashback sur vos sorties</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                3%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Historique Cashback */}
      <Card title="📜 Historique">
        <div className="text-center py-12">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">Aucune transaction cashback pour le moment</p>
          <p className="text-sm text-gray-400 mt-2">
            Vos gains de cashback apparaîtront ici
          </p>
        </div>
      </Card>
    </div>
  );
}
