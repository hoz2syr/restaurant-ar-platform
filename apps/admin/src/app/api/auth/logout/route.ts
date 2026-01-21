import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the accessToken cookie by setting it to empty with immediate expiry
  const cookie = `accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;

  const res = new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  res.headers.set('Set-Cookie', cookie);
  return res;
}
