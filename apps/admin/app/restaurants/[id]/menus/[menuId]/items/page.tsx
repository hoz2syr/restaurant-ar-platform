'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { menuItemApi, MenuItem } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import AdminLayout from '../../../../../AdminLayout';
import Modal from '../../../../../components/Modal';
import Input from '../../../../../components/Input';
import TextArea from '../../../../../components/TextArea';

export default function MenuItemsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const menuId = params.menuId as string;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    isAvailable: true,
  });

  useEffect(() => {
    loadItems();
  }, [menuId]);

  const loadItems = async () => {
    try {
      const data = await menuItemApi.getByMenu(menuId);
      setItems(data);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await menuItemApi.create(menuId, formData);
      setShowModal(false);
      setFormData({ name: '', description: '', price: 0, category: '', isAvailable: true });
      loadItems();
    } catch (error) {
      console.error('Failed to create menu item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await menuItemApi.delete(id);
      loadItems();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
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
            <Link href={`/restaurants/${restaurantId}/menus/${menuId}`} className="text-gray-600 hover:text-gray-900">
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Menu Items</h1>
              <p className="mt-2 text-gray-600">Manage menu items</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <FiPlus className="inline-block mr-2" />
            Add Item
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium">{item.name}</td>
                  <td className="max-w-xs truncate">{item.description}</td>
                  <td>{item.category}</td>
                  <td className="font-semibold">{formatCurrency(item.price)}</td>
                  <td>
                    <span className={`badge ${item.isAvailable ? 'badge-success' : 'badge-gray'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <Link
                        href={`/menu-items/${item.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
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

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Menu Item" size="lg">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Item Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextArea
              label="Description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
              <Input
                label="Category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700">Available</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Item
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
