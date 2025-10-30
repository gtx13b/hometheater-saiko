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
            className={`
                // 固定位置: 画面下端、全幅
                fixed bottom-0 left-0 right-0 w-full z-40 
                bg-gray-800 hover:bg-gray-700 text-white 
                
                // 高さ・配置: 高さ約24px、中央揃え
                py-4 flex items-center justify-center text-sm font-semibold
                
                // アニメーション: 表示/非表示
                transition-all duration-300 ease-in-out
                ${isVisible 
                    ? 'translate-y-0 opacity-100 pointer-events-auto' 
                    : 'translate-y-full opacity-0 pointer-events-none'
                }
            `}
            aria-label="ページトップへスクロール"
        >
            <ChevronUp className="w-4 h-4 mr-1" />
            <span>TOPへ戻る</span>
        </button>
    );
}