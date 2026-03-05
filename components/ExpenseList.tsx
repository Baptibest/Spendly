'use client';

import { useState } from 'react';
import { ExpenseWithCategory } from '@/types/expense.types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ExpenseForm from '@/components/forms/ExpenseForm';
import { Trash2, Edit } from 'lucide-react';
import { formatDate } from '@/utils/date.utils';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

interface ExpenseListProps {
  expenses: ExpenseWithCategory[];
  onUpdate: () => void;
}

export default function ExpenseList({ expenses, onUpdate }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetchWithAuth(`/api/expenses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onUpdate();
      }
    } catch (err) {
      console.error('Erreur suppression:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune dépense enregistrée
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: expense.category.color }}
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {expense.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {expense.category.name} • {formatDate(expense.expense_date)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-bold text-gray-900">
                {expense.amount.toFixed(2)} €
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingExpense(expense)}
                  className="text-primary-600 hover:text-primary-700 p-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  disabled={deletingId === expense.id}
                  className="text-danger hover:text-red-600 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Modifier la dépense"
      >
        {editingExpense && (
          <ExpenseForm
            initialData={editingExpense}
            onSuccess={() => {
              setEditingExpense(null);
              onUpdate();
            }}
          />
        )}
      </Modal>
    </>
  );
}
