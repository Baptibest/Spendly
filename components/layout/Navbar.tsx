'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Wallet, History, Trophy, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();
  const [mode, setMode] = useState<'category' | 'global' | 'automatic'>('category');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.data) {
          setMode(data.data.mode);
        }
      } catch (err) {
        console.error('Erreur chargement settings:', err);
      }
    };
    
    // Charger les settings au montage
    fetchSettings();
    
    // Rafraîchir toutes les 2 secondes pour détecter les changements de mode
    const interval = setInterval(fetchSettings, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const allLinks = [
    { href: '/expenses', label: 'Dépenses', icon: Home, hideInAutomatic: true },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/budgets', label: 'Budgets', icon: Wallet },
    { href: '/history', label: 'Historique', icon: History },
    { href: '/succes', label: 'Succès', icon: Trophy },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ];

  const links = allLinks.filter(link => {
    if (mode === 'automatic' && link.hideInAutomatic) {
      return false;
    }
    return true;
  });

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              Spendly
            </h1>
          </div>
          <div className="flex space-x-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon size={18} className="mr-2" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
