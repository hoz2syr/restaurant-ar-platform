'use client';

import { MenuCard } from './MenuCard';
import { MenuGridSkeleton } from '@/components/ui';
import type { MenuItem } from '@/types';

interface MenuGridProps {
  items: MenuItem[];
  loading?: boolean;
  onAddToOrder?: (item: MenuItem) => void;
}

export function MenuGrid({ items, loading, onAddToOrder }: MenuGridProps) {
  if (loading) {
    return <MenuGridSkeleton count={6} />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl mb-4 block">🍽️</span>
        <h3 className="text-xl font-serif font-semibold text-primary mb-2">
          لا توجد عناصر
        </h3>
        <p className="text-primary-500">
          لم نجد عناصر مطابقة لبحثك. جرّب تصنيفاً آخر.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onAddToOrder={() => onAddToOrder?.(item)}
        />
      ))}
    </div>
  );
}
