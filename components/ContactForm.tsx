// components/ContactForm.tsx
"use client";

import React, { useState } from 'react';

// フォームの入力データを保持するための型定義
interface FormData {
  name: string;
  email: string;
  message: string;
}

// フォーム送信の状態を管理するための型定義
type Status = 'idle' | 'submitting' | 'success' | 'error';

const ContactForm: React.FC = () => {
  // フォームの状態を管理
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  // 送信状態を管理
  const [status, setStatus] = useState<Status>('idle');

  // 入力フィールドの値が変更されたときの処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // フォーム送信時の処理 (fetch関数を使用してAPIにデータを送信)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // すでに送信中の場合は処理を中断
    if (status === 'submitting') return;

    setStatus('submitting');
    
    try {
      // 💡 Next.jsのAPIルートへデータを送信
      const response = await fetch('/api/contact', {
        method: 'POST', // フォームデータの送信にはPOSTメソッドを使用
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // データをJSON形式に変換
      });

      if (response.ok) {
        // HTTPステータスコードが200番台の場合（成功）
        setStatus('success');
        setFormData({ name: '', email: '', message: '' }); // フォームをクリア

        // 成功メッセージを5秒後に非表示にする
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
        
      } else {
        // HTTPステータスコードがエラーの場合 (400, 500など)
        setStatus('error');
        console.error("API Error Response:", response.status, response.statusText);
      }
    } catch (error) {
      // ネットワークエラーなど、fetch自体が失敗した場合
      setStatus('error');
      console.error("Network Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* フォーム送信後のメッセージ表示 */}
      {status === 'success' && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
          <p className="font-bold">送信完了</p>
          <p>お問い合わせ内容を承りました。ありがとうございました。</p>
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">エラー</p>
          <p>送信中にエラーが発生しました。時間をおいて再度お試しください。</p>
        </div>
      )}

      {/* 1. お名前フィールド */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={status === 'submitting'} // 送信中は入力不可
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* 2. メールアドレスフィールド */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={status === 'submitting'}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* 3. お問い合わせ内容フィールド */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          disabled={status === 'submitting'}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150 disabled:bg-gray-50 disabled:cursor-not-allowed"
        ></textarea>
      </div>

      {/* 4. 送信ボタン */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`
          w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200
          ${
            status === 'submitting'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-300'
          }
        `}
      >
        {status === 'submitting' ? '送信中...' : '送信する'}
      </button>
    </form>
  );
};

export default ContactForm;