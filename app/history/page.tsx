'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import CategoryCard from '@/components/dashboard/CategoryCard';
import { Category } from '@/types/category.types';
import { Expense } from '@/types/expense.types';
import { Budget } from '@/types/budget.types';
import {
  calculateCategoryTotals,
  calculateGlobalTotals,
} from '@/utils/calculations';
import { getCurrentMonth, getCurrentYear, getMonthName } from '@/utils/date.utils';

export default function HistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const pastMonths = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentYear, currentMonth - 1 - i, 1);
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchMonthData();
    }
  }, [selectedMonth, selectedYear]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
    }
  };

  const fetchMonthData = async () => {
    if (!selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const [expensesRes, budgetsRes] = await Promise.all([
        fetch(`/api/expenses?month=${selectedMonth}&year=${selectedYear}`),
        fetch(`/api/budgets?month=${selectedMonth}&year=${selectedYear}`),
      ]);

      const [expensesData, budgetsData] = await Promise.all([
        expensesRes.json(),
        budgetsRes.json(),
      ]);

      if (expensesData.success) setExpenses(expensesData.data);
      if (budgetsData.success) setBudgets(budgetsData.data);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryTotals =
    selectedMonth && selectedYear
      ? calculateCategoryTotals(expenses, budgets, categories)
      : [];
  const globalSummary =
    categoryTotals.length > 0 ? calculateGlobalTotals(categoryTotals) : null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Historique</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {pastMonths.map(({ month, year }) => (
          <button
            key={`${month}-${year}`}
            onClick={() => {
              setSelectedMonth(month);
              setSelectedYear(year);
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedMonth === month && selectedYear === year
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <p className="font-semibold text-gray-900">{getMonthName(month)}</p>
            <p className="text-sm text-gray-600">{year}</p>
          </button>
        ))}
      </div>

      {!selectedMonth || !selectedYear ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            Aucune dépense pour ce mois. Ajoutez-en depuis l&apos;onglet Dépenses.
          </p>
        </Card>
      ) : loading ? (
        <Card>
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        </Card>
      ) : (
        <>
          {globalSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p className="text-sm text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {globalSummary.total_budget.toFixed(2)} €
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600">Dépensé</p>
                <p className="text-2xl font-bold text-gray-900">
                  {globalSummary.total_spent.toFixed(2)} €
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600">Reste</p>
                <p
                  className={`text-2xl font-bold ${
                    globalSummary.total_remaining < 0
                      ? 'text-danger'
                      : 'text-success'
                  }`}
                >
                  {globalSummary.total_remaining.toFixed(2)} €
                </p>
              </Card>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Par catégorie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTotals.map((summary) => (
                <CategoryCard key={summary.category_id} summary={summary} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
