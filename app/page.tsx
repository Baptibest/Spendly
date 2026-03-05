'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import ExpenseForm from '@/components/forms/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import { ExpenseWithCategory } from '@/types/expense.types';
import { BudgetSettings } from '@/types/settings.types';
import { getCurrentMonth, getCurrentYear, getMonthName } from '@/utils/date.utils';

export default function HomePage() {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [settings, setSettings] = useState<BudgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, settingsRes] = await Promise.all([
        fetch('/api/expenses?recent=10'),
        fetch('/api/settings'),
      ]);

      const [expensesData, settingsData] = await Promise.all([
        expensesRes.json(),
        settingsRes.json(),
      ]);

      if (expensesData.success) {
        setExpenses(expensesData.data);
      }

      if (settingsData.success && settingsData.data) {
        setSettings(settingsData.data);
      }
    } catch (err) {
      console.error('Erreur chargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = fetchData;

  const totalThisMonth = expenses
    .filter((exp) => {
      const expDate = new Date(exp.expense_date);
      return (
        expDate.getMonth() + 1 === currentMonth &&
        expDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  const showAccountType = settings?.mode === 'global' || settings?.mode === 'automatic';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dépenses
        </h1>
        <p className="text-gray-600 mt-2">
          Gérez vos dépenses facilement et efficacement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Ajouter une dépense">
          <ExpenseForm onSuccess={fetchExpenses} showAccountType={showAccountType} />
        </Card>

        <Card title={`Résumé ${getMonthName(currentMonth)} ${currentYear}`}>
          <div className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total dépensé ce mois</p>
              <p className="text-3xl font-bold text-primary-700">
                {totalThisMonth.toFixed(2)} €
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Consultez le{' '}
              <a
                href="/dashboard"
                className="text-primary-600 hover:underline font-medium"
              >
                Dashboard
              </a>{' '}
              pour plus de détails
            </p>
          </div>
        </Card>
      </div>

      <Card title="Dernières dépenses">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Chargement...
          </div>
        ) : (
          <ExpenseList expenses={expenses} onUpdate={fetchExpenses} />
        )}
      </Card>
    </div>
  );
}
