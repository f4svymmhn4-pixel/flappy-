import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/lib/providers';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Bike Route Generator — Sorties vélo intelligentes',
  description:
    'Génère automatiquement les meilleurs parcours vélo autour de chez toi : réseau routier, pistes cyclables, dénivelé, paysages et points d’intérêt analysés pour chaque sortie.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
