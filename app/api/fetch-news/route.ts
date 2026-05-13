import { NextResponse } from 'next/server';

function normalizeText(text: string): string {
  return text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
  );
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
}

const RSS_SOURCES = [
  { url: 'https://av.watch.impress.co.jp/data/rss/1.0/avw/feed.rdf', name: 'AV Watch' },
  { url: 'https://www.phileweb.com/rss.php', name: 'Phile-web' },
];

const HT_KEYWORDS = [
  'プロジェクター', 'スクリーン', 'AVアンプ', 'サラウンド', 'ホームシアター',
  'HDMI', '4K', '8K', 'HDR', 'Dolby', 'Atmos', 'DTS', 'OLED',
  'ウーファー', 'サブウーファー', 'シアターシステム', 'サウンドバー',
  'レシーバー', 'フロントスピーカー', 'センタースピーカー', 'トールボーイ',
  '超短焦点', 'レーザープロジェクター', 'ネットワークプレーヤー',
  'BDプレーヤー', 'ブルーレイプレーヤー', 'ビデオプロセッサー',
  'ホームシアタースピーカー', 'フロアスタンディング',
];

const EXCLUDE_KEYWORDS = [
  'BDソフト', 'Blu-rayソフト', 'ブルーレイソフト', '4Kソフト', 'UHD-BD',
  'Netflix', 'Amazon Prime', 'Amazon Music', 'Disney+', 'Hulu', 'DAZN',
  '配信', 'ストリーミング',
  'TOHOシネマズ', 'シネマズ', '映画館', 'IMAX', '映画祭',
  'Bluetoothスピーカー', 'モバイルスピーカー', 'ポータブルスピーカー',
  'ワイヤレスイヤホン', 'イヤホン', 'ヘッドホン', 'ヘッドフォン',
  'DAC', 'ヘッドホンアンプ',
  'スマートフォン', 'スマホ', 'iPhone', 'Android',
  'カメラ', 'レンズ', '視聴会', '展示会', 'まとめ',
];

interface NewsItem {
  title: string;
  url: string;
  description: string;
  date: string;
  source: string;
}

function parseItems(xml: string, sourceName: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemPattern.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const link =
      extractTag(block, 'link') ||
      (block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? '') ||
      (block.match(/<guid[^>]*>([^<]+)<\/guid>/i)?.[1] ?? '');
    const description = extractTag(block, 'description');
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'dc:date');

    if (!title || !link) continue;

    const normalized = normalizeText(title + ' ' + description);
    const hasHT = HT_KEYWORDS.some((kw) => normalized.includes(normalizeText(kw)));
    if (!hasHT) continue;
    const hasExclude = EXCLUDE_KEYWORDS.some((kw) => normalized.includes(normalizeText(kw)));
    if (hasExclude) continue;

    let dateStr = '';
    if (pubDate) {
      try {
        dateStr = new Date(pubDate).toISOString().split('T')[0];
      } catch {
        dateStr = pubDate.substring(0, 10);
      }
    }

    items.push({ title, url: link, description, date: dateStr, source: sourceName });
  }
  return items;
}

export async function GET() {
  try {
    const allItems: NewsItem[] = [];
    const seen = new Set<string>();

    for (const source of RSS_SOURCES) {
      try {
        const res = await fetch(source.url, {
          signal: AbortSignal.timeout(10000),
          headers: { 'User-Agent': 'Mozilla/5.0 HomeTheater RSS Reader' },
        });
        if (!res.ok) continue;
        const xml = await res.text();
        const items = parseItems(xml, source.name);
        for (const item of items) {
          if (!seen.has(item.url)) {
            seen.add(item.url);
            allItems.push(item);
          }
        }
      } catch (err) {
        console.error(`${source.name} fetch error:`, err);
      }
    }

    allItems.sort((a, b) => (b.date > a.date ? 1 : -1));
    return NextResponse.json({ items: allItems });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
