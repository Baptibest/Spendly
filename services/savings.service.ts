import { supabase } from '@/lib/supabase';
import { Savings } from '@/types/savings.types';

export async function getSavings(
  month: number,
  year: number
): Promise<Savings | null> {
  const { data, error } = await supabase
    .from('savings')
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

export async function upsertSavings(
  month: number,
  year: number,
  amount: number,
  targetAmount: number = 0
): Promise<Savings> {
  const { data, error } = await supabase
    .from('savings')
    .upsert(
      {
        month,
        year,
        amount,
        target_amount: targetAmount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'month,year' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getYearlySavings(year: number): Promise<Savings[]> {
  const { data, error } = await supabase
    .from('savings')
    .select('*')
    .eq('year', year)
    .order('month');

  if (error) throw error;
  return data || [];
}
