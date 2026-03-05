import { supabase } from '@/lib/supabase';
import { Category } from '@/types/category.types';

export async function getAllCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createCategory(
  name: string,
  color: string,
  userId: string,
  icon?: string
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, color, icon, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string, userId: string): Promise<void> {
  const { error: expensesError } = await supabase
    .from('expenses')
    .delete()
    .eq('category_id', id)
    .eq('user_id', userId);

  if (expensesError) throw expensesError;

  const { error: budgetsError } = await supabase
    .from('budgets')
    .delete()
    .eq('category_id', id)
    .eq('user_id', userId);

  if (budgetsError) throw budgetsError;

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function seedDefaultCategories(userId: string): Promise<void> {
  const defaultCategories = [
    { name: 'Logement', color: '#3b82f6', icon: 'Home', user_id: userId },
    { name: 'Alimentation', color: '#10b981', icon: 'ShoppingCart', user_id: userId },
    { name: 'Transport', color: '#f59e0b', icon: 'Car', user_id: userId },
    { name: 'Loisirs', color: '#8b5cf6', icon: 'Gamepad2', user_id: userId },
    { name: 'Santé', color: '#ef4444', icon: 'Heart', user_id: userId },
    { name: 'Abonnements', color: '#06b6d4', icon: 'CreditCard', user_id: userId },
    { name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag', user_id: userId },
    { name: 'Autres', color: '#6b7280', icon: 'MoreHorizontal', user_id: userId },
  ];

  for (const category of defaultCategories) {
    await supabase
      .from('categories')
      .upsert(category, { onConflict: 'name,user_id' });
  }
}
