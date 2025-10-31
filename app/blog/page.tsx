// app/blog/page.tsx

import Link from 'next/link';
import { getSortedPostsData, PostData } from '@/lib/posts'; 

export const dynamic = 'force-dynamic';

function getBlogPosts() {
  const allPosts = getSortedPostsData();
  return allPosts.filter(post => post.category.toLowerCase() !== 'news');
}

const BlogCard = ({ post }: { post: PostData }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // ✅ 代替画像を安全に設定
  const defaultImageUrl = '/images/default-blog-image.webp';
  const imageUrl =
    post.image && post.image.trim() !== '' && post.image.toLowerCase() !== 'none'
      ? post.image
      : defaultImageUrl;

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
          {/* カテゴリータグ */}
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

export default function BlogPage() {
  const blogPosts = getBlogPosts();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight">
            ホームシアター ガイド & レビュー
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            初心者向けガイドから詳細な製品レビューまで。最適なシステム選びに役立つ記事をご覧ください。
          </p>
        </header>

        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
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
