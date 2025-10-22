// app/api/delete-article/route.ts の全文

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

// 既存の画像を削除するヘルパー関数
async function deleteImage(imagePath: string) {
    // imagePath には /images/category/ID.jpg が入っていることを前提とする
    if (!imagePath || !imagePath.startsWith('/images/')) return;
    
    // public/ に imagePath のパスをそのまま結合して物理パスを作成
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    try {
        await fs.unlink(fullPath);
        console.log(`Deleted article image: ${fullPath}`);
    } catch (error: any) {
        // ファイルが存在しない (ENOENT) 場合でも成功とみなす
        if (error.code !== 'ENOENT') {
             console.error('Failed to delete article image:', error);
             // 致命的なエラーではないため、削除処理は続行
        } else {
             console.log(`Image file not found at ${fullPath}, skipping image deletion.`);
        }
    }
}

export async function POST(req: Request) {
    try {
        const { slug } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: "スラッグが指定されていません" }, { status: 400 });
        }

        const dataDir = path.join(process.cwd(), "data/blog-articles");
        const filePathMd = path.join(dataDir, `${slug}.md`);

        // 1. 記事ファイルを読み込み、画像パスを取得する
        let imagePathToDelete = null;
        try {
            const fileContent = await fs.readFile(filePathMd, "utf8");
            const { data } = matter(fileContent);
            
            if (data.image && data.image !== "none") {
                imagePathToDelete = data.image as string;
            }
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return NextResponse.json({ error: "指定された記事ファイルが見つかりません" }, { status: 404 });
            }
            console.error("記事ファイルの読み込み中にエラー:", error);
            // 読み込みに失敗しても削除は試みるため、ここで終了しない
        }

        // 2. Front Matter に画像パスがあれば、画像を削除する
        if (imagePathToDelete) {
            await deleteImage(imagePathToDelete);
        }

        // 3. Markdown ファイル自体を削除する
        await fs.unlink(filePathMd);

        return NextResponse.json({ message: `記事と関連画像を削除しました: ${slug}` }, { status: 200 });
        
    } catch (error: any) {
        console.error("記事削除エラー:", error);
        return NextResponse.json({ error: error.message || "記事の削除に失敗しました" }, { status: 500 });
    }
}