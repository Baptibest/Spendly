import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!error) {
      // Rediriger vers le dashboard après confirmation
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // En cas d'erreur, rediriger vers la page de login avec un message
  return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
}
