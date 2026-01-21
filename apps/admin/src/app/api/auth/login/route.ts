import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

    const resp = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return new NextResponse(JSON.stringify({ message: data || 'Login failed' }), { status: resp.status, headers: { 'Content-Type': 'application/json' } });
    }

    const token = data?.accessToken;
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'No token from upstream' }), { status: 502 });
    }

    // Set HttpOnly cookie
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const secure = process.env.NODE_ENV === 'production';
    const cookie = `accessToken=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure ? '; Secure' : ''}`;

    const res = new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    res.headers.set('Set-Cookie', cookie);
    return res;
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: err instanceof Error ? err.message : String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
