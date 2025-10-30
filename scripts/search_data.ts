// scripts/search_data.ts
// 💡 RAG検索ロジックを実装し、上位K件（ここでは3件）のドキュメントを抽出します。
import { GoogleGenAI as AIClient } from '@google/genai';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises'; // JSONファイルの読み込みに使用

// .env ファイルの環境変数を読み込み
dotenv.config({ path: '.env.local' }); 

const RAG_DATA_FILE = 'rag_data.json'; 

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey || apiKey.length < 10) { 
    throw new Error("GEMINI_API_KEY is not set or its value is invalid.");
}

const ai = new AIClient({ apiKey });

interface VectorizedDocument {
    text: string;
    url: string;
    title: string;
    embedding: number[];
}

export interface SearchResult extends VectorizedDocument { // 💡 エクスポート追加: API等での利用のため
    similarity: number;
}

// 💡 コサイン類似度を計算するヘルパー関数
// コサイン類似度は、2つのベクトルの方向がどれだけ似ているかを示す指標です。
// 1に近いほど類似性が高いことを意味します。
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0; // ゼロベクトル
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * 検索クエリに基づいて、埋め込みドキュメントから上位K件を取得します。
 * @param query 検索クエリ
 * @param k 取得するドキュメントの数
 * @returns 類似度が高い順にソートされたドキュメントのリスト
 */
export async function retrieveRAGDocuments(query: string, k: number = 3): Promise<SearchResult[]> { // 💡 exportを追加
    console.log(`RAG検索を開始: クエリ='${query}', 取得数= ${k}`);

    // 1. RAGデータを読み込み
    const fileContent = await readFile(RAG_DATA_FILE, 'utf-8');
    const documents: VectorizedDocument[] = JSON.parse(fileContent);

    // 2. 検索クエリの埋め込みを生成
    console.log('→ クエリの埋め込みを生成中...');
    const queryEmbeddingResponse = await ai.models.embedContent({
        model: "text-embedding-004", 
        contents: [{ text: query }],
    });
    
    // 埋め込みベクトルを取得
    const queryEmbedding = queryEmbeddingResponse.embeddings?.[0]?.values as number[];

    if (!queryEmbedding) {
        throw new Error("Failed to generate embedding for the query.");
    }

    // 3. 各ドキュメントとの類似度を計算
    const rankedResults: SearchResult[] = documents.map(doc => {
        const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
        return {
            ...doc,
            similarity: similarity,
        };
    });

    // 4. 類似度でソートし、上位K件を取得
    // 降順（類似度が高いものが最初）にソート
    rankedResults.sort((a, b) => b.similarity - a.similarity);
    
    // 💡 ここでK件に絞り込みます
    const topKResults = rankedResults.slice(0, k);

    return topKResults;
}

// 💡 修正点: ES Module 環境で動作させるため、require.main === module のチェックを削除し、
//     単独実行時のテストロジックを非同期IIFEに変更しました。
(async () => {
    try {
        const targetQuery = "ホームシアター";
        const results = await retrieveRAGDocuments(targetQuery, 3);

        console.log(`\n✅ クエリ「${targetQuery}」に対する上位3件の結果:`);
        results.forEach((r, index) => {
            // 類似度をパーセンテージ形式にフォーマット
            const similarityPercent = (r.similarity * 100).toFixed(2);
            console.log(`
[${index + 1}位] 類似度: ${similarityPercent}%
    タイトル: ${r.title}
    URL: ${r.url}
    テキストスニペット: ${r.text.substring(0, 50)}...
`);
        });
    } catch (error) {
        console.error("検索中にエラーが発生しました:", error);
    }
})();
