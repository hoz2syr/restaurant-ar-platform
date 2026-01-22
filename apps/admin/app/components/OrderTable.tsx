'use client';

import Link from 'next/link';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Order } from '@/lib/api';
import { formatDateTime, formatCurrency } from '@/lib/utils';

interface OrderTableProps {
  orders: Order[];
  onStatusChange: (id: string, status: Order['status']) => void;
}

export default function OrderTable({ orders, onStatusChange }: OrderTableProps) {
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
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Restaurant</th>
            <th>User</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="font-medium">#{order.id.slice(0, 8)}</td>
              <td>{order.restaurantId}</td>
              <td>{order.userId}</td>
              <td>{order.items.length} items</td>
              <td className="font-semibold">{formatCurrency(order.total)}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
                  className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${getStatusBadge(order.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>{formatDateTime(order.createdAt)}</td>
              <td>
                <Link
                  href={`/orders/${order.id}`}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <FiEdit className="w-5 h-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
