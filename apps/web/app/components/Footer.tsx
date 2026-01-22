'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              AR Restaurant Platform
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('home.subtitle')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {t('nav.restaurants')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/restaurants"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  {t('nav.restaurants')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {t('nav.orders')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/orders"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  {t('nav.orders')}
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  {t('nav.cart')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 AR Restaurant Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
