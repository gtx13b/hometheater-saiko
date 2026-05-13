import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dirPath = path.join(process.cwd(), 'data', 'blog-articles');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get('id');

    if (!fs.existsSync(dirPath)) return NextResponse.json([]);

    if (rawId) {
      const id = decodeURIComponent(decodeURIComponent(rawId));
      const filePath = path.join(dirPath, id);
      if (!fs.existsSync(filePath)) return NextResponse.json({ message: 'Not Found' }, { status: 404 });

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: fm, content } = matter(fileContent);

      let imageUrl = '';
      let imageLinkName = '';
      const ref: string = fm['参照'] || '';
      if (ref) {
        const parts = ref.split('|');
        imageUrl = parts[0] || '';
        imageLinkName = parts[1] || '';
      }

      return NextResponse.json({
        title: fm.title || '',
        date: fm.date || '',
        category: fm.category || '',
        author: fm.author || '',
        description: fm.description || '',
        image: fm.image || '',
        imageUrl,
        imageLinkName,
        altText: fm.alt || '',
        maker: fm.maker || '',
        equipment: fm.equipment || '',
        content: content.trim(),
      });
    }

    const files = fs.readdirSync(dirPath);
    const articles = files.map((fileName) => {
      const filePath = path.join(dirPath, fileName);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const titleLine = lines.find(l => l.includes('title:'));
      const dateLine = lines.find(l => l.includes('date:'));
      
      return {
        id: fileName,
        title: titleLine ? titleLine.replace('title:', '').trim() : fileName,
        date: dateLine ? dateLine.replace('date:', '').trim() : '不明',
      };
    });

    // 数値として比較して降順（新しい順）に並べ替え
    return NextResponse.json(
      articles.sort((a, b) => {
        const aNum = parseFloat(a.id) || 0;
        const bNum = parseFloat(b.id) || 0;
        return bNum - aNum;
      })
    );
  } catch (error) {
    return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    const fileName = `${Date.now()}.md`; 
    const filePath = path.join(dirPath, fileName);
    const fileContent = `---\ntitle: ${title}\ndate: ${new Date().toISOString().split('T')[0]}\n---\n\n${content}`;
    fs.writeFileSync(filePath, fileContent, 'utf8');
    return NextResponse.json({ message: '保存成功' });
  } catch (error) {
    return NextResponse.json({ message: '保存失敗' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, content } = await request.json();
    const decodedId = decodeURIComponent(id);
    const filePath = path.join(dirPath, decodedId);
    if (!fs.existsSync(filePath)) return NextResponse.json({ message: 'File not found' }, { status: 404 });
    const fileContent = `---\ntitle: ${title}\ndate: ${new Date().toISOString().split('T')[0]}\n---\n\n${content}`;
    fs.writeFileSync(filePath, fileContent, 'utf8');
    return NextResponse.json({ message: '更新成功' });
  } catch (error) {
    return NextResponse.json({ message: '更新失敗' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const decodedId = decodeURIComponent(id);
    const filePath = path.join(dirPath, decodedId);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return NextResponse.json({ message: '削除成功' });
  } catch (error) {
    return NextResponse.json({ message: '削除失敗' }, { status: 500 });
  }
}