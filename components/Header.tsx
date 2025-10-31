"use client";

// import Link from 'next/link'; // Next.jsのLinkを削除
// 必要なフックとルーター、アイコンをインポート
import React, { useState, useRef, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Next.jsのuseRouterを削除
import { Search, X } from 'lucide-react'; // 検索と閉じるアイコン

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 検索モーダルの表示状態
  const [searchQuery, setSearchQuery] = useState(""); // 検索クエリ
  // const router = useRouter(); // routerを削除
  const inputRef = useRef<HTMLInputElement>(null); // 検索入力への参照

  const closeMenu = () => setIsOpen(false);
  const closeSearch = () => setIsSearchOpen(false);

  const HEADER_HEIGHT_PX = 64;

  // 検索モーダルが開いたら入力フィールドにフォーカス
  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // 検索フォームの送信処理
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      closeSearch(); // モーダルを閉じる
      closeMenu(); // モバイルメニューも閉じる
      // 検索結果ページへ遷移（例: /search?q=検索語）
      // router.pushからwindow.location.hrefに変更
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchQuery(""); // クエリをリセット
    }
  };

  return (
    // 背景を白に、下線もグレーに変更
    <header className="bg-white p-4 shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* 💡 ロゴエリア */}
        {/* Linkをaタグに変更 */}
        <a
          href="/"
          className="inline-flex items-center group relative overflow-hidden z-20"
          onClick={closeMenu}
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 transition duration-300 group-hover:text-gray-700">
            <span className="font-extrabold">
              ホームシアター最高！
            </span>
          </h1>
        </a>
        
        {/* --- 右側の要素 (ナビゲーション、検索、ハンバーガー) --- */}
        <div className="flex items-center space-x-2 sm:space-x-4"> {/* アイコン間のスペースを調整 */}

          {/* 1. デスクトップ用ナビゲーション */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Linkをaタグに変更 */}
            <a
              href="/about"
              className="text-gray-600 text-lg hover:text-gray-900 transition duration-300 font-medium relative group"
            >
              このサイトについて
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
            {/* Linkをaタグに変更 */}
            <a
              href="/gear-guide"
              className="text-gray-600 text-lg hover:text-gray-900 transition duration-300 font-medium relative group"
            >
              機材選びの基本
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
            {/* Linkをaタグに変更 */}
            <a
              href="/budget-systems"
              className="text-gray-600 text-lg hover:text-gray-900 transition duration-300 font-medium relative group"
            >
              おすすめ構成
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
            {/* Linkをaタグに変更 */}
            <a
              href="/installation"
              className="text-gray-600 text-lg hover:text-gray-900 transition duration-300 font-medium relative group"
            >
              設置・空間設計
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
          </div>

          {/* ★★★ 検索アイコン (デスクトップ・モバイル共通) ★★★ */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-gray-600 hover:text-gray-900 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
            aria-label="記事を検索する"
          >
            <Search className="w-6 h-6" />
          </button>

          {/* 2. モバイル用ハンバーガーボタン */}
          <button
            // ボタンとアイコンの色を黒系に変更
            className="md:hidden text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition z-20 relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col justify-around w-6 h-6">
              <span
                className={`block h-0.5 w-full bg-gray-800 transform transition duration-300 ease-in-out ${
                  isOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-gray-800 transition duration-300 ease-in-out ${
                  isOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-gray-800 transform transition duration-300 ease-in-out ${
                  isOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </div>
          </button>
        </div> {/* --- 右側の要素ここまで --- */}
      </nav>

      {/* 3. モバイルメニュー本体 */}
      <nav
        className={`
          md:hidden
          absolute top-[${HEADER_HEIGHT_PX}px] left-0 w-full bg-white shadow-lg z-10
          transform transition-all duration-300 ease-in-out
          
          ${
            isOpen
              ? 'translate-y-0 opacity-100 h-auto'
              : '-translate-y-4 opacity-0 h-0 overflow-hidden'
          }
        `}
        aria-hidden={!isOpen}
      >
        {/* モバイルメニューのリンク */}
        {/* Linkをaタグに変更 */}
        <a
          href="/"
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          ホーム
        </a>
        {/* Linkをaタグに変更 */}
        <a
          href="/about"
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          このサイトについて
        </a>
        {/* Linkをaタグに変更 */}
        <a
          href="/gear-guide"
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          機材選びの基本
        </a>
        {/* Linkをaタグに変更 */}
        <a
          href="/budget-systems"
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          おすすめ構成
        </a>
        {/* Linkをaタグに変更 */}
        <a
          href="/installation"
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          設置・空間設計
        </a>
      </nav>

      {/* ★★★ 検索モーダル ★★★ */}
      {isSearchOpen && (
        // オーバーレイ: z-50 (ヘッダーと同じ)
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20"
          onClick={closeSearch} // 背景クリックで閉じる
        >
          <div 
            className="w-full max-w-lg p-4"
            onClick={(e) => e.stopPropagation()} // モーダル内部のクリックは伝播させない
          >
            <form 
              onSubmit={handleSearchSubmit} 
              className="relative bg-white rounded-lg shadow-2xl"
            >
              <input
                ref={inputRef} // フォーカス用
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="記事を検索..."
                className="w-full py-4 pl-6 pr-28 text-lg text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* 検索実行ボタン (アイコン) */}
              <button
                type="submit"
                className="absolute right-16 top-0 bottom-0 px-4 text-gray-600 hover:text-blue-600 transition duration-300"
                aria-label="検索実行"
              >
                <Search className="w-6 h-6" />
              </button>
              {/* 閉じるボタン */}
              <button
                type="button"
                onClick={closeSearch}
                className="absolute right-4 top-0 bottom-0 px-4 text-gray-500 hover:text-gray-800 transition duration-300"
                aria-label="検索を閉じる"
              >
                <X className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

