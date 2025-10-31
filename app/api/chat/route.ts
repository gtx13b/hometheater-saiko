import { GoogleGenAI as AIClient } from '@google/genai';
import * as fs from 'fs/promises';
import * as path from 'path';
import { NextResponse } from 'next/server';

// ------------------------------------
// 1. データ構造とファイルパスの定義
// ------------------------------------

interface Document {
    text: string;
    url: string;
    title: string;
    maker?: string[];    // メーカー名
    equipment?: string[]; // 機材カテゴリー
}

interface VectorizedDocument extends Document {
    embedding: number[];
}

interface RankedDocument extends VectorizedDocument {
    similarity: number;
    isMetaBoosted: boolean; // メタデータブーストが適用されたかを示すフラグ
}

// 💡 RAGデータファイル
const RAG_DATA_FILE = path.resolve(process.cwd(), 'rag_data.json'); 
const TOP_K = 10; 
const EMBEDDING_MODEL = "text-embedding-004";
const GENERATIVE_MODEL = "gemini-2.5-flash"; // 回答生成用
const ENTITY_MODEL = "gemini-2.5-flash"; // エンティティ抽出用

// ------------------------------------
// 2. ユーティリティ: コサイン類似度
// ------------------------------------

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0.0;
    let magnitudeA = 0.0;
    let magnitudeB = 0.0;
    
    if (vecA.length !== vecB.length) {
        console.error("Vectors must have the same dimension for cosine similarity.");
        return 0;
    }

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

// ------------------------------------
// 3. メタデータ抽出とハイブリッドな優先順位付けロジック
// ------------------------------------

const EQUIPMENT_CATEGORIES = ["AVアンプ", "スピーカー", "プロジェクター", "ディスプレイ", "プレーヤー", "ケーブル", "ソフト"];

// LLM出力のためのJSONスキーマを定義
const ENTITY_SCHEMA = {
    type: "OBJECT",
    properties: {
        maker: {
            type: "ARRAY",
            description: "質問から抽出されたメーカー名のリスト。例: 'DENON', 'SONY', 'エプソン', 'デビアレ'など。見つからない場合は空の配列。",
            items: { type: "STRING" }
        },
        equipment: {
            type: "ARRAY",
            description: `質問から抽出された機材カテゴリーのリスト。リストは${EQUIPMENT_CATEGORIES.join(', ')}のいずれかから選んでください。見つからない場合は空の配列。`,
            items: { type: "STRING" }
        },
        isBudgetQuery: { // 💡 追加: 予算/価格に関する質問か？
            type: "BOOLEAN",
            description: "質問が具体的な予算、価格、費用、コスト、または特定の価格帯（例: 100万円、安い、ハイエンド）について尋ねている場合はtrue。それ以外はfalse。",
        }
    },
    required: ["maker", "equipment", "isBudgetQuery"]
};

interface EquipmentQuery {
    maker: string[];
    equipment: string[];
    isBudgetQuery: boolean; // 💡 追加
}


/**
 * Geminiを利用して質問文からメタデータエンティティを抽出する
 * @param query - ユーザーの質問文
 * @returns 抽出されたメーカー名と機材カテゴリー、予算意図のフラグ
 */
async function extractQueryEntities(query: string): Promise<EquipmentQuery> {
    // LLMへのシステム指示: 検出されたままの表記で返すよう強制
    const systemInstruction = 
        `あなたは質問文を分析し、含まれるホームシアター関連の「メーカー名」と「機材カテゴリー」を厳密に抽出し、さらに質問が「予算/価格」に関するものか判定する専門家です。` +
        `質問文に該当する情報が見当たらない場合は、必ず空の配列（[]）またはfalseを返してください。` +
        `機材カテゴリーは、${EQUIPMENT_CATEGORIES.join(', ')} の中からのみ選んでください。`;

    try {
        const response = await exponentialBackoff(() => ai.models.generateContent({
            model: ENTITY_MODEL,
            contents: [{ role: 'user', parts: [{ text: `以下の質問文を分析してください: "${query}"` }] }],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: ENTITY_SCHEMA as any,
            }
        }));

        const jsonString = response.text?.trim();
        if (!jsonString) {
            console.warn("LLM entity extraction failed: response.text is empty or undefined.");
            return { maker: [], equipment: [], isBudgetQuery: false }; 
        }

        let parsedJson: EquipmentQuery;
        try {
            parsedJson = JSON.parse(jsonString) as EquipmentQuery;
        } catch (jsonError) {
            console.error("LLM Entity Extraction Error: Failed to parse JSON response:", jsonString.substring(0, 100), jsonError);
            return { maker: [], equipment: [], isBudgetQuery: false }; 
        }

        if (!Array.isArray(parsedJson.maker) || !Array.isArray(parsedJson.equipment) || typeof parsedJson.isBudgetQuery !== 'boolean') {
             console.error("LLM Entity Extraction Error: Parsed JSON structure is invalid. Keys are missing or not arrays/boolean.");
             return { maker: [], equipment: [], isBudgetQuery: false };
        }

        // 抽出されたメーカー名と機材カテゴリーを正規化し、重複を削除
        const normalizedMaker = [...new Set((parsedJson.maker || []).map(m => normalizeForBoost(m)))];
        const normalizedEquipment = [...new Set((parsedJson.equipment || []).map(e => normalizeForBoost(e)))];

        return { 
            maker: normalizedMaker, 
            equipment: normalizedEquipment,
            isBudgetQuery: parsedJson.isBudgetQuery
        };

    } catch (error) {
        console.error("LLM Entity Extraction failed after all retries. Falling back to empty entities:", error);
        return { maker: [], equipment: [], isBudgetQuery: false }; // 失敗時はRAGブーストなしで続行
    }
}

/**
 * 文字列をブースト比較用に正規化するユーティリティ関数
 */
function normalizeForBoost(str: string): string {
    // 1. 大文字化
    str = str.toUpperCase();
    // 2. 全角スペースを半角スペースに
    str = str.replace(/　/g, ' ');
    // 3. すべての空白文字を除去
    str = str.replace(/\s+/g, '');
    return str;
}


/**
 * 検索結果の記事リストに対し、メーカー名や機材カテゴリー、予算情報でスコアを調整する
 */
function prioritizeArticles(
    articles: RankedDocument[], 
    queryMaker: string[], 
    queryEquipment: string[],
    isBudgetQuery: boolean // 💡 NEW ARGUMENT
): RankedDocument[] {
    
    // クエリに特定の意図（メーカー、機材、予算）が含まれているか？
    const isQuerySpecific = queryMaker.length > 0 || queryEquipment.length > 0 || isBudgetQuery;
    
    // クエリが完全に汎用的なら、調整せずに返す
    if (!isQuerySpecific) {
        return articles.sort((a, b) => b.similarity - a.similarity); // 念のためソート
    }

    // 💡 1. 補正定数の定義
    const makerBoost = 0.60;              // メーカー名が一致した場合の超強力ブースト
    const equipmentBoost = 0.15;          // 0.15に再調整
    const budgetBoost = 0.50;             // 💡 NEW: 予算意図が一致した場合の強力ブースト
    const genericArticleAbsolutePenalty = 1.0; // 特定メーカー質問時の汎用記事強制排除
    const specificMismatchPenalty = 0.45; // メーカータグがあるが、クエリのメーカーと不一致の場合のペナルティ
    const genericArticleSoftPenalty = 0.45; // 🌟 NEW: 機材質問時、タグなし汎用記事への緩やかなペナルティ (0.30 -> 0.45に調整)
    
    // 予算マッチング用キーワード
    const budgetKeywords = ['予算', '価格', 'システム構成', 'コスト', '金額']; 

    
    return articles.map(article => {
        let similarityBoost = 0;
        let similarityPenalty = 0;
        
        const articleMakers = (article.maker || []);
        const articleEquipment = (article.equipment || []); 
        
        const normalizedArticleMakers = articleMakers.map(normalizeForBoost);
        const hasMakerMatch = queryMaker.some(qM => normalizedArticleMakers.includes(qM));
        
        let newSimilarity = article.similarity;
        const isGenericArticle = articleMakers.length === 0 && articleEquipment.length === 0;

        // --- ✨ 予算ブースティングロジック (メーカー/機材の前に適用) ✨ ---
        if (isBudgetQuery) {
            const normalizedTitle = normalizeForBoost(article.title);
            // 予算に関する質問であり、記事タイトルも予算関連キーワードを含む場合に強力にブースト
            const isBudgetArticle = budgetKeywords.some(keyword => normalizedTitle.includes(normalizeForBoost(keyword)));

            if (isBudgetArticle) {
                similarityBoost += budgetBoost;
                // console.log(`[RAG Boost - Budget] Applying strong budget boost to: ${article.title}`);
            }
        }

        // --- ✨ メーカー/機材ブースティング / ペナルティロジック ✨ ---
        
        if (queryMaker.length > 0) {
            // 質問が特定のメーカーを指している場合
            if (articleMakers.length === 0) {
                // 🚨 CASE 1: 特定のメーカーに関する質問だが、記事にメーカータグが全くない（汎用記事）
                newSimilarity -= genericArticleAbsolutePenalty; 
                // console.log(`[RAG Penalty - Generic] Applying absolute penalty to: ${article.title}. New score: ${newSimilarity.toFixed(4)}`);
            } else if (hasMakerMatch) {
                // CASE 2: メーカーが一致: 強力にブースト
                similarityBoost += makerBoost; 
                // console.log(`[RAG Boost - Match] Applying strong maker boost to: ${article.title}`);
            } else {
                // CASE 3: メーカーが不一致: 記事にはタグがあるが、クエリと異なるメーカー
                similarityPenalty += specificMismatchPenalty;
                // console.log(`[RAG Penalty - Mismatch] Applying specific penalty to: ${article.title}`);
            }
        } 
        
        // 🌟 NEW: 機材に関する質問（メーカーは不問）で、タグのない記事を緩やかにペナルティ
        // Makerのペナルティが適用されていない場合のみ実行
        if (queryMaker.length === 0 && queryEquipment.length > 0 && isGenericArticle) {
             similarityPenalty += genericArticleSoftPenalty;
             // console.log(`[RAG Penalty - Soft Generic] Applying soft penalty to: ${article.title}`);
        }

        // Equipment matching logic (ブーストとして適用)
        const normalizedArticleEquipment = articleEquipment.map(normalizeForBoost);
        const hasEquipmentMatch = queryEquipment.some(qE => normalizedArticleEquipment.includes(qE));
        
        if (hasEquipmentMatch) {
            similarityBoost += equipmentBoost;
        }


        // 類似度調整を適用 (Boost - Penalty)
        newSimilarity = newSimilarity + similarityBoost - similarityPenalty;

        return {
            ...article,
            similarity: Math.min(Math.max(newSimilarity, 0.00), 1.0), // スコアは0.00から1.0に制限
            isMetaBoosted: hasMakerMatch || hasEquipmentMatch || (isBudgetQuery && similarityBoost > 0),
        };
    }).sort((a, b) => b.similarity - a.similarity); 
}

// ------------------------------------
// 4. データローダーとAIクライアント
// ------------------------------------

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
}

// 💡 AIClientのインスタンスは一度だけ作成する
const ai = new AIClient({ apiKey }); 
let vectorizedData: VectorizedDocument[] | null = null;

/**
 * 指数バックオフを用いたリトライ処理
 */
async function exponentialBackoff<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const status = (error as any).status || (error as any).code;
            
            // 503 (Unavailable), 429 (Rate Limit), またはネットワークエラーの場合はリトライ
            if (status === 503 || status === 429 || status === undefined) {
                if (attempt === maxRetries - 1) {
                    console.error(`[Gemini API] Failed after ${maxRetries} attempts. Giving up.`);
                    throw error; // 最終試行で失敗したらエラーを再スロー
                }
                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000; // 1s, 2s, 4s + jitter
                console.warn(`[Gemini API] Retrying due to status ${status || 'Network Error'} in ${delay.toFixed(0)}ms (Attempt ${attempt + 1}/${maxRetries}).`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // その他の致命的なエラーはすぐにスロー
                throw error;
            }
        }
    }
    // ここには到達しないはず
    throw new Error("Exhausted all retries for Gemini API call.");
}

async function loadVectorizedData(): Promise<VectorizedDocument[]> {
    if (vectorizedData) {
        return vectorizedData;
    }
    const RAG_DATA_FILE_LOCAL = path.resolve(process.cwd(), 'rag_data.json'); 

    console.log(`RAG data loading from disk: ${RAG_DATA_FILE_LOCAL}`);
    try {
        const jsonContent = await fs.readFile(RAG_DATA_FILE_LOCAL, 'utf-8');
        vectorizedData = JSON.parse(jsonContent) as VectorizedDocument[]; 
        console.log(`RAG data loaded: ${vectorizedData.length} documents. First document title: ${vectorizedData[0]?.title}`);
        return vectorizedData;
    } catch (error) {
        console.error("------------------------------------------------------------------");
        console.error(`[FATAL ERROR] Failed to load RAG data from path: ${RAG_DATA_FILE_LOCAL}`);
        console.error(`Current Working Directory (CWD): ${process.cwd()}`);
        console.error("Error Details:", error);
        throw new Error("Internal Server Error: Could not load knowledge base.");
    }
}

// ------------------------------------
// 5. App Router API ハンドラー (POST)
// ------------------------------------

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
        }
        
        // 最後のユーザーメッセージを確実に抽出
        const lastUserMessage = messages.findLast((m: any) => m.role === 'user');
        const query = lastUserMessage?.text || '';

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Valid user query not found in messages.' }, { status: 400 });
        }
        
        // 1. データのロード
        const data = await loadVectorizedData();

        if (data.length === 0) {
            console.warn("WARNING: Knowledge base loaded 0 documents. Cannot perform RAG.");
            const systemPrompt = 
                `あなたはホームシアターに関する専門家です。質問に詳細かつ専門的に回答してください。`;
            
            const response = await exponentialBackoff(() => ai.models.generateContent({
                model: GENERATIVE_MODEL,
                contents: [{ role: 'user', parts: [{ text: query }] }],
                config: {
                    systemInstruction: systemPrompt,
                }
            }));
            
            return NextResponse.json({ text: response.text, context: [] }, { status: 200 });
        }
        
        // ----------------------------------------------------
        // LLMによるエンティティ抽出を実行
        // ----------------------------------------------------
        // 💡 LLMは質問からメーカー名、機材、そして予算意図を自動で抽出する
        const { maker: queryMaker, equipment: queryEquipment, isBudgetQuery } = await extractQueryEntities(query); 
        console.log(`[LLM Meta] Extracted: Maker: [${queryMaker.join(', ')}], Equipment: [${queryEquipment.join(', ')}], Budget: [${isBudgetQuery}]`);


        // 2. クエリを埋め込みベクトルに変換
        console.log(`Generating embedding for raw query: "${query.substring(0, 30)}..."`);
        
        const queryEmbeddingResponse = await exponentialBackoff(() => ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: [{ text: query }], 
        }));

        const queryVector = (queryEmbeddingResponse as any)?.embeddings?.[0]?.values as number[];
        
        if (!queryVector || queryVector.length === 0) {
            throw new Error("Failed to generate embedding vector for the query.");
        }

        // 3. 類似度検索 (RAG)
        let similarityResults: RankedDocument[] = data.map(doc => {
            const similarity = cosineSimilarity(queryVector, doc.embedding);
            return { ...doc, similarity, isMetaBoosted: false };
        });

        // 4. ハイブリッドなブーストとフィルタリングを適用
        similarityResults = prioritizeArticles(
            similarityResults, 
            queryMaker, 
            queryEquipment,
            isBudgetQuery // 💡 NEW ARGUMENT
        );
        
        // 類似度0.4以上のドキュメントのみをフィルタリングして利用し、TOP_Kに制限
        const topDocs = similarityResults
            .filter(item => item.similarity >= 0.4) 
            .slice(0, TOP_K);
        
        console.log("--- RAG Search Results (TOP K) ---");
        topDocs.forEach((item, index) => {
            console.log(`[${index + 1}] Similarity: ${item.similarity.toFixed(4)} | Boosted: ${item.isMetaBoosted ? 'Yes' : 'No'} | Title: ${item.title}`);
        });
        console.log("-----------------------------------");

        // 5. プロンプトの構築
        const context = topDocs.map(doc => 
            `REFERENCE: ${doc.title} (URL: ${doc.url})\nCONTENT:\n${doc.text}\n---`
        ).join('\n');

        const systemPrompt = 
            `あなたはホームシアターに関する専門家です。提供された文脈（REFERENCE）**のみ**を参考に、ユーザーの質問に詳細かつ専門的に回答してください。\n` +
            `回答の際には、**必ず**参照したREFERENCEの内容を**引用または要約**し、そのタイトルとURLを明確な引用元として含めてください。` +
            `参照情報が見つからない場合は、「関連する情報が見つかりませんでした」と回答してください。`;

        const finalPrompt = `${systemPrompt}\n\n--- CONTEXT ---\n${context}\n\n--- USER QUESTION ---\n${query}`;

        // 6. Geminiによる回答生成
        console.log("Generating response with Gemini...");
        
        const response = await exponentialBackoff(() => ai.models.generateContent({
            model: GENERATIVE_MODEL,
            contents: finalPrompt,
        }));

        let textResponse = response.text || "応答を生成できませんでした。";
        
        // 7. 応答の構築
        const contextData = topDocs.map(item => ({
            title: item.title,
            url: item.url,
            similarity: item.similarity,
        }));
        
        return NextResponse.json({ 
            text: textResponse, 
            context: contextData
        }, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to process chat request.' }, { status: 500 });
    }
}