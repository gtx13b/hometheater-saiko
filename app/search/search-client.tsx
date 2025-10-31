'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/article_data';
import { Tag } from 'lucide-react';

interface SearchClientProps {
  articles: Article[];
  initialQuery: string;
  initialPage?: number;
}

export default function SearchClient({
  articles,
  initialQuery,
  initialPage = 1,
}: SearchClientProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const perPage = 5;
  const totalPages = Math.ceil(articles.length / perPage);

  const pagedArticles = articles.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">記事検索</h1>

      {/* 検索フォーム */}
      <form className="mb-8 flex gap-2" method="get">
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="キーワードを入力..."
          className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          検索
        </button>
      </form>

      {articles.length === 0 ? (
        <p className="text-gray-500">
          {initialQuery ? '該当する記事がありません。' : '検索ワードを入力してください。'}
        </p>
      ) : (
        <>
          <ul className="space-y-6">
            {pagedArticles.map((article) => (
              <li
                key={article.id}
                className="border-b pb-4 flex gap-4 items-center"
              >
                {/* 記事情報 */}
                <div className="flex-1 flex flex-col justify-between">
                  <Link
                    href={`/blog/${article.id}`}
                    className="text-xl font-semibold hover:underline hover:text-blue-500"
                  >
                    {article.title}
                  </Link>

                  <div className="flex items-center gap-2 mt-2 mb-3 text-sm text-gray-500">
  <span>{article.date}</span>

  <div
    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-md ${
      article.category.toLowerCase() === 'news'
        ? 'bg-orange-100 text-orange-700'
        : 'bg-blue-100 text-blue-700'
    }`}
  >
    {/* Tag アイコンを入れる場合 */}
    { <Tag className="w-4 h-4 mr-1.5" /> }
    {article.category}
  </div>
</div>

                  <p className="text-gray-700 text-sm">{article.content}</p>
                </div>

                {/* サムネイル */}
                {article.image && (

                    <Link
                    href={`/blog/${article.id}`}
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      className="hover:opacity-80 flex-shrink-0 w-[180px] h-[130px] flex items-center justify-center overflow-hidden min-w-full min-h-full object-cover rounded-md"
                    />
                    </Link>

                )}
              </li>
            ))}
          </ul>

          {/* ページング */}
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              前へ
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              次へ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
