'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Far left */}
          <div className="flex-shrink-0 mr-8">
            <Link href="/home" className="flex items-center">
              <img
                src="/Spendly.png"
                alt="Spendly"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Navigation links - Spread across the navbar */}
          <div className="flex-1 flex justify-around items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium transition-colors px-4 py-2 rounded-md ${
                  pathname === link.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
