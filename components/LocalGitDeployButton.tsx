// components/LocalGitDeployButton.tsx

"use client";

import { useState } from 'react';

/**
 * カスタムURLスキーム (git-deploy://trigger) を呼び出すデプロイボタン
 * * このボタンは、ローカルPC上にインストールされたJavaアプリケーション (GitDeployApp) を
 * 起動し、そのアプリ内で git add, commit, push の処理を自動実行させます。
 * * 注意: 成功・失敗の結果はブラウザ側では直接取得できないため、
 * Javaアプリのコンソール出力を確認する必要があります。
 */
export default function LocalGitDeployButton() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLocalDeploy = () => {
    setMessage("🔄 ローカルGit操作をトリガー中...");
    setIsSubmitting(true);
    
    // カスタムURLスキームを発行
    // これにより、Windowsレジストリに登録されたローカルアプリが起動します。
    window.location.href = "git-deploy://trigger";
    
    // アプリケーション起動後の待機とメッセージ表示
    // 成功・失敗は正確には判断できませんが、待機時間として設定
    setTimeout(() => {
      setMessage("✅ Git操作を起動しました。コンソール出力を確認してください。");
      setIsSubmitting(false);
      
      // 3秒後にメッセージをクリア
      setTimeout(() => setMessage(''), 3000);
      
    }, 1500); // アプリケーション起動のための短い遅延
  };
  
  return (
    <div className="flex flex-col items-end space-y-1">
      <button
        onClick={handleLocalDeploy}
        disabled={isSubmitting}
        className={`
          inline-flex items-center justify-center py-2 px-4 rounded-md font-semibold text-sm
          ${isSubmitting 
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300'
          }
        `}
      >
        {isSubmitting ? '🔄 処理実行中...' : '🔥 ローカルGitデプロイ'}
      </button>
      
      {message && (
        <p className={`text-xs font-medium w-full text-right ${message.includes('✅') ? 'text-green-600' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}