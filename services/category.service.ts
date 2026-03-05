import { supabase } from '@/lib/supabase';
import { Category } from '@/types/category.types';

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createCategory(
  name: string,
  color: string,
  icon?: string
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, color, icon })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error: expensesError } = await supabase
    .from('expenses')
    .delete()
    .eq('category_id', id);

  if (expensesError) throw expensesError;

  const { error: budgetsError } = await supabase
    .from('budgets')
    .delete()
    .eq('category_id', id);

  if (budgetsError) throw budgetsError;

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) throw error;
}

export async function seedDefaultCategories(): Promise<void> {
  const defaultCategories = [
    { name: 'Logement', color: '#3b82f6', icon: 'Home' },
    { name: 'Alimentation', color: '#10b981', icon: 'ShoppingCart' },
    { name: 'Transport', color: '#f59e0b', icon: 'Car' },
    { name: 'Loisirs', color: '#8b5cf6', icon: 'Gamepad2' },
    { name: 'Santé', color: '#ef4444', icon: 'Heart' },
    { name: 'Abonnements', color: '#06b6d4', icon: 'CreditCard' },
    { name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag' },
    { name: 'Autres', color: '#6b7280', icon: 'MoreHorizontal' },
  ];

  for (const category of defaultCategories) {
    await supabase
      .from('categories')
      .upsert(category, { onConflict: 'name' });
  }
}
