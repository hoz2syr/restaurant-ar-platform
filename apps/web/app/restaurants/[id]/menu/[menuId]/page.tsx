'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { menusAPI } from '@/lib/api';
import MenuItemCard from '../../../../components/MenuItemCard';

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [menu, setMenu] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.menuId) {
      loadMenu();
      loadItems();
    }
  }, [params.menuId]);

  const loadMenu = async () => {
    try {
      const data = await menusAPI.getById(params.menuId as string);
      setMenu(data.menu);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await menusAPI.getItems(params.menuId as string);
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('common.loading')}
          </p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Menu not found'}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          ← {t('common.back')}
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {menu.name}
          </h1>
          {menu.description && (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {menu.description}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={{
                  ...item,
                  restaurantId: params.id as string,
                  restaurantName: menu.restaurantName || '',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
