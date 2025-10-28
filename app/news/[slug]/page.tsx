// app/news/[slug]/page.tsx の修正後の全文

// @ts-nocheck 

import { getPostData, getAllPostSlugs, PostData } from '../../../lib/posts';
import Markdown from 'react-markdown';
import { Metadata } from 'next';
import Link from 'next/link';
// next/image はそのまま使用
import Image from 'next/image';
import rehypeRaw from 'rehype-raw';
import React from 'react';

// アイコンをインポート
import { Calendar, User, ArrowLeft, Tag, ChevronRight, Edit } from 'lucide-react'; // ★Editアイコンを追加

// Tailwind CSSのTypographyプラグイン相当のスタイルをカスタムで定義
const markdownContainerClasses = `
  markdown-content 
  prose prose-xl 
  prose-h2:border-b-4 prose-h2:border-blue-500/50 prose-h2:pb-2 prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-gray-900 
  prose-h2:text-3xl
  prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-gray-800
  prose-p:leading-relaxed prose-p:my-6
  prose-a:text-blue-600 prose-a:font-medium prose-a:underline 
  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-3
  prose-li:my-2
  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:rounded-r-lg
  prose-blockquote:bg-gray-50 prose-blockquote:py-3
  prose-blockquote:text-xs prose-blockquote:text-gray-700 prose-blockquote:italic
`;

// Markdownコンポーネントのカスタマイズ
const customRenderers = {
  // Pタグのカスタマイズ
  p: ({ children }: { children: React.ReactNode }) => {
    const textContent = React.Children.toArray(children).map(c =>
      typeof c === 'string' ? c : ''
    ).join('');
    const isSource = textContent.startsWith('参照元：');

    if (isSource) {
      return (
        <p className="text-xs text-gray-500 my-4 leading-relaxed text-right">
          {children}
        </p>
      );
    }

    // 通常の段落は prose のまま
    return <p className="text-xl text-gray-700 my-6 leading-relaxed">{children}</p>;
  },

  // H2
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl font-bold border-b-4 border-blue-500/50 pb-2 mt-12 mb-6 text-gray-900">{children}</h2>
  ),

  // H3
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-2xl font-bold mt-10 mb-4 text-gray-800">{children}</h3>
  ),

  // H4
  h4: ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-xl font-bold mt-8 mb-4 px-4 py-3 bg-gray-100 border-l-4 border-blue-500 text-gray-800 rounded-r-lg">
      {children}
    </h4>
  ),

  // H5
  h5: ({ children }: { children: React.ReactNode }) => (
    <h5 className="text-lg font-semibold mt-6 mb-3 text-gray-800 underline decoration-double decoration-gray-500 underline-offset-6">
  {children}
</h5>
  ),

  // OL（番号付きリスト）のレンダラー
  ol: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <ol className={`list-decimal pl-8 my-6 space-y-3 ${className || 'text-gray-700'}`}>
      {children}
    </ol>
  ),

  // UL（箇条書き）のレンダラーはそのまま
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc pl-8 my-6 space-y-3 text-lg text-gray-700">{children}</ul>
  ),

  // LI（リスト項目）共通
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="my-2">{children}</li>
  ),

  // blockquote（引用）
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="my-8 p-4 border-l-4 border-blue-600 bg-blue-50 italic text-xs text-gray-700 rounded-r-lg">
      {children}
    </blockquote>
  ),

  // 🔥 画像レンダラーの補完
  img: (props: { alt?: string; src?: string }) => {
    if (!props.src) return null;

    // Next.jsのImageコンポーネントを使用する場合、widthとheightが必要です。
    // 仮の値を設定し、layout="responsive" (Next.js 13以降では非推奨ですが、ここではサイズ設定のために使用)
    const width = 1200; 
    const height = 675; // 16:9 の比率

    return (
      // <figure> タグで画像をラップ
      <figure className="flex flex-col items-center max-w-3xl mx-auto">
        <div className="overflow-hidden rounded-xl shadow-xl w-full">
            <Image
              src={props.src}
              alt={props.alt || '記事画像'}
              width={width}
              height={height}
              layout="responsive" 
              objectFit="cover"
              className="w-full h-auto"
            />
        </div>
        
        {/* alt属性があれば <figcaption> として表示 */}
        {props.alt && (
          <figcaption className="text-center text-sm text-gray-600 mt-3 p-3 max-w-full w-full rounded-b-lg">
            {props.alt}
          </figcaption>
        )}
      </figure>
    );
  },
};


// サーバーコンポーネントで動的なメタデータを生成
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const postData = await getPostData(params.slug);
  
  if (!postData) {
    return {
      title: '記事が見つかりません',
    };
  }
  
  return {
    title: postData.title,
    description: `ホームシアターに関する記事: ${postData.title} by ${postData.author}`,
  };
}

// ページコンポーネント
export default async function Post({ params }: { params: { slug: string } }) {
  const postData: (PostData & { content: string }) | null = await getPostData(params.slug);
  
  if (!postData) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800">記事が見つかりませんでした</h1>
      </div>
    );
  }

  // カテゴリ名を日本語に変換
  const categoryName = postData.category === 'news' ? '業界ニュース' : 'ブログ・レビュー';

  // ★ 開発環境判定
  const isDevelopment = process.env.NODE_ENV === 'development';
  // 編集ページへのリンク
  const editLink = `/admin/edit/${postData.slug}`;


  return (
    <div className="bg-white min-h-screen">
      <main className="pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 戻るボタンと編集ボタンのコンテナ (flexで左右に配置) */}
          <div className="flex justify-between items-center mb-8">
            {/* 戻るボタン */}
            <Link href="/news" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-150 font-medium">
              <ArrowLeft className="w-5 h-5 mr-1" />
              ニュース一覧に戻る
            </Link>

            {/* ★ 編集ボタンの追加 (開発環境のみ) ★ */}
            {isDevelopment && (
              <Link
                href={editLink}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-full shadow-lg text-white bg-red-500 hover:bg-red-600 transition duration-300 transform hover:scale-105"
                title="開発環境: 記事編集ページへ"
              >
                <Edit className="w-4 h-4 mr-2" />
                記事を編集
              </Link>
            )}
            {/* ★ 編集ボタンの追加ここまで ★ */}
          </div>

          {/* 記事ヘッダー（タイトルとメタ情報） */}
          <header className="border-b border-gray-200 pb-8 mb-12">
            
            {/* カテゴリタグ */}
            <div className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full mb-4 
              ${postData.category === 'news' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
              <Tag className="w-4 h-4 mr-1.5" />
              {categoryName}
            </div>

            {/* 記事タイトル */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              {postData.title}
            </h1>

            {/* 著者・日付情報 */}
            <div className="flex flex-wrap items-center space-x-6 text-1xl text-gray-500">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                <span className="font-medium text-gray-700">{postData.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                <span>{postData.date}</span>
              </div>
            </div>
          </header>

          {/* 記事本文 */}
          <article className="max-w-3xl mx-auto">
            {/* Markdown表示部分にカスタムスタイルを適用 */}
            <div className={markdownContainerClasses}>
              <Markdown 
                components={customRenderers as any} 
                rehypePlugins={[rehypeRaw]} 
              >
                {postData.content}
              </Markdown>
            </div>
          </article>
        </div>
      </main>

      {/* フッターCTA */}
      <footer className="bg-gray-800 text-white text-center py-12">
        <h3 className="text-2xl font-bold mb-4">ホームシアターの次のステップへ</h3>
        <Link 
          href="/budget-systems" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-bold rounded-lg shadow-md text-gray-900 bg-blue-400 hover:bg-blue-300 transition duration-300"
        >
          予算別ガイドをチェック
          <ChevronRight className="w-5 h-5 ml-2" />
        </Link>
      </footer>
    </div>
  );
}

// 動的なルーティングに必要な全てのslugを生成
export async function generateStaticParams() {
  const allSlugs = getAllPostSlugs();
  
  // ★ ニュース記事のみをフィルタリングします
  const newsSlugs = allSlugs
    .filter(post => post.category && post.category.toLowerCase() === 'news')
    .map(post => ({ slug: post.slug }));

  return newsSlugs;
}
