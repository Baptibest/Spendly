import { supabase } from '@/lib/supabase';
import { BudgetSettings, MonthlyScore } from '@/types/settings.types';

export async function getBudgetSettings(): Promise<BudgetSettings | null> {
  const { data, error } = await supabase
    .from('budget_settings')
    .select('*')
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
  monthlyIncome: number
): Promise<BudgetSettings> {
  const existing = await getBudgetSettings();

  if (existing) {
    const { data, error } = await supabase
      .from('budget_settings')
      .update({
        mode,
        monthly_income: monthlyIncome,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
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
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function getMonthlyScore(
  month: number,
  year: number
): Promise<MonthlyScore | null> {
  const { data, error } = await supabase
    .from('monthly_scores')
    .select('*')
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
  score: number
): Promise<MonthlyScore> {
  const existing = await getMonthlyScore(month, year);

  if (existing) {
    const { data, error } = await supabase
      .from('monthly_scores')
      .update({
        total_income: totalIncome,
        total_spent: totalSpent,
        score,
      })
      .eq('id', existing.id)
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
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
