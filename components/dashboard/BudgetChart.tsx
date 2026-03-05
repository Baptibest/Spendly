'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BudgetSummary } from '@/types/budget.types';
import Card from '@/components/ui/Card';

interface BudgetChartProps {
  data: BudgetSummary[];
}

export default function BudgetChart({ data }: BudgetChartProps) {
  const chartData = data.map((item) => ({
    name: item.category_name,
    Budget: item.budget,
    Dépensé: item.spent,
  }));

  return (
    <Card title="Dépenses vs Budget par catégorie">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budget" fill="#0ea5e9" />
          <Bar dataKey="Dépensé" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
