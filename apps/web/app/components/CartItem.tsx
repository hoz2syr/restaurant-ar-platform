'use client';

import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart, CartItem as CartItemType } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { t } = useLanguage();
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="relative h-20 w-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-3xl">
            🍽️
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {item.restaurantName}
        </p>
        <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">
          ${item.price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-8 h-8 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          -
        </button>
        <span className="text-lg font-semibold w-8 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-8 h-8 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          +
        </button>
      </div>

      <button
        onClick={() => removeItem(item.id)}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
