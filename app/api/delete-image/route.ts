import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { imagePath } = await req.json();

    if (!imagePath || !imagePath.startsWith('/images/')) {
      return NextResponse.json({ ok: true });
    }

    const fullPath = path.join(process.cwd(), 'public', imagePath);
    await fs.unlink(fullPath).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
