'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Category } from '@/types/category.types';
import { Trash2, Plus } from 'lucide-react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    icon: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetchWithAuth('/api/categories', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Catégorie ajoutée avec succès !');
        setFormData({ name: '', color: '#3b82f6', icon: '' });
        setIsModalOpen(false);
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  const handleDelete = async (id: string, name: string) => {
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
        setSuccess('Catégorie supprimée avec succès !');
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Impossible de supprimer cette catégorie');
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  const predefinedColors = [
    '#3b82f6', // Bleu
    '#10b981', // Vert
    '#f59e0b', // Orange
    '#8b5cf6', // Violet
    '#ef4444', // Rouge
    '#06b6d4', // Cyan
    '#ec4899', // Rose
    '#6b7280', // Gris
    '#14b8a6', // Teal
    '#f97316', // Orange foncé
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des catégories
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {success && (
        <div className="bg-green-50 text-success p-4 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-danger p-4 rounded-lg">{error}</div>
      )}

      {loading ? (
        <Card>
          <div className="text-center py-8 text-gray-500">Chargement...</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {category.name}
                    </p>
                    <p className="text-sm text-gray-500">{category.color}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="text-danger hover:text-red-600 p-2 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <Card>
          <div className="text-center py-8 text-gray-500">
            Aucune catégorie. Créez-en une pour commencer !
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError('');
        }}
        title="Ajouter une catégorie"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-danger p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Nom de la catégorie"
            type="text"
            required
            maxLength={100}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
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
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-12 h-12 rounded-lg transition-all ${
                    formData.color === color
                      ? 'ring-2 ring-offset-2 ring-primary-600 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Input
              type="text"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              placeholder="#3b82f6"
            />
          </div>

          <Input
            label="Icône (optionnel)"
            type="text"
            value={formData.icon}
            onChange={(e) =>
              setFormData({ ...formData, icon: e.target.value })
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
