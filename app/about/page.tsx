// app/about/page.tsx

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    // 💡 main要素に基本的なパディング (p-10) と背景色 (bg-gray-50) を適用
    <main className="min-h-screen bg-gray-50 p-10">
      
      {/* 💡 コンテンツを中央に寄せ、最大幅を設定 (max-w-4xl mx-auto) */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        
        {/* タイトル */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b-4 border-amber-400 pb-2">
          このサイトについて
        </h1>
        
        {/* セクション１ */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            開発技術
          </h2>
          <p className="text-gray-600 leading-relaxed">
            このモダンなホームページは、強力なJavaScriptフレームワークである 
            <strong className="text-blue-600">Next.js</strong>、UI構築ライブラリの 
            <strong className="text-cyan-500">React</strong>、そして型安全性を確保するための 
            <strong className="text-blue-500">TypeScript</strong> を組み合わせて開発されています。
          </p>
        </section>

        {/* セクション２ */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            デザインとスタイル
          </h2>
          <p className="text-gray-600 leading-relaxed">
            デザインにはユーティリティファーストのCSSフレームワーク 
            <strong className="text-teal-500">Tailwind CSS</strong> を使用しており、
            カスタムCSSを記述することなく、高速でおしゃれなデザインを実現しています。
          </p>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;