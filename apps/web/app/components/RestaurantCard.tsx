'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    description: string;
    cuisine: string;
    image?: string;
    rating?: number;
    deliveryTime?: string;
  };
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
          {restaurant.image ? (
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
              🍽️
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {restaurant.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {restaurant.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="inline-block bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs px-2 py-1 rounded">
              {restaurant.cuisine}
            </span>
            {restaurant.rating && (
              <div className="flex items-center text-yellow-500">
                <span className="mr-1">⭐</span>
                <span className="text-sm font-semibold">{restaurant.rating}</span>
              </div>
            )}
          </div>
          {restaurant.deliveryTime && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              🚚 {restaurant.deliveryTime}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
