'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { items, getTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const total = getTotal();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/cart');
      return;
    }
    // TODO: Implement checkout flow
    alert('Checkout functionality will be implemented');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {t('cart.title')}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 dark:text-gray-400 text-xl mb-6">
              {t('cart.empty')}
            </p>
            <button
              onClick={() => router.push('/restaurants')}
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 font-medium"
            >
              {t('nav.restaurants')}
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('cart.total')}
                </span>
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 font-medium text-lg transition-colors"
                >
                  {t('cart.checkout')}
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="w-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 py-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
