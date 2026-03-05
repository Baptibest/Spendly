import { supabase } from '@/lib/supabase';
import { BankConnection, BankTransaction } from '@/types/bank.types';

// Connexions bancaires
export async function getBankConnections(): Promise<BankConnection[]> {
  const { data, error } = await supabase
    .from('bank_connections')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createBankConnection(
  bankName: string,
  accountNumber: string,
  accountType: 'checking' | 'savings'
): Promise<BankConnection> {
  const { data, error } = await supabase
    .from('bank_connections')
    .insert({
      bank_name: bankName,
      account_number: accountNumber,
      account_type: accountType,
      balance: 0,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBankConnection(id: string): Promise<void> {
  const { error } = await supabase
    .from('bank_connections')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Transactions bancaires
export async function getBankTransactions(
  connectionId?: string,
  month?: number,
  year?: number
): Promise<BankTransaction[]> {
  let query = supabase
    .from('bank_transactions')
    .select('*')
    .order('transaction_date', { ascending: false });

  if (connectionId) {
    query = query.eq('bank_connection_id', connectionId);
  }

  if (month && year) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0);
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
    query = query.gte('transaction_date', startDate).lte('transaction_date', endDateStr);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function categorizeTransaction(
  transactionId: string,
  categoryId: string
): Promise<BankTransaction> {
  const { data, error } = await supabase
    .from('bank_transactions')
    .update({
      category_id: categoryId,
      is_categorized: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function importTransactionToExpense(
  transactionId: string,
  expenseId: string
): Promise<BankTransaction> {
  const { data, error } = await supabase
    .from('bank_transactions')
    .update({
      is_imported_to_expenses: true,
      expense_id: expenseId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Simulation : Générer des transactions fictives
export async function generateSimulatedTransactions(
  connectionId: string,
  count: number = 10
): Promise<BankTransaction[]> {
  const transactions = [];
  const today = new Date();
  
  const descriptions = [
    'Supermarché Carrefour',
    'Station Service Total',
    'Restaurant Le Bistrot',
    'Amazon.fr',
    'Netflix',
    'Spotify',
    'Pharmacie',
    'Boulangerie',
    'Café',
    'Transport RATP',
  ];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const transactionDate = new Date(today);
    transactionDate.setDate(transactionDate.getDate() - daysAgo);

    const amount = Math.random() * 100 + 5;
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    const { data, error } = await supabase
      .from('bank_transactions')
      .insert({
        bank_connection_id: connectionId,
        transaction_date: transactionDate.toISOString().split('T')[0],
        description,
        amount: parseFloat(amount.toFixed(2)),
        transaction_type: 'debit',
        is_categorized: false,
        is_imported_to_expenses: false,
      })
      .select()
      .single();

    if (!error && data) {
      transactions.push(data);
    }
  }

  return transactions;
}
