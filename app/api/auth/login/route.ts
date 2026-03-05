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

    // For now, simple authentication
    // Admin account: admin@spendly.com / admin123
    if (email === 'admin@spendly.com' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        data: {
          id: '1',
          email: 'admin@spendly.com',
          role: 'admin',
        },
      });
    }

    // Check in database for other users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur serveur' },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Simple password check (in production, use bcrypt)
    if (user.password_hash !== password) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur login:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
