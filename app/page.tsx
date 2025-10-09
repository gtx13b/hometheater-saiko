// app/page.tsx


import { Metadata } from 'next';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'ホームシアター最高！ | Home Theater & Home Cinemaのすべて。失敗しない選び方、設置ガイド', 
  description: '初心者から上級者まで、理想のHome Cinemaを構築するための専門サイト。プロジェクター、スピーカー、AVアンプ、設置方法など、Home Theater作りの全行程を徹底解説。',
  keywords: ['ホームシアター', 'Home Theater', 'Home Cinema', 'プロジェクター', '音響', '設置'],
  robots: 'index, follow',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 md:p-12">
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-xl shadow-2xl">
        
        {/* H1タグ：サイト全体テーマの宣言 */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8 border-b-8 border-red-600 pb-4">
          ホームシアターの教科書：理想の空間を実現するための完全ガイド
        </h1>
        
        <p className="text-xl text-gray-700 mb-12 leading-relaxed">
          プロジェクターの選び方から、音響設計、インテリアとの調和まで、あなたのホームシアター作りを徹底サポートします。
        </p>

        {/* サイト内の主要カテゴリへのナビゲーション (SEOに重要) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* リンクはまだ作っていませんが、構造的に重要です */}
            <div className="p-6 bg-red-50 rounded-lg shadow-md hover:shadow-lg transition">
                <h2 className="text-2xl font-bold text-red-700 mb-3">機材選びの基本</h2>
                <p className="text-gray-600">プロジェクター、AVアンプ、スピーカーの予算別・機能別徹底比較。</p>
                <Link href="/category/gear-guide" className="text-red-500 hover:text-red-600 font-medium mt-2 block">
                    詳細を見る &rarr;
                </Link>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition">
                <h2 className="text-2xl font-bold text-blue-700 mb-3">設置・空間設計</h2>
                <p className="text-gray-600">部屋の広さ別レイアウト、配線方法、防音・吸音の専門知識。</p>
                <Link href="/category/installation" className="text-blue-500 hover:text-blue-600 font-medium mt-2 block">
                    詳細を見る &rarr;
                </Link>
            </div>

            <div className="p-6 bg-green-50 rounded-lg shadow-md hover:shadow-lg transition">
                <h2 className="text-2xl font-bold text-green-700 mb-3">予算と失敗談</h2>
                <p className="text-gray-600">初心者向けの総費用シミュレーションと、経験者が語る失敗事例集。</p>
                <Link href="/category/cost-failure" className="text-green-500 hover:text-green-600 font-medium mt-2 block">
                    詳細を見る &rarr;
                </Link>
            </div>

        </div>
        
        {/* ... (その他のコンテンツ) ... */}
      </div>
    </main>
  );
}