"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 

// 🔥 修正: タイムゾーンの影響を受けず、ローカルの「今日」を YYYY-MM-DD 形式で取得する関数
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    // getMonth() は 0 から始まるため +1 する
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

export default function AdminPage() {
  const [title, setTitle] = useState("");
  // 🔥 修正した関数を呼び出す
  const [date, setDate] = useState(getTodayDateString()); 
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("シアターマイスター"); 
  const [category, setCategory] = useState("news");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(""); 
  const [imageLinkName, setImageLinkName] = useState("");
  const [altText, setAltText] = useState(""); 
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date); 
    formData.append("description", description);
    formData.append("author", author); 
    formData.append("category", category);
    formData.append("content", content);
    formData.append("imageUrl", imageUrl); 
    formData.append("imageLinkName", imageLinkName);
    formData.append("altText", altText); 
    
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("/api/create-article", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`記事作成成功: ${data.slug}`);
        // フォームのリセット 
        setTitle("");
        // 🔥 リセット時も修正後の関数で今日の日付を再設定
        setDate(getTodayDateString()); 
        setDescription("");
        setAuthor("シアターマイスター"); 
        setCategory("news");
        setContent("");
        setImageFile(null);
        setImageUrl(""); 
        setImageLinkName("");
        setAltText(""); 
        
        (document.getElementById('image-upload') as HTMLInputElement).value = '';
      } else {
        setMessage(`記事作成に失敗しました: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`記事作成に失敗しました: ${error.message}`);
    }
  };
  
  // DatePickerのために、date文字列をDateオブジェクトに変換
  const selectedDate = date ? new Date(date) : null;
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      // DatePickerから取得したDateオブジェクトを、再度ローカルタイムゾーンでフォーマットして保存
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
        📝 管理画面 - 新しい記事の投稿
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
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                >
                    <option value="news">ニュース</option>
                    <option value="blog">ブログ</option>
                </select>
            </div>
            <div className="col-span-2 w-full">
                <DatePicker
                    selected={selectedDate} // ここに今日の日付が反映される
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd" 
                    placeholderText="公開日 必須"
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
            
            {/* ファイル選択 と 代替テキスト (alt属性) - 横並び */}
            <div className="grid grid-cols-2 gap-4 items-center">
                {/* 6-1. ファイル選択 (画像) */}
                <div className="flex items-center space-x-3">
                    <label className="text-gray-600 whitespace-nowrap">画像:</label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
                    />
                </div>
                
                {/* 6-2. 代替テキスト (alt属性) */}
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
                {/* 6-3. 参照URL */}
                <input
                    type="url"
                    placeholder="参照URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
                {/* 6-4. リンク時の名前 */}
                <input
                    type="text"
                    placeholder="リンク時の名前"
                    value={imageLinkName}
                    onChange={(e) => setImageLinkName(e.target.value)}
                    className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
            </div>
        </div>

        {/* 7. 本文 */}
        <textarea
          placeholder="記事の本文 (Markdown形式で記述) 必須"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md h-72 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
          required
        />

        {/* 送信ボタン */}
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-[1.01]"
        >
          🚀 記事を作成して公開
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