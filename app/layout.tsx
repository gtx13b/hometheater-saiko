// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google'; // Noto Sans JPをインポート

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Noto Sans JP を初期化し、ウェイト（太さ）を指定
const notoSansJp = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'], 
  display: 'swap',
  variable: '--font-noto-sans-jp', // この変数名が重要
});

export const metadata: Metadata = {
  title: 'ホームシアター最高！ - 最高の機材と知識で感動体験を',
  description: 'ホームシアター初心者から上級者まで、失敗しない機材選び、設置方法、空間設計を徹底解説。あなたの日常を非日常に変えるための総合ガイド。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 💡 HTMLタグ全体にフォントクラスを適用
    <html lang="ja" className={`${notoSansJp.variable}`}> 
      <body>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}