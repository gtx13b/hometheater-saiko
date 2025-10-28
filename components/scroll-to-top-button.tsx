// components/scroll-to-top-button.tsx

"use client";

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * ページ上部へスクロールするためのボタンコンポーネント
 */
export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // スクロール位置の監視ロジック (変更なし)
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // トップへスクロールする関数 (変更なし)
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            // Tailwind CSS クラスの変更点:
            // 1. transition-all duration-500: 500msかけてすべてをアニメーション
            // 2. opacity-0/100: 不透明度を0から100に切り替え
            // 3. scale-75/100: ボタンサイズを75%から100%に切り替え
            // 4. pointer-events-none/auto: 非表示時にクリックを無効化

            className={`
                fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 
                text-white p-3 rounded-full shadow-lg z-40
                transition-all duration-500 ease-in-out transform
                ${isVisible 
                    ? 'opacity-100 scale-100 pointer-events-auto' 
                    : 'opacity-0 scale-75 pointer-events-none'
                }
            `}
            aria-label="ページトップへスクロール"
        >
            <ChevronUp className="w-6 h-6" />
        </button>
        // 🔥 isVisibleに関係なくボタンを常にレンダリングすることで、CSSトランジションを有効にします
    );
}