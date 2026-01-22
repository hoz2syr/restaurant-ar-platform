import { api } from './api';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'owner';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

export const auth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/admin/auth/login', credentials);
    
    if (response.token && response.user) {
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
  },

  getCurrentUser: (): AdminUser | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('admin_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },

  isAdmin: (): boolean => {
    const user = auth.getCurrentUser();
    return user?.role === 'admin';
  },

  checkAuth: () => {
    if (!auth.isAuthenticated()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  },
};
