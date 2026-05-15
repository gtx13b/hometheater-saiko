"use client";

import { useState } from "react";

export default function DeployButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDeploy = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/deploy", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setMessage("✅ " + (data.message || "デプロイを開始しました！"));
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err: any) {
      setMessage("⚠️ 通信エラー: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {message && (
        <div className="bg-gray-900 border border-gray-700 text-sm text-white px-4 py-2 rounded-lg shadow-lg max-w-xs text-right">
          {message}
        </div>
      )}
      <button
        onClick={handleDeploy}
        disabled={loading}
        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors disabled:opacity-50"
      >
        {loading ? "デプロイ中..." : "🚀 サイトを更新"}
      </button>
    </div>
  );
}
