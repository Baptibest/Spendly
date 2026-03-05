import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spendly - Gérez votre budget facilement',
  description: 'Application de gestion budgétaire simple et efficace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-blue-100`}>
        {children}
      </body>
    </html>
  );
}
