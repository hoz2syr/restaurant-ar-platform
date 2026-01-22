'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { menuItemsAPI } from '@/lib/api';
import ARViewer from '../../components/ARViewer';

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadItem();
    }
  }, [params.id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const data = await menuItemsAPI.getById(params.id as string);
      setItem(data.item);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (item) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
      });
      router.push('/cart');
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

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Item not found'}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AR Viewer */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            {item.model3DUrl ? (
              <ARViewer
                modelUrl={item.model3DUrl}
                poster={item.image}
                alt={item.name}
              />
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400 text-9xl">
                🍽️
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {item.name}
            </h1>

            {item.restaurantName && (
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                from {item.restaurantName}
              </p>
            )}

            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              ${item.price.toFixed(2)}
            </div>

            {item.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('menu.description')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            )}

            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Ingredients
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ingredient: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
            >
              {t('menu.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
