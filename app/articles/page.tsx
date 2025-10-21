// app/articles/page.tsx

import Link from 'next/link';
import { getAllArticles, Article } from '@/lib/articles'; 

// 1ページあたりの記事表示件数
const ITEMS_PER_PAGE = 5;

// page.tsx は searchParams を props として受け取れる
export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const articles: Article[] = await getAllArticles();

  // 1. 現在のページ番号を取得 (page=1 をデフォルトとする)
  const currentPage = Number(searchParams.page) || 1;
  
  // 2. 記事データのフィルタリング
  const totalItems = articles.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // 記事配列の開始インデックスと終了インデックスを計算
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  // 現在のページに表示する記事を抽出
  const currentArticles = articles.slice(startIndex, endIndex);

  // 3. ページネーションUIの生成
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 border-b pb-2">
        全記事一覧 (ブログ & ニュース)
      </h1>
      
      {/* 記事リストの表示 (ロジックは変更なし) */}
      {currentArticles.length === 0 ? (
        <p className="text-gray-500">記事が見つかりません。</p>
      ) : (
        <div className="space-y-6">
          {currentArticles.map((article) => (
            <div key={article.slug} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white">
              <Link href={`/${article.category}/${article.slug}`} className="block">
                <p className={`text-xs font-semibold uppercase mb-1 ${article.category === 'news' ? 'text-red-600' : 'text-blue-600'}`}>
                  {article.category === 'news' ? 'ニュース' : 'ブログ'}
                </p>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:underline">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {article.description}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <span className="mr-4">📅 {article.date}</span>
                  <span>✍️ {article.author}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* ページネーションUI */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-2">
          {/* ≪ 前へ ボタン */}
          {currentPage > 1 && (
            <Link 
              href={`/articles?page=${currentPage - 1}`}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              ≪ 前へ
            </Link>
          )}

          {/* ページ番号ボタン */}
          {pageNumbers.map((page) => (
            <Link
              key={page}
              href={`/articles?page=${page}`}
              className={`px-4 py-2 border rounded-lg transition ${
                page === currentPage
                  ? 'bg-blue-600 text-white font-bold border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 border-gray-300'
              }`}
            >
              {page}
            </Link>
          ))}

          {/* 次へ ≫ ボタン */}
          {currentPage < totalPages && (
            <Link 
              href={`/articles?page=${currentPage + 1}`}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              次へ ≫
            </Link>
          )}
        </div>
      )}
    </div>
  );
}