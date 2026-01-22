'use client';

import { User } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FiEdit } from 'react-icons/fi';

interface UserTableProps {
  users: User[];
  onStatusChange: (id: string, status: User['status']) => void;
}

export default function UserTable({ users, onStatusChange }: UserTableProps) {
  const getStatusBadge = (status: User['status']) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-gray',
      suspended: 'badge-danger',
    };
    return `badge ${badges[status]}`;
  };

  const getRoleBadge = (role: User['role']) => {
    const badges = {
      admin: 'badge-danger',
      owner: 'badge-primary',
      customer: 'badge-gray',
    };
    return `badge ${badges[role]}`;
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="font-medium">{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={getRoleBadge(user.role)}>
                  {user.role}
                </span>
              </td>
              <td>
                <select
                  value={user.status}
                  onChange={(e) => onStatusChange(user.id, e.target.value as User['status'])}
                  className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${getStatusBadge(user.status)}`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <button className="text-primary-600 hover:text-primary-900">
                  <FiEdit className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
