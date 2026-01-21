import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Suspense } from 'react';
import { TableProvider } from './providers/TableProvider';
import { OrderProvider } from './providers/OrderProvider';
import { Header, Footer } from '@/components/layout';
import { PageLoader } from '@/components/ui';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Restaurant AR Platform',
    template: '%s | Restaurant',
  },
  description: 'استمتع بتجربة طعام استثنائية مع قائمة الواقع المعزز',
  keywords: ['مطعم', 'قائمة طعام', 'واقع معزز', 'AR', 'طلب طعام'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Restaurant AR Platform',
    description: 'استمتع بتجربة طعام استثنائية مع قائمة الواقع المعزز',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant AR Platform',
    description: 'استمتع بتجربة طعام استثنائية مع قائمة الواقع المعزز',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#111827',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-background">
        <Suspense fallback={<PageLoader />}>
          <TableProvider>
            <OrderProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </OrderProvider>
          </TableProvider>
        </Suspense>
      </body>
    </html>
  );
}
