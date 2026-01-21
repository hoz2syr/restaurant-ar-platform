import { NextResponse } from 'next/server';

function parseCookie(header: string | null, name: string) {
  if (!header) return undefined;
  const parts = header.split(';').map((p) => p.trim());
  const found = parts.find((p) => p.startsWith(name + '='));
  if (!found) return undefined;
  return decodeURIComponent(found.split('=')[1]);
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = parseCookie(cookieHeader, 'accessToken');
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
    const resp = await fetch(`${apiBase}/admin/users?page=${page}&limit=${limit}`, {
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
