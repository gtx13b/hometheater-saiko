// components/Footer.tsx (修正後)

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    // py-12 の py- を p-b に変えて、余白を増やすことで、
    // スクロールトップバーにコンテンツが隠れるのを防ぎます。
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-[2rem]"> {/* 👈 pt-12 は維持し、pb-をカスタム値で大きくする */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* 著作権表示 */}
        <p className="text-sm text-gray-500 font-light tracking-wider">
          &copy; {currentYear} ホームシアター最高！ All rights reserved.
        </p>
        
        {/* 💡 スクロールトップバーの高さ確保用:
             py-4 は上下に 32px + テキスト。
             ここでは、余裕を見て約 80px (20) のパディングを確保します。
        */}
        <div className="h-12 sm:h-16"></div> 


      </div>
    </footer>
  );
};

export default Footer;