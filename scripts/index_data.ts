// scripts/index_data.ts
// 💡 修正点: ChromaDB関連のインポートを削除し、ローカルファイル操作のためのfs/promisesを追加
import { GoogleGenAI as AIClient } from '@google/genai';
import * as dotenv from 'dotenv';
import { writeFile } from 'fs/promises'; // JSONファイルへの書き込みに使用

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

// 💡 AIに覚えさせたいデータ構造を定義
interface Document {
    text: string;
    url: string;
    title: string;
}

// 💡 埋め込みベクトルを追加した後のデータ構造
interface VectorizedDocument extends Document {
    embedding: number[];
}

// 💡 ここにAIに覚えさせたいデータを追加してください！
const documents: Document[] = [
    {
        text: "【初心者必見】失敗しない機材選びの基本。最高の感動は、正しい機材選びから始まる。あなたの部屋に最適な「最適解」を見つけましょう。",
        url: "https://hometheater-saiko.vercel.app/gear-guide",
        title: "【初心者必見】失敗しないホームシアター機材選びの基本ガイド",
    },
    {
        text: "【予算別】ホームシアターおすすめシステム構成ガイド。10万円、60万円、150万円。あなたの予算と最高の感動を両立させる「最適解」を具体的に提案します。",
        url: "https://hometheater-saiko.vercel.app/budget-systems",
        title: "【予算別】ホームシアターおすすめシステム構成ガイド (10万円/60万円/150万円) ",
    },
    {
        text: "設置・空間設計ガイド：感動を呼ぶ「部屋づくり」機材の性能を100%引き出し、最高の没入感を生むための、スピーカー配置、視聴距離、そして音響調整のノウハウ。",
        url: "https://hometheater-saiko.vercel.app/installation",
        title: "【完全ガイド】ホームシアターの設置・空間設計の基本と応用",
    },
    {
        text: "AV機器（プロジェクター・スクリーン・AVアンプ・スピーカー・TVテレビ・再生機器・レコーダー・STBセットトップボックス・appletv firetv chromecast等）の新製品情報、技術トレンド、業界動向の速報をお届けします。",
        url: "https://hometheater-saiko.vercel.app/news",
        title: "ホームシアター 業界ニュース",
    },
    {
        text: "初心者向けガイドから詳細な製品（プロジェクター・AVアンプ・スピーカー）レビューまで。最適なシステム選びに役立つ記事をご覧ください。",
        url: "https://hometheater-saiko.vercel.app/news",
        title: "ホームシアター ガイド & レビュー",
    },
    // 必要に応じて、さらにデータを追加してください...
];

async function createRAGDataFile() {
    console.log(`インデックスの作成を開始: ${RAG_DATA_FILE}`);

    const texts = documents.map(d => d.text);

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
    const vectorizedDocuments: VectorizedDocument[] = documents.map((doc, index) => ({
        ...doc,
        embedding: embeddings[index],
    }));

    // 結合したデータをJSONファイルに書き込み
    const jsonContent = JSON.stringify(vectorizedDocuments, null, 2);
    await writeFile(RAG_DATA_FILE, jsonContent, 'utf-8');

    console.log(`✅ ${documents.length}個のドキュメントが ${RAG_DATA_FILE} に書き込まれました。`);
    console.log('これでAPIルートからRAG検索が可能です。');
}

createRAGDataFile().catch(console.error);
