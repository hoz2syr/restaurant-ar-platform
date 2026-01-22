'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import { orderApi, Order } from '@/lib/api';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import AdminLayout from '../../AdminLayout';
import Select from '../../components/Select';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orderApi.getById(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: Order['status']) => {
    try {
      await orderApi.updateStatus(id, status);
      if (order) {
        setOrder({ ...order, status });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (loading || !order) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-primary',
      preparing: 'badge badge-blue-100 text-blue-800',
      ready: 'badge-success',
      delivered: 'badge-gray',
      cancelled: 'badge-danger',
    };
    return badges[status] || 'badge-gray';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/orders" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
            <p className="mt-2 text-gray-600">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiPackage className="mr-2" />
                Order Items
              </h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.menuItem?.name || 'Menu Item'}
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      {item.specialInstructions && (
                        <p className="text-sm text-gray-600 mt-1">Note: {item.specialInstructions}</p>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-2">Order Notes</h2>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Order Status</h2>
              <div className="mb-4">
                <span className={`${getStatusBadge(order.status)} text-base`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <Select
                label="Update Status"
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'preparing', label: 'Preparing' },
                  { value: 'ready', label: 'Ready' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
              />
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Restaurant ID</p>
                  <p className="font-medium">{order.restaurantId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer ID</p>
                  <p className="font-medium">{order.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDateTime(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDateTime(order.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
