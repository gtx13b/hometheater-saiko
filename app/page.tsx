// app/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
// lib/posts から、フィルタリング関数をインポート
import { getFilteredPostsData } from '../lib/posts'; 

// アイコンをインポート（Lucide Reactを使用）
import { ChevronRight, DollarSign, Speaker, Layout, Rss, Newspaper } from 'lucide-react'; 

// ページのメタデータを設定（SEO対策）
export const metadata: Metadata = {
  title: 'ホームシアター最高！ | 失敗しない機材選び・予算別システム・空間設計の完全ガイド',
  description: '初心者でも最高の感動と没入感を自宅で実現するためのホームシアター総合ガイドサイト。予算、機材、設置のすべてを徹底解説。',
};

// 主要コンテンツのデータ構造
const coreContents = [
  {
    title: '予算別システム構成',
    description: '10万円から150万円まで。あなたの予算で最高の感動を実現するための具体的かつ最適な機材の組み合わせを提案します。',
    href: '/budget-systems',
    icon: DollarSign,
    color: 'border-blue-500 bg-blue-50',
  },
  {
    title: '機材選びの基本ガイド',
    description: '失敗しないプロジェクター、AVアンプ、スピーカーの選び方を徹底解説。スペックの沼にハマらず、最適な機材を見つける知識を提供します。',
    href: '/gear-guide',
    icon: Speaker,
    color: 'border-green-500 bg-green-50',
  },
  {
    title: '設置・空間設計ガイド',
    description: '機材の性能を100%引き出すためのスピーカー配置、視聴距離、遮光、吸音のノウハウ。最高の没入感は「部屋づくり」で決まります。',
    href: '/installation',
    icon: Layout,
    color: 'border-orange-500 bg-orange-50',
  },
];

// ----------------------------------------------------
// 💡 記事データの取得と分類
// ----------------------------------------------------
// このコンポーネントはサーバーコンポーネントとして実行されます
const HomePage = () => {
  // ニュース記事を取得し、最新の3件に制限
  // 'news'カテゴリの記事のみを取得
  const newsPosts = getFilteredPostsData('news').slice(0, 3);
  
  // ブログ記事を取得し、最新の3件に制限
  // 'blog'カテゴリの記事のみを取得
  const blogPosts = getFilteredPostsData('blog').slice(0, 3);

  return (
    <div className="bg-white text-gray-700 min-h-screen">
      
      {/* 1. ヒーローセクション */}
      <div className="relative bg-gray-900 text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            {/* ダミーの背景画像URL。実際にはプロジェクト内のpublicディレクトリに配置してください */}
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/hero_background.webp')" }} role="img" aria-label="暗い部屋に映る大画面のホームシアター" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
          <p className="text-lg font-medium uppercase tracking-widest text-blue-400 mb-3">
            YOUR ULTIMATE HOME THEATER GUIDE
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            最高の「ホームシアター最高！」を、あなたに。
          </h1>
          <p className="text-xl sm:text-2xl font-light text-gray-300 max-w-3xl mx-auto mb-10">
            知識ゼロからでも、失敗せず、予算内で最大の感動を得るための「最適解」だけを提案する総合ガイド。
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/budget-systems" 
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-bold rounded-lg shadow-lg text-gray-900 bg-blue-400 hover:bg-blue-300 transition duration-300"
            >
              まずは予算から始める
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. サイトのコアバリュー（3つの柱） */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
          迷うのは、今日で終わり。3つの柱で失敗を防ぐ
        </h2>

        {/* コアコンテンツへの導線（CTAブロック） */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreContents.map((content, index) => (
            <Link 
              key={index}
              href={content.href}
              className={`group block p-6 border-l-4 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 ${content.color}`}
            >
              <content.icon className="w-10 h-10 text-gray-800 mb-4 transition duration-300 group-hover:scale-105" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {content.title}
              </h3>
              <p className="text-gray-600 mb-4 text-lg">
                {content.description}
              </p>
              <div className="text-blue-600 font-semibold flex items-center">
                記事を読む
                <ChevronRight className="w-4 h-4 ml-1 transition duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. 最新情報セクション (ニュースとブログ) */}
      <div className="bg-gray-50 border-t border-b border-gray-200 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
                最新情報：業界の動向とレビュー
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* 3-1. 業界ニュース (動的データを使用) */}
                <div>
                    <div className="flex items-center mb-6 border-b border-gray-300 pb-2">
                        <Newspaper className="w-6 h-6 text-gray-600 mr-2" />
                        <h3 className="text-2xl font-bold text-gray-900">
                            業界ニュース
                        </h3>
                        {/* ニュース一覧ページへのリンク（仮） */}
                        <Link href="/news" className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                            一覧を見る <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <ul className="space-y-4">
                        {newsPosts.map(item => (
                            <li key={item.slug} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                <Link href={`/news/${item.slug}`} className="group block hover:bg-gray-100 p-2 -mx-2 rounded transition duration-150">
                                    <p className="text-sm text-gray-500 mb-1">{item.date}</p>
                                    <p className="text-lg font-medium text-gray-800 group-hover:text-blue-600 flex items-center">
                                        {item.title}
                                        <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition duration-150" />
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3-2. ブログ・レビュー (動的データを使用) */}
                <div>
                    <div className="flex items-center mb-6 border-b border-gray-300 pb-2">
                        <Rss className="w-6 h-6 text-gray-600 mr-2" />
                        <h3 className="text-2xl font-bold text-gray-900">
                            ブログ・レビュー
                        </h3>
                        {/* ブログ一覧ページへのリンク（仮） */}
                        <Link href="/blog" className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                            一覧を見る <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <ul className="space-y-4">
                        {blogPosts.map(item => (
                            <li key={item.slug} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                <Link href={`/blog/${item.slug}`} className="group block hover:bg-gray-100 p-2 -mx-2 rounded transition duration-150">
                                    <p className="text-sm text-gray-500 mb-1">{item.date}</p>
                                    <p className="text-lg font-medium text-gray-800 group-hover:text-blue-600 flex items-center">
                                        {item.title}
                                        <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition duration-150" />
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </div>

     {/* 4. なぜ「ホームシアター最高！」を選ぶのか (信頼性セクション) */}
      <div className="max-w-4xl mx-auto px-4 py-20 sm:py-24">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          なぜ、このサイトが生まれたのか？
        </h2>
        <div className="space-y-10">
            
            <div className="flex items-start space-x-6">
              <span className="text-4xl font-bold text-blue-500">1</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ユーザーと同じ「ホームシアター愛好家」の目線
                </h3>
                <p className="text-lg text-gray-700">
                  私たちは販売業者でもインストール業者でもありません。ただ純粋に、自宅で映画やゲームの「最高の感動」を追求する一人の愛好家です。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <span className="text-4xl font-bold text-green-500">2</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  失敗談から学ぶ、リアルな情報
                </h3>
                <p className="text-lg text-gray-700">
                  「あの時こうしておけば良かった」という自身の失敗や遠回りの経験に基づき、無駄な出費や後悔を避けるための実践的なアドバイスを提供します。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <span className="text-4xl font-bold text-orange-500">3</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  小さな「最高！」を共有したい
                </h3>
                <p className="text-lg text-gray-700">
                  ホームシアターの魅力は、スペックではなく「体験」です。誰もが手の届く範囲で、日常の中に小さな感動を生み出すヒントを共有することが、このサイトの存在意義です。
                </p>
              </div>
            </div>
        </div>
      </div>

      {/* 5. 記事一覧へのフッターCTA */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center border-t border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          さあ、あなたの理想のシアターを始めましょう。
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          すべての記事とガイドラインは、以下のページからご覧いただけます。
        </p>
        <Link 
          href="/articles" 
          className="inline-flex items-center px-10 py-4 border border-transparent text-xl font-bold rounded-lg shadow-md text-white bg-gray-800 hover:bg-gray-700 transition duration-300"
        >
          全記事一覧を見る
          <ChevronRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

    </div>
  );
};

export default HomePage;
