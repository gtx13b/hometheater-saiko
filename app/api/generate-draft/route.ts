import { NextResponse } from 'next/server';
import { GoogleGenAI as AIClient } from '@google/genai';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function fetchOgpImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
      html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i) ||
      html.match(/<meta[^>]+name="og:image"[^>]+content="([^"]+)"/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function downloadAndConvertToWebP(imageUrl: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();
    const destDir = path.join(process.cwd(), 'public', 'images', 'news');
    await fs.mkdir(destDir, { recursive: true });
    const fileName = `${slug}.webp`;
    await fs.writeFile(path.join(destDir, fileName), webpBuffer);
    return `/images/news/${fileName}`;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { url, title, description, source } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY が設定されていません' }, { status: 500 });
    }

    const slug = Date.now().toString();

    const ogpImageUrl = await fetchOgpImage(url);
    let imagePath = '';
    if (ogpImageUrl) {
      imagePath = (await downloadAndConvertToWebP(ogpImageUrl, slug)) || '';
    }

    const ai = new AIClient({ apiKey });

    const systemInstruction = `あなたはホームシアター専門のブログライターです。
ホームシアター愛好家向けに、機器の特徴や魅力を分かりやすく、かつ専門的に解説します。
- 事実に基づいた内容のみを記載し、推測や誇張は避ける
- 製品名・スペック・価格などの具体的な数値はソースにある情報だけを使う
- マークダウン形式で本文を書く
- 読者が製品を実際に検討できる実用的な情報を提供する`;

    const prompt = `以下のニュース情報を元に、ホームシアターブログの記事を日本語で書いてください。

タイトル: ${title}
ソース: ${source}
URL: ${url}
概要: ${description || '（概要なし）'}

必ずJSON形式のみで返してください（マークダウンコードブロック不要）:
{
  "title": "記事タイトル（日本語、魅力的かつ正確に）",
  "description": "SEO用の説明文（80〜120文字）",
  "content": "マークダウン形式の本文（## 見出し付き、300〜500文字程度。事実ベースで書く）",
  "altText": "画像のalt説明（日本語、30文字以内）",
  "maker": "メーカー名（製品情報がある場合のみ。なければ空文字）",
  "equipment": "製品名・型番（製品情報がある場合のみ。なければ空文字）"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { systemInstruction, temperature: 0.65 },
    });

    const rawText = response.text?.trim() || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'AIの応答からJSONを取得できませんでした', raw: rawText },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      title: parsed.title || title,
      description: parsed.description || description || '',
      content: parsed.content || '',
      altText: parsed.altText || title,
      maker: parsed.maker || '',
      equipment: parsed.equipment || '',
      imagePath,
    });
  } catch (err: any) {
    console.error('generate-draft error:', err);
    return NextResponse.json({ error: err.message || '下書き生成に失敗しました' }, { status: 500 });
  }
}
