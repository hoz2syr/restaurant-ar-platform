import { NextResponse } from 'next/server';

function parseCookie(header: string | null, name: string) {
  if (!header) return undefined;
  const parts = header.split(';').map((p) => p.trim());
  const found = parts.find((p) => p.startsWith(name + '='));
  if (!found) return undefined;
  return decodeURIComponent(found.split('=')[1]);
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

async function proxyJsonResponse(resp: Response) {
  const text = await resp.text();
  return new NextResponse(text, {
    status: resp.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const token = parseCookie(_req.headers.get('cookie'), 'accessToken');
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resp = await fetch(`${API_BASE}/admin/orders/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return proxyJsonResponse(resp);
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = parseCookie(req.headers.get('cookie'), 'accessToken');
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = await req.json();
    const resp = await fetch(`${API_BASE}/admin/orders/${params.id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return proxyJsonResponse(resp);
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
