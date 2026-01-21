'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTable } from './TableProvider';

type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderContextType = {
  items: OrderItem[];
  subtotal: number;
  total: number;
  addItem: (item: OrderItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQty: (menuItemId: string, qty: number) => void;
  clearOrder: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { tableId } = useTable();
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    setItems([]);
  }, [tableId]);

  const addItem = (item: OrderItem) => {
    setItems((prev) => {
      const existing = prev.find((entry) => entry.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((entry) =>
          entry.menuItemId === item.menuItemId
            ? { ...entry, quantity: entry.quantity + item.quantity }
            : entry,
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prev) => prev.filter((item) => item.menuItemId !== menuItemId));
  };

  const updateQty = (menuItemId: string, qty: number) => {
    if (qty <= 0) return;
    setItems((prev) =>
      prev.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: qty }
          : item,
      ),
    );
  };

  const clearOrder = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const total = subtotal;

  return (
    <OrderContext.Provider value={{ items, subtotal, total, addItem, removeItem, updateQty, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return ctx;
}
