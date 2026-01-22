'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { restaurantApi, Restaurant } from '@/lib/api';
import AdminLayout from '../../AdminLayout';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import Link from 'next/link';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRestaurant();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const data = await restaurantApi.getById(id);
      setRestaurant(data);
    } catch (error) {
      console.error('Failed to load restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;
    setSaving(true);
    try {
      await restaurantApi.update(id, restaurant);
      alert('Restaurant updated successfully');
    } catch (error) {
      console.error('Failed to update restaurant:', error);
      alert('Failed to update restaurant');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!restaurant) {
    return (
      <AdminLayout>
        <div className="text-center">
          <p>Restaurant not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/restaurants" className="text-gray-600 hover:text-gray-900">
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
              <p className="mt-2 text-gray-600">Edit restaurant details</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link href={`/restaurants/${id}/menus`} className="btn-secondary">
              Manage Menus
            </Link>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Restaurant Name"
                required
                value={restaurant.name}
                onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
              />
              <Select
                label="Status"
                required
                value={restaurant.status}
                onChange={(e) => setRestaurant({ ...restaurant, status: e.target.value as Restaurant['status'] })}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'pending', label: 'Pending' },
                ]}
              />
            </div>
            <div className="mt-4">
              <TextArea
                label="Description"
                required
                value={restaurant.description}
                onChange={(e) => setRestaurant({ ...restaurant, description: e.target.value })}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone"
                type="tel"
                required
                value={restaurant.phone}
                onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                required
                value={restaurant.email}
                onChange={(e) => setRestaurant({ ...restaurant, email: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Input
                label="Address"
                required
                value={restaurant.address}
                onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link href="/restaurants" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="btn-primary">
              <FiSave className="inline-block mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
