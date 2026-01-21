'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users?page=${page}&limit=10`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUsers(data.data || []);
        setMeta(data.meta || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>المستخدمون — Users</h1>
        <Link href="/dashboard" style={{ color: '#0070f3' }}>← العودة للوحة التحكم</Link>
      </header>

      {loading && <p>جارِ التحميل...</p>}
      {error && <p style={{ color: 'red' }}>خطأ: {error}</p>}

      {!loading && !error && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>الاسم</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>البريد</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>الدور</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>نشط</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>لا يوجد مستخدمون</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{user.name}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{user.email}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{user.role}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{user.isActive ? '✅' : '❌'}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{new Date(user.createdAt).toLocaleDateString('ar-SA')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {meta && meta.pages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ padding: '0.5rem 1rem' }}>السابق</button>
              <span style={{ padding: '0.5rem' }}>صفحة {meta.page} من {meta.pages}</span>
              <button disabled={page >= meta.pages} onClick={() => setPage(page + 1)} style={{ padding: '0.5rem 1rem' }}>التالي</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
