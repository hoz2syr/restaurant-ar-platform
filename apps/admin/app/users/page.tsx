'use client';

import { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { userApi, User } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '../AdminLayout';
import UserTable from '../components/UserTable';
import Select from '../components/Select';

export default function UsersPage() {
  const { loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      const params: any = {};
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      const data = await userApi.getAll(Object.keys(params).length > 0 ? params : undefined);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: User['status']) => {
    try {
      await userApi.updateStatus(id, status);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="mt-2 text-gray-600">Manage user accounts and permissions</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <FiFilter className="text-gray-400" />
            <Select
              label=""
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: '', label: 'All Roles' },
                { value: 'admin', label: 'Admin' },
                { value: 'owner', label: 'Owner' },
                { value: 'customer', label: 'Customer' },
              ]}
            />
            <Select
              label=""
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' },
              ]}
            />
          </div>
        </div>

        <UserTable users={users} onStatusChange={handleStatusChange} />
      </div>
    </AdminLayout>
  );
}
