'use client';

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import Card from '@/components/ui/Card';

interface PieChartProps {
  income: number;
  spent: number;
  savings: number;
  score: number;
}

export default function PieChart({ income, spent, savings, score }: PieChartProps) {
  const remaining = income - spent - savings;
  
  const data = [
    { name: 'Dépensé', value: spent, color: '#f59e0b' },
    { name: 'Épargne', value: savings, color: '#0ea5e9' },
    { name: 'Restant', value: Math.max(0, remaining), color: '#10b981' },
  ].filter(item => item.value > 0);

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
    <Card title="Répartition du budget">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center items-center space-y-4">
          <div
            className={`w-32 h-32 rounded-full ${getScoreBgColor(score)} flex items-center justify-center`}
          >
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-xs text-gray-600 mt-1">/ 100</div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {getScoreMessage(score)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Score budgétaire
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full text-center">
            <div>
              <div className="text-xs text-gray-500">Revenu</div>
              <div className="text-sm font-semibold text-gray-900">
                {income.toFixed(0)} €
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Dépensé</div>
              <div className="text-sm font-semibold text-danger">
                {spent.toFixed(0)} €
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Épargne</div>
              <div className="text-sm font-semibold text-primary-600">
                {savings.toFixed(0)} €
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
