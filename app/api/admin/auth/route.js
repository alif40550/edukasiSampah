import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'admin';

    if (username === expectedUser && password === expectedPass) {
      const response = NextResponse.json({ success: true, message: 'Login berhasil' });
      
      response.cookies.set({
        name: 'admin_session',
        value: process.env.ADMIN_SECRET_TOKEN || 'kampoengradja_admin_token_2026',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 jam
        sameSite: 'lax',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Username atau password admin salah!' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const cookie = request.cookies.get('admin_session');
  const validToken = process.env.ADMIN_SECRET_TOKEN || 'kampoengradja_admin_token_2026';

  if (cookie && cookie.value === validToken) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logout berhasil' });
  response.cookies.delete('admin_session');
  return response;
}
