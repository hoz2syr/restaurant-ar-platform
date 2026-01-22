'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { menuApi, Menu } from '@/lib/api';
import AdminLayout from '../../../AdminLayout';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';

export default function RestaurantMenusPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    loadMenus();
  }, [restaurantId]);

  const loadMenus = async () => {
    try {
      const data = await menuApi.getByRestaurant(restaurantId);
      setMenus(data);
    } catch (error) {
      console.error('Failed to load menus:', error);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await menuApi.create(restaurantId, formData);
      setShowModal(false);
      setFormData({ name: '', description: '', isActive: true, order: 0 });
      loadMenus();
    } catch (error) {
      console.error('Failed to create menu:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;
    try {
      await menuApi.delete(id);
      loadMenus();
    } catch (error) {
      console.error('Failed to delete menu:', error);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/restaurants/${restaurantId}`} className="text-gray-600 hover:text-gray-900">
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Menus</h1>
              <p className="mt-2 text-gray-600">Manage restaurant menus</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <FiPlus className="inline-block mr-2" />
            Add Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{menu.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{menu.description}</p>
                </div>
                <span className={`badge ${menu.isActive ? 'badge-success' : 'badge-gray'}`}>
                  {menu.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex space-x-2 mt-4">
                <Link
                  href={`/restaurants/${restaurantId}/menus/${menu.id}`}
                  className="btn-primary flex-1 text-center"
                >
                  <FiEdit className="inline-block mr-2" />
                  Edit
                </Link>
                <Link
                  href={`/restaurants/${restaurantId}/menus/${menu.id}/items`}
                  className="btn-secondary flex-1 text-center"
                >
                  Items
                </Link>
                <button onClick={() => handleDelete(menu.id)} className="btn-danger">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Menu">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Menu Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextArea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
              label="Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700">Active</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Menu
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
