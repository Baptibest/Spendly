'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Home, BarChart3, Wallet, History, Trophy, Gift, Settings } from 'lucide-react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();
  const [mode, setMode] = useState<'category' | 'global' | 'automatic'>('category');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetchWithAuth('/api/settings');
        const data = await res.json();
        if (data.success && data.data) {
          setMode(data.data.mode);
        }
      } catch (err) {
        console.error('Erreur chargement paramètres:', err);
      }
    };
    
    // Charger la photo de profil depuis localStorage
    const loadProfilePicture = () => {
      const savedPicture = localStorage.getItem('profilePicture');
      if (savedPicture && savedPicture !== '/default-avatar.png') {
        setProfilePicture(savedPicture);
      } else {
        setProfilePicture(null);
      }
    };
    
    // Charger les settings au montage
    fetchSettings();
    loadProfilePicture();
    
    // Rafraîchir toutes les 2 secondes pour détecter les changements de mode et de photo
    const interval = setInterval(() => {
      fetchSettings();
      loadProfilePicture();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const allLinks = [
    { href: '/expenses', label: 'Dépenses', icon: Home, hideInAutomatic: true },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/budgets', label: 'Budgets', icon: Wallet },
    { href: '/history', label: 'Historique', icon: History },
    { href: '/succes', label: 'Succès', icon: Trophy },
    { href: '/cashback', label: 'Cashback', icon: Gift },
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
            <Image
              src="/Spendly.png"
              alt="Spendly"
              width={180}
              height={60}
              priority
              className="h-14 w-auto"
            />
          </div>
          <div className="flex items-center space-x-4">
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
            {profilePicture ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-300">
                <Image
                  src={profilePicture}
                  alt="Photo de profil"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <Settings size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
