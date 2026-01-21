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
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
    const resp = await fetch(`${apiBase}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = resp.headers.get('content-type') || 'application/json';
    const text = await resp.text();
    return new NextResponse(text, { status: resp.status, headers: { 'Content-Type': contentType } });
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: err instanceof Error ? err.message : String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
