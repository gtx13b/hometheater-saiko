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
        console.log(data.data); // デプロイIDなど確認用
        setMessage("✅ デプロイを開始しました！");
      } else {
        setMessage("❌ デプロイに失敗しました: " + data.error);
      }
    } catch (err: any) {
      setMessage("⚠️ 通信エラー: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleDeploy}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "デプロイ中…" : "サイトを更新"}
      </button>
      {message && <p className="ml-4 text-sm">{message}</p>}
    </div>
  );
}
