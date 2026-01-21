'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Eye, Sparkles } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useOrder } from '@/app/providers/OrderProvider';
import type { MenuItem } from '@/types';

interface MenuCardProps {
  item: MenuItem;
  onAddToOrder?: () => void;
}

export function MenuCard({ item, onAddToOrder }: MenuCardProps) {
  const { addItem } = useOrder();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      menuItemId: item.id,
      name: item.nameAr || item.name,
      price: item.price,
      quantity: 1,
    });
    onAddToOrder?.();
  };

  return (
    <article className="card card-hover group">
      <Link href={`/menu/${item.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-primary-100">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.nameAr || item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-4xl">🍽️</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {item.hasArModel && (
              <span className="badge-ar flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AR
              </span>
            )}
            {!item.isAvailable && (
              <span className="badge-warning">غير متوفر</span>
            )}
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white text-primary px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-4 h-4" />
              عرض التفاصيل
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {item.category && (
            <p className="text-xs text-accent font-medium mb-1">
              {item.category.nameAr || item.category.name}
            </p>
          )}

          {/* Name */}
          <h3 className="text-lg font-serif font-semibold text-primary mb-1 line-clamp-1">
            {item.nameAr}
          </h3>
          <p className="text-sm text-primary-500 mb-2">{item.name}</p>

          {/* Description */}
          {item.descriptionAr && (
            <p className="text-sm text-primary-400 line-clamp-2 mb-3">
              {item.descriptionAr}
            </p>
          )}

          {/* Price & Add Button */}
          <div className="flex items-center justify-between pt-2 border-t border-primary-100">
            <span className="text-lg font-bold text-accent">
              {formatPrice(item.price)}
            </span>
            <button
              onClick={handleAdd}
              disabled={!item.isAvailable}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                item.isAvailable
                  ? 'bg-accent text-white hover:bg-accent-600 active:scale-95'
                  : 'bg-primary-200 text-primary-400 cursor-not-allowed'
              )}
              aria-label={`إضافة ${item.nameAr} للطلب`}
            >
              <Plus className="w-4 h-4" />
              إضافة
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}
