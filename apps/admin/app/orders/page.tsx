'use client';

import { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { orderApi, Order } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '../AdminLayout';
import OrderTable from '../components/OrderTable';
import Select from '../components/Select';

export default function OrdersPage() {
  const { loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : undefined;
      const data = await orderApi.getAll(params);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Order['status']) => {
    try {
      await orderApi.updateStatus(id, status);
      loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="mt-2 text-gray-600">Manage and track customer orders</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <FiFilter className="text-gray-400" />
            <Select
              label=""
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Orders' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'preparing', label: 'Preparing' },
                { value: 'ready', label: 'Ready' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
          </div>
        </div>

        <OrderTable orders={orders} onStatusChange={handleStatusChange} />
      </div>
    </AdminLayout>
  );
}
