// app/layout.tsx (一部抜粋)

import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer'; // 💡 Footerをインポート

// ... metadataの記述などが上部にあります ...
    
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen"> {/* 👈 画面の高さ全体を使うための設定 */}
        
        <Header />
        
        {/* 💡 childrenをflex-growで囲み、ヘッダーとフッターの間で領域を最大限使用 */}
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer /> {/* 👈 ここにフッターを配置 */}
        
      </body>
    </html>
  );
}