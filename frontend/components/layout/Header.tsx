'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/button';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/onboarding', label: 'Nouvelle sortie' },
  { href: '/history', label: 'Historique' },
  { href: '/favorites', label: 'Favoris' },
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-xl">🚴</span>
          <span>BikeRoute</span>
        </Link>

        <nav className="hidden gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-brand-600 text-white'
                  : 'text-muted hover:bg-slate-900/5 dark:hover:bg-white/10',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === 'authenticated' ? (
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              {session.user?.name ?? session.user?.email} · Déconnexion
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm">Connexion</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
