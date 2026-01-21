'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

type AdminOrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED';

type AdminOrderItemSnapshot = {
  name: string;
  nameAr?: string;
};

type AdminOrderItem = {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes: string | null;
  itemSnapshot: AdminOrderItemSnapshot;
};

type AdminOrderDetail = {
  id: string;
  orderNumber: string;
  tableId: string | null;
  status: AdminOrderStatus | string;
  total: number;
  createdAt: string;
  items: AdminOrderItem[];
};

const STATUS_LABELS: Record<AdminOrderStatus, string> = {
  PENDING: 'قيد الانتظار',
  ACCEPTED: 'مقبول',
  PREPARING: 'قيد التحضير',
  READY: 'جاهز للتسليم',
  COMPLETED: 'مكتمل',
};

const STATUS_TRANSITIONS: Partial<
  Record<AdminOrderStatus, { next: AdminOrderStatus; label: string }>
> = {
  PENDING: { next: 'ACCEPTED', label: 'قبول الطلب' },
  ACCEPTED: { next: 'PREPARING', label: 'بدء التحضير' },
  PREPARING: { next: 'READY', label: 'جاهز للتسليم' },
  READY: { next: 'COMPLETED', label: 'إنهاء الطلب' },
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = typeof params?.id === 'string' ? params.id : null;
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/admin/orders/${orderId}`);
      const data = await resp.json().catch(() => null);
      if (!resp.ok) {
        throw new Error(data?.message || `HTTP ${resp.status}`);
      }
      setOrder(data);
    } catch (err: unknown) {
      setOrder(null);
      const message = err instanceof Error ? err.message : 'تعذّر الحصول على الطلب';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const transition = useMemo(() => {
    if (!order) return null;
    return STATUS_TRANSITIONS[order.status as AdminOrderStatus] ?? null;
  }, [order]);

  const handleStatusUpdate = useCallback(async () => {
    if (!orderId || !transition) return;
    setStatusLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: transition.next }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok) {
        throw new Error(data?.message || `HTTP ${resp.status}`);
      }
      await fetchOrder();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'تعذّر تحديث الحالة';
      setError(message);
    } finally {
      setStatusLoading(false);
    }
  }, [orderId, transition, fetchOrder]);

  return (
    <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>تفاصيل الطلب</h1>
          {order && (
            <p style={{ margin: 0, color: '#555' }}>#{order.orderNumber}</p>
          )}
        </div>
        <Link href="/dashboard/orders" style={{ color: '#0070f3' }}>
          ← العودة لقائمة الطلبات
        </Link>
      </header>

      {loading && <p>جارِ التحميل...</p>}
      {error && (
        <p style={{ color: 'red' }}>خطأ: {error}</p>
      )}

      {order && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>رقم الطلب</p>
              <p style={{ margin: '0.25rem 0 0' }}>{order.id}</p>
            </div>
            <div style={{ flex: '1 1 200px', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>المسار</p>
              <p style={{ margin: '0.25rem 0 0' }}>{order.tableId ?? '—'}</p>
            </div>
            <div style={{ flex: '1 1 200px', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>الحالة</p>
              <p style={{ margin: '0.25rem 0 0' }}>{STATUS_LABELS[order.status as AdminOrderStatus] ?? order.status}</p>
            </div>
            <div style={{ flex: '1 1 200px', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>المجموع</p>
              <p style={{ margin: '0.25rem 0 0' }}>{order.total.toFixed(2)} ر.س</p>
            </div>
            <div style={{ flex: '1 1 200px', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>أنشئ في</p>
              <p style={{ margin: '0.25rem 0 0' }}>{new Date(order.createdAt).toLocaleString('ar-SA')}</p>
            </div>
          </div>

          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>العناصر</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>الاسم</th>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>الكمية</th>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>السعر</th>
                  <th style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>المجموع</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                      {item.itemSnapshot.name}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{item.quantity}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{item.price.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
                {order.items.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
                      لا توجد عناصر
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {transition && (
            <div>
              <button
                onClick={handleStatusUpdate}
                disabled={statusLoading || loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#0070f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: statusLoading || loading ? 'not-allowed' : 'pointer',
                }}
              >
                {statusLoading ? 'جارِ التحديث...' : transition.label}
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
