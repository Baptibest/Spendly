import { supabase } from '@/lib/supabase';
import { Budget, CreateBudgetDTO } from '@/types/budget.types';

export async function createOrUpdateBudget(
  data: CreateBudgetDTO,
  userId: string
): Promise<Budget> {
  const { data: budget, error } = await supabase
    .from('budgets')
    .upsert({ ...data, user_id: userId }, {
      onConflict: 'category_id,month,year,user_id',
    })
    .select()
    .single();

  if (error) throw error;
  return budget;
}

export async function getBudgetsByMonth(
  month: number,
  year: number,
  userId: string
): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year);

  if (error) throw error;
  return data || [];
}

export async function getBudgetForCategory(
  categoryId: string,
  month: number,
  year: number,
  userId: string
): Promise<Budget | null> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('category_id', categoryId)
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}
