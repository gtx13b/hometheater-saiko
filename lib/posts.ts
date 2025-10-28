// lib/posts.ts

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'data/blog-articles');

export type PostCategory = "blog" | "news";

export interface PostData {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: PostCategory; 
  image?: string; // オプションとして追加
}

// ----------------------------------------------------
// 1. 全てのファイル名 (slug) を取得する関数 (ルーティング用)
// ----------------------------------------------------
export function getAllPostSlugs(): string[] {
    const fileNames = fs.readdirSync(postsDirectory);
    // 拡張子 .md を取り除いたファイル名を返す
    return fileNames.map(fileName => fileName.replace(/\.md$/, ''));
}


// ----------------------------------------------------
// 2. 全ての記事データ (メタ情報のみ) を取得する関数
// ----------------------------------------------------
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    // 日付ソート用のプロパティを追加
    const dateSortable = new Date(matterResult.data.date).getTime();

    return {
      slug,
      title: matterResult.data.title,
      date: matterResult.data.date,
      author: matterResult.data.author,
      category: matterResult.data.category || 'blog', 
      image: matterResult.data.image || '',
      dateSortable, 
    } as unknown as PostData & { dateSortable: number };
  });

  // 日付でソートする（新しい順）
  return (allPostsData as (PostData & { dateSortable: number })[])
    .sort((a, b) => b.dateSortable - a.dateSortable)
    .map(({ dateSortable, ...rest }) => rest);
}

// ----------------------------------------------------
// 3. カテゴリでフィルタリングする関数
// ----------------------------------------------------
export function getFilteredPostsData(category: PostCategory): PostData[] {
    const allPosts = getSortedPostsData();
    return allPosts.filter(post => post.category === category);
}

// ----------------------------------------------------
// 4. 単一の記事データ (メタ情報 + 本文) を取得する関数
// ----------------------------------------------------
export async function getPostData(slug: string): Promise<(PostData & { content: string }) | null> {
    
    let decodedSlug = slug;
    
    // 🔥 修正箇所: URLエンコードされたslugをデコードする
    try {
        decodedSlug = decodeURIComponent(slug);
    } catch (e) {
        // デコードに失敗した場合は、元のslugを使用する
        console.warn(`Slug decoding failed for: ${slug}`);
    }

    // デコードされたslugを使ってファイルパスを構築
    const fullPath = path.join(postsDirectory, `${decodedSlug}.md`); 
    
    // ファイルが存在しない場合の処理
    if (!fs.existsSync(fullPath)) {
        // デバッグ用: 見つからなかったパスをログに出力
        console.error(`Post not found at path: ${fullPath}`);
        // さらに、元のエンコードされたslugでファイルを探す保険も可能
        if (decodedSlug !== slug) {
             const originalPath = path.join(postsDirectory, `${slug}.md`);
             if (fs.existsSync(originalPath)) {
                 // まれにデコード不要な環境もあるため、元のslugで再度試みる
                 return await getPostData(slug); // 再帰呼び出しで元のslugで処理
             }
        }
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // gray-matterを使ってフロントマターと本文を解析
    const matterResult = matter(fileContents);

    return {
        // 戻り値のslugはデコードされたものを使用することが一般的
        slug: decodedSlug, 
        title: matterResult.data.title,
        // ... (他のプロパティは変更なし)
        date: matterResult.data.date,
        author: matterResult.data.author,
        category: matterResult.data.category || 'blog',
        image: matterResult.data.image || '',
        content: matterResult.content,
    } as PostData & { content: string };
}