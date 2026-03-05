import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
  description: z.string().max(255, 'Description trop longue (max 255 caractères)'),
  category_id: z.string().uuid('Catégorie invalide'),
  expense_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide'),
});

export const budgetSchema = z.object({
  category_id: z.string().uuid('Catégorie invalide'),
  month: z.number().min(1).max(12, 'Mois invalide (1-12)'),
  year: z.number().min(2000, 'Année invalide'),
  amount: z.number().min(0, 'Le montant ne peut pas être négatif'),
});

export function validateExpenseInput(data: any) {
  return expenseSchema.safeParse(data);
}

export function validateBudgetInput(data: any) {
  return budgetSchema.safeParse(data);
}
