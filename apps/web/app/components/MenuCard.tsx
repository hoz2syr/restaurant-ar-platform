'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

interface MenuCardProps {
  menu: {
    id: string;
    name: string;
    description?: string;
    restaurantId: string;
    itemCount?: number;
  };
}

export default function MenuCard({ menu }: MenuCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={`/restaurants/${menu.restaurantId}/menu/${menu.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {menu.name}
          </h3>
          {menu.itemCount !== undefined && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {menu.itemCount} {t('menu.items')}
            </span>
          )}
        </div>
        {menu.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {menu.description}
          </p>
        )}
        <button className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors">
          {t('restaurant.viewMenu')}
        </button>
      </div>
    </Link>
  );
}
