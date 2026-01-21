import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const resp = await fetch(`${API_BASE}/public/menu/${params.id}/ar/readiness`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
      cache: 'no-store',
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      return NextResponse.json(
        { message: data?.message || 'Failed to fetch AR readiness' },
        { status: resp.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
