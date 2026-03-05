import { supabase } from '@/lib/supabase';
import { Budget, CreateBudgetDTO } from '@/types/budget.types';

export async function createOrUpdateBudget(
  data: CreateBudgetDTO
): Promise<Budget> {
  const { data: budget, error } = await supabase
    .from('budgets')
    .upsert(data, {
      onConflict: 'category_id,month,year',
    })
    .select()
    .single();

  if (error) throw error;
  return budget;
}

export async function getBudgetsByMonth(
  month: number,
  year: number
): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('month', month)
    .eq('year', year);

  if (error) throw error;
  return data || [];
}

export async function getBudgetForCategory(
  categoryId: string,
  month: number,
  year: number
): Promise<Budget | null> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('category_id', categoryId)
    .eq('month', month)
    .eq('year', year)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}
