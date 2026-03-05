import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

    // Créer l'utilisateur avec Supabase Auth (envoie automatiquement l'email de confirmation)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      }
    });

    if (authError) {
      console.error('Erreur Supabase Auth:', authError);
      return NextResponse.json(
        createErrorResponse(authError.message === 'User already registered' 
          ? 'Un compte existe déjà avec cet email' 
          : 'Erreur lors de la création du compte'),
        { status: authError.message === 'User already registered' ? 409 : 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        createErrorResponse('Erreur lors de la création du compte'),
        { status: 500 }
      );
    }

    // Créer l'entrée dans la table users avec l'ID de Supabase Auth
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        role: 'user'
      })
      .select()
      .single();

    if (userError) {
      console.error('Erreur création utilisateur dans table users:', userError);
      // Supprimer l'utilisateur Auth si la création dans users échoue
      await supabase.auth.admin.deleteUser(authData.user.id);
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
    }

    // Retourner un message de succès avec instruction de vérifier l'email
    return NextResponse.json(
      createSuccessResponse({
        message: 'Inscription réussie ! Vérifiez votre email pour confirmer votre compte.',
        email: authData.user.email
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json(
      createErrorResponse('Erreur serveur lors de l\'inscription'),
      { status: 500 }
    );
  }
}
