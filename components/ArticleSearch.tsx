"use client";

import React, { useState, useMemo } from 'react';

// 記事データの型定義
interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
}

// ダミー記事データ（実際はAPIから取得します）
const DUMMY_ARTICLES: Article[] = [
  { id: 1, title: 'はじめてのホームシアター：予算別おすすめ構成', content: '入門者向けに5万円、10万円、20万円の予算別で最適なホームシアターシステムを解説します。プロジェクターとテレビどちらを選ぶべきかのポイントも紹介。', category: 'おすすめ構成', date: '2024-10-01' },
  { id: 2, title: 'Dolby Atmosの基本と最適なスピーカー配置', content: '立体音響技術Dolby Atmosの仕組みを分かりやすく解説。7.1.4chや5.1.2chといったスピーカーの配置図と設置のコツを徹底ガイドします。', category: '設置・空間設計', date: '2024-10-15' },
  { id: 3, title: '【レビュー】最新4Kプロジェクター徹底比較', content: '2024年に発売された主要な4Kプロジェクター3機種の明るさ、コントラスト、遅延速度を比較し、ゲームや映画鑑賞に最適なモデルを評価します。', category: '機材選びの基本', date: '2024-11-03' },
  { id: 4, title: 'リビングを映画館にするための防音と遮光のテクニック', content: '隣室や屋外への音漏れを防ぐための簡単な防音対策と、映画鑑賞に最適な暗さを作り出すための遮光カーテンの選び方を解説します。', category: '設置・空間設計', date: '2024-11-20' },
  { id: 5, title: 'HDMI 2.1とは？AVアンプ選びで失敗しないために', content: '次世代規格HDMI 2.1の機能（4K/120Hz、VRRなど）を解説し、最新のゲーム機やPCを接続する際に必要なAVアンプの選び方を説明します。', category: '機材選びの基本', date: '2024-12-05' },
];

/**
 * 検索キーワードに一致したテキストをハイライト表示するコンポーネント
 * @param text 処理対象のテキスト
 * @param query 検索キーワード
 */
const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query || query.trim() === '') return <span>{text}</span>;

  // 大文字・小文字を区別しない正規表現を作成
  const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-300 rounded px-0.5 font-semibold text-gray-900">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

const ArticleSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // 検索ロジック: queryに基づいて記事をフィルタリング
  const searchResults = useMemo(() => {
    if (!query || query.trim() === '') {
      return DUMMY_ARTICLES; // キーワードがない場合は全件表示（または空にしても良い）
    }

    const lowerCaseQuery = query.toLowerCase().trim();
    
    // 検索処理
    return DUMMY_ARTICLES.filter(article =>
      // タイトルまたは内容がキーワードを含むかチェック
      article.title.toLowerCase().includes(lowerCaseQuery) ||
      article.content.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query]); // queryが変更されたときにのみ再計算

  // 検索ボタン押下時の処理（ここではqueryのstate更新に任せるため、主にローディング表現用）
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // 実際の検索APIを呼ぶ代わりに、0.5秒の遅延で結果を表示する
    setTimeout(() => {
      setIsSearching(false);
      // setQuery(query); // queryはinputで更新済み
    }, 500);
  };

  const resultsCount = searchResults.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-extrabold text-gray-900 border-b-4 border-gray-900 pb-2">記事検索</h2>

        {/* 検索フォーム */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <input
            type="search"
            placeholder="プロジェクター、Dolby Atmos、防音など..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow text-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white text-lg p-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-150 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            disabled={isSearching || query.trim() === ''}
          >
            {isSearching ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>検索中...</span>
              </>
            ) : (
              <span>検索</span>
            )}
          </button>
        </form>

        {/* 検索結果の表示 */}
        <div className="pt-4">
          <p className="text-xl font-medium text-gray-700 mb-6">
            「<span className="text-indigo-600 font-bold">{query || 'すべて'}</span>」の検索結果: <span className="font-bold">{resultsCount}件</span>
          </p>

          <div className="space-y-6">
            {isSearching ? (
              <div className="text-center p-12 bg-white rounded-xl shadow-md text-gray-500 text-lg">
                検索結果を読み込み中...
              </div>
            ) : resultsCount > 0 ? (
              searchResults.map(article => (
                <div key={article.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
                  <a href={`/articles/${article.id}`} onClick={(e) => { e.preventDefault(); console.log(`Navigating to article ${article.id}`); }} className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg -m-2 p-2">
                    <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{article.category}</span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-2">
                      <HighlightedText text={article.title} query={query} />
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      <HighlightedText text={article.content} query={query} />
                    </p>
                    <div className="mt-3 text-sm text-gray-400">
                      公開日: {article.date}
                    </div>
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center p-12 bg-white rounded-xl shadow-md">
                <p className="text-xl font-semibold text-gray-500">
                  お探しの記事は見つかりませんでした。
                </p>
                <p className="mt-2 text-gray-400">
                  別のキーワードをお試しいただくか、カテゴリーをご確認ください。
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArticleSearch;
