"use client";

import React, { useState, useEffect, useRef } from 'react'; // useRefをインポート
import { MessageSquare, X } from 'lucide-react'; 
import HomeTheaterChatbot from './HomeTheaterChatbot'; // 既存のチャットボットをインポート

const ChatPopup = () => {
  // isMounted: アニメーションの状態（scale-100かどうか）
  const [isMounted, setIsMounted] = useState(false); 
  // isVisible: DOMに要素が存在するかどうか
  const [isVisible, setIsVisible] = useState(false); 
  // 💡 修正: タイマーIDを保持するためのref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleChat = () => {
    // 既存のタイマーがあればクリアする（連続クリック対策）
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isMounted) {
      // 閉じる処理:
      // 1. アニメーションを即座に開始 (scale-0へ)
      setIsMounted(false);
      
      // 2. アニメーション完了を待ってからDOMから要素を削除
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        timerRef.current = null;
      }, 300); // アニメーション時間 (duration-300) に合わせる

    } else {
      // 開く処理:
      // 1. DOMに要素を即座に表示
      setIsVisible(true);

      // 2. DOMに要素が追加された後、アニメーションを開始
      timerRef.current = setTimeout(() => {
        setIsMounted(true);
        timerRef.current = null;
      }, 10); // ごく短い遅延で次のレンダリングを待ち、アニメーションをトリガー
    }
  };

  // 💡 修正: 複雑なuseEffectロジックは全て削除し、クリーンアップのみ残す
  // アンマウント時にタイマーが残っていたらクリアする
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []); // 依存配列なし

  return (
    // 画面右下に固定配置する親コンテナ
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* 1. チャットモーダル (ポップアップウィンドウ) - isVisibleでDOMへの表示を制御 */}
      {isVisible && (
        <div 
          // isMountedでアニメーションクラスを制御
          className={`absolute bottom-20 right-0 
                     bg-white rounded-xl shadow-2xl border border-gray-100 
                     w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden 
                     transition-all duration-300 ease-in-out transform origin-bottom-right
                     ${isMounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`
          }
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
            <h3 className="text-lg font-bold">AI相談室</h3>
            <button 
              onClick={toggleChat} 
              className="text-white hover:text-gray-200 transition"
              aria-label="チャットを閉じる"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* チャットボット本体を直接レンダリング */}
          {/* HomeTheaterChatbotはflex-growで残りのスペースを全て占有 */}
          <div className="flex-grow flex flex-col p-2 overflow-y-auto">
            <HomeTheaterChatbot isPopup={true} />
          </div>
        </div>
      )}

      {/* 2. 開閉ボタン (右下のフローティングボタン) - ウィンドウが開いていても固定の位置に留まる */}
      <button
        onClick={toggleChat}
        // isMountedで開閉の状態をチェックし、ボタンの表示を切り替える
        className={`w-16 h-16 rounded-full shadow-xl text-white transition-all duration-300 ease-in-out flex items-center justify-center 
                  ${isMounted ? 'bg-red-600 hover:bg-red-700 rotate-90' : 'bg-blue-600 hover:bg-blue-700'}`}
        aria-label={isMounted ? "チャットを閉じる" : "チャットを開く"}
      >
        {isMounted ? (
          <X className="w-8 h-8" />
        ) : (
          <MessageSquare className="w-8 h-8" />
        )}
      </button>
    </div>
  );
};

export default ChatPopup;
