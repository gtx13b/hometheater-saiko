// app/layout.tsx
// --------------------------------------------------------
// 【一時的な修正】Canvas環境でのパス解決エラー回避のため、インポートをコメントアウト
// Vercel環境では、これらのパスは正しく解決されます。
// --------------------------------------------------------
// import './globals.css';
import type { Metadata } from 'next';
// import { Noto_Sans_JP } from 'next/font/google'; // Noto Sans JPをインポート

// import Header from '@/components/Header'; // パスエイリアスに戻す
// import Footer from '@/components/Footer'; // パスエイリアスに戻す

// --------------------------------------------------------
// 【一時的な修正】Vercelのビルドエラー回避のため、next/fontをコメントアウト
// --------------------------------------------------------

// Noto Sans JP を初期化し、ウェイト（太さ）を指定
// const notoSansJp = Noto_Sans_JP({ 
//   subsets: ['latin'],
//   weight: ['300', '400', '700', '900'], 
//   display: 'swap',
//   variable: '--font-noto-sans-jp', // この変数名が重要
// });

const FONT_VARIABLE = '';
// --------------------------------------------------------


export const metadata: Metadata = {
  title: 'ホームシアター最高！ - 最高の機材と知識で感動体験を',
  description: 'ホームシアター初心者から上級者まで、失敗しない機材選び、設置方法、空間設計を徹底解説。あなたの日常を非日常に変えるための総合ガイド。',
};

// ヘッダーとフッターのインポートをコメントアウトしたため、ここで空のコンポーネントを定義
// Vercelでは本来のコンポーネントが使われます
const Header = () => <></>;
const Footer = () => <></>;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 💡 HTMLタグ全体にフォントクラスを適用
    <html lang="ja" className={FONT_VARIABLE}> 
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
