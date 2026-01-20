import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant AR Platform',
  description: 'Restaurant with AR Menu Experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
