'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { restaurantsAPI } from '@/lib/api';
import MenuCard from '../../components/MenuCard';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadRestaurant();
      loadMenus();
    }
  }, [params.id]);

  const loadRestaurant = async () => {
    try {
      const data = await restaurantsAPI.getById(params.id as string);
      setRestaurant(data.restaurant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load restaurant');
    }
  };

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await restaurantsAPI.getMenus(params.id as string);
      setMenus(data.menus || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menus');
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

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Restaurant not found'}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Restaurant Header */}
      <div className="relative h-80 w-full bg-gray-200 dark:bg-gray-700">
        {restaurant.image ? (
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-9xl">
            🍽️
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <p className="text-gray-200 text-lg mb-4">
              {restaurant.description}
            </p>
            <div className="flex flex-wrap gap-4 text-white">
              {restaurant.cuisine && (
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  {restaurant.cuisine}
                </span>
              )}
              {restaurant.rating && (
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  ⭐ {restaurant.rating}
                </span>
              )}
              {restaurant.deliveryTime && (
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  🚚 {restaurant.deliveryTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menus Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t('restaurant.menus')}
        </h2>

        {menus.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {t('restaurant.noMenus')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
