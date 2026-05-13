import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const {
      title, date, category, author, description, content,
      imagePath, imageUrl, imageLinkName, altText, maker, equipment,
    } = await req.json();

    if (!title || !date || !content || !category) {
      return NextResponse.json({ error: '必須フィールドが不足しています' }, { status: 400 });
    }

    const esc = (s: string) => (s || '').replace(/"/g, '\\"');
    const slug = Date.now().toString();
    const dataDir = path.join(process.cwd(), 'data/blog-articles');
    await fs.mkdir(dataDir, { recursive: true });

    const refValue = imageUrl ? `${imageUrl}|${imageLinkName || ''}` : '';
    const refLine = refValue ? `\n参照: "${esc(refValue)}"` : '';
    const makerLine = maker ? `\nmaker: "${esc(maker)}"` : '';
    const equipLine = equipment ? `\nequipment: "${esc(equipment)}"` : '';

    const frontMatter = `---
title: "${esc(title)}"
date: "${date}"
description: "${esc(description || '')}"
author: "${esc(author || 'シアターマイスター')}"
category: "${category}"
image: "${imagePath || 'none'}"${refLine}${makerLine}${equipLine}
alt: "${esc(altText || '')}"
---

${content.trim()}`;

    await fs.writeFile(path.join(dataDir, `${slug}.md`), frontMatter, 'utf8');

    return NextResponse.json({ message: '保存しました', slug });
  } catch (err: any) {
    console.error('save-draft error:', err);
    return NextResponse.json({ error: err.message || '保存に失敗しました' }, { status: 500 });
  }
}
