'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { menuApi, Menu } from '@/lib/api';
import AdminLayout from '../../../../AdminLayout';
import Input from '../../../../components/Input';
import TextArea from '../../../../components/TextArea';

export default function MenuDetailPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const menuId = params.menuId as string;
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMenu();
  }, [menuId]);

  const loadMenu = async () => {
    try {
      const data = await menuApi.getById(menuId);
      setMenu(data);
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menu) return;
    setSaving(true);
    try {
      await menuApi.update(menuId, menu);
      alert('Menu updated successfully');
    } catch (error) {
      console.error('Failed to update menu:', error);
      alert('Failed to update menu');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !menu) {
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
          <div className="flex items-center space-x-4">
            <Link href={`/restaurants/${restaurantId}/menus`} className="text-gray-600 hover:text-gray-900">
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{menu.name}</h1>
              <p className="mt-2 text-gray-600">Edit menu details</p>
            </div>
          </div>
          <Link href={`/restaurants/${restaurantId}/menus/${menuId}/items`} className="btn-secondary">
            Manage Items
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Menu Information</h2>
            <div className="space-y-4">
              <Input
                label="Menu Name"
                required
                value={menu.name}
                onChange={(e) => setMenu({ ...menu, name: e.target.value })}
              />
              <TextArea
                label="Description"
                value={menu.description}
                onChange={(e) => setMenu({ ...menu, description: e.target.value })}
              />
              <Input
                label="Display Order"
                type="number"
                value={menu.order}
                onChange={(e) => setMenu({ ...menu, order: parseInt(e.target.value) })}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={menu.isActive}
                  onChange={(e) => setMenu({ ...menu, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link href={`/restaurants/${restaurantId}/menus`} className="btn-secondary">
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
