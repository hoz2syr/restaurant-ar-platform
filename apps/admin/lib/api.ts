import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async upload<T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }
}

export const api = new ApiClient();

// API Types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  imageUrl?: string;
  ownerId: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  menuId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  model3dUrl?: string;
  category: string;
  isAvailable: boolean;
  allergens?: string[];
  nutritionInfo?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'owner' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRestaurants: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Order[];
  popularItems: MenuItem[];
}

// API Methods
export const restaurantApi = {
  getAll: () => api.get<Restaurant[]>('/admin/restaurants'),
  getById: (id: string) => api.get<Restaurant>(`/admin/restaurants/${id}`),
  create: (data: Partial<Restaurant>) => api.post<Restaurant>('/admin/restaurants', data),
  update: (id: string, data: Partial<Restaurant>) => api.put<Restaurant>(`/admin/restaurants/${id}`, data),
  delete: (id: string) => api.delete(`/admin/restaurants/${id}`),
};

export const menuApi = {
  getByRestaurant: (restaurantId: string) => api.get<Menu[]>(`/admin/restaurants/${restaurantId}/menus`),
  getById: (id: string) => api.get<Menu>(`/admin/menus/${id}`),
  create: (restaurantId: string, data: Partial<Menu>) => api.post<Menu>(`/admin/restaurants/${restaurantId}/menus`, data),
  update: (id: string, data: Partial<Menu>) => api.put<Menu>(`/admin/menus/${id}`, data),
  delete: (id: string) => api.delete(`/admin/menus/${id}`),
};

export const menuItemApi = {
  getByMenu: (menuId: string) => api.get<MenuItem[]>(`/admin/menus/${menuId}/items`),
  getById: (id: string) => api.get<MenuItem>(`/admin/menu-items/${id}`),
  create: (menuId: string, data: Partial<MenuItem>) => api.post<MenuItem>(`/admin/menus/${menuId}/items`, data),
  update: (id: string, data: Partial<MenuItem>) => api.put<MenuItem>(`/admin/menu-items/${id}`, data),
  delete: (id: string) => api.delete(`/admin/menu-items/${id}`),
  uploadImage: (id: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload<{ url: string }>(`/admin/menu-items/${id}/image`, formData, onProgress);
  },
  upload3DModel: (id: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('model', file);
    return api.upload<{ url: string }>(`/admin/menu-items/${id}/model`, formData, onProgress);
  },
};

export const orderApi = {
  getAll: (params?: { status?: string; restaurantId?: string }) => api.get<Order[]>('/admin/orders', { params }),
  getById: (id: string) => api.get<Order>(`/admin/orders/${id}`),
  updateStatus: (id: string, status: Order['status']) => api.patch<Order>(`/admin/orders/${id}/status`, { status }),
};

export const userApi = {
  getAll: (params?: { role?: string; status?: string }) => api.get<User[]>('/admin/users', { params }),
  getById: (id: string) => api.get<User>(`/admin/users/${id}`),
  update: (id: string, data: Partial<User>) => api.put<User>(`/admin/users/${id}`, data),
  updateStatus: (id: string, status: User['status']) => api.patch<User>(`/admin/users/${id}/status`, { status }),
};

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/admin/dashboard/stats'),
};

export const fileApi = {
  upload: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload<{ url: string }>('/admin/upload', formData, onProgress);
  },
};
