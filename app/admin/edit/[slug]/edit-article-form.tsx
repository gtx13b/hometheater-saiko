// app/admin/edit/[slug]/edit-article-form.tsx

"use client";

import { useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { FullArticle } from '@/lib/articles';
import { useRouter } from 'next/navigation';
import React from 'react'; 

interface EditArticleFormProps {
    initialData: FullArticle;
}

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// ヘルパー関数: FileオブジェクトをBase64文字列に変換
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => { 
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export default function EditArticleForm({ initialData }: EditArticleFormProps) {
  const router = useRouter();
  
  const [title, setTitle] = useState(initialData.title);
  const [date, setDate] = useState(initialData.date);
  const [description, setDescription] = useState(initialData.description || "");
  const [author, setAuthor] = useState(initialData.author || "シアターマイスター"); 
  
  // category の useState に型引数 <string> を追加
  const [category, setCategory] = useState<string>(initialData.category); 
  
  const [content, setContent] = useState(initialData.content);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || ""); 
  const [imageLinkName, setImageLinkName] = useState(initialData.imageLinkName || "");
  
  // 🔥 修正点: initialData.alt を直接使用 (型定義を修正したためエラーが解消)
  const [altText, setAltText] = useState(initialData.alt || ""); 
  
  const [message, setMessage] = useState("");
  const [currentImage, setCurrentImage] = useState(initialData.image); 
  const [deleteImage, setDeleteImage] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [copyMessage, setCopyMessage] = useState(""); 

  // -----------------------------------------------------
  // クリップボードにコピーする関数 (動的生成 - figcaptionのスタイル修正済み)
  // -----------------------------------------------------
  const copyHtmlToClipboard = useCallback(() => {
    // フォームの入力値を変数に取得（未入力の場合は空文字）
    const imageSourceUrl = imageUrl.trim();
    const imageSourceName = imageLinkName.trim();
    const imageAltText = altText.trim();
    const imageSlug = initialData.slug; // 記事のスラッグをファイル名として使用

    // 参照リンク全体を組み立て
    let figcaptionContent = '';
    // 共通のインラインスタイル (mb-16 などの Tailwind クラスを削除)
    const commonStyle = 'margin-top: 8px; font-size: 0.9em; color: #6b7280;';
    const linkStyle = 'color: #1d4ed8; text-decoration: underline;';
    
    if (imageSourceUrl && imageSourceName) {
        // 両方ある場合はリンクタグ全体を生成
        figcaptionContent = `
  <figcaption class="mb-16">
    参照：<a href="${imageSourceUrl}" target="_blank" style="${linkStyle}">${imageSourceName}</a>
  </figcaption>`.trim();
    } else if (imageSourceName) {
        // URLはないが名前だけある場合はリンクなしのfigcaptionを生成
         figcaptionContent = `
  <figcaption class="mb-16">
    参照：${imageSourceName}
  </figcaption>`.trim();
    } else if (imageSourceUrl) {
         // 名前はないがURLだけある場合はリンクタグ全体を生成（URLを名前として使用）
        figcaptionContent = `
  <figcaption class="mb-16">
    参照：<a href="${imageSourceUrl}" target="_blank" style="${linkStyle}">${imageSourceUrl}</a>
  </figcaption>`.trim();
    }
    
    // HTMLテンプレート全体を動的に組み立て
    const dynamicTemplate = `
<figure style="text-align: center; margin: 20px auto;">
  <img src="/images/${category}/${imageSlug}.webp" alt="${imageAltText}" width="800" height="450" style="display: block; margin: 0 auto; border-radius: 8px;" />
${figcaptionContent ? '  ' + figcaptionContent : ''}
</figure>
`.trim();
    
    navigator.clipboard.writeText(dynamicTemplate).then(() => {
        setCopyMessage("✅ テンプレートをクリップボードにコピーしました！");
        setTimeout(() => setCopyMessage(""), 3000); 
    }).catch(err => {
        setCopyMessage("❌ コピーに失敗しました。手動でコピーしてください。");
        console.error('Failed to copy text: ', err);
    });
    // useCallbackの依存配列は、テンプレート生成に必要なステート変数とする
  }, [category, initialData.slug, imageUrl, imageLinkName, altText]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setMessage("");
    setIsSubmitting(true);
    
    let imageBase64: string | null = null;
    
    if (imageFile) {
        try {
            imageBase64 = await fileToBase64(imageFile);
        } catch (error) {
            setMessage("画像の読み込みに失敗しました。");
            setIsSubmitting(false);
            return;
        }
    }

    const payload = {
        slug: initialData.slug,
        title,
        date,
        description,
        author,
        category,
        content,
        imageUrl,
        imageLinkName,
        altText,
        
        imageBase64,
        oldImage: currentImage,
        deleteImage,
    };

    try {
      const res = await fetch("/api/update-article", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`記事の更新に成功しました: ${data.slug}`);
        router.push(`/admin/articles`);
        router.refresh();
      } else {
        setMessage(`記事の更新に失敗しました: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`記事の更新に失敗しました: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const selectedDate = date ? new Date(date) : null;
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      const day = String(newDate.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    } else {
      setDate("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 my-10 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-2">
        ✏️ 記事の修正: {initialData.title}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. タイトル (必須) */}
        <input
            type="text"
            placeholder="記事タイトル (必須)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
        />
        
        {/* 2. カテゴリーと 3. 日付 (横並び) */}
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
                <select
                    value={category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newValue = e.target.value as string;
                        setCategory(newValue);
                    }}
                    className="w-full border border-gray-300 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                >
                    <option value="news">ニュース</option>
                    <option value="blog">ブログ</option>
                </select>
            </div>
            <div className="col-span-2 w-full">
                <DatePicker
                    selected={selectedDate} 
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd" 
                    placeholderText="公開日 (YYYY/MM/DD) 必須"
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 font-sans text-sm"
                    required
                />
            </div>
        </div>

        {/* 4. 著者名 */}
        <input
            type="text"
            placeholder="著者名"
            value={author} 
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />

        {/* 5. 簡単な説明 (SEO向け) */}
        <input
            type="text"
            placeholder="簡単な説明 (SEO向け)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
        
        {/* 6. 画像関連のセクション */}
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">画像設定</h2>
            
           
            {/* 既存の画像プレビューと削除チェックボックス */}
            {currentImage && !imageFile && (
                <div className="mb-4 flex items-center justify-between">
                    <img 
                        src={currentImage} 
                        alt="現在の画像" 
                        className="w-48 h-auto rounded-lg shadow-md"
                    />
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="deleteImageCheckbox"
                            checked={deleteImage}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteImage(e.target.checked)}
                            className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <label htmlFor="deleteImageCheckbox" className="text-sm font-medium text-red-600">
                            画像を削除する
                        </label>
                    </div>
                </div>
            )}
            
            {/* ファイル選択 と 代替テキスト (alt属性) - 横並び */}
            <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center space-x-3">
                    <label className="text-gray-600 whitespace-nowrap">画像:</label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null; 
                          setImageFile(file);
                          setDeleteImage(false);
                        }}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
                    />
                </div>
                
                <input
                    type="text"
                    placeholder="代替テキスト (alt属性)"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
            </div>

            {/* 6-3. 参照URL と 6-4. リンク時の名前 - 横並び */}
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="url"
                    placeholder="参照URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
                <input
                    type="text"
                    placeholder="リンク時の名前"
                    value={imageLinkName}
                    onChange={(e) => setImageLinkName(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
            </div>

            {/* コピーボタンとメッセージエリア */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                    type="button" 
                    onClick={copyHtmlToClipboard} 
                    className="flex-shrink-0 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                >
                    📋 画像HTMLテンプレートをコピー
                </button>
                {copyMessage && (
                    <span className={`text-xs sm:text-sm font-medium ${copyMessage.startsWith("✅") ? 'text-green-600' : 'text-red-600'}`}>
                        {copyMessage}
                    </span>
                )}
            </div>

        </div>

        {/* 7. 本文 */}
        <textarea
          placeholder="記事の本文 (Markdown形式で記述) 必須"
          value={content}
          onChange={(e) => {
          const normalizedContent = e.target.value.replace(/\r/g, ''); 
           setContent(normalizedContent);
          }}
          className="w-full border border-gray-300 p-3 rounded-md h-72 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
          required
        />

        {/* 送信ボタン */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-orange-600 text-white font-semibold py-3 rounded-md hover:bg-orange-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '更新中...' : '✅ 記事を修正して更新'}
        </button>
      </form>
      
      {/* メッセージ表示エリア */}
      {message && (
        <p className={`mt-6 p-4 rounded-lg font-medium ${message.includes("成功") ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
          {message}
        </p>
      )}
    </div>
  );
}