'use client';

import Link from 'next/link';
import { ShoppingBag, MapPin } from 'lucide-react';
import { useTable } from '@/app/providers/TableProvider';
import { useOrder } from '@/app/providers/OrderProvider';

export function Header() {
  const { tableId } = useTable();
  const { items } = useOrder();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 glass border-b border-primary-100">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/menu" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">R</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-serif font-semibold text-primary group-hover:text-accent transition-colors">
                Restaurant
              </h1>
              <p className="text-xs text-primary-500 -mt-0.5">AR Experience</p>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Table ID Badge */}
            {tableId && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span className="text-sm font-medium text-primary">
                  طاولة {tableId}
                </span>
              </div>
            )}

            {/* Cart Button */}
            <Link
              href="/order"
              className="relative flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full hover:bg-accent-600 transition-all active:scale-95"
              aria-label={`سلة الطلبات (${itemCount} عنصر)`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">السلة</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
