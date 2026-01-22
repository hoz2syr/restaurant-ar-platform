'use client';

import Link from 'next/link';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { Restaurant } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface RestaurantTableProps {
  restaurants: Restaurant[];
  onDelete: (id: string) => void;
}

export default function RestaurantTable({ restaurants, onDelete }: RestaurantTableProps) {
  const getStatusBadge = (status: Restaurant['status']) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-gray',
      pending: 'badge-warning',
    };
    return `badge ${badges[status]}`;
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id}>
              <td className="font-medium">{restaurant.name}</td>
              <td>{restaurant.address}</td>
              <td>{restaurant.phone}</td>
              <td>{restaurant.email}</td>
              <td>
                <span className={getStatusBadge(restaurant.status)}>
                  {restaurant.status}
                </span>
              </td>
              <td>{formatDate(restaurant.createdAt)}</td>
              <td>
                <div className="flex space-x-2">
                  <Link
                    href={`/restaurants/${restaurant.id}`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <FiEye className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/restaurants/${restaurant.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FiEdit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => onDelete(restaurant.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
