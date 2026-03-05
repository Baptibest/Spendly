'use client';

import Link from 'next/link';
import { TrendingUp, PieChart, Target, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Gérez votre budget avec{' '}
            <span className="text-primary-600">Spendly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            L&apos;application intelligente qui vous aide à suivre vos dépenses,
            atteindre vos objectifs financiers et prendre le contrôle de votre
            argent.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button className="px-8 py-3 text-lg">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" className="px-8 py-3 text-lg">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <TrendingUp size={48} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Suivi en temps réel</h3>
            <p className="text-gray-600">
              Visualisez vos dépenses et revenus instantanément
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <PieChart size={48} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Budgets par catégorie</h3>
            <p className="text-gray-600">
              Organisez vos finances par catégories personnalisées
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Target size={48} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Objectifs d&apos;épargne</h3>
            <p className="text-gray-600">
              Définissez et atteignez vos objectifs financiers
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Shield size={48} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sécurisé et privé</h3>
            <p className="text-gray-600">
              Vos données sont protégées et confidentielles
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à prendre le contrôle de vos finances ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d&apos;utilisateurs qui gèrent leur budget avec
            Spendly
          </p>
          <Link href="/login">
            <Button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
