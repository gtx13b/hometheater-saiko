// components/Header.tsx
"use client";

import Link from 'next/link';
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  const HEADER_HEIGHT_PX = 64; 

  return (
    // 背景を白に、下線もグレーに変更
    <header className="bg-white p-4 shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* 💡 ロゴエリア：h1タグでSEO最適化 - 白背景に合わせて文字色を黒系に */}
        <Link 
          href="/" 
          className="inline-flex items-center group relative overflow-hidden z-20" 
          onClick={closeMenu}
        >
          {/* h1タグ全体で単色・統一サイズでマークアップ */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 transition duration-300 group-hover:text-gray-700">
              
              {/* 「ホームシアター」の部分 */}
              <span className="font-extrabold">
                  ホームシアター最高！
              </span>
          </h1>

          {/* 💡 ホバー時の光沢アニメーションは今回は控えめに削除、またはモノトーンなハイライトに */}
        </Link>
        
        {/* 1. デスクトップ用ナビゲーション (お問い合わせを削除) */}
        <div className="hidden md:flex space-x-6">
          <Link 
            href="/about" 
            className="text-gray-600 text-lg hover:text-gray-900 transition duration-300 font-medium relative group"
          >
            このサイトについて
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link 
            href="/gear-guide" 
            className="text-gray-600 text-lg hover:text-gray-900 transition duration-300 font-medium relative group"
          >
            機材選びの基本
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link 
            href="/budget-systems" 
            className="text-gray-600 text-lg hover:text-gray-900 transition duration-300 font-medium relative group"
          >
            おすすめ構成
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link 
            href="/installation" 
            className="text-gray-600 text-lg hover:text-gray-900 transition duration-300 font-medium relative group"
          >
            設置・空間設計
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          {/* ★★★ お問い合わせリンクを削除 ★★★ */}
        </div>

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
      </nav>

      {/* 3. モバイルメニュー本体 (お問い合わせを削除) */}
      <nav
        className={`
          md:hidden 
          // 背景色を白に変更
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
        <Link 
          href="/" 
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          ホーム
        </Link>
        <Link 
          href="/about" 
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          このサイトについて
        </Link>
        
        <Link 
          href="/gear-guide" 
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          機材選びの基本
        </Link>
        <Link 
          href="/budget-systems" 
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          おすすめ構成
        </Link>
        <Link 
          href="/installation" 
          className="block text-gray-700 text-lg p-4 hover:bg-gray-100 transition"
          onClick={closeMenu}
        >
          設置・空間設計
        </Link>
        
        {/* ★★★ お問い合わせリンクを削除 ★★★ */}
      </nav>
    </header>
  );
};

export default Header;