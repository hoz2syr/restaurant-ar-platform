const API_BASE = '/api';

async function parseApiError(res: Response, fallback: string) {
  try {
    const data = await res.json();
    return data?.message || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchMenu(page = 1, limit = 50, category?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (category) {
    params.set('category', category);
  }
  const res = await fetch(`${API_BASE}/menu?${params}`);
  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Failed to fetch menu'));
  }
  return res.json();
}

export async function fetchMenuItem(id: string) {
  const res = await fetch(`${API_BASE}/menu/${id}`);
  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Failed to fetch menu item'));
  }
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/menu/categories`);
  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Failed to fetch categories'));
  }
  return res.json();
}

export async function createOrder(payload: {
  tableId: string;
  items: Array<{ menuItemId: string; quantity: number }>;
}) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Failed to create order'));
  }
  return res.json();
}

export async function fetchOrder(orderId: string) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`);
  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Failed to fetch order'));
  }
  return res.json();
}
