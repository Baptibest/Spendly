'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicNavbar() {
  const pathname = usePathname();

  const links = [
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'Qui sommes-nous ?' },
    { href: '/login', label: 'Connexion' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Navigation links - Left side */}
          <div className="flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo - Right side */}
          <div className="flex items-center">
            <Link href="/home" className="text-2xl font-bold text-primary-600">
              Spendly
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
