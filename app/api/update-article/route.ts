// app/api/update-article/route.ts の全文 (Front Matterの改行を修正)

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp"; 

// ==============================================================================
// ヘルパー関数 (変更なし)
// ==============================================================================

/** Base64文字列を受け取り、WebPに変換してディスクに書き込む */
async function writeImageFromBase64(base64Data: string, finalSlug: string, category: string): Promise<string> {
    const base64Image = base64Data.split(';base64,').pop();
    if (!base64Image) {
        throw new Error("Invalid Base64 format");
    }
    const buffer = Buffer.from(base64Image, 'base64');
    
    const lowerCaseCategory = (category || 'default').toLowerCase(); 
    
    const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();
    const imageName = `${finalSlug}.webp`; 
    const destDir = path.join(process.cwd(), "public", "images", lowerCaseCategory); 
    
    await fs.mkdir(destDir, { recursive: true });
    const destPath = path.join(destDir, imageName);
    await fs.writeFile(destPath, webpBuffer); 
    
    return `/images/${lowerCaseCategory}/${imageName}`;
}

async function deleteExistingImage(imagePath: string) {
    if (!imagePath || !imagePath.startsWith('/images/')) return;
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    try {
        await fs.unlink(fullPath);
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
             console.error('Failed to delete old image:', error);
        }
    }
}

// ==============================================================================
// POST ハンドラ
// ==============================================================================

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const dataDir = path.join(process.cwd(), "data/blog-articles");

        // 1. JSONデータの取得
        const slug: string = data.slug; 
        const title: string = data.title; 
        const date: string = data.date;   
        const category: string = data.category; 
        const content: string = data.content || ""; 
        const description: string = data.description || "";
        const author: string = data.author || "";
        
        const imageBase64: string | null = data.imageBase64 || null; 
        const oldImage: string = data.oldImage || ""; 
        const deleteImage: boolean = data.deleteImage || false; 
        const altText: string = data.altText || "";
        const imageUrl: string = data.imageUrl || "";
        const imageLinkName: string = data.imageLinkName || "";

        const filePathMd = path.join(dataDir, `${slug}.md`);

        // 2. バリデーション
        if (!slug || !title || !date || !content.trim() || !category) {
          return NextResponse.json({ error: "必須フィールドが不足しています" }, { status: 400 });
        }
        
        let finalImagePath = oldImage; 
        
        // 3. 画像の更新処理 (変更なし)
        if (imageBase64) {
          if (oldImage) await deleteExistingImage(oldImage);
          finalImagePath = await writeImageFromBase64(imageBase64, slug, category); 
        } else if (deleteImage && oldImage && oldImage !== "none") { 
          await deleteExistingImage(oldImage); 
          finalImagePath = "none";
        }
        
        // 4. 🔥 本文処理: 先頭と末尾の空白（改行含む）を完全に除去
        const finalContentForSave = content.trim(); 
        
        // 5. Front MatterとMarkdown本文を結合
        const frontMatterImagePath = finalImagePath || "none"; 
        
        const imageReferenceBlock = ""; 
        
        const referenceValue = imageUrl ? `${imageUrl}|${imageLinkName}` : "";
        // frontMatterReferenceから先頭の \n を削除し、後で適切に追加する
        let frontMatterReference = referenceValue ? `参照: "${referenceValue.replace(/"/g, '\\"')}"` : '';
        
        const finalArticleContent = finalContentForSave; 
        
        // 🔥 修正箇所: imageキー、参照キー、altキーが必ず改行で区切られるように調整
        const finalFileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
author: "${author.replace(/"/g, '\\"')}"
category: "${category}"
image: "${frontMatterImagePath}"
${frontMatterReference ? `${frontMatterReference}\n` : ''}alt: "${altText.replace(/"/g, '\\"')}"
---\n${imageReferenceBlock}${finalArticleContent}`;

// 🔥🔥🔥 [重要] このログを追加してください 🔥🔥🔥
        console.log("--- DEBUG: Final File Content (Alt Text Check) ---");
        // altText の値だけを抜き出す
        console.log(`Input Alt Text: "${altText}"`); 
        console.log(`Front Matter Alt: "alt: "${altText.replace(/"/g, '\\"')}"`); 
        console.log("-------------------------------");
        // 🔥🔥🔥

        // ファイル書き込み
        const contentBuffer = Buffer.from(finalFileContent, 'utf8');
        await fs.writeFile(filePathMd, contentBuffer);

        return NextResponse.json({ message: "記事更新成功", slug }, { status: 200 });
    } catch (error: any) {
        console.error("記事更新エラー:", error);
        return NextResponse.json({ error: error.message || "記事更新に失敗しました" }, { status: 500 });
    }
}