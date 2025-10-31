// scripts/generate_rag_data.ts

import { GoogleGenAI as AIClient } from '@google/genai';
import * as fs from 'fs/promises';
import * as path from 'path';
// dotenvをインポートし、.env.localを明示的にロードします
import * as dotenv from 'dotenv';
const envPath = path.resolve(process.cwd(), '.env.local');
// dotenv.config() の結果を格納し、直接キーを参照できるようにする
const envConfig = dotenv.config({ path: envPath });

// 拡張子を明示し、モジュール解決エラーを回避します。
import { getDocumentsFromArticles } from './process_md_articles.ts'; 
// 🔥 修正点1: staticDocumentsとDocument型をdata/documents.tsからインポート
import { staticDocuments, type Document } from '../data/documents.ts'; 

// ------------------------------------
// 1. 設定
// ------------------------------------
const RAG_DATA_FILE = path.resolve(process.cwd(), 'rag_data.json'); 
const EMBEDDING_MODEL = "text-embedding-004"; 

// ... (省略: AIクライアントとAPIキーのセットアップ)

// envConfig.parsed から直接キーを取得し、環境変数に依存しない
const apiKey = envConfig.parsed?.GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    // APIキーがない場合、処理を中断
    console.error("\n[FATAL ERROR] GEMINI_API_KEYが設定されていません。RAGデータ生成をスキップします。");
    process.exit(1);
}

// 取得したapiKey変数をAIClientに直接渡す
const ai = new AIClient({ apiKey: apiKey });

interface VectorizedDocument extends Document {
    embedding: number[];
}

/**
 * RAG知識ベースを生成するメイン関数
 */
async function generateRagData() {
    console.log("--- RAG Knowledge Base Generation Started ---");

    // 1. Markdown記事からDocumentオブジェクトを取得
    const articleDocuments = await getDocumentsFromArticles();

    // 🔥 修正点2: 静的データと記事データを統合
    const allDocuments: Document[] = [
        ...staticDocuments, // 静的データを先頭に追加
        ...articleDocuments, // Markdown記事データを追加
    ];

    console.log(`\n--- データの統合 ---`);
    console.log(`静的ページ数: ${staticDocuments.length} 件`);
    console.log(`Markdown記事数: ${articleDocuments.length} 件`);
    console.log(`合計ドキュメント数: ${allDocuments.length} 件`);
    console.log("--------------------");


    if (allDocuments.length === 0) {
        console.warn("警告: 処理するドキュメントが一つも見つかりませんでした。rag_data.jsonは更新されません。");
        return;
    }
    
    // 🔥 NEW LOGGING: 認識した全ドキュメントのタイトルを出力して確認 (allDocumentsを使用)
    console.log(`\n--- 認識された全ドキュメント (${allDocuments.length}件) ---`);
    allDocuments.forEach((doc, index) => {
        // 静的データは 'STATIC'、記事は 'ARTICLE' と区別してログ出力するのも良いでしょう
        const type = index < staticDocuments.length ? 'STATIC' : 'ARTICLE';
        console.log(`[${index + 1}/${allDocuments.length}] [${type}] ${doc.title}`);
    });
    console.log("----------------------------------------");


    // 2. 埋め込みベクトルの生成 (allDocumentsを使用)
    console.log(`\n→ ${allDocuments.length} 件のドキュメントの埋め込みを生成中... (Model: ${EMBEDDING_MODEL})`);
    
    // 埋め込みテキストのリストを作成
    const textsToEmbed = allDocuments.map(doc => doc.text);

    try {
        // 埋め込みAPI呼び出し
        const embeddingResponse = await ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: textsToEmbed.map(text => ({ text: text })) as any,
        });

        // 3. Documentに埋め込みベクトルを追加 (allDocumentsを使用)
        const vectorizedDocuments: VectorizedDocument[] = [];
        const embeddings = (embeddingResponse as any).embeddings;

        for (let i = 0; i < allDocuments.length; i++) {
            vectorizedDocuments.push({
                ...allDocuments[i],
                embedding: embeddings[i].values as number[], 
            });
        }

        // 4. JSONファイルとして保存
        await fs.writeFile(
            RAG_DATA_FILE,
            JSON.stringify(vectorizedDocuments, null, 2),
            'utf-8'
        );

        console.log(`\n✅ rag_data.json が正常に更新されました。収録ドキュメント数: ${vectorizedDocuments.length} 件`);
        console.log(`ファイルパス: ${RAG_DATA_FILE}`);
        
    } catch (error) {
        // APIエラーの場合、キーが無効であることを明確に伝える
        if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
            console.error(`\n[FATAL ERROR - API KEY INVALID] 埋め込みAPI呼び出し中にエラーが発生しました。`);
            console.error(`原因: 設定されているAPIキーが無効であるか、または${EMBEDDING_MODEL}モデルを使用する権限がありません。`);
            console.error(`→ 有効な新しいキーを取得し、.env.localを更新してください。`);
        } else {
            // その他のエラーは再スローまたは詳細なログ出力
            console.error("\n[API ERROR - UNKNOWN] 埋め込みAPI呼び出し中に予期せぬエラーが発生しました:", error);
            process.exit(1); 
        }
    }
    
    console.log("--- RAG Knowledge Base Generation Finished ---");
}

// 実行
generateRagData().catch(error => {
    console.error("\n[FATAL ERROR] スクリプト実行中に予期せぬエラーが発生しました:", error);
    process.exit(1);
});