import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const resp = await fetch(`${API_BASE}/public/orders/${params.id}`);
  const data = await resp.text();
  return new NextResponse(data, {
    status: resp.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
