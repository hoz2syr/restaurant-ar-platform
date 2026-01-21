import { NextResponse } from 'next/server';

function parseCookie(header: string | null, name: string) {
  if (!header) return undefined;
  const parts = header.split(';').map((p) => p.trim());
  const found = parts.find((p) => p.startsWith(name + '='));
  if (!found) return undefined;
  return decodeURIComponent(found.split('=')[1]);
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = parseCookie(cookieHeader, 'accessToken');
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
    const resp = await fetch(`${apiBase}/admin/menu/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await resp.text();
    return new NextResponse(text, {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = parseCookie(cookieHeader, 'accessToken');
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
    const resp = await fetch(`${apiBase}/admin/menu/${params.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    return new NextResponse(text, {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = parseCookie(cookieHeader, 'accessToken');
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
    const resp = await fetch(`${apiBase}/admin/menu/${params.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await resp.text();
    return new NextResponse(text, {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
