'use client';

import { useState, useEffect } from 'react';
import GlobalSummary from '@/components/dashboard/GlobalSummary';
import CategoryCard from '@/components/dashboard/CategoryCard';
import BudgetChart from '@/components/dashboard/BudgetChart';
import ScoreCard from '@/components/dashboard/ScoreCard';
import PieChart from '@/components/dashboard/PieChart';
import MonthComparisonChart from '@/components/dashboard/MonthComparisonChart';
import BankTransactionsTable from '@/components/dashboard/BankTransactionsTable';
import Select from '@/components/ui/Select';
import { Category } from '@/types/category.types';
import { Expense } from '@/types/expense.types';
import { Budget } from '@/types/budget.types';
import { BudgetSettings } from '@/types/settings.types';
import { Savings } from '@/types/savings.types';
import {
  calculateCategoryTotals,
  calculateGlobalTotals,
} from '@/utils/calculations';
import { getCurrentMonth, getCurrentYear, getMonthName } from '@/utils/date.utils';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function DashboardPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [settings, setSettings] = useState<BudgetSettings | null>(null);
  const [savings, setSavings] = useState<Savings | null>(null);
  const [previousMonthExpenses, setPreviousMonthExpenses] = useState<Expense[]>([]);
  const [bankTransactions, setBankTransactions] = useState<any[]>([]);
  const [previousMonthBankTransactions, setPreviousMonthBankTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const handleRefreshTransactions = async () => {
    try {
      const res = await fetchWithAuth('/api/bank-transactions');
      const data = await res.json();
      if (data.success) {
        setBankTransactions(data.data);
      }
    } catch (err) {
      console.error('Erreur actualisation transactions:', err);
    }
  };

  const handleCategorizeTransaction = async (transactionId: string, categoryId: string) => {
    try {
      const res = await fetchWithAuth(`/api/bank-transactions/${transactionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ category_id: categoryId }),
      });
      const data = await res.json();
      if (data.success) {
        // Mettre à jour les transactions localement
        setBankTransactions(prev => 
          prev.map(t => 
            t.id === transactionId 
              ? { ...t, category_id: categoryId, is_categorized: true }
              : t
          )
        );
      }
    } catch (err) {
      console.error('Erreur catégorisation transaction:', err);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      return;
    }

    try {
      const res = await fetchWithAuth(`/api/bank-transactions/${transactionId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        // Retirer la transaction de la liste locale
        setBankTransactions(prev => prev.filter(t => t.id !== transactionId));
      }
    } catch (err) {
      console.error('Erreur suppression transaction:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Calculer le mois précédent
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;

      const [categoriesRes, expensesRes, budgetsRes, settingsRes, savingsRes, prevExpensesRes, bankTransactionsRes] = await Promise.all([
        fetchWithAuth('/api/categories'),
        fetchWithAuth(`/api/expenses?month=${month}&year=${year}`),
        fetchWithAuth(`/api/budgets?month=${month}&year=${year}`),
        fetchWithAuth('/api/settings'),
        fetchWithAuth(`/api/savings?month=${month}&year=${year}`),
        fetchWithAuth(`/api/expenses?month=${prevMonth}&year=${prevYear}`),
        fetchWithAuth('/api/bank-transactions'),
      ]);

      const [categoriesData, expensesData, budgetsData, settingsData, savingsData, prevExpensesData, bankTransactionsData] = await Promise.all([
        categoriesRes.json(),
        expensesRes.json(),
        budgetsRes.json(),
        settingsRes.json(),
        savingsRes.json(),
        prevExpensesRes.json(),
        bankTransactionsRes.json(),
      ]);

      if (categoriesData.success) setCategories(categoriesData.data);
      if (expensesData.success) setExpenses(expensesData.data);
      if (budgetsData.success) setBudgets(budgetsData.data);
      if (settingsData.success) setSettings(settingsData.data);
      if (savingsData.success && savingsData.data) setSavings(savingsData.data);
      if (prevExpensesData.success) setPreviousMonthExpenses(prevExpensesData.data);
      if (bankTransactionsData.success) {
        setBankTransactions(bankTransactionsData.data);
        // Filtrer les transactions du mois précédent
        const prevMonthTransactions = bankTransactionsData.data.filter((t: any) => {
          const transactionDate = new Date(t.transaction_date);
          return transactionDate.getMonth() + 1 === prevMonth && 
                 transactionDate.getFullYear() === prevYear;
        });
        setPreviousMonthBankTransactions(prevMonthTransactions);
      }
    } catch (err) {
      console.error('Erreur chargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryTotals = calculateCategoryTotals(expenses, budgets, categories);
  const globalSummary = calculateGlobalTotals(categoryTotals);

  const mode = settings?.mode || 'category';
  const monthlyIncome = settings?.monthly_income || 0;
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savingsAmount = savings?.amount || 0;
  const score = monthlyIncome > 0 
    ? Math.max(0, Math.min(100, Math.round(100 - (totalSpent / monthlyIncome * 100))))
    : 0;

  // Calculer les dépenses par catégorie pour le mois actuel et précédent (pour modes category et global)
  const monthComparisonData = categories.map(category => {
    const currentMonthSpent = expenses
      .filter(exp => exp.category_id === category.id)
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const previousMonthSpent = previousMonthExpenses
      .filter(exp => exp.category_id === category.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      category_name: category.name,
      current_month: currentMonthSpent,
      previous_month: previousMonthSpent,
    };
  });

  // Calculer les dépenses par catégorie basées sur les transactions bancaires (pour mode automatic)
  const bankMonthComparisonData = categories.map(category => {
    // Filtrer les transactions du mois actuel
    const currentMonthTransactions = bankTransactions.filter((t: any) => {
      const transactionDate = new Date(t.transaction_date);
      return transactionDate.getMonth() + 1 === month && 
             transactionDate.getFullYear() === year &&
             t.category_id === category.id;
    });
    const currentMonthSpent = currentMonthTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const previousMonthSpent = previousMonthBankTransactions
      .filter((t: any) => t.category_id === category.id)
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    return {
      category_name: category.name,
      current_month: currentMonthSpent,
      previous_month: previousMonthSpent,
    };
  });

  const currentMonthName = getMonthName(month);
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousMonthName = getMonthName(previousMonth);

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: getMonthName(i + 1),
  }));

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: String(getCurrentYear() - i),
    label: String(getCurrentYear() - i),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
          <Select
            value={String(month)}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            options={monthOptions}
          />
          <Select
            value={String(year)}
            onChange={(e) => setYear(parseInt(e.target.value))}
            options={yearOptions}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : (
        <>
          {/* Mode Budget par catégorie : diagramme en barres + dépenses par catégorie */}
          {mode === 'category' && (
            <>
              <BudgetChart data={categoryTotals} />
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Dépenses par catégorie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTotals.map((summary) => (
                    <CategoryCard key={summary.category_id} summary={summary} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Mode Budget global avec score : score + comparaison mensuelle */}
          {mode === 'global' && (
            <>
              <ScoreCard
                income={monthlyIncome}
                spent={totalSpent}
                score={score}
                savings={savingsAmount}
              />
              
              <MonthComparisonChart
                data={monthComparisonData}
                currentMonthName={currentMonthName}
                previousMonthName={previousMonthName}
              />
            </>
          )}

          {/* Mode Suivi automatique : transactions bancaires + comparaison mensuelle */}
          {mode === 'automatic' && (
            <>
              <BankTransactionsTable 
                transactions={bankTransactions}
                categories={categories}
                month={month}
                year={year}
                onRefresh={handleRefreshTransactions}
                onCategorize={handleCategorizeTransaction}
                onDelete={handleDeleteTransaction}
              />
              
              <MonthComparisonChart
                data={bankMonthComparisonData}
                currentMonthName={currentMonthName}
                previousMonthName={previousMonthName}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
