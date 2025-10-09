// components/Footer.tsx

import React from 'react';
import Link from 'next/link';

// ヘッダーと同じトーンのTailwindクラスで装飾
const Footer: React.FC = () => {
  return (
    // bg-gray-900: 濃い背景色 / p-8: 大きめのパディング / text-white: 白い文字
    <footer className="bg-gray-900 text-white p-8 mt-12 border-t border-gray-700">
      
      {/* コンテンツエリア (ヘッダーと同じ幅・中央寄せ) */}
      <div className="max-w-7xl mx-auto text-center">
        
        {/* ナビゲーションリンク */}
        <div className="space-x-6 mb-4">
          <Link href="/" className="hover:text-amber-400 transition">
            ホーム
          </Link>
          <Link href="/about" className="hover:text-amber-400 transition">
            アバウト
          </Link>
          <Link href="/contact" className="hover:text-amber-400 transition">
            お問い合わせ
          </Link>
        </div>
        
        {/* 著作権表示 (text-gray-500: やや薄い色) */}
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} My Modern Site. All rights reserved.
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;