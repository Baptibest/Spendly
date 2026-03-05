export interface Expense {
  id: string;
  amount: number;
  description: string;
  category_id: string;
  expense_date: string;
  account_type?: 'checking' | 'savings';
  created_at: string;
}

export interface CreateExpenseDTO {
  amount: number;
  description: string;
  category_id: string;
  expense_date: string;
}

export interface UpdateExpenseDTO {
  amount?: number;
  description?: string;
  category_id?: string;
  expense_date?: string;
}

export interface ExpenseWithCategory extends Expense {
  category: {
    name: string;
    color: string;
    icon?: string;
  };
}
