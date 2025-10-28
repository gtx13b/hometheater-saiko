// components/Footer.tsx

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    // 背景を明るいグレーに、文字色を濃いグレーに変更
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* ナビゲーションやリンクは省略し、著作権表示のみをシンプルに配置 */}
        
        {/* 著作権表示 */}
        <p className="text-sm text-gray-500 font-light tracking-wider">
          &copy; {currentYear} ホームシアター最高！ All rights reserved.
        </p>


      </div>
    </footer>
  );
};

export default Footer;