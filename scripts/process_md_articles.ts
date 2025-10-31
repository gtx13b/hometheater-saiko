import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkPlainText from 'remark-plain-text'; 

// ------------------------------------
// 🔥 修正 1: Document型をmakerとequipmentに更新
// ------------------------------------
export type Document = {
    text: string;
    url: string;
    title: string;
    maker?: string[];     // メーカー名 (配列を想定)
    equipment?: string[]; // 機材カテゴリー (配列を想定)
};

// 処理対象のディレクトリ
const ARTICLES_DIR = path.join(process.cwd(), 'data', 'blog-articles'); 

// サイトのベースURL
const BASE_URL = 'https://hometheater-saiko.vercel.app/'; 

// ------------------------------------
// URLに含めることを許可するカテゴリのリスト (全て小文字で)
// ------------------------------------
const ALLOWED_CATEGORIES = ['news', 'blog'];

// ------------------------------------
// 既存ロジック
// ------------------------------------
/**
 * MarkdownファイルからDocumentオブジェクトを生成する
 */
async function processMarkdownFile(filePath: string): Promise<Document> {
    // ファイル名（拡張子なし）を取得
    const fileName = path.basename(filePath, path.extname(filePath)); 
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { content, data: frontmatter } = matter(fileContent);

    // remark でプレーンテキストに変換
    const plainTextResult = await remark().use(remarkPlainText).process(content);
    
    // 埋め込み用テキストを1500文字に制限
    const description = plainTextResult.toString().trim().substring(0, 1500); 

    // Documentオブジェクトの構築に必要な基本データ
const category = frontmatter.category || '未分類';
const title = frontmatter.title || fileName;

// 🔥 修正点A: 新しいメタデータを取得・配列化するロジックを強化
// 1. データを取り出す
const rawMakerData = frontmatter.maker;
const rawEquipmentData = frontmatter.equipment;

/**
 * データを配列に変換するユーティリティ関数
 * - 既に配列ならそのまま返す
 * - 文字列ならカンマで分割し、トリムして返す
 * - それ以外は空の配列を返す
 */
const convertToArray = (data: any): string[] => {
    if (Array.isArray(data)) {
        // 既に配列なら、文字列化してトリム
        return data.map((item: any) => String(item).trim());
    }
    if (typeof data === 'string') {
        // カンマ区切り文字列なら、分割してトリムし、空要素を削除
        return data.split(',')
                   .map(item => item.trim())
                   .filter(item => item.length > 0);
    }
    return []; // データがない、または不正な形式
};

// 修正された変換ロジックを適用
const maker: string[] = convertToArray(rawMakerData);
const equipment: string[] = convertToArray(rawEquipmentData);

// 埋め込み対象テキストにタイトルとカテゴリー情報をプレフィックスとして追加
const makerTag = maker.length > 0 ? `[メーカー: ${maker.join(', ')}]` : '';
const equipmentTag = equipment.length > 0 ? `[機材カテゴリ: ${equipment.join(', ')}]` : '';
 
const embeddingText = `[タイトル: ${title}] [カテゴリー: ${category}] ${makerTag} ${equipmentTag} ${description}`.trim();

    // ---------------------------------------------------------------------
    // ✅ URLの構築ロジック（変更なし）
    // ---------------------------------------------------------------------
    const lowerCaseCategory = category.toLowerCase(); 
    const isAllowedCategory = ALLOWED_CATEGORIES.includes(lowerCaseCategory);

    const urlPath = isAllowedCategory
        ? `${lowerCaseCategory}/${fileName}`
        : fileName;


    return {
        text: embeddingText, 
        url: `${BASE_URL}${urlPath}`, 
        title: `[${category}] ${title}`,
        // 🔥 修正 2C: 新しいメタデータをDocumentオブジェクトに格納
        maker: maker,
        equipment: equipment,
    };
}

/**
 * ディレクトリ内のすべてのMarkdownファイルを処理し、Document配列を返す
 */
export async function getDocumentsFromArticles(): Promise<Document[]> {
    console.log("\n--- DEBUG: getDocumentsFromArticles関数が実行されました (ユーザーロジックベース) ---");

    const resolvedArticlesDir = path.resolve(ARTICLES_DIR);
    
    try {
        const files = await fs.readdir(resolvedArticlesDir, { withFileTypes: true });
        
        const mdFiles = files.filter(file => {
            if (file.isDirectory()) return false;
            const ext = path.extname(file.name).toLowerCase();
            return ext === '.md' || ext === '.markdown';
        });

        const mdFilePaths = mdFiles.map(file => path.join(resolvedArticlesDir, file.name));
        
        const mdFilesCount = mdFilePaths.length;
        
        console.log(`\n→ ${resolvedArticlesDir} 内の ${mdFilesCount} 件のMarkdown記事を処理中...`);
        console.log(`[DEBUG] 認識されたファイル: ${mdFiles.map(f => f.name).join(', ')}`);


        if (mdFilesCount === 0) {
            console.warn(`[警告] 処理するMarkdownファイルが見つかりませんでした。パス: ${resolvedArticlesDir}`);
            return [];
        }

        const documentPromises = mdFilePaths.map(filePath => {
            return processMarkdownFile(filePath);
        });

        return Promise.all(documentPromises);
        
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.error(`[CRITICAL ERROR] ディレクトリが見つかりません: ${ARTICLES_DIR}`);
            return [];
        }
        throw error;
    }
}