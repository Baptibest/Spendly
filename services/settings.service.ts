import { supabase } from '@/lib/supabase';
import { BudgetSettings, MonthlyScore } from '@/types/settings.types';

export async function getBudgetSettings(userId: string): Promise<BudgetSettings | null> {
  const { data, error } = await supabase
    .from('budget_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  return data;
}

export async function updateBudgetSettings(
  mode: string,
  monthlyIncome: number,
  userId: string
): Promise<BudgetSettings> {
  const existing = await getBudgetSettings(userId);

  if (existing) {
    const { data, error } = await supabase
      .from('budget_settings')
      .update({
        mode,
        monthly_income: monthlyIncome,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('budget_settings')
      .insert({
        mode,
        monthly_income: monthlyIncome,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function getMonthlyScore(
  month: number,
  year: number,
  userId: string
): Promise<MonthlyScore | null> {
  const { data, error } = await supabase
    .from('monthly_scores')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveMonthlyScore(
  month: number,
  year: number,
  totalIncome: number,
  totalSpent: number,
  score: number,
  userId: string
): Promise<MonthlyScore> {
  const existing = await getMonthlyScore(month, year, userId);

  if (existing) {
    const { data, error } = await supabase
      .from('monthly_scores')
      .update({
        total_income: totalIncome,
        total_spent: totalSpent,
        score,
      })
      .eq('id', existing.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('monthly_scores')
      .insert({
        month,
        year,
        total_income: totalIncome,
        total_spent: totalSpent,
        score,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
