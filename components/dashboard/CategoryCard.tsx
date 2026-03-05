import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { BudgetSummary } from '@/types/budget.types';

interface CategoryCardProps {
  summary: BudgetSummary;
}

export default function CategoryCard({ summary }: CategoryCardProps) {
  const { category_name, budget, spent, remaining, percentage } = summary;

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">{category_name}</h4>
          <span
            className={`text-sm font-medium ${
              percentage && percentage > 100
                ? 'text-danger'
                : percentage && percentage >= 75
                ? 'text-warning'
                : 'text-success'
            }`}
          >
            {percentage !== null ? `${percentage.toFixed(0)}%` : 'N/A'}
          </span>
        </div>

        <ProgressBar percentage={percentage} />

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-gray-600">Budget</p>
            <p className="font-semibold">{budget.toFixed(2)} €</p>
          </div>
          <div>
            <p className="text-gray-600">Dépensé</p>
            <p className="font-semibold">{spent.toFixed(2)} €</p>
          </div>
          <div>
            <p className="text-gray-600">Reste</p>
            <p
              className={`font-semibold ${
                remaining < 0 ? 'text-danger' : 'text-success'
              }`}
            >
              {remaining.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
