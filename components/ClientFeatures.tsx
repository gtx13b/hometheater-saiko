// components/ClientFeatures.tsx

'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import ChatPopup from './ChatPopup';
import { 
    ChevronRight, 
    List,
    Plus, 
} from 'lucide-react'; 

export default function ClientFeatures() {
    const [isFooterOpen, setIsFooterOpen] = useState(true);

    return (
        <>
            <ChatPopup />

            {process.env.NODE_ENV === 'development' && (
                <footer 
                    className={`
                        fixed bottom-0 left-0 right-0 w-full z-50 
                        
                        ${isFooterOpen 
                            ? 'bg-gray-900/90 text-white shadow-2xl backdrop-blur-sm'
                            : 'bg-transparent text-white shadow-none backdrop-blur-none'
                        }
                        
                        transition-all duration-300 ease-in-out
                        
                        // 開いているとき: h-20 (80px) / 閉じているとき: h-8 (32px)
                        ${isFooterOpen 
                            ? 'h-20 pl-1 pr-4 py-2' 
                            : 'h-8 p-0'  
                        }
                        
                        flex items-center justify-start overflow-hidden

                        // 🔥 修正点: 閉じているときにマウスイベントを透過させる
                        ${isFooterOpen ? '' : 'pointer-events-none'}
                    `}
                >
                    {/* 開閉ボタン (常に表示) */}
                    <button
                        onClick={() => setIsFooterOpen(!isFooterOpen)}
                        className={`
                            // w-5 (20px) に固定し、高さを h-full にすることで、フッターの高さに追従させる
                            w-5 h-full rounded-md flex-shrink-0 flex items-center justify-center
                            text-white bg-gray-700 hover:bg-gray-600 
                            transition duration-200 z-10 
                            // 📌 pointer-events-auto を末尾に配置
                            pointer-events-auto
                            
                            // 🔥 修正点: 閉じているときと開いているときの見た目を統一
                            ${isFooterOpen 
                                // 開いているとき (h-20) のボタンデザイン
                                ? 'rounded-md' 
                                // 閉じているとき (h-8) のボタンデザイン: p-0 の影響を受けないよう m-1 を付ける
                                : 'rounded-md m-1' 
                            }
                            
                            // 矢印の向きの制御は維持
                            ${isFooterOpen ? 'rotate-0' : 'rotate-180'} 
                        `}
                        aria-label={isFooterOpen ? "管理者メニューを閉じる" : "管理者メニューを開く"}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* メインコンテンツ (isFooterOpen が true の場合のみ表示) */}
                    {isFooterOpen && (
                        <div className="flex items-center space-x-8 mx-auto mr-auto w-full max-w-2xl overflow-x-auto justify-center"> 
                            
                            <span className="text-xl font-semibold text-white-400 flex-shrink-0">
                                [開発モード]
                            </span>

                            <Link 
                                href="/admin/articles" 
                                className="flex items-center justify-center space-x-1 flex-shrink-0
                                        bg-blue-600 hover:bg-blue-700 rounded-lg 
                                        w-48 text-lg font-bold transition duration-150 py-2" 
                            >
                                <List className="w-5 h-5" />
                                <span>記事管理一覧</span>
                            </Link>

                            <Link 
                                href="/admin" 
                                className="flex items-center justify-center space-x-1 flex-shrink-0
                                        bg-green-600 hover:bg-green-700 rounded-lg 
                                        w-48 text-lg font-bold transition duration-150 py-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>新規記事作成</span>
                            </Link>
                            
                        </div>
                    )}
                </footer>
            )}
        </>
    );
}