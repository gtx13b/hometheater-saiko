// app/admin/articles/page.tsx

import { getAllArticles, Article } from '@/lib/articles';
import Link from 'next/link';
import AdminArticleActions from './admin-article-actions'; // 3.で作成

// 記事データを取得し、一覧を表示するサーバーコンポーネント
export default async function AdminArticlesPage() {
  const articles: Article[] = await getAllArticles();

  // 日付順に降順ソートされている前提 (lib/articles.ts で処理済み)

  return (
    <div className="max-w-5xl mx-auto p-8 my-10 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-2">
        📂 記事管理一覧
      </h1>

      {articles.length === 0 ? (
        <p className="text-gray-500">記事がありません。</p>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div 
              key={article.slug} 
              className="flex justify-between items-center p-4 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition duration-150"
            >
              {/* 記事情報 */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold uppercase ${article.category === 'news' ? 'text-red-600' : 'text-blue-600'}`}>
                  {article.category}
                </p>
                <h2 className="text-lg font-bold truncate text-gray-800" title={article.title}>
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  公開日: {article.date} | 作成者: {article.author}
                </p>
              </div>

              {/* 操作ボタン (クライアントコンポーネント) */}
              <div className="flex space-x-2 ml-4 flex-shrink-0">
                <Link
                  href={`/admin/edit/${article.slug}`} // 修正ページへのリンク（後で作成）
                  className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                >
                  修正
                </Link>
                
                {/* 削除アクションコンポーネント */}
                <AdminArticleActions slug={article.slug} title={article.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}