import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';
  const category = url.searchParams.get('category');

  const categoryQuery = category ? `&category=${encodeURIComponent(category)}` : '';
  const resp = await fetch(`${API_BASE}/public/menu?page=${page}&limit=${limit}${categoryQuery}`);
  const data = await resp.text();
  return new NextResponse(data, {
    status: resp.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
