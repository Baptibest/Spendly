import Card from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface GlobalSummaryProps {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
}

export default function GlobalSummary({
  totalBudget,
  totalSpent,
  totalRemaining,
}: GlobalSummaryProps) {
  const isOverBudget = totalRemaining < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Budget Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalBudget.toFixed(2)} €
            </p>
          </div>
          <Wallet className="text-primary-600" size={32} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Dépensé</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalSpent.toFixed(2)} €
            </p>
          </div>
          <TrendingDown className="text-warning" size={32} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Reste</p>
            <p
              className={`text-2xl font-bold ${
                isOverBudget ? 'text-danger' : 'text-success'
              }`}
            >
              {totalRemaining.toFixed(2)} €
            </p>
          </div>
          <TrendingUp
            className={isOverBudget ? 'text-danger' : 'text-success'}
            size={32}
          />
        </div>
      </Card>
    </div>
  );
}
