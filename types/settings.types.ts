export type BudgetMode = 'category' | 'global' | 'automatic';

export interface BudgetSettings {
  id: string;
  mode: BudgetMode;
  monthly_income: number;
  created_at: string;
  updated_at: string;
}

export interface MonthlyScore {
  id: string;
  month: number;
  year: number;
  total_income: number;
  total_spent: number;
  score: number;
  created_at: string;
}

export interface ScoreCalculation {
  income: number;
  spent: number;
  remaining: number;
  percentage: number;
  score: number;
}
