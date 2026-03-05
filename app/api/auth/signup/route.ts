import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // Create new user (in production, hash the password)
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: password, // In production, use bcrypt
          role: 'user',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erreur création utilisateur:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la création du compte' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        email: data.email,
        role: data.role,
      },
    });
  } catch (error) {
    console.error('Erreur signup:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
