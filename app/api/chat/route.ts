// app/api/chat/route.ts

import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// 環境変数からAPIキーを読み込む
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables.');
}

// GoogleGenAIの初期化
const ai = new GoogleGenAI({ apiKey });

// 💡 ホームシアターに特化した指示をシステムプロンプトとして定義
const systemInstruction = "あなたは「ホームシアター最高！」の公式AIチャットボットです。ユーザーの予算や興味のある機材（プロジェクター、アンプ、スピーカーなど）について、優しく、親切に、具体的な提案を行ってください。専門用語は分かりやすく説明し、常にユーザーの疑問解消を最優先してください。";

/**
 * チャットリクエストを処理する POST メソッド
 */
export async function POST(req: Request) {
  try {
    // 🔥 修正点: クライアント側が送信する 'messages' キーでデータを受け取る
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      // 🐛 以前発生したエラーをここで返す
      return new NextResponse(JSON.stringify({ error: 'No messages provided.' }), { status: 400 });
    }

    // --- メッセージロールの変換ロジック ---

    // Gemini APIは 'user' と 'model' ロールのみをサポートするため、
    // クライアント側の 'ai' を 'model' に、その他の無効なロールは 'user' に変換
    const contents = messages
      .map((message: any) => {
        let role = message.role;
        
        // クライアント側の 'ai' ロールを Geminiの 'model' に変換
        if (role === 'ai') {
          role = 'model';
        } else if (role !== 'user') {
          // 'assistant' や 'system' などは 'user' として処理 (ただし、クライアント側で不要なロールを送らないのが理想)
          role = 'user';
        }

        return {
          role: role,
          // contentフィールドはGeminiでは parts 配列に変換される
          parts: [{ text: message.text }], // クライアント側の 'text' フィールドを使用
        };
      })
      // 'system' や不適切なメッセージを除外するため、最後にフィルタリング
      .filter((content: any) => content.role === 'user' || content.role === 'model');

    // --- ロール変換ロジック 終了 ---
    
    // Gemini APIにリクエストを送信
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: contents, // 変換済みの会話履歴
      config: {
        // サーバー側でシステムプロンプトを設定
        systemInstruction: systemInstruction,
        temperature: 0.7, 
      },
    });

    const aiResponseText = response.text;
    
    // AIの応答をJSON形式でクライアントに返す
    return new NextResponse(JSON.stringify({ text: aiResponseText }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    // クライアント側には一般的なエラーメッセージを返す
    return new NextResponse(JSON.stringify({ error: 'AI応答の取得中に致命的なエラーが発生しました。' }), { status: 500 });
  }
}