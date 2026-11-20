import { NextResponse } from 'next/server';
import { recordVisit, getVisits, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  await initDb();
  const data = await getVisits();
  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    const { name, email, institution, avatar_url, auth_provider } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Nama dan email wajib diisi' }, { status: 400 });
    }

    const res = await recordVisit({ name, email, institution, avatar_url, auth_provider });
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
