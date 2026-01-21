'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package } from 'lucide-react';
import { fetchOrder } from '@/lib/api';
import { formatPrice, getStatusLabel } from '@/lib/utils';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const totalParam = searchParams.get('total');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetchOrder(orderId)
      .then((data) => {
        const payload = data.data || data;
        setStatus(payload?.status || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="container-app py-12">
        <ErrorMessage message="لم يتم تحديد رقم طلب." />
        <Link href="/menu" className="btn-primary mt-4 inline-flex">
          العودة للقائمة
        </Link>
      </div>
    );
  }

  const statusInfo = status ? getStatusLabel(status) : null;

  return (
    <div className="container-app py-12">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
          تم إنشاء الطلب بنجاح 🎉
        </h1>
        <p className="text-primary-500 mb-8">
          شكراً لاختيارك مطعمنا، جاري تجهيز طلبك.
        </p>

        <div className="card p-6 text-right space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-400">رقم الطلب</span>
            <span className="text-lg font-semibold text-primary">{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-400">الإجمالي</span>
            <span className="text-lg font-semibold text-accent">
              {totalParam ? formatPrice(Number(totalParam)) : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-400">الحالة</span>
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : statusInfo ? (
              <span className={`badge ${statusInfo.color}`}>{statusInfo.labelAr}</span>
            ) : (
              <span className="text-sm text-primary-500">غير متاحة</span>
            )}
          </div>
          {error && <ErrorMessage message={error} />}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/menu" className="btn-primary">
            العودة للقائمة
          </Link>
          <Link href="/order" className="btn-secondary">
            متابعة الطلبات
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-primary-400 text-sm">
          <Package className="w-4 h-4" />
          سيصلك تحديث تلقائي عند تغيير حالة الطلب
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container-app py-12"><LoadingSpinner size="lg" text="جارٍ التحميل..." /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
