// RAGのコアとなるロジック（データの読み込み、類似度計算、ブースト処理など）をこのファイルに集約します。
import * as fs from 'fs';
import * as path from 'path';

// RAGで利用するデータの構造
interface Document {
    url: string;
    title: string;
    text: string;
    embeddingText: string;
    embedding: number[];
}

// 類似度検索の結果
interface SimilarityResult {
    doc: Document;
    similarity: number;
}

// RAGの動作設定
const RAG_DATA_FILE_LOCAL = 'rag_data.json';
const TOP_K = 3;
const SIMILARITY_THRESHOLD = 0.3;

// キーワードブーストの設定
const BOOST_KEYWORDS: { [key: string]: number } = {
    "プロジェクター": 0.2,
    "avアンプ": 0.2,
    "ホームシアター": 0.1,
    "スピーカー": 0.1,
};

// ブランド名とそのローマ字表記のマッピング（クエリ強化用）
const BRAND_MAPPING: { [key: string]: string } = {
    "エプソン": "epson",
    "ソニー": "sony",
    "デノン": "denon",
    "ヤマハ": "yamaha",
    "オッポ": "oppo",
    "ベンキュー": "benq",
};

// ---------------------------
// 1. データローディング
// ---------------------------

/**
 * ベクトル化されたRAGデータをローカルファイルから読み込む。
 * @returns RAGドキュメント配列
 */
export async function loadVectorizedData(): Promise<Document[]> {
    try {
        const filePath = path.join(process.cwd(), RAG_DATA_FILE_LOCAL);
        const data = await fs.promises.readFile(filePath, 'utf-8');
        console.log(`RAG data loaded from: ${filePath}`);
        return JSON.parse(data) as Document[];
    } catch (error: any) {
        // ファイルが見つからない場合や読み込みエラーの場合、APIをクラッシュさせずに空データを返す
        if (error.code === 'ENOENT') {
            console.warn(`[RAG WARNING]: Data file not found at ${path.join(process.cwd(), RAG_DATA_FILE_LOCAL)}. RAG will be disabled.`);
            // RAGをスキップするため空配列を返す
            return [];
        }
        // その他のエラーの場合はログを出力して再スロー
        console.error(`[RAG ERROR]: Failed to load vectorized data: ${error.message}`);
        throw new Error('Failed to load RAG data due to file system error.');
    }
}

// ---------------------------
// 2. 類似度計算
// ---------------------------

/**
 * コサイン類似度を計算する（0.0から1.0）。
 * @param vecA クエリベクトル
 * @param vecB ドキュメントベクトル
 * @returns コサイン類似度
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    if (vecA.length !== vecB.length) return 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    
    return dotProduct / (magnitudeA * magnitudeB);
}

// ---------------------------
// 3. クエリの正規化とRAG処理
// ---------------------------

/**
 * クエリにブランドのローマ字表記を追加して、埋め込み精度を向上させる。
 * @param query ユーザーの質問
 * @returns 強化されたクエリ
 */
export function normalizeQuery(query: string): string {
    let enrichedQuery = query;
    const lowerQuery = query.toLowerCase();

    for (const [jp, en] of Object.entries(BRAND_MAPPING)) {
        // カタカナが含まれていたらローマ字を追加
        if (lowerQuery.includes(jp)) {
            enrichedQuery += ` ${en}`;
        }
        // ローマ字が含まれていたらカタカナを追加
        if (lowerQuery.includes(en)) {
            enrichedQuery += ` ${jp}`;
        }
    }

    return enrichedQuery.trim();
}

/**
 * 類似度を計算し、ブーストを適用して、LLMに渡す文脈テキストを生成する。
 * @param queryVector 質問の埋め込みベクトル
 * @param ragData 全RAGデータ
 * @returns 抽出されたトップドキュメントと文脈テキスト
 */
export function processRAG(queryVector: number[], ragData: Document[]): { topDocs: SimilarityResult[], context: string } {
    if (ragData.length === 0) {
        return { topDocs: [], context: "" };
    }

    // 💡 修正: mapのコールバックの引数に型を明示的に指定
    const similarityResults: SimilarityResult[] = ragData.map((doc: Document) => ({
        doc: doc,
        similarity: cosineSimilarity(queryVector, doc.embedding),
    }));

    // 類似度ブーストの適用
    // 💡 修正: mapのコールバックの引数に型を明示的に指定
    let boostedResults = similarityResults.map((item: SimilarityResult) => {
        let similarity = item.similarity;
        // normalizeQueryはクエリの正規化用なので、ここでは使用せず、小文字化とキーワードチェックのみを行う
        const docTextLower = (item.doc.title + " " + item.doc.url).toLowerCase();
        
        for (const [keyword, boostValue] of Object.entries(BOOST_KEYWORDS)) {
            if (docTextLower.includes(keyword) && item.doc.title.toLowerCase().includes(keyword)) {
                // ドキュメントのタイトルまたはURLキーワードにマッチした場合にブースト
                similarity += boostValue;
            }
        }

        // 類似度は1.0を上限とする
        return { ...item, similarity: Math.min(similarity, 1.0) };
    });

    // ブースト後の類似度で降順ソート
    boostedResults.sort((a, b) => b.similarity - a.similarity);

    // 類似度0.3以上のドキュメントのみをフィルタリングして利用し、TOP_Kに制限
    const topDocs = boostedResults
        .filter(item => item.similarity >= SIMILARITY_THRESHOLD) 
        .slice(0, TOP_K);

    // LLMに渡すための文脈テキストを生成
    const context = topDocs.map(item => 
        `記事タイトル: ${item.doc.title}\n記事内容: ${item.doc.text}\n参照元URL: ${item.doc.url}`
    ).join('\n\n---\n\n');

    return { topDocs, context };
}
