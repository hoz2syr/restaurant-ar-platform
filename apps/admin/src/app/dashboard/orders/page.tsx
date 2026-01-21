'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  customerName: string;
  total: number;
  createdAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/orders?page=${page}&limit=10`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setOrders(data.data || []);
        setMeta(data.meta || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <header className="admin-header">
        <div>
          <h1 className="admin-section-title">الطلبات</h1>
          <p className="helper-text">تابع طلبات العملاء وحالة التنفيذ.</p>
        </div>
        <Link href="/dashboard" className="btn btn-outline">العودة للوحة التحكم</Link>
      </header>

      {loading && <div className="admin-card">جارِ التحميل...</div>}
      {error && <div className="admin-card">خطأ: {error}</div>}

      {!loading && !error && (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>النوع</th>
                <th>الحالة</th>
                <th>العميل</th>
                <th>المجموع</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>لا توجد طلبات</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/dashboard/orders/${order.id}`} style={{ color: '#2563eb' }}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td>{order.type}</td>
                    <td>
                      <span className={`badge ${order.status === 'READY' ? 'badge-success' : order.status === 'PENDING' ? 'badge-warning' : 'badge-info'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.customerName}</td>
                    <td>{order.total.toFixed(2)} ر.س</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {meta && meta.pages > 1 && (
            <div className="admin-toolbar" style={{ justifyContent: 'center', marginTop: 16 }}>
              <button className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>السابق</button>
              <span className="helper-text">صفحة {meta.page} من {meta.pages}</span>
              <button className="btn btn-secondary" disabled={page >= meta.pages} onClick={() => setPage(page + 1)}>التالي</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
