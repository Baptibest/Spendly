'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, Home, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/budgets', label: 'Budgets', icon: Wallet },
    { href: '/expenses', label: 'Dépenses', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-500'
              )}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
