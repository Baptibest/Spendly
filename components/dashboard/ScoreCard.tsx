'use client';

import { TrendingUp, TrendingDown, Award, PiggyBank } from 'lucide-react';
import Card from '@/components/ui/Card';

interface ScoreCardProps {
  income: number;
  spent: number;
  score: number;
  savings?: number;
}

export default function ScoreCard({ income, spent, score, savings = 0 }: ScoreCardProps) {
  const remaining = income - spent - savings;
  const percentage = income > 0 ? (spent / income) * 100 : 0;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent ! 🎉';
    if (score >= 75) return 'Très bien ! 👍';
    if (score >= 50) return 'Bien 👌';
    if (score >= 25) return 'Attention ⚠️';
    return 'Critique ! 🚨';
  };

  return (
    <Card>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div
            className={`relative w-40 h-40 rounded-full ${getScoreBgColor(score)} flex items-center justify-center`}
          >
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-sm text-gray-600 mt-1">/ 100</div>
            </div>
            <Award
              size={24}
              className={`absolute top-2 right-2 ${getScoreColor(score)}`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {getScoreMessage(score)}
          </h3>
          <p className="text-sm text-gray-600">
            Vous avez dépensé {percentage.toFixed(1)}% de votre revenu
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-4 border-t">
          <div>
            <div className="text-xs text-gray-500 mb-1">Revenu</div>
            <div className="text-base font-semibold text-gray-900">
              {income.toFixed(0)} €
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Dépensé</div>
            <div className="text-base font-semibold text-danger flex items-center justify-center gap-1">
              <TrendingDown size={14} />
              {spent.toFixed(0)} €
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Épargne</div>
            <div className="text-base font-semibold text-primary-600 flex items-center justify-center gap-1">
              <PiggyBank size={14} />
              {savings.toFixed(0)} €
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Restant</div>
            <div className="text-base font-semibold text-success flex items-center justify-center gap-1">
              <TrendingUp size={14} />
              {remaining.toFixed(0)} €
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all ${
                percentage >= 100
                  ? 'bg-danger'
                  : percentage >= 75
                  ? 'bg-warning'
                  : 'bg-success'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {percentage >= 100
              ? 'Budget dépassé !'
              : `${(100 - percentage).toFixed(1)}% restant`}
          </p>
        </div>
      </div>
    </Card>
  );
}
