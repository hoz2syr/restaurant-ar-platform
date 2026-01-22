'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiImage, FiPackage } from 'react-icons/fi';
import { menuItemApi, MenuItem } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import AdminLayout from '../../AdminLayout';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import FileUploader from '../../components/FileUploader';

export default function MenuItemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const data = await menuItemApi.getById(id);
      setItem(data);
    } catch (error) {
      console.error('Failed to load menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setSaving(true);
    try {
      await menuItemApi.update(id, item);
      alert('Menu item updated successfully');
    } catch (error) {
      console.error('Failed to update menu item:', error);
      alert('Failed to update menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (url: string) => {
    if (item) {
      setItem({ ...item, imageUrl: url });
    }
  };

  const handleModelUpload = (url: string) => {
    if (item) {
      setItem({ ...item, model3dUrl: url });
    }
  };

  if (loading || !item) {
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
        <div className="flex items-center space-x-4">
          <Link href={`/restaurants/${item.menuId}/menus`} className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
            <p className="mt-2 text-gray-600">Edit menu item details and assets</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Item Information</h2>
              <div className="space-y-4">
                <Input
                  label="Item Name"
                  required
                  value={item.name}
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                />
                <TextArea
                  label="Description"
                  required
                  value={item.description}
                  onChange={(e) => setItem({ ...item, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price"
                    type="number"
                    step="0.01"
                    required
                    value={item.price}
                    onChange={(e) => setItem({ ...item, price: parseFloat(e.target.value) })}
                  />
                  <Input
                    label="Category"
                    required
                    value={item.category}
                    onChange={(e) => setItem({ ...item, category: e.target.value })}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.isAvailable}
                    onChange={(e) => setItem({ ...item, isAvailable: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Available for orders</label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiImage className="mr-2" />
                  Item Image
                </h2>
                {item.imageUrl && (
                  <div className="mb-4">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
                <FileUploader
                  onUploadComplete={handleImageUpload}
                  accept="image/*"
                  label="Upload Image"
                  description="Upload a photo of the menu item"
                />
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiPackage className="mr-2" />
                  3D Model
                </h2>
                {item.model3dUrl && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">3D model uploaded</p>
                    <p className="text-xs text-gray-500 mt-1">{item.model3dUrl}</p>
                  </div>
                )}
                <FileUploader
                  onUploadComplete={handleModelUpload}
                  accept=".glb,.gltf,.obj,.fbx"
                  maxSize={50 * 1024 * 1024}
                  label="Upload 3D Model"
                  description="Upload a 3D model (GLB, GLTF, OBJ, FBX)"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => window.history.back()} className="btn-secondary">
              Cancel
            </button>
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
