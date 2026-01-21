'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useOrder } from '../providers/OrderProvider';
import { useTable } from '../providers/TableProvider';
import { createOrder } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { ErrorMessage, Toast, useToast } from '@/components/ui';

type ApiResponse = {
  orderId: string;
  status: string;
  total: number;
};

export default function OrderPage() {
  const router = useRouter();
  const { tableId } = useTable();
  const { items, subtotal, total, updateQty, removeItem, clearOrder } = useOrder();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  const handleSubmit = async () => {
    if (!tableId) {
      setMessage('يجب تحديد الطاولة أولاً');
      return;
    }
    if (items.length === 0) {
      setMessage('لا توجد عناصر في الطلب');
      return;
    }
    setSubmitting(true);
    setMessage(null);

    try {
      const data = (await createOrder({
        tableId,
        items: items.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
      })) as ApiResponse;

      clearOrder();
      router.push(`/order/success?orderId=${encodeURIComponent(data.orderId)}&total=${data.total.toFixed(2)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل إرسال الطلب';
      setMessage(message);
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      setMessage(null);
    }
  }, [items]);

  return (
    <div className="container-app py-8 md:py-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-primary-400">السلة</p>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">مراجعة الطلب</h1>
          {tableId && (
            <p className="text-sm text-primary-500 mt-1">
              رقم الطاولة: <strong className="text-accent">{tableId}</strong>
            </p>
          )}
        </div>
        <Link href="/menu" className="text-accent hover:text-accent-600 transition-colors">
          ← العودة للقائمة
        </Link>
      </header>

      {message && (
        <ErrorMessage message={message} onDismiss={() => setMessage(null)} className="mb-6" />
      )}

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 text-primary-200 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-primary mb-2">السلة فارغة</h3>
          <p className="text-primary-500 mb-6">اختر بعض الأطباق من القائمة لتبدأ.</p>
          <Link href="/menu" className="btn-primary">
            استعراض القائمة
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.menuItemId} className="card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary">{item.name}</h3>
                    <p className="text-sm text-primary-500">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-primary-50 rounded-full px-3 py-1">
                      <button
                        type="button"
                        onClick={() => updateQty(item.menuItemId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition"
                        aria-label="تقليل الكمية"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.menuItemId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition"
                        aria-label="زيادة الكمية"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="text-lg font-semibold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.menuItemId)}
                      className="text-red-500 hover:text-red-700 transition"
                      aria-label="حذف العنصر"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-serif font-semibold text-primary mb-4">ملخص الطلب</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-primary-600">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-primary-600">
                  <span>الضريبة</span>
                  <span>—</span>
                </div>
                <div className="border-t border-primary-100 pt-3 flex justify-between text-lg font-semibold text-primary">
                  <span>الإجمالي</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || items.length === 0}
                className="btn-primary w-full mt-6"
              >
                {submitting ? 'جارٍ إرسال الطلب...' : 'إرسال الطلب'}
              </button>
              {!tableId && (
                <p className="text-xs text-primary-400 mt-3 text-center">
                  تأكد من تحديد رقم الطاولة قبل الإرسال
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
