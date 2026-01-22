const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...(fetchOptions.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) =>
    apiFetch<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: (token: string) =>
    apiFetch<{ user: any }>('/auth/profile', { token }),
};

// Restaurants API
export const restaurantsAPI = {
  getAll: (params?: { search?: string; cuisine?: string }) => {
    const searchParams = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return apiFetch<{ restaurants: any[] }>(
      `/restaurants${searchParams ? `?${searchParams}` : ''}`
    );
  },

  getById: (id: string) =>
    apiFetch<{ restaurant: any }>(`/restaurants/${id}`),

  getMenus: (restaurantId: string) =>
    apiFetch<{ menus: any[] }>(`/restaurants/${restaurantId}/menus`),
};

// Menus API
export const menusAPI = {
  getById: (id: string) => apiFetch<{ menu: any }>(`/menus/${id}`),

  getItems: (menuId: string) =>
    apiFetch<{ items: any[] }>(`/menus/${menuId}/items`),
};

// Menu Items API
export const menuItemsAPI = {
  getById: (id: string) => apiFetch<{ item: any }>(`/menu-items/${id}`),

  search: (query: string) =>
    apiFetch<{ items: any[] }>(`/menu-items/search?q=${query}`),
};

// Orders API
export const ordersAPI = {
  create: (token: string, orderData: any) =>
    apiFetch<{ order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
      token,
    }),

  getAll: (token: string) =>
    apiFetch<{ orders: any[] }>('/orders', { token }),

  getById: (token: string, id: string) =>
    apiFetch<{ order: any }>(`/orders/${id}`, { token }),
};

export { API_URL };
