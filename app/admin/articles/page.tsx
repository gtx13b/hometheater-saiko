
import { getAllArticles, Article } from '@/lib/articles';
import Link from 'next/link';
import AdminArticleActions from './admin-article-actions';
import DeployButton from '@/components/DeployButton';

export default async function AdminArticlesPage() {
  const articles: Article[] = await getAllArticles();

  return (
    <div className="max-w-5xl mx-auto p-8 my-10 bg-white shadow-xl rounded-lg">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-3xl font-extrabold text-gray-800 border-b pb-2 mb-2 sm:mb-0">
          📂 記事管理一覧
        </h1>

        {/* ボタン群 */}
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 w-full sm:w-auto">
          {/* 左端：新規ブログ登録 */}
          <Link
            href="/admin/"
            className="inline-flex items-center justify-center pl-4 pr-4 bg-orange-500 text-white rounded-md"
          >
            新規ブログ登録
          </Link>

          {/* 右端：デプロイボタン */}
          <DeployButton />
        </div>
      </div>

      {/* 記事一覧 */}
      {articles.length === 0 ? (
        <p className="text-gray-500 mt-4">記事がありません。</p>
      ) : (
        <div className="space-y-4 mt-4">
          {articles.map((article) => (
            <div
              key={article.slug}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition duration-150"
            >
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

              <div className="flex space-x-2 ml-4 flex-shrink-0">
                <Link
                  href={`/admin/edit/${article.slug}`}
                  className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                >
                  修正
                </Link>
                <AdminArticleActions slug={article.slug} title={article.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
