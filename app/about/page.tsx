'use client';

import Link from 'next/link';
import { Users, Heart, Lightbulb, Award } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Qui sommes-nous ?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Spendly est né de la volonté de rendre la gestion budgétaire simple,
            accessible et efficace pour tous.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <div className="bg-primary-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nous croyons que tout le monde mérite d&apos;avoir le contrôle sur ses
              finances. Notre mission est de fournir des outils simples et
              puissants pour vous aider à comprendre vos dépenses, planifier
              votre budget et atteindre vos objectifs financiers.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users size={48} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessibilité</h3>
              <p className="text-gray-600">
                Une application simple et intuitive pour tous
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Heart size={48} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bienveillance</h3>
              <p className="text-gray-600">
                Vous accompagner sans jugement dans votre parcours financier
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Lightbulb size={48} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Des fonctionnalités modernes et intelligentes
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award size={48} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                La meilleure expérience utilisateur possible
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Ce que nous offrons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary-600">
                3 Modes de Budget
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Budget par catégorie</li>
                <li>• Budget global avec score</li>
                <li>• Suivi automatique bancaire</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary-600">
                Visualisations Claires
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Graphiques interactifs</li>
                <li>• Tableaux de bord personnalisés</li>
                <li>• Historique détaillé</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary-600">
                Gestion Complète
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Catégories personnalisables</li>
                <li>• Objectifs d&apos;épargne</li>
                <li>• Système de succès</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à commencer ?
          </h2>
          <Link href="/login">
            <Button className="px-8 py-3 text-lg">
              Créer mon compte gratuitement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
