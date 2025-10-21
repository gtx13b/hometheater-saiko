// lib/articles.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Front Matterの型定義（必要に応じて追加）
export interface Article {
  slug: string;
  title: string;
  date: string;
  category: 'blog' | 'news';
  description: string;
  author: string;
  image: string;
}

const articlesDirectory = path.join(process.cwd(), 'data/blog-articles');

/**
 * すべての記事のメタデータ（Front Matter）を取得する
 * @returns すべての記事のデータを降順（新しい順）でソートした配列
 */
export async function getAllArticles(): Promise<Article[]> {
  // 1. data/blog-articles ディレクトリ内のすべてのファイル名を取得
  const fileNames = await fs.readdir(articlesDirectory);

  // 2. 各ファイルからメタデータ（Front Matter）を抽出
  const allArticlesData = await Promise.all(
    fileNames.map(async (fileName) => {
      // .md 拡張子を取り除き、slug（記事のURLとなる部分）を生成
      const slug = fileName.replace(/\.md$/, '');
      
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, 'utf8');

      // gray-matter を使用して Front Matter をパース
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as Omit<Article, 'slug'>),
      } as Article;
    })
  );

  // 3. 日付（date）に基づいて降順（新しい記事が上）にソート
  return allArticlesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}