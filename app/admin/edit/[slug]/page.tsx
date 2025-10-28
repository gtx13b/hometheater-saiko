// app/admin/edit/[slug]/page.tsx

import { getArticleBySlug, FullArticle } from '@/lib/articles';
import EditArticleForm from './edit-article-form'; // クライアントコンポーネントをインポート

// パラメータの型定義
interface EditPageProps {
    params: {
        slug: string;
    }
}

// サーバーコンポーネントとして記事データを取得
export default async function EditPage({ params }: EditPageProps) {
    const article = await getArticleBySlug(params.slug);

    // 記事が見つからない場合のエラー表示
    if (!article) {
        return (
            <div className="max-w-4xl mx-auto p-8 my-10 bg-white shadow-xl rounded-lg text-center">
                <h1 className="text-3xl font-extrabold text-red-600 mb-4">
                    エラー: 記事が見つかりません
                </h1>
                <p className="text-gray-600">
                    指定されたスラッグ ({params.slug}) に一致する記事ファイルが見つかりませんでした。
                </p>
                <a href="/admin/articles" className="mt-6 inline-block text-blue-600 hover:underline">
                    管理一覧に戻る
                </a>
            </div>
        );
    }

    // 記事が見つかった場合、フォームにデータを渡して表示
    return <EditArticleForm initialData={article} />;
}