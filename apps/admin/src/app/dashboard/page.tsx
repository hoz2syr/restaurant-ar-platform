'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface Stats {
  ordersCount: number;
  menuItemsCount: number;
  reservationsCount: number;
  usersCount: number;
}

async function handleLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const cards = useMemo(() => {
    if (!stats) return [];
    return [
      { title: 'الطلبات', subtitle: 'Orders', value: stats.ordersCount, href: '/dashboard/orders' },
      { title: 'العناصر', subtitle: 'Menu Items', value: stats.menuItemsCount, href: '/dashboard/menu' },
      { title: 'الحجوزات', subtitle: 'Reservations', value: stats.reservationsCount },
      { title: 'المستخدمون', subtitle: 'Users', value: stats.usersCount, href: '/dashboard/users' },
    ];
  }, [stats]);

  const maxValue = Math.max(...cards.map((card) => card.value), 1);

  const exportCsv = () => {
    if (!stats) return;
    const rows = [
      ['Metric', 'Value'],
      ['Orders', stats.ordersCount],
      ['Menu Items', stats.menuItemsCount],
      ['Reservations', stats.reservationsCount],
      ['Users', stats.usersCount],
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-stats-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = async () => {
    if (!stats) return;
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Restaurant Admin Stats', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Metric', 'Value']],
      body: [
        ['Orders', stats.ordersCount],
        ['Menu Items', stats.menuItemsCount],
        ['Reservations', stats.reservationsCount],
        ['Users', stats.usersCount],
      ],
    });
    doc.save(`dashboard-stats-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div>
      <header className="admin-header">
        <div>
          <h1 className="admin-section-title">لوحة التحكم الذكية</h1>
          <p className="helper-text">إحصائيات فورية ومؤشرات أداء قابلة للتصدير.</p>
        </div>
        <div className="admin-toolbar">
          <button className="btn btn-secondary" onClick={exportCsv}>تصدير CSV</button>
          <button className="btn btn-secondary" onClick={exportPdf}>تصدير PDF</button>
          <button className="btn btn-outline" onClick={handleLogout}>تسجيل الخروج</button>
        </div>
      </header>

      {loading && <div className="admin-card">جارِ تحميل الإحصائيات...</div>}
      {error && <div className="admin-card">خطأ: {error}</div>}

      {stats && (
        <>
          <section className="admin-grid stats">
            {cards.map((card) => (
              <Link key={card.title} href={card.href || '#'} style={{ textDecoration: 'none' }}>
                <div className="admin-card">
                  <div className="stat-label">{card.subtitle}</div>
                  <div className="stat-number">{card.value}</div>
                  <div className="helper-text">{card.title}</div>
                  <div className="progress-bar" style={{ marginTop: 12 }}>
                    <span style={{ width: `${(card.value / maxValue) * 100}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </section>

          <section className="panel-grid" style={{ marginTop: 24 }}>
            <div className="admin-card">
              <h3 className="admin-section-title">نظرة عامة</h3>
              <p className="helper-text">قم بمتابعة أداء المنيو والطلبات بشكل يومي، واستفد من التصدير للمحاسبة أو التحليل.</p>
              <ul className="helper-text" style={{ marginTop: 12, paddingRight: 18 }}>
                <li>تحديث الأسعار وتوفر الأصناف بسرعة.</li>
                <li>مراقبة حركة الطلبات.</li>
                <li>تحليل عدد المستخدمين النشطين.</li>
              </ul>
            </div>
            <div className="admin-card">
              <h3 className="admin-section-title">إجراءات سريعة</h3>
              <div className="admin-toolbar">
                <Link href="/dashboard/menu" className="btn btn-primary">إدارة المنيو</Link>
                <Link href="/dashboard/orders" className="btn btn-secondary">متابعة الطلبات</Link>
              </div>
              <p className="helper-text" style={{ marginTop: 12 }}>تأكد من تحديث التصنيفات والأسعار بشكل دوري.</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
