'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, Clock, RefreshCw, Trash2 } from 'lucide-react';

interface BankTransaction {
  id: string;
  description: string;
  amount: number;
  transaction_date: string;
  is_categorized: boolean;
  category_id?: string;
}

interface BankTransactionsTableProps {
  transactions: BankTransaction[];
  categories: { id: string; name: string; color: string }[];
  month: number;
  year: number;
  onRefresh?: () => void;
  onCategorize?: (transactionId: string, categoryId: string) => void;
  onDelete?: (transactionId: string) => void;
}

export default function BankTransactionsTable({ 
  transactions, 
  categories,
  month,
  year,
  onRefresh,
  onCategorize,
  onDelete
}: BankTransactionsTableProps) {
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Non catégorisée';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Non catégorisée';
  };

  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return '#9ca3af';
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#9ca3af';
  };

  // Filtrer les transactions du mois sélectionné
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.transaction_date);
    return transactionDate.getMonth() + 1 === month && 
           transactionDate.getFullYear() === year;
  });

  const totalSpent = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const categorizedCount = currentMonthTransactions.filter(t => t.is_categorized).length;
  const uncategorizedCount = currentMonthTransactions.length - categorizedCount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total dépensé</p>
            <p className="text-3xl font-bold text-danger">{totalSpent.toFixed(2)} €</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Transactions catégorisées</p>
            <p className="text-3xl font-bold text-success flex items-center justify-center gap-2">
              <CheckCircle size={24} />
              {categorizedCount}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">À catégoriser</p>
            <p className="text-3xl font-bold text-warning flex items-center justify-center gap-2">
              <Clock size={24} />
              {uncategorizedCount}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transactions bancaires du mois</h3>
          {onRefresh && (
            <Button onClick={onRefresh} size="sm" variant="secondary">
              <RefreshCw size={16} className="mr-2" />
              Actualiser
            </Button>
          )}
        </div>
        
        {currentMonthTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune transaction pour ce mois
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Catégorie</th>
                  <th className="text-right py-3 px-4">Montant</th>
                  <th className="text-center py-3 px-4">Statut</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMonthTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(transaction.transaction_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <select
                        value={transaction.category_id || ''}
                        onChange={(e) => onCategorize && onCategorize(transaction.id, e.target.value)}
                        className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        style={{
                          backgroundColor: `${getCategoryColor(transaction.category_id)}10`,
                          borderColor: getCategoryColor(transaction.category_id),
                        }}
                      >
                        <option value="">Non catégorisée</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-danger">
                      -{transaction.amount.toFixed(2)} €
                    </td>
                    <td className="py-3 px-4 text-center">
                      {transaction.is_categorized ? (
                        <CheckCircle size={20} className="text-success inline" />
                      ) : (
                        <Clock size={20} className="text-warning inline" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {onDelete && (
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="text-danger hover:text-red-700 transition-colors p-1"
                          title="Supprimer la transaction"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
