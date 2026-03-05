import { BudgetSummary, GlobalSummary } from '@/types/budget.types';
import { Expense } from '@/types/expense.types';
import { Budget } from '@/types/budget.types';
import { Category } from '@/types/category.types';

export function roundToTwo(num: number): number {
  return Math.round(num * 100) / 100;
}

export function calculatePercentage(spent: number, budget: number): number | null {
  if (budget === 0) return null;
  return roundToTwo((spent / budget) * 100);
}

export function calculateRemaining(budget: number, spent: number): number {
  return roundToTwo(budget - spent);
}

export function calculateCategoryTotals(
  expenses: Expense[],
  budgets: Budget[],
  categories: Category[]
): BudgetSummary[] {
  return categories.map((category) => {
    const categoryExpenses = expenses.filter(
      (exp) => exp.category_id === category.id
    );
    const spent = roundToTwo(
      categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    );

    const categoryBudget = budgets.find(
      (b) => b.category_id === category.id
    );
    const budget = categoryBudget?.amount || 0;

    const remaining = calculateRemaining(budget, spent);
    const percentage = calculatePercentage(spent, budget);

    return {
      category_id: category.id,
      category_name: category.name,
      category_color: category.color,
      budget,
      spent,
      remaining,
      percentage,
    };
  });
}

export function calculateGlobalTotals(
  categoryTotals: BudgetSummary[]
): GlobalSummary {
  const total_budget = roundToTwo(
    categoryTotals.reduce((sum, cat) => sum + cat.budget, 0)
  );
  const total_spent = roundToTwo(
    categoryTotals.reduce((sum, cat) => sum + cat.spent, 0)
  );
  const total_remaining = calculateRemaining(total_budget, total_spent);

  return {
    total_budget,
    total_spent,
    total_remaining,
    categories: categoryTotals,
  };
}
