'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Sparkles, Clock, ShoppingBag, ExternalLink } from 'lucide-react';
import { useOrder } from '../../providers/OrderProvider';
import { useTable } from '../../providers/TableProvider';
import { fetchMenuItem } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { MenuDetailSkeleton, ErrorMessage, Toast, useToast } from '@/components/ui';
import type { MenuItem } from '@/types';

interface MenuItemClientProps {
  id: string;
}

export default function MenuItemClient({ id }: MenuItemClientProps) {
  const { tableId } = useTable();
  const { addItem } = useOrder();
  const { toasts, showToast, removeToast } = useToast();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [arReadiness, setArReadiness] = useState<{
    isReady: boolean;
    supportedFormats: string[];
    reason?: string;
    modelUrl?: string;
    thumbnailUrl?: string;
  } | null>(null);

  const loadItem = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const [itemData, arData] = await Promise.all([
        fetchMenuItem(id),
        fetch(`/api/menu/${id}/ar`).then((res) => res.json()),
      ]);
      const payload = itemData.data || itemData;
      setItem(payload);
      setArReadiness(arData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل تحميل العنصر';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const handleViewAr = useCallback(() => {
    if (!arReadiness?.isReady) {
      const reason = arReadiness?.reason || 'الواقع المعزز غير متوفر لهذا الجهاز';
      showToast(reason, 'error');
      return;
    }
    if (arReadiness.modelUrl) {
      window.open(arReadiness.modelUrl, '_blank', 'noopener,noreferrer');
    }
  }, [arReadiness, showToast]);

  const handleAddToOrder = useCallback(() => {
    if (!item) return;
    addItem({
      menuItemId: item.id,
      name: item.nameAr || item.name,
      price: item.price,
      quantity: 1,
    });
    showToast(`تمت إضافة ${item.nameAr || item.name} إلى السلة`, 'success');
  }, [addItem, item, showToast]);

  return (
    <div className="container-app py-8 md:py-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-primary-400">تفاصيل الطبق</p>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">تفاصيل العنصر</h1>
          {tableId && (
            <p className="text-sm text-primary-500 mt-1">
              رقم الطاولة: <strong className="text-accent">{tableId}</strong>
            </p>
          )}
        </div>
        <Link href="/menu" className="text-accent hover:text-accent-600 transition-colors inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          العودة للقائمة
        </Link>
      </header>

      {loading && <MenuDetailSkeleton />}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={loadItem} />
      )}

      {!loading && item && (
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card bg-primary-100">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.nameAr || item.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                  <span className="text-6xl">🍽️</span>
                </div>
              )}
            </div>

            {item.hasArModel && (
              <div className="absolute top-4 right-4 badge-ar flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {arReadiness?.isReady ? 'AR Ready' : 'AR Not Supported'}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {item.category && (
              <p className="text-sm text-accent font-medium">
                {item.category.nameAr || item.category.name}
              </p>
            )}

            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
                {item.nameAr || item.name}
              </h2>
              <p className="text-lg text-primary-500">{item.name}</p>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-3xl font-bold text-accent">
                {formatPrice(item.price)}
              </span>
              {item.preparationTime && (
                <span className="inline-flex items-center gap-2 text-sm text-primary-500">
                  <Clock className="w-4 h-4" />
                  {item.preparationTime} دقيقة تحضير
                </span>
              )}
            </div>

            <p className="text-primary-600 leading-relaxed">
              {item.descriptionAr || item.description || '—'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToOrder}
                disabled={!item.isAvailable}
                className="btn-primary flex-1"
                aria-label="إضافة للطلب"
              >
                <ShoppingBag className="w-4 h-4" />
                إضافة للطلب
              </button>
              <button
                type="button"
                onClick={handleViewAr}
                disabled={!arReadiness?.isReady}
                className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="عرض بالواقع المعزز"
                aria-disabled={arReadiness?.isReady ? 'false' : 'true'}
              >
                <ExternalLink className="w-4 h-4" />
                {arReadiness?.isReady ? 'عرض بالواقع المعزز' : 'غير مدعوم على هذا الجهاز'}
              </button>
            </div>

            {!item.isAvailable && (
              <p className="text-sm text-red-500">هذا العنصر غير متوفر حالياً</p>
            )}
          </div>
        </div>
      )}

      {item && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-primary-100 shadow-lg sm:hidden">
          <button
            type="button"
            onClick={handleAddToOrder}
            disabled={!item.isAvailable}
            className="btn-primary w-full"
          >
            إضافة للطلب • {formatPrice(item.price)}
          </button>
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
