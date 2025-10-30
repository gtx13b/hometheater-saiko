// components/HomeTheaterChatbot.tsx
// このコンポーネントは対話的なため、必ず 'use client' を追加します。
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, Link, RotateCcw } from 'lucide-react'; // LinkとRotateCcw（リセットアイコン）を追加

// チャットメッセージの型定義 (RAGデータを保持できるように修正)
interface RecommendedArticle {
    title: string;
    url: string;
    similarity: number;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
  // 💡 変更点1: 単一の記事から記事の配列に変更
  recommendedArticles?: RecommendedArticle[]; 
}

// propsの型を定義
interface HomeTheaterChatbotProps {
  isPopup?: boolean; // ポップアップモードかどうか
}

// 💡 定数: 初期メッセージを定義
const INITIAL_MESSAGES: Message[] = [
  { role: 'ai', text: 'こんにちは！ホームシアター最高！です。あなたの予算や興味のある機材について、何でもお気軽にご質問ください！' },
];

// 💡 関数: localStorageから履歴をロードするロジック
const getInitialMessages = (): Message[] => {
  if (typeof window !== 'undefined') {
    const storedMessages = localStorage.getItem('chatHistory');
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages);
        // 形式が正しいか簡易的に確認
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 既存の履歴が新しい型に合うように調整（もし古いデータ形式でも動くように）
          return parsed.map((msg: any) => ({
            ...msg,
            // 💡 修正: 過去の単一の recommendedArticle が存在する場合、新しい配列形式に変換
            recommendedArticles: msg.recommendedArticle ? [msg.recommendedArticle] : (msg.recommendedArticles || []),
          }));
        }
      } catch (e) {
        // パース失敗時は初期メッセージを返す
        return INITIAL_MESSAGES;
      }
    }
  }
  return INITIAL_MESSAGES;
};

// AIとのチャット履歴を管理するための状態を含んだコンポーネント
const HomeTheaterChatbot = ({ isPopup = false }: HomeTheaterChatbotProps) => {
  
  // 💡 修正1: useStateの初期値としてgetInitialMessages関数を渡すことで、localStorageから履歴をロード
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // メッセージを一番下までスクロールさせる関数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 💡 追加2: messagesが変更されるたびにlocalStorageに保存
  useEffect(() => {
    // クライアント側でのみ実行
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
    // メッセージが更新されたらスクロール
    scrollToBottom();
  }, [messages]);


  // 💡 修正3: 会話履歴をリセットする関数 (localStorageもクリア)
  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatHistory');
    }
    setMessages(INITIAL_MESSAGES);
    setInput('');
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input.trim() };
    // 最新のメッセージを状態に追加し、API送信用の配列を作成
    const updatedMessages = [...messages, userMessage];

    // ユーザーメッセージを追加し、入力欄をクリア
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // 🔥 RAG機能を継続するため、APIエンドポイントを /api/ask に変更し、クエリを直接送信
      const apiResponse = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // RAG APIは通常、単一のクエリを受け取る
        body: JSON.stringify({ query: input.trim() }), 
      });

      const data = await apiResponse.json();

      if (apiResponse.ok) {
        // 🔥 RAGのレスポンス構造 (answerとrecommendedArticle) に合わせてデータを処理
        const aiResponse: Message = { 
          role: 'ai', 
          text: data.answer, // RAGの回答
          // 💡 変更点2: APIが articles 配列を返すようになったと仮定して取得
          recommendedArticles: data.recommendedArticles || [], 
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        // サーバーからのエラー応答をそのまま表示
        const errorMessage: Message = { role: 'ai', text: `AIとの通信でエラーが発生しました: ${data.error || '不明なエラー'}` };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = { role: 'ai', text: 'ネットワークエラーが発生しました。' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // フォーム送信を防ぐ
      handleSendMessage();
    }
  };

  // AIの回答から余分な推薦記事リンクを削除する関数を強化
  const sanitizeAiText = (text: string): string => {
    if (!text) return '';
    
    let cleanText = text;

    // RAG情報全体を削除するパターン: 「---」から始まる、または「推薦記事」という単語を含む行を削除
    cleanText = cleanText.replace(/(\n+---[\s\S]*?)(推薦記事.*)$/gm, '');

    // 💡 強化: ユーザーが指摘した冗長でAI的な定型文を全て削除するための正規表現リスト
    const aiSpecificPhrases = [
        // 1. 「ご質問の「〇〇」に関する情報は、提供されたコンテキスト内には見当たりませんでした。」の削除
        /ご質問の「.*?」に関する情報は、提供されたコンテキスト内には見当たりませんでした。\s*/g, 
        // 2. 「このコンテキスト情報は、「ホームシアター最高！」というサイトの理念や、サイト運営者がホームシアターを作る理由について説明しているものです。」の削除
        /このコンテキスト情報は、「.*?」というサイトの理念や、サイト運営者がホームシアターを作る理由について説明しているものです。\s*/g,
        
        // 3. 【包括的削除】「コンテキスト情報」「コン記事情報」を含む、情報不足を示す硬い定型文を全て削除
        // 「（ご提示いただいた）？（提供された）？（コンテキスト情報|コン記事情報|コン記事）には...」のパターンを削除
        /（?ご提示いただいた）?（?提供された）?（?コンテキスト情報|コン記事情報|コン記事）には.*?(に関する記述がございませんでした。|に関する情報が見つかりませんでした。|はございません。|という単語に関する記載がございません。|という単語に関する記載はございません。)\s*/g,
        
        // 4. 【既存の硬い定型文】その他の「情報なし」を示す定型文を削除
        /ご質問いただきました.*?(に関する記述がございませんでした。|に関する情報が見つかりませんでした。|はございません。)/g,
        /申し訳ありません。ご質問の「.*?」に関する情報は.*?(はございません。)/g,
        /申し訳ありませんが、提供されたコン記事情報の中には「.*?」に関する記述がございませんでした。/g, 
        
        // 5. 【ユーザー指摘の具体的な最新パターン】「ご提示いただいた記事のコンテキスト情報には」で始まる硬い定型文
        /ご提示いただいた記事のコンテキスト情報には\s*/g,
        // 6. 「〇〇」という単語に関する記載がございません
        /「.*?」という単語に関する記載がございません\s*/g,
    ];

    aiSpecificPhrases.forEach(regex => {
        cleanText = cleanText.replace(regex, '');
    });

    // 削除しきれなかった特定の形式の文字列をさらに削除
    cleanText = cleanText.replace(/推薦記事URL: \[.*?\)/g, '');
    cleanText = cleanText.replace(/推薦記事 \(類似度:.*?\)/g, '');
    cleanText = cleanText.replace(/100万円で組む究極のホームシアター構成/g, ''); // 特定のタイトルを削除

    // さらに、URLとタイトルがセットで残った場合を想定して、余分な改行も削除
    cleanText = cleanText.replace(/\s*\[.*?\]\(https?:\/\/[^\s]+\)/g, '');
    
    return cleanText.trim();
  };

  return (
    <div className={
      isPopup 
      // 1. ルートdiv: ポップアップの高さに合わせるために h-full を追加し、余白を親に任せる
      ? "flex flex-col flex-grow w-full h-full" 
      : "bg-white p-6 rounded-xl shadow-2xl border border-gray-100 max-w-2xl mx-auto my-10" 
    }>
      
       {/* ポップアップ時のリセットボタン (メッセージエリア直上) */}
      {isPopup && (
         <div className="flex justify-end px-4">
            <button 
              onClick={handleReset}
              className="text-xs px-2 mb-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition flex items-center"
              aria-label="会話履歴をリセット"
              title="会話をリセット"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              会話リセット
            </button>
          </div>
      )}
      
      {/* メッセージ履歴エリア */}
      <div className={
        isPopup 
        // 3. メッセージ履歴div: ポップアップモードでは、外側のp-2を考慮して、mx-2/my-2/p-3で調整
        // 💡 修正: ポップアップ時のメッセージリストの上部パディングを pt-4 に変更し、ボタンとの間隔を確保
        ? "overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 flex flex-col space-y-4 flex-grow mx-2 mb-2 p-3 pt-4"
        // 通常モード
        : "h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 flex flex-col space-y-4 flex-grow"
      }> 
        {messages.map((msg, index) => {
          
          const displayText = msg.role === 'ai' ? sanitizeAiText(msg.text) : msg.text;
          
          // 💡 修正4: 類似度で降順にソートし、フィルタリングの敷居値を0.5に下げて、最大3つに制限
          const filteredArticles = (msg.recommendedArticles || [])
            // 類似度で降順ソート: 最も類似度の高い記事を優先
            .sort((a, b) => b.similarity - a.similarity)
            // 敷居値を0.5に緩和 (0.7では候補が不足しがち)
            .filter(article => article.similarity >= 0.5)
            // 上位3つを抽出
            .slice(0, 3);

          return (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                {/* メッセージ本文 */}
                {displayText.split('\n').map((line, i) => (
                  // 💡 break-wordsを追加し、長い文字列での横スクロールを防ぐ
                  <p key={i} className="break-words">{line}</p> // 改行を保持して表示
                ))}

                {/* 推薦記事の表示ロジックをここに追加 */}
                {msg.role === 'ai' && filteredArticles.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-sm font-bold text-blue-700 mb-2 flex items-center">
                      <Link className="w-4 h-4 mr-1" />
                      参考になりそうな記事
                      <Link className="w-4 h-4 mr-1" />
                    </p>
                    {filteredArticles.map((article, i) => (
                        <a 
                          key={i}
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-red-400 pb-2 underline transition-colors block break-words mt-1"
                        >
                          {/* 💡 類似度を記事タイトルの前に表示 */}
                          {article.title}
                        </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} /> {/* スクロール位置の基準 */}
      </div>


      {/* 入力フォーム */}
      <div className={
        isPopup
        // 4. 入力フォームdiv: ポップアップモード時は左右マージンと下のパディングを追加
        ? "flex space-x-3 mx-2 pb-2" 
        : "flex space-x-3"
      }>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={isLoading ? '応答を待っています...' : '予算や機材について質問を入力...'}
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
        <button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default HomeTheaterChatbot;
