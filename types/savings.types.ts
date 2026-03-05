export interface Savings {
  id: string;
  month: number;
  year: number;
  amount: number;
  target_amount: number;
  created_at: string;
  updated_at: string;
}

export interface SavingsSummary {
  current_month_savings: number;
  target_savings: number;
  total_saved_year: number;
  savings_rate: number;
}
