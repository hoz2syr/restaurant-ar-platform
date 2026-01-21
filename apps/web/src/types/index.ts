// Shared Types for the Web App

export interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  description: string | null;
  descriptionAr: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  preparationTime: number | null;
  hasArModel: boolean;
  arModelUrl: string | null;
  category: {
    id: string;
    name: string;
    nameAr: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string | null;
  sortOrder: number;
  _count?: {
    items: number;
  };
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  nameAr?: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

export interface Order {
  id: string;
  tableId: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    quantity: number;
    priceAtOrder: number;
    menuItem: MenuItem;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateOrderPayload {
  tableId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
}

export interface CreateOrderResponse {
  orderId: string;
  status: string;
  total: number;
}
