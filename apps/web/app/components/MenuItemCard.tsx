'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';

interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    has3DModel?: boolean;
    restaurantId: string;
    restaurantName: string;
  };
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { t } = useLanguage();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
            🍽️
          </div>
        )}
        {item.has3DModel && (
          <Link
            href={`/menu-items/${item.id}`}
            className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-primary-700"
          >
            {t('menu.viewIn3D')}
          </Link>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            {t('menu.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
