// app/api/deploy/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;
    const vercelToken = process.env.VERCEL_TOKEN;

    // 💡 環境変数が不足している場合、すぐにエラーを返す
    if (!vercelProjectId || !vercelToken) {
        return NextResponse.json(
            { success: false, error: "VERCEL_PROJECT_ID または VERCEL_TOKEN が不足しています。" }, 
            { status: 500 }
        );
    }
    
    // 💡 プロジェクトIDをURLに含める
    const deploymentUrl = `https://api.vercel.com/v13/deployments?projectId=${vercelProjectId}`;

    const response = await fetch(deploymentUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`, // トークンを使用
        "Content-Type": "application/json",
      },
      // ... (body の内容はそのまま)
      body: JSON.stringify({
         name: process.env.VERCEL_PROJECT_NAME,
         target: "production",
         gitSource: {
           type: "github",
           org: "gtx13b",
           repo: "hometheater-saiko",
           ref: "main",
         },
      }),
    });

    // 💡 レスポンスが空または不正なJSONでないかチェック
    const responseText = await response.text(); // まずテキストとして取得
    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        // JSONパースエラーが発生した場合、空のレスポンスが原因
        console.error("Failed to parse Vercel API response:", responseText);
        return NextResponse.json({ 
            success: false, 
            error: "Vercel APIから不正なレスポンスを受信しました（認証エラーの可能性が高い）。" 
        }, { status: 500 });
    }
    
    // ... 成功/失敗のチェック
    if (!response.ok) {
        console.error("Vercel API Error:", data);
        return NextResponse.json({ 
            success: false, 
            error: data.error?.message || "Vercel APIがエラーを返しました" 
        }, { status: response.status });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "不明なエラー";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}