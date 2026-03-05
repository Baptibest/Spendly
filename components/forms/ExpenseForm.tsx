'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Category } from '@/types/category.types';
import { formatDateForInput } from '@/utils/date.utils';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

interface ExpenseFormProps {
  onSuccess?: () => void;
  showAccountType?: boolean;
  initialData?: {
    id?: string;
    amount: number;
    description: string;
    category_id: string;
    expense_date: string;
    account_type?: 'checking' | 'savings';
  };
}

export default function ExpenseForm({ onSuccess, showAccountType = false, initialData }: ExpenseFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    amount: initialData?.amount?.toString() || '',
    description: initialData?.description || '',
    category_id: initialData?.category_id || '',
    expense_date: initialData?.expense_date || formatDateForInput(new Date()),
    account_type: initialData?.account_type || 'checking',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetchWithAuth('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        if (!formData.category_id && data.data.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: data.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        category_id: formData.category_id,
        expense_date: formData.expense_date,
        account_type: formData.account_type,
      };

      const url = initialData?.id
        ? `/api/expenses/${initialData.id}`
        : '/api/expenses';
      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        if (!initialData?.id) {
          setFormData({
            amount: '',
            description: '',
            category_id: categories[0]?.id || '',
            expense_date: formatDateForInput(new Date()),
            account_type: 'checking',
          });
        }
        onSuccess?.();
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-danger p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Montant (€)"
        type="number"
        step="0.01"
        min="0.01"
        required
        value={formData.amount}
        onChange={(e) =>
          setFormData({ ...formData, amount: e.target.value })
        }
      />

      <Input
        label="Description"
        type="text"
        maxLength={255}
        required
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <Select
        label="Catégorie"
        required
        value={formData.category_id}
        onChange={(e) =>
          setFormData({ ...formData, category_id: e.target.value })
        }
        options={categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }))}
      />

      <Input
        label="Date"
        type="date"
        required
        value={formData.expense_date}
        onChange={(e) =>
          setFormData({ ...formData, expense_date: e.target.value })
        }
      />

      {showAccountType && (
        <Select
          label="Compte source"
          required
          value={formData.account_type}
          onChange={(e) =>
            setFormData({ ...formData, account_type: e.target.value as 'checking' | 'savings' })
          }
          options={[
            { value: 'checking', label: '💳 Compte courant' },
            { value: 'savings', label: '🐷 Compte épargne' },
          ]}
        />
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? 'Enregistrement...'
          : initialData?.id
          ? 'Modifier'
          : 'Ajouter la dépense'}
      </Button>
    </form>
  );
}
