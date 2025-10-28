// app/blog/page.tsx

import Link from 'next/link';
// getSortedPostsData と PostData の定義をインポート
import { getSortedPostsData, PostData } from '@/lib/posts'; 

// ===================================================
// 💡 修正箇所: キャッシュを無効化する設定を追記
// このページ（および依存データ）のキャッシュ時間を0秒に設定し、
// デプロイ時に必ず最新のファイルを読み込むように強制します。
export const dynamic = 'force-dynamic';
// ===================================================

/**
 * ニュース以外のブログ記事のみをフィルタリングする関数
 */
function getBlogPosts() {
  const allPosts = getSortedPostsData();
  // categoryが'news'ではない記事のみを抽出
  return allPosts.filter(post => post.category.toLowerCase() !== 'news');
}

/**
 * 個々の記事カードコンポーネント (Tailwind CSSを使用)
 */
const BlogCard = ({ post }: { post: PostData }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // 代替画像のURLを定義（publicディレクトリを参照）
  const defaultImageUrl = '/images/default-blog-image.webp'; 
  // 画像パスが falsy な場合に代替画像を使用する
  const imageUrl = (post.image && post.image.trim() !== '') ? post.image : defaultImageUrl;

  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
      style={{ minHeight: '400px' }} 
    >
      {/* 記事画像 */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* コンテンツエリア */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-3 text-sm">
          {/* カテゴリータグ (ニュースとは色を変えて区別) */}
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          {/* 日付 */}
          <time dateTime={post.date} className="text-gray-500">
            {formattedDate}
          </time>
        </div>
        
        {/* 記事タイトル */}
        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h2>
        
        {/* 著者情報 */}
        <p className="text-sm text-gray-600">
          著者: {post.author || 'シアターマイスター'}
        </p>
      </div>
    </Link>
  );
};

/**
 * ブログ一覧ページコンポーネント
 */
export default function BlogPage() {
  // 修正後の関数を呼び出し、ブログ記事のみを取得
  const blogPosts = getBlogPosts();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ヘッダーセクション：ガイド・レビュー特化 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight">
            ホームシアター ガイド & レビュー
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            初心者向けガイドから詳細な製品レビューまで。最適なシステム選びに役立つ記事をご覧ください。
          </p>
        </header>

        {/* 記事グリッド */}
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          // 記事がない場合のメッセージ
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <p className="text-2xl font-semibold text-gray-700">
              現在、公開されているガイド・レビュー記事はありません。
            </p>
            <p className="mt-2 text-gray-500">
              新しい記事が公開されるのをお待ちください。
            </p>
          </div>
        )}

      </div>
    </main>
  );
}