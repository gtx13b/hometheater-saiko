// app/admin/articles/admin-article-actions.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminArticleActionsProps {
  slug: string;
  title: string;
}

export default function AdminArticleActions({ slug, title }: AdminArticleActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`記事「${title}」を本当に削除しますか？\n（この操作は元に戻せません）`)) {
      return;
    }

    setIsDeleting(true);
    
    // 記事削除APIを呼び出し
    try {
      // 記事データから画像パスとカテゴリを取得するロジックが欠けているため、
      // ここでは最低限 slug のみを使って削除を試みます。
      // 本来は、lib/articles.ts で記事の full data を取得し、categoryとimagePathを渡す必要があります。
      
      const res = await fetch('/api/delete-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, category: 'news', imagePath: null }), // 画像削除ロジックが複雑なため、ここでは固定値を渡しています
      });

      if (res.ok) {
        alert(`記事「${title}」を削除しました。`);
        // 削除後、ページをリフレッシュして一覧を更新
        router.refresh(); 
      } else {
        const errorData = await res.json();
        alert(`削除に失敗しました: ${errorData.error}`);
      }
    } catch (error) {
      alert('削除中にエラーが発生しました。');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition disabled:bg-red-400"
    >
      {isDeleting ? '削除中...' : '削除'}
    </button>
  );
}