export interface Budget {
  id: string;
  category_id: string;
  month: number;
  year: number;
  amount: number;
  created_at: string;
}

export interface CreateBudgetDTO {
  category_id: string;
  month: number;
  year: number;
  amount: number;
}

export interface BudgetSummary {
  category_id: string;
  category_name: string;
  category_color: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number | null;
}

export interface GlobalSummary {
  total_budget: number;
  total_spent: number;
  total_remaining: number;
  categories: BudgetSummary[];
}
