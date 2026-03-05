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
import Card from '@/components/ui/Card';

interface MonthComparisonData {
  category_name: string;
  current_month: number;
  previous_month: number;
}

interface MonthComparisonChartProps {
  data: MonthComparisonData[];
  currentMonthName: string;
  previousMonthName: string;
}

export default function MonthComparisonChart({ 
  data, 
  currentMonthName, 
  previousMonthName 
}: MonthComparisonChartProps) {
  const chartData = data.map((item) => ({
    name: item.category_name,
    [currentMonthName]: item.current_month,
    [previousMonthName]: item.previous_month,
  }));

  return (
    <Card title="Comparaison des dépenses par catégorie">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
          <Legend />
          <Bar dataKey={currentMonthName} fill="#0ea5e9" />
          <Bar dataKey={previousMonthName} fill="#94a3b8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
