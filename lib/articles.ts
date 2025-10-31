// lib/articles.ts の修正後の全文

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Front Matterの型定義（既存のもの + maker, equipment）
export interface Article {
  slug: string;
  title: string;
  date: string;
  category: 'blog' | 'news';
  description: string;
  author: string;
  image: string; // Front Matter内の image: の値
    // 🔥 NEW: makerとequipmentを追加 (Front Matterから読み込むデータ)
    maker?: string;      // メーカー名 (省略可能)
    equipment?: string;  // 機材カテゴリー (省略可能)
}

// 🔥 修正点A: FullArticle に maker と equipment を追加
export interface FullArticle extends Article {
    content: string; // 本文
    imageUrl: string; // 参照URL
    imageLinkName: string; // リンク名
    alt: string; // 代替テキストのキーを 'alt' に統一
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

      // data.maker や data.equipment は string | undefined になるため、
      // Article 型にキャストしてもエラーは出ない。
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

// -----------------------------------------------------
// 🔥 修正点B: 単一の記事をslugから取得する関数 (maker/equipment キーの読み込み)
// -----------------------------------------------------
export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    try {
        const fullPath = path.join(articlesDirectory, `${slug}.md`);
        const fileContents = await fs.readFile(fullPath, 'utf8');

        // gray-matter で Front Matter と Content を同時にパース
        const { data, content } = matter(fileContents);

        let imageUrl = '';
        let imageLinkName = '';
        
        // 記事登録APIで保存した参照情報（例: 'https://example.com|Example Site'）をパース
        const reference = data.参照 as string | undefined;
        if (reference) {
            const parts = reference.split('|');
            imageUrl = parts[0] || '';
            imageLinkName = parts[1] || '';
        }

        // 必須プロパティとcontentを結合してFullArticleのオブジェクトを生成
        return {
            slug: slug,
            content: content,
            imageUrl: imageUrl,
            imageLinkName: imageLinkName,
            
            alt: (data.alt as string) || '',

            // 🔥 NEW: makerとequipmentをデータから取得
            maker: (data.maker as string) || '',
            equipment: (data.equipment as string) || '',

            // Front Matterのプロパティを明示的に指定してキャストし、
            // 欠落を防ぎ、型を確定させる
            title: data.title as string,
            date: data.date as string,
            category: data.category as 'blog' | 'news',
            description: data.description as string,
            author: data.author as string,
            image: data.image as string,

        } as FullArticle; // FullArticleとして型を確定

    } catch (error: any) {
        // ファイルが見つからない場合など
        if (error.code === 'ENOENT') {
            return null; 
        }
        throw error;
    }
}