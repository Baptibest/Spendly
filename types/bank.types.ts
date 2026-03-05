export interface BankConnection {
  id: string;
  bank_name: string;
  account_number: string;
  account_type: 'checking' | 'savings';
  balance: number;
  is_active: boolean;
  last_sync: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  id: string;
  bank_connection_id: string;
  transaction_date: string;
  description: string;
  amount: number;
  transaction_type: 'debit' | 'credit';
  category_id: string | null;
  is_categorized: boolean;
  is_imported_to_expenses: boolean;
  expense_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankTransactionWithCategory extends BankTransaction {
  category_name?: string;
  category_color?: string;
}

export interface CreateBankConnectionDTO {
  bank_name: string;
  account_number: string;
  account_type: 'checking' | 'savings';
}

export interface SimulatedBank {
  name: string;
  logo: string;
  color: string;
}

export const SIMULATED_BANKS: SimulatedBank[] = [
  { name: 'Crédit Agricole', logo: '🏦', color: '#00A651' },
  { name: 'BNP Paribas', logo: '🏦', color: '#00915A' },
  { name: 'Société Générale', logo: '🏦', color: '#E60028' },
  { name: 'LCL', logo: '🏦', color: '#0066CC' },
  { name: 'Banque Populaire', logo: '🏦', color: '#FF6600' },
  { name: 'Caisse d\'Épargne', logo: '🏦', color: '#FF0000' },
  { name: 'La Banque Postale', logo: '🏦', color: '#FFD500' },
  { name: 'Boursorama', logo: '🏦', color: '#FF6B00' },
];
