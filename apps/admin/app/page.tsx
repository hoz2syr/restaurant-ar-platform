'use client';

import { useEffect, useState } from 'react';
import { FiShoppingBag, FiPackage, FiUsers, FiDollarSign } from 'react-icons/fi';
import { dashboardApi, DashboardStats } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import DashboardCard from './components/DashboardCard';
import { formatCurrency } from '@/lib/utils';
import AdminLayout from './AdminLayout';

export default function DashboardPage() {
  const { loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({
        totalRestaurants: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: [],
        popularItems: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Restaurants"
            value={stats?.totalRestaurants || 0}
            icon={<FiShoppingBag />}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<FiPackage />}
            color="green"
            trend={{ value: 8, isPositive: true }}
          />
          <DashboardCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<FiUsers />}
            color="yellow"
            trend={{ value: 5, isPositive: true }}
          />
          <DashboardCard
            title="Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={<FiDollarSign />}
            color="red"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-500">{order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Items</h3>
            {stats?.popularItems && stats.popularItems.length > 0 ? (
              <div className="space-y-3">
                {stats.popularItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No popular items</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
