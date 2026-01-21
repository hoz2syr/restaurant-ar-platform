import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Restaurant Admin Panel',
  description: 'Restaurant Management Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="admin-shell">
          <aside className="admin-sidebar">
            <div className="admin-brand">
              <span>R</span>
              <div>
                <div style={{ fontWeight: 700 }}>Restaurant Admin</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>لوحة التحكم</div>
              </div>
            </div>
            <nav className="admin-nav">
              <Link href="/dashboard">لوحة التحكم</Link>
              <Link href="/dashboard/menu">إدارة المنيو</Link>
              <Link href="/dashboard/orders">الطلبات</Link>
              <Link href="/dashboard/users">المستخدمون</Link>
            </nav>
          </aside>
          <main className="admin-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
