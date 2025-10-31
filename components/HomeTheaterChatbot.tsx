"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, Link, RotateCcw } from 'lucide-react'; 
import ReactMarkdown from 'react-markdown'; 

// チャットメッセージの型定義 (RAGデータを保持できるように修正)
interface RecommendedArticle {
    title: string;
    url: string;
    similarity: number;
}

interface Message {
    role: 'user' | 'ai';
    text: string;
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
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map((msg: any) => ({
                        ...msg,
                        recommendedArticles: msg.recommendedArticle ? [msg.recommendedArticle] : (msg.recommendedArticles || []),
                    }));
                }
            } catch (e) {
                return INITIAL_MESSAGES;
            }
        }
    }
    return INITIAL_MESSAGES;
};

// AIの回答から余分な推薦記事リンク、参照元/引用元、そして末尾の「**」を削除する関数を強化
const sanitizeAiText = (text: string): string => {
    if (!text) return '';
    
    let cleanText = text;

    // 🔥 引用元/参照元のブロック全体を**最も強固に削除**する正規表現 (前回の修正を維持)
    const absoluteReferenceRegex = /\s*(引用元|参照元)[\s\S]*/gm;
    cleanText = cleanText.replace(absoluteReferenceRegex, '');
    
    // RAG情報全体を削除するパターン: 「---」から始まる、または「推薦記事」という単語を含む行を削除
    cleanText = cleanText.replace(/(\n+---[\s\S]*?)(推薦記事.*)$/gm, '');
    
    // 💡 修正点: 文字列の末尾にある不要な「**」マークアップを削除する
    // \s* : 末尾の任意の空白文字
    // \*\* : 二つのアスタリスク
    // $ : 文字列の末尾
    cleanText = cleanText.replace(/\s*\*\*$/, ''); 

    // 💡 デバッグ用の区切り線とそれに続くテキストを削除（既存）
    cleanText = cleanText.replace(/--- 参照元記事一覧 \(デバッグ用\) ---[\s\S]*?\n/gm, '');

    // その他のAI特有のフレーズの削除
    const aiSpecificPhrases = [
        /ご質問の「.*?」に関する情報は、提供されたコンテキスト内には見当たりませんでした。\s*/g, 
        /このコンテキスト情報は、「.*?」というサイトの理念や、サイト運営者がホームシアターを作る理由について説明しているものです。\s*/g,
        /（?ご提示いただいた）?（?提供された）?（?コンテキスト情報|コン記事情報|コン記事）には.*?(に関する記述がございませんでした。|に関する情報が見つかりませんでした。|はございません。|という単語に関する記載がございません。|という単語に関する記載はございません。)\s*/g,
        /ご質問いただきました.*?(に関する記述がございませんでした。|に関する情報が見つかりませんでした。|はございません。)/g,
        /申し訳ありません。ご質問の「.*?」に関する情報は.*?(はございません。)/g,
        /申し訳ありませんが、提供されたコン記事情報の中には「.*?」に関する記述がございませんでした。/g, 
        /ご提示いただいた記事のコンテキスト情報には\s*/g,
        /「.*?」という単語に関する記載がございません\s*/g,
        /denon_x2850h_review/g,
        /\[未分類\]\s*denon_x2850h_review/g,
        /\[[^\]]*\]\s*[^.\s]+\.md/g,
        /推薦記事URL: \[.*?\)/g,
        /推薦記事 \(類似度:.*?\)/g,
        /100万円で組む究極のホームシアター構成/g, 
        /\s*\[.*?\]\(https?:\/\/[^\s]+\)/g,
    ];

    aiSpecificPhrases.forEach(regex => {
        cleanText = cleanText.replace(regex, '');
    });
    
    // 最後にトリムして、メッセージ末尾の改行やスペースを削除
    return cleanText.trim();
};


// AIとのチャット履歴を管理するための状態を含んだコンポーネント
const HomeTheaterChatbot = ({ isPopup = false }: HomeTheaterChatbotProps) => {
    
    const [messages, setMessages] = useState<Message[]>(getInitialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // 💬 チャット履歴の一番下の要素へのRef (ユーザー発言時に使用)
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // 💬 最新のAI回答要素へのRef
    const lastAiMessageRef = useRef<HTMLDivElement>(null); 
    // 💬 スクロール対象となるチャット履歴コンテナへのRef
    const chatContainerRef = useRef<HTMLDivElement>(null);
    // 💬 ユーザーの次の質問のための入力欄へのRef
    const inputRef = useRef<HTMLInputElement>(null); 

    /**
     * 指定された要素の位置へスクロールする（汎用）
     * @param elementToScrollTo スクロール先の要素
     * @param offset スクロール位置のオフセット（調整用）
     */
    const scrollToElement = (elementToScrollTo: HTMLElement, offset: number = 0) => {
        if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            // ターゲット要素の位置を、コンテナの先頭からの相対位置として計算
            const targetTop = elementToScrollTo.offsetTop;
            
            container.scrollTo({ 
                top: targetTop + offset, 
                behavior: "smooth" 
            });
        }
    };


    // 🔥 スクロールロジックのコア
    useEffect(() => {
        // 1. localStorageに履歴を保存
        if (typeof window !== 'undefined') {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }

        // 2. スクロールとフォーカス制御
        if (!isLoading) {
            // ローディングが完了した場合 (AIの応答が終了)
            if (lastAiMessageRef.current) {
                // 👉 AI回答の先頭にスクロールする
                // 🔥 修正点: ご要望のオフセット -115 を適用
                scrollToElement(lastAiMessageRef.current, -115); 
            }
            
            // ユーザー入力欄にフォーカスを戻す
            inputRef.current?.focus();

        } else if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
            // ユーザーが発言した直後 (isLoading=true) は、チャット履歴の一番下までスクロール
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }

    }, [messages, isLoading]);


    // 💡 会話履歴をリセットする関数 (localStorageもクリア)
    const handleReset = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('chatHistory');
        }
        setMessages(INITIAL_MESSAGES);
        setInput('');
        // リセット後も入力欄にフォーカス
        inputRef.current?.focus();
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input.trim() };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const apiResponse = await fetch('/api/chat', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    messages: updatedMessages.map(msg => ({ 
                        role: msg.role === 'ai' ? 'ai' : 'user', 
                        text: msg.text,
                    }))
                }), 
            });

            const data = await apiResponse.json();

            if (apiResponse.ok) {
                const aiResponse: Message = { 
                    role: 'ai', 
                    text: data.text, 
                    recommendedArticles: Array.isArray(data.context) ? data.context : [], 
                };
                setMessages(prev => [...prev, aiResponse]);
            } else {
                const errorMessage: Message = { 
                    role: 'ai', 
                    text: `AIとの通信でエラーが発生しました: ${data.error || JSON.stringify(data) || '不明なエラー'}` 
                };
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
            e.preventDefault(); 
            handleSendMessage();
        }
    };

    return (
        <div className={
            isPopup 
            ? "flex flex-col flex-grow w-full h-full" 
            : "bg-white p-6 rounded-xl shadow-2xl border border-gray-100 max-w-2xl mx-auto my-10" 
        }>
            
            {/* ポップアップ時のリセットボタン */}
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
            <div 
                // 🔥 Refを割り当てる
                ref={chatContainerRef}
                className={
                isPopup 
                ? "overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 flex flex-col space-y-4 flex-grow mx-2 mb-2 p-3 pt-4"
                : "h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 flex flex-col space-y-4 flex-grow"
            }> 
                {messages.map((msg, index) => {
                    
                    const displayText = msg.role === 'ai' ? sanitizeAiText(msg.text) : msg.text;
                    
                    const filteredArticles = (msg.recommendedArticles || [])
                        .sort((a, b) => b.similarity - a.similarity)
                        .filter(article => article.similarity >= 0.4)
                        .slice(0, 3);
                    
                    // 🔥 最後のAIメッセージに Ref を設定
                    const isLastAiMessage = msg.role === 'ai' && index === messages.length - 1;

                    return (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                // 🔥 Refを割り当てる
                                ref={isLastAiMessage ? lastAiMessageRef : null}
                                className={`max-w-[80%] p-3 rounded-xl shadow-md ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-gray-200 text-gray-800 rounded-tl-none'
                                }`}>
                                {/* メッセージ本文のレンダリング */}
                                {msg.role === 'user' ? (
                                    // ユーザー発言はそのまま
                                    displayText.split('\n').map((line, i) => (
                                        <p key={i} className="break-words">{line}</p> 
                                    ))
                                ) : (
                                    // AI発言はReactMarkdownとしてレンダリングする
                                    <ReactMarkdown
                                        components={{
                                            // pタグにproseクラスを適用し、Tailwind CSSのスタイルを維持
                                            p: ({ node, ...props }) => <p className="text-gray-800 prose prose-sm max-w-none break-words" {...props} />,
                                            li: ({ node, ...props }) => <li className="text-gray-800" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                                        }}
                                    >
                                        {displayText}
                                    </ReactMarkdown>
                                )}

                                {/* 推薦記事の表示ロジック */}
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
                                                {article.title} <span className="text-gray-500 font-normal ml-1">({(article.similarity * 100).toFixed(1)}%)</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} /> {/* スクロール位置の基準 (ユーザー発言時) */}
            </div>


            {/* 入力フォーム */}
            <div className={
                isPopup
                ? "flex space-x-3 mx-2 pb-2" 
                : "flex space-x-3"
            }>
                <input
                    // 🔥 Refを割り当てる
                    ref={inputRef}
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