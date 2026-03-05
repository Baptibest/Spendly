import { supabase } from '@/lib/supabase';
import {
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO,
  ExpenseWithCategory,
} from '@/types/expense.types';

export async function createExpense(data: CreateExpenseDTO, userId: string): Promise<Expense> {
  const { data: expense, error } = await supabase
    .from('expenses')
    .insert({ ...data, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return expense;
}

export async function updateExpense(
  id: string,
  data: UpdateExpenseDTO,
  userId: string
): Promise<Expense> {
  const { data: expense, error } = await supabase
    .from('expenses')
    .update(data)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return expense;
}

export async function deleteExpense(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getExpensesByMonth(
  month: number,
  year: number,
  userId: string
): Promise<ExpenseWithCategory[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  
  // Calculer le dernier jour du mois correctement
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('expenses')
    .select(
      `
      *,
      category:categories(name, color, icon)
    `
    )
    .eq('user_id', userId)
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
  limit: number = 10,
  userId: string
): Promise<ExpenseWithCategory[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select(
      `
      *,
      category:categories(name, color, icon)
    `
    )
    .eq('user_id', userId)
    .order('expense_date', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map((item) => ({
    ...item,
    category: item.category || { name: 'Inconnu', color: '#6b7280' },
  }));
}
