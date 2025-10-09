// components/Header.tsx
"use client";

import Link from 'next/link';
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  // ヘッダーの高さを約64px（p-4のサイズに相当）と仮定
  const HEADER_HEIGHT_PX = 64; 

  return (
    <header className="bg-gray-900 p-4 shadow-xl sticky top-0 z-50">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* ロゴ/サイト名 */}
        <Link 
          href="/" 
          className="text-2xl font-extrabold text-amber-400 hover:text-amber-300 transition duration-300 z-20"
          onClick={closeMenu}
        >
          My Modern Site
        </Link>
        
        {/* 1. デスクトップ用ナビゲーション (省略) */}
        <div className="hidden md:flex space-x-6">
          <Link 
            href="/" 
            className="text-white text-lg hover:text-amber-400 transition duration-300 font-medium"
          >
            ホーム
          </Link>
          <Link 
            href="/about" 
            className="text-white text-lg hover:text-amber-400 transition duration-300 font-medium"
          >
            アバウト
          </Link>
        </div>

        {/* 2. モバイル用ハンバーガーボタン (省略) */}
        <button 
          className="md:hidden text-white p-2 rounded-lg hover:bg-gray-700 transition z-20 relative"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col justify-around w-6 h-6">
            <span 
              className={`block h-0.5 w-full bg-white transform transition duration-300 ease-in-out ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span 
              className={`block h-0.5 w-full bg-white transition duration-300 ease-in-out ${
                isOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span 
              className={`block h-0.5 w-full bg-white transform transition duration-300 ease-in-out ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </div>
        </button>
      </nav>

      {/* 3. モバイルメニュー本体 (スライドインアニメーション強調版) */}
      <nav
        className={`
          md:hidden 
          // 開始位置はヘッダー直下
          absolute top-[${HEADER_HEIGHT_PX}px] left-0 w-full bg-gray-900 shadow-lg z-10
          // 💡 duration-300 に変更し、動きを強調
          transform transition-all duration-300 ease-in-out
          
          ${
            isOpen 
              ? 'translate-y-0 opacity-100 h-auto' // 開いている状態: 元の位置に、完全に表示
              // 閉じている状態: 上に少し移動させ（-translate-y-4）、高さをゼロにする
              : '-translate-y-4 opacity-0 h-0 overflow-hidden'
          }
        `}
        aria-hidden={!isOpen}
      >
        <Link 
          href="/" 
          className="block text-white text-lg p-4 hover:bg-gray-700 transition"
          onClick={closeMenu}
        >
          ホーム
        </Link>
        <Link 
          href="/about" 
          className="block text-white text-lg p-4 hover:bg-gray-700 transition"
          onClick={closeMenu}
        >
          アバウト
        </Link>
        <Link 
          href="/contact" 
          className="block text-white text-lg p-4 hover:bg-gray-700 transition"
          onClick={closeMenu}
        >
          お問い合わせ
        </Link>
      </nav>
    </header>
  );
};

export default Header;