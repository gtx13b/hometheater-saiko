// scripts/index_data.ts

import { GoogleGenAI as AIClient } from '@google/genai';
import * as dotenv from 'dotenv';
import { writeFile } from 'fs/promises'; 
// 💡 修正点: 型は 'import type' で、データは 'staticDocuments' としてインポート
import type { Document } from '../data/documents.ts'; 
import { staticDocuments } from '../data/documents.ts'; 
import { getDocumentsFromArticles } from './process_md_articles.ts'; // 💡 新しい処理関数をインポート

// .env ファイルの環境変数を読み込み
dotenv.config({ path: '.env.local' }); 

// RAGデータファイルの出力先
const RAG_DATA_FILE = 'rag_data.json'; 

// APIキーの確認とデバッグ
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// デバッグ用に追加: APIキーが読み込まれたかを確認する
if (apiKey && apiKey.length > 10) { 
    console.log("✅ GEMINI_API_KEY が .env.local から読み込まれました。");
    console.log(`キーの長さ: ${apiKey.length} 文字`); 
} else {
    throw new Error("GEMINI_API_KEY is not set or its value is invalid. Please check your .env.local file. Ensure it is defined as GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY.");
}

const ai = new AIClient({ apiKey });

// 💡 埋め込みベクトルを追加した後のデータ構造 
interface VectorizedDocument extends Document {
    embedding: number[];
}

async function createRAGDataFile() {
    console.log(`インデックスの作成を開始: ${RAG_DATA_FILE}`);
    
    // 1. 静的データと動的データを取得
    const articleDocuments = await getDocumentsFromArticles();
    
    // 2. データをマージ
    const allDocuments = [...staticDocuments, ...articleDocuments];
    
    const texts = allDocuments.map(d => d.text);

    // 💡 全てのテキストの埋め込みを一括で生成します。
    console.log(`→ Gemini APIを使用して ${texts.length} 個のドキュメントの埋め込みを生成中...`);
    
    const embeddingResponse = await ai.models.embedContent({
        model: "text-embedding-004", 
        contents: texts.map(text => ({ text })),
    });

    if (!embeddingResponse.embeddings || embeddingResponse.embeddings.length !== texts.length) {
        throw new Error("Embedding API returned invalid number of embeddings.");
    }
    
    const embeddings = embeddingResponse.embeddings.map(e => e.values as number[]);

    // ドキュメントと埋め込みベクトルを結合
    const vectorizedDocuments: VectorizedDocument[] = allDocuments.map((doc, index) => ({
        ...doc,
        embedding: embeddings[index],
    }));

    // 結合したデータをJSONファイルに書き込み
    const jsonContent = JSON.stringify(vectorizedDocuments, null, 2);
    await writeFile(RAG_DATA_FILE, jsonContent, 'utf-8');

    console.log(`✅ ${allDocuments.length}個のドキュメントが ${RAG_DATA_FILE} に書き込まれました。`);
    console.log('これでAPIルートからRAG検索が可能です。');
}

createRAGDataFile().catch(console.error);