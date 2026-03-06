'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion si non authentifié
      router.push('/login');
    }
  }, [router, pathname]);

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
