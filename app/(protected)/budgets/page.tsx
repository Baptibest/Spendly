'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Category } from '@/types/category.types';
import { Budget } from '@/types/budget.types';
import { BudgetSettings } from '@/types/settings.types';
import { Savings } from '@/types/savings.types';
import { BankConnection, BankTransaction, SIMULATED_BANKS } from '@/types/bank.types';
import { getCurrentMonth, getCurrentYear, getMonthName } from '@/utils/date.utils';
import Modal from '@/components/ui/Modal';
import { Copy, TrendingUp, PiggyBank, Wallet, RefreshCw, Trash2, CheckCircle, Plus } from 'lucide-react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function BudgetsPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<BudgetSettings | null>(null);
  const [mode, setMode] = useState<'category' | 'global' | 'automatic'>('category');
  const [monthlyIncome, setMonthlyIncome] = useState('0');
  const [savings, setSavings] = useState<Savings | null>(null);
  const [savingsAmount, setSavingsAmount] = useState('0');
  const [savingsTarget, setSavingsTarget] = useState('0');
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([]);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [showAddBankForm, setShowAddBankForm] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    color: '#3b82f6',
    icon: '',
  });
  const [categoryError, setCategoryError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMonthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const fetchInitialData = async () => {
    try {
      console.log('Fetching initial data...');
      const [categoriesRes, settingsRes, bankConnectionsRes] = await Promise.all([
        fetchWithAuth('/api/categories'),
        fetchWithAuth('/api/settings'),
        fetchWithAuth('/api/bank-connections'),
      ]);

      const [categoriesData, settingsData, bankConnectionsData] = await Promise.all([
        categoriesRes.json(),
        settingsRes.json(),
        bankConnectionsRes.json(),
      ]);

      console.log('Settings data:', settingsData);
      console.log('Categories data:', categoriesData);

      if (settingsData.success && settingsData.data) {
        setSettings(settingsData.data);
        setMode(settingsData.data.mode);
        setMonthlyIncome(settingsData.data.monthly_income.toString());
      }

      if (categoriesData.success) {
        // Si l'utilisateur n'a pas de catégories, les initialiser
        if (categoriesData.data.length === 0) {
          console.log('Aucune catégorie trouvée, initialisation...');
          try {
            const initRes = await fetchWithAuth('/api/auth/init-user', {
              method: 'POST',
            });
            const initData = await initRes.json();
            if (initData.success) {
              // Recharger les catégories
              const newCategoriesRes = await fetchWithAuth('/api/categories');
              const newCategoriesData = await newCategoriesRes.json();
              if (newCategoriesData.success) {
                setCategories(newCategoriesData.data);
                const initialBudgets: Record<string, string> = {};
                newCategoriesData.data.forEach((cat: Category) => {
                  initialBudgets[cat.id] = '0';
                });
                setBudgets(initialBudgets);
              }
            }
          } catch (err) {
            console.error('Erreur initialisation catégories:', err);
          }
        } else {
          setCategories(categoriesData.data);
          const initialBudgets: Record<string, string> = {};
          categoriesData.data.forEach((cat: Category) => {
            initialBudgets[cat.id] = '0';
          });
          setBudgets(initialBudgets);
        }
      }

      if (bankConnectionsData.success) {
        setBankConnections(bankConnectionsData.data);
        if (bankConnectionsData.data.length > 0) {
          fetchBankTransactions(bankConnectionsData.data[0].id);
        }
      }

      fetchMonthData();
    } catch (err) {
      console.error('Erreur chargement données initiales:', err);
    }
  };

  const fetchBankTransactions = async (connectionId: string) => {
    try {
      const res = await fetchWithAuth(`/api/bank-transactions?connection_id=${connectionId}`);
      const data = await res.json();
      if (data.success) {
        setBankTransactions(data.data);
      }
    } catch (err) {
      console.error('Erreur chargement transactions:', err);
    }
  };

  const fetchMonthData = async () => {
    try {
      const [budgetsRes, savingsRes] = await Promise.all([
        fetchWithAuth(`/api/budgets?month=${month}&year=${year}`),
        fetchWithAuth(`/api/savings?month=${month}&year=${year}`),
      ]);

      const [budgetsData, savingsData] = await Promise.all([
        budgetsRes.json(),
        savingsRes.json(),
      ]);

      if (savingsData.success && savingsData.data) {
        setSavings(savingsData.data);
        setSavingsAmount(savingsData.data.amount.toString());
        setSavingsTarget(savingsData.data.target_amount.toString());
      } else {
        setSavings(null);
        setSavingsAmount('0');
        setSavingsTarget('0');
      }

      if (budgetsData.success) {
        const existingBudgets: Record<string, string> = {};
        budgetsData.data.forEach((budget: Budget) => {
          existingBudgets[budget.category_id] = budget.amount.toString();
        });
        setBudgets((prev) => ({ ...prev, ...existingBudgets }));
      }
    } catch (err) {
      console.error('Erreur chargement données mois:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const promises = Object.entries(budgets).map(([categoryId, amount]) => {
        return fetchWithAuth('/api/budgets', {
          method: 'POST',
          body: JSON.stringify({
            category_id: categoryId,
            month,
            year,
            amount: parseFloat(amount) || 0,
          }),
        });
      });

      await Promise.all(promises);
      setMessage('Budgets enregistrés avec succès !');
    } catch (err) {
      setMessage('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMode = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetchWithAuth('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          mode,
          monthly_income: parseFloat(monthlyIncome) || 0,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSettings(data.data);
        setMessage('✅ Mode enregistré avec succès !');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSavings = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetchWithAuth('/api/savings', {
        method: 'POST',
        body: JSON.stringify({
          month,
          year,
          amount: parseFloat(savingsAmount) || 0,
          target_amount: parseFloat(savingsTarget) || 0,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSavings(data.data);
        setMessage('✅ Épargne enregistrée avec succès !');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToNextMonth = async () => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    if (
      !confirm(
        `Copier les budgets de ${getMonthName(month)} ${year} vers ${getMonthName(nextMonth)} ${nextYear} ?\n\nCela remplacera les budgets existants du mois suivant.`
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetchWithAuth('/api/budgets/copy', {
        method: 'POST',
        body: JSON.stringify({
          fromMonth: month,
          fromYear: year,
          toMonth: nextMonth,
          toYear: nextYear,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`Budgets copiés vers ${getMonthName(nextMonth)} ${nextYear} avec succès !`);
      } else {
        setMessage(data.error || 'Erreur lors de la copie');
      }
    } catch (err) {
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBankConnection = async () => {
    if (!selectedBank || !accountNumber) {
      setMessage('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetchWithAuth('/api/bank-connections', {
        method: 'POST',
        body: JSON.stringify({
          bank_name: selectedBank,
          account_number: accountNumber,
          account_type: accountType,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Connexion bancaire ajoutée avec succès !');
        setShowAddBankForm(false);
        setSelectedBank('');
        setAccountNumber('');
        fetchInitialData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncBank = async (connectionId: string) => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetchWithAuth('/api/bank-transactions/sync', {
        method: 'POST',
        body: JSON.stringify({
          connection_id: connectionId,
          count: 10,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`✅ ${data.data.count} nouvelles transactions importées !`);
        fetchBankTransactions(connectionId);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Erreur lors de la synchronisation');
      }
    } catch (err) {
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBankConnection = async (id: string) => {
    if (!confirm('Supprimer cette connexion bancaire ?')) return;

    try {
      const res = await fetchWithAuth(`/api/bank-connections/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Connexion supprimée');
        fetchInitialData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Erreur lors de la suppression');
    }
  };

  const handleCategorizeTransaction = async (transactionId: string, categoryId: string) => {
    try {
      const res = await fetchWithAuth('/api/bank-transactions', {
        method: 'PUT',
        body: JSON.stringify({
          transaction_id: transactionId,
          category_id: categoryId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Transaction catégorisée');
        if (bankConnections.length > 0) {
          fetchBankTransactions(bankConnections[0].id);
        }
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      setMessage('Erreur lors de la catégorisation');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError('');

    try {
      const res = await fetchWithAuth('/api/categories', {
        method: 'POST',
        body: JSON.stringify(categoryFormData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Catégorie ajoutée avec succès !');
        setCategoryFormData({ name: '', color: '#3b82f6', icon: '' });
        setIsModalOpen(false);
        fetchInitialData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setCategoryError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setCategoryError('Erreur de connexion');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?\n\n⚠️ ATTENTION : Toutes les dépenses et budgets associés à cette catégorie seront également supprimés définitivement !`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Catégorie supprimée avec succès !');
        fetchInitialData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Impossible de supprimer cette catégorie');
      }
    } catch (err) {
      setMessage('Erreur de connexion');
    }
  };

  const predefinedColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
    '#06b6d4', '#ec4899', '#6b7280', '#14b8a6', '#f97316',
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: getMonthName(i + 1),
  }));

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: String(getCurrentYear() - i),
    label: String(getCurrentYear() - i),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Gérer les budgets
        </h1>
        {mode === 'category' && (
          <div className="flex gap-3">
            <Select
              value={String(month)}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              options={monthOptions}
            />
            <Select
              value={String(year)}
              onChange={(e) => setYear(parseInt(e.target.value))}
              options={yearOptions}
            />
          </div>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border-2 font-semibold ${
            message.includes('succès')
              ? 'bg-green-50 text-success border-green-500'
              : 'bg-red-50 text-danger border-red-500'
          }`}
        >
          {message}
        </div>
      )}

      <Card title="Mode de gestion">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
              mode === 'category' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                name="mode"
                value="category"
                checked={mode === 'category'}
                onChange={(e) => setMode(e.target.value as 'category')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">
                  📊 Budget par catégorie
                </div>
                <p className="text-sm text-gray-600">
                  Définissez un budget pour chaque catégorie
                </p>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
              mode === 'global' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                name="mode"
                value="global"
                checked={mode === 'global'}
                onChange={(e) => setMode(e.target.value as 'global')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary-600" />
                  Budget global avec score
                </div>
                <p className="text-sm text-gray-600">
                  Revenu mensuel avec système de score
                </p>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
              mode === 'automatic' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                name="mode"
                value="automatic"
                checked={mode === 'automatic'}
                onChange={(e) => setMode(e.target.value as 'automatic')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  🏦 Suivi automatique
                </div>
                <p className="text-sm text-gray-600">
                  Connexion bancaire et import automatique
                </p>
              </div>
            </label>
          </div>

          {mode === 'global' && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Input
                label="Revenu mensuel (€)"
                type="number"
                step="0.01"
                min="0"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="Ex: 2000"
              />
            </div>
          )}

          <Button onClick={handleSaveMode} disabled={loading} className="w-full">
            {loading ? 'Enregistrement...' : 'Enregistrer le mode'}
          </Button>
        </div>
      </Card>

      {mode === 'global' && (
        <Card title="Compte épargne">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <PiggyBank size={24} className="text-primary-600" />
              <p className="text-sm text-gray-600">
                Définissez votre épargne mensuelle pour {getMonthName(month)} {year}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Montant épargné (€)"
                type="number"
                step="0.01"
                min="0"
                value={savingsAmount}
                onChange={(e) => setSavingsAmount(e.target.value)}
                placeholder="Ex: 500"
              />
              <Input
                label="Objectif d'épargne (€)"
                type="number"
                step="0.01"
                min="0"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(e.target.value)}
                placeholder="Ex: 600"
              />
            </div>

            {parseFloat(savingsAmount) > 0 && parseFloat(savingsTarget) > 0 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <strong>Progression :</strong>{' '}
                  {((parseFloat(savingsAmount) / parseFloat(savingsTarget)) * 100).toFixed(1)}% de l&apos;objectif atteint
                </p>
              </div>
            )}

            <Button onClick={handleSaveSavings} disabled={loading} className="w-full">
              {loading ? 'Enregistrement...' : 'Enregistrer l\'épargne'}
            </Button>
          </div>
        </Card>
      )}

      {mode === 'category' && (
        <Card title="Budgets par catégorie">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{category.name}</p>
                </div>
                <div className="w-48">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgets[category.id] || '0'}
                    onChange={(e) =>
                      setBudgets({ ...budgets, [category.id]: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                  className="text-danger hover:text-red-600 p-2 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <Button onClick={handleSave} disabled={loading} className="w-full">
              {loading ? 'Enregistrement...' : 'Enregistrer les budgets'}
            </Button>
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleCopyToNextMonth}
                disabled={loading}
                variant="secondary"
                size="sm"
              >
                <Copy size={16} className="mr-2" />
                Copier au mois suivant
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="secondary"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Nouvelle catégorie
              </Button>
            </div>
          </div>
        </Card>
      )}

      {mode === 'automatic' && (
        <>
          {showAddBankForm && (
            <Card title="Connecter un compte bancaire">
              <div className="space-y-4">
                <Select
                  label="Banque"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  options={[
                    { value: '', label: 'Sélectionnez une banque' },
                    ...SIMULATED_BANKS.map((bank) => ({
                      value: bank.name,
                      label: `${bank.logo} ${bank.name}`,
                    })),
                  ]}
                />

                <Input
                  label="Numéro de compte (simulé)"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Ex: FR76 1234 5678 9012 3456 7890 123"
                />

                <Select
                  label="Type de compte"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as 'checking' | 'savings')}
                  options={[
                    { value: 'checking', label: '💳 Compte courant' },
                    { value: 'savings', label: '🐷 Compte épargne' },
                  ]}
                />

                <div className="flex gap-3">
                  <Button onClick={handleAddBankConnection} disabled={loading} className="flex-1">
                    {loading ? 'Connexion...' : 'Connecter'}
                  </Button>
                  <Button onClick={() => setShowAddBankForm(false)} variant="secondary">
                    Annuler
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card title="Comptes connectés">
            <div className="mb-4">
              <Button onClick={() => setShowAddBankForm(!showAddBankForm)}>
                <Wallet size={18} className="mr-2" />
                Ajouter un compte
              </Button>
            </div>

            {bankConnections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun compte connecté. Ajoutez votre premier compte bancaire !
              </div>
            ) : (
              <div className="space-y-3">
                {bankConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🏦</div>
                      <div>
                        <p className="font-semibold">{connection.bank_name}</p>
                        <p className="text-sm text-gray-600">
                          {connection.account_number} • {connection.account_type === 'checking' ? 'Courant' : 'Épargne'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSyncBank(connection.id)}
                        disabled={loading}
                        variant="secondary"
                        size="sm"
                      >
                        <RefreshCw size={16} className="mr-1" />
                        Synchroniser
                      </Button>
                      <Button
                        onClick={() => handleDeleteBankConnection(connection.id)}
                        variant="secondary"
                        size="sm"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {bankTransactions.length > 0 && (
            <Card title="Transactions à catégoriser">
              <div className="space-y-2">
                {bankTransactions
                  .filter((t) => !t.is_categorized)
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.transaction_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-danger">
                          -{transaction.amount.toFixed(2)} €
                        </p>
                        <Select
                          value={transaction.category_id || ''}
                          onChange={(e) => handleCategorizeTransaction(transaction.id, e.target.value)}
                          options={[
                            { value: '', label: 'Catégorie...' },
                            ...categories.map((cat) => ({
                              value: cat.id,
                              label: cat.name,
                            })),
                          ]}
                        />
                      </div>
                    </div>
                  ))}
                {bankTransactions.filter((t) => !t.is_categorized).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle size={48} className="mx-auto mb-3 text-success" />
                    Toutes les transactions sont catégorisées !
                  </div>
                )}
              </div>
            </Card>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoryError('');
        }}
        title="Ajouter une catégorie"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          {categoryError && (
            <div className="bg-red-50 text-danger p-3 rounded-lg text-sm">
              {categoryError}
            </div>
          )}

          <Input
            label="Nom de la catégorie"
            type="text"
            required
            maxLength={100}
            value={categoryFormData.name}
            onChange={(e) =>
              setCategoryFormData({ ...categoryFormData, name: e.target.value })
            }
            placeholder="Ex: Épargne, Cadeaux, Vacances..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCategoryFormData({ ...categoryFormData, color })}
                  className={`w-12 h-12 rounded-lg transition-all ${
                    categoryFormData.color === color
                      ? 'ring-2 ring-offset-2 ring-primary-600 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Input
              type="text"
              value={categoryFormData.color}
              onChange={(e) =>
                setCategoryFormData({ ...categoryFormData, color: e.target.value })
              }
              placeholder="#3b82f6"
            />
          </div>

          <Input
            label="Icône (optionnel)"
            type="text"
            value={categoryFormData.icon}
            onChange={(e) =>
              setCategoryFormData({ ...categoryFormData, icon: e.target.value })
            }
            placeholder="Ex: Home, Car, Heart..."
          />

          <Button type="submit" className="w-full">
            Ajouter la catégorie
          </Button>
        </form>
      </Modal>
    </div>
  );
}
