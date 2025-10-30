// pages/api/ask.ts
import { GoogleGenAI as AIClient } from '@google/genai';
import { retrieveRAGDocuments, SearchResult } from '../../scripts/search_data'; // 💡 RAG検索ロジックをインポート
import type { NextApiRequest, NextApiResponse } from 'next';

// -----------------------------------------------------------------------
// 1. API設定とクライアント初期化
// -----------------------------------------------------------------------

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.");
}

const ai = new AIClient({ apiKey });

// APIルートハンドラ
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // POSTメソッドのみを受け付ける
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid query in request body.' });
    }
    
    // -----------------------------------------------------------------------
    // 2. RAG (Retrieval) ステップ: 関連ドキュメントの取得
    // -----------------------------------------------------------------------
    let recommendedArticles: SearchResult[] = [];
    let context = "";

    try {
        // scripts/search_data.ts の関数を使って上位3件のドキュメントを取得
        recommendedArticles = await retrieveRAGDocuments(query, 3);

        // コンテキストとしてGeminiに渡す文字列を作成
        context = recommendedArticles
            .map((article, index) => 
                `---
[コン記事 #${index + 1}] タイトル: ${article.title}
URL: ${article.url}
内容: ${article.text}
---`
            )
            .join('\n\n');

    } catch (error) {
        // RAGデータの読み込みや埋め込み生成でエラーが発生した場合、ログに出力するが、
        // 処理自体は続行し、Geminiに直接回答させます（コンテキストなし）。
        console.error("RAG Retrieval Failed, proceeding without context:", error);
    }
    
    // -----------------------------------------------------------------------
    // 3. Generation ステップ: コンテキストに基づいた回答生成
    // -----------------------------------------------------------------------
    
    // Geminiに与えるシステムプロンプト
    const systemInstruction = 
        `あなたは「ホームシアター最高！」のサイト専門のAIコンサルタントです。
        以下の指示に厳密に従って、ユーザーの質問に回答してください。

        1. **回答の原則**: 
           - 提供された[コン記事]情報（コンテキスト）に**基づいて**回答してください。
           - コンテキスト情報に答えがない場合は、「申し訳ありませんが、提供された情報の中には、その質問に対する具体的な記述がございませんでした。」といった形で、情報が不足していることを丁寧に伝えてください。
           - サイトのトーン（親しみやすく、熱意がある）に合わせて、簡潔かつ明確に回答してください。
        
        2. **情報源の言及**:
           - 回答内で、コンテキスト情報（[コン記事 #X]）から得た情報源について言及しないでください。回答は、あなたが知っている事実として述べてください。

        3. **フォーマット**:
           - 外部サイトのURLを回答本文中に含めないでください。
           - 語尾に「〜です」「〜ます」を使い、フレンドリーな口調で答えてください。
           - 日本語で回答してください。`;

    // ユーザーに与えるクエリ（コンテキストを付加）
    const userPrompt = `
[コンテキスト情報]
${context}

[ユーザーからの質問]
${query}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: systemInstruction,
            },
        });

        const answerText = response.text;

        // 成功応答: AIの回答と、検索で取得した推薦記事をセットで返す
        res.status(200).json({ 
            answer: answerText,
            recommendedArticles: recommendedArticles.map(a => ({
                title: a.title,
                url: a.url,
                similarity: a.similarity,
            }))
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to generate response from AI.' });
    }
}
