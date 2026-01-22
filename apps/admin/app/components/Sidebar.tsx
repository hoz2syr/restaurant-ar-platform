'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiFileText, 
  FiSettings,
  FiPackage,
} from 'react-icons/fi';
import { classNames } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Restaurants', href: '/restaurants', icon: FiShoppingBag },
  { name: 'Orders', href: '/orders', icon: FiPackage },
  { name: 'Users', href: '/users', icon: FiUsers },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-admin-sidebar">
      <div className="flex items-center justify-center h-16 bg-admin-sidebar border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Restaurant Admin</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-admin-active text-white'
                  : 'text-gray-300 hover:bg-admin-hover hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
