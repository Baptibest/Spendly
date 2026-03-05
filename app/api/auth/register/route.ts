import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { createSuccessResponse, createErrorResponse } from '@/utils/errorHandler';

// Catégories par défaut pour les nouveaux utilisateurs
const DEFAULT_CATEGORIES = [
  { name: 'Logement', icon: '🏠', color: '#3b82f6' },
  { name: 'Alimentation', icon: '🛒', color: '#10b981' },
  { name: 'Transport', icon: '🚗', color: '#f59e0b' },
  { name: 'Loisirs', icon: '🎮', color: '#8b5cf6' },
  { name: 'Santé', icon: '❤️', color: '#ef4444' },
  { name: 'Abonnements', icon: '💳', color: '#06b6d4' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Autres', icon: '➕', color: '#6b7280' }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        createErrorResponse('Email et mot de passe requis'),
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        createErrorResponse('Le mot de passe doit contenir au moins 6 caractères'),
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        createErrorResponse('Un compte existe déjà avec cet email'),
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        role: 'user'
      })
      .select()
      .single();

    if (userError) {
      console.error('Erreur création utilisateur:', userError);
      return NextResponse.json(
        createErrorResponse('Erreur lors de la création du compte'),
        { status: 500 }
      );
    }

    // Créer les catégories par défaut pour le nouvel utilisateur
    const categoriesWithUserId = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      user_id: newUser.id
    }));

    const { error: categoriesError } = await supabase
      .from('categories')
      .insert(categoriesWithUserId);

    if (categoriesError) {
      console.error('Erreur création catégories:', categoriesError);
      // Ne pas bloquer l'inscription si les catégories échouent
    }

    // Créer les paramètres par défaut
    const { error: settingsError } = await supabase
      .from('budget_settings')
      .insert({
        user_id: newUser.id,
        mode: 'category',
        monthly_income: 0
      });

    if (settingsError) {
      console.error('Erreur création paramètres:', settingsError);
      // Ne pas bloquer l'inscription si les paramètres échouent
    }

    // Retourner les informations de l'utilisateur (sans le mot de passe)
    const userData = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    };

    return NextResponse.json(createSuccessResponse(userData), { status: 201 });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json(
      createErrorResponse('Erreur serveur lors de l\'inscription'),
      { status: 500 }
    );
  }
}
