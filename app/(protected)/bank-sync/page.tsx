'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { BankConnection, BankTransaction, SIMULATED_BANKS } from '@/types/bank.types';
import { Category } from '@/types/category.types';
import { Wallet, RefreshCw, Trash2, CheckCircle } from 'lucide-react';

export default function BankSyncPage() {
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [connectionsRes, categoriesRes] = await Promise.all([
        fetch('/api/bank-connections'),
        fetch('/api/categories'),
      ]);

      const [connectionsData, categoriesData] = await Promise.all([
        connectionsRes.json(),
        categoriesRes.json(),
      ]);

      if (connectionsData.success) {
        setConnections(connectionsData.data);
        if (connectionsData.data.length > 0) {
          fetchTransactions(connectionsData.data[0].id);
        }
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (err) {
      console.error('Erreur chargement données:', err);
    }
  };

  const fetchTransactions = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/bank-transactions?connection_id=${connectionId}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error('Erreur chargement transactions:', err);
    }
  };

  const handleAddConnection = async () => {
    if (!selectedBank || !accountNumber) {
      setMessage('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/bank-connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bank_name: selectedBank,
          account_number: accountNumber,
          account_type: accountType,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Connexion bancaire ajoutée avec succès !');
        setShowAddForm(false);
        setSelectedBank('');
        setAccountNumber('');
        fetchData();
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

  const handleSync = async (connectionId: string) => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/bank-transactions/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connection_id: connectionId,
          count: 10,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`✅ ${data.data.count} nouvelles transactions importées !`);
        fetchTransactions(connectionId);
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

  const handleDeleteConnection = async (id: string) => {
    if (!confirm('Supprimer cette connexion bancaire ?')) return;

    try {
      const res = await fetch(`/api/bank-connections/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Connexion supprimée');
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Erreur lors de la suppression');
    }
  };

  const handleCategorize = async (transactionId: string, categoryId: string) => {
    try {
      const res = await fetch('/api/bank-transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id: transactionId,
          category_id: categoryId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Transaction catégorisée');
        if (connections.length > 0) {
          fetchTransactions(connections[0].id);
        }
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      setMessage('Erreur lors de la catégorisation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Synchronisation Bancaire
          </h1>
          <p className="text-gray-600 mt-2">
            Connectez vos comptes et importez vos transactions automatiquement
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Wallet size={18} className="mr-2" />
          Ajouter un compte
        </Button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border-2 font-semibold ${
            message.includes('✅')
              ? 'bg-green-50 text-success border-green-500'
              : 'bg-red-50 text-danger border-red-500'
          }`}
        >
          {message}
        </div>
      )}

      {showAddForm && (
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
              <Button onClick={handleAddConnection} disabled={loading} className="flex-1">
                {loading ? 'Connexion...' : 'Connecter'}
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="secondary">
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card title="Comptes connectés">
        {connections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun compte connecté. Ajoutez votre premier compte bancaire !
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((connection) => (
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
                    onClick={() => handleSync(connection.id)}
                    disabled={loading}
                    variant="secondary"
                    size="sm"
                  >
                    <RefreshCw size={16} className="mr-1" />
                    Synchroniser
                  </Button>
                  <Button
                    onClick={() => handleDeleteConnection(connection.id)}
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

      {transactions.length > 0 && (
        <Card title="Transactions à catégoriser">
          <div className="space-y-2">
            {transactions
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
                      onChange={(e) => handleCategorize(transaction.id, e.target.value)}
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
            {transactions.filter((t) => !t.is_categorized).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-3 text-success" />
                Toutes les transactions sont catégorisées !
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
