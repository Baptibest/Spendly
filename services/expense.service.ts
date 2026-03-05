import { supabase } from '@/lib/supabase';
import {
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO,
  ExpenseWithCategory,
} from '@/types/expense.types';

export async function createExpense(data: CreateExpenseDTO): Promise<Expense> {
  const { data: expense, error } = await supabase
    .from('expenses')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return expense;
}

export async function updateExpense(
  id: string,
  data: UpdateExpenseDTO
): Promise<Expense> {
  const { data: expense, error } = await supabase
    .from('expenses')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return expense;
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id);

  if (error) throw error;
}

export async function getExpensesByMonth(
  month: number,
  year: number
): Promise<ExpenseWithCategory[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const { data, error } = await supabase
    .from('expenses')
    .select(
      `
      *,
      category:categories(name, color, icon)
    `
    )
    .gte('expense_date', startDate)
    .lte('expense_date', endDate)
    .order('expense_date', { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => ({
    ...item,
    category: item.category || { name: 'Inconnu', color: '#6b7280' },
  }));
}

export async function getRecentExpenses(
  limit: number = 10
): Promise<ExpenseWithCategory[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select(
      `
      *,
      category:categories(name, color, icon)
    `
    )
    .order('expense_date', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map((item) => ({
    ...item,
    category: item.category || { name: 'Inconnu', color: '#6b7280' },
  }));
}
