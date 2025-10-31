// app/api/create-article/route.ts の修正後の全文

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp"; 

const slugify = require("slugify"); 

// writeImageToDisk 関数: 全ての画像をWebPに変換し、記事ID (スラッグ) をファイル名として保存
async function writeImageToDisk(file: File, finalSlug: string, category: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const lowerCaseCategory = category.toLowerCase(); 

    const webpBuffer = await sharp(buffer)
        .webp({ quality: 85 })
        .toBuffer();

    const imageName = `${finalSlug}.webp`; 
    
    const destDir = path.join(process.cwd(), "public", "images", lowerCaseCategory); 
    
    await fs.mkdir(destDir, { recursive: true });
    const destPath = path.join(destDir, imageName);
    
    await fs.writeFile(destPath, webpBuffer);
    
    return `/images/${lowerCaseCategory}/${imageName}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1. フォームデータの取得
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string; 
    const description = (formData.get("description") as string) || "";
    const author = (formData.get("author") as string) || "";
    
    // 🔥 NEW: makerとequipmentを取得
    const maker = (formData.get("maker") as string) || "";
    const equipment = (formData.get("equipment") as string) || "";
    
    const imageFile = formData.get("image") as File | null;
    const imageUrl = (formData.get("imageUrl") as string) || "";
    const imageLinkName = (formData.get("imageLinkName") as string) || "";
    const altText = (formData.get("altText") as string) || ""; 

    // 2. バリデーション
    if (!title || !date || !content.trim() || !category) {
      return NextResponse.json({ error: "必須フィールドが不足しています" }, { status: 400 });
    }
    
    // 3. スラッグの生成: IDをタイムスタンプに固定
    const finalSlug = Date.now().toString(); 
    
    const dataDir = path.join(process.cwd(), "data/blog-articles");
    const filePathMd = path.join(dataDir, `${finalSlug}.md`);

    // 4. 画像のアップロード処理（WebPに変換して保存）
    let finalImagePath = ""; 
    if (imageFile && imageFile.size > 0) {
      finalImagePath = await writeImageToDisk(imageFile, finalSlug, category); 
    }
    
    // 5. Front Matterの準備
    const frontMatterImagePath = finalImagePath || "none"; 
    
    const referenceValue = imageUrl ? `${imageUrl}|${imageLinkName}` : "";
    // 参照フィールドをFront Matterに追加
    let frontMatterReference = referenceValue ? `\n参照: "${referenceValue.replace(/"/g, '\\"')}"` : '';

    // 🔥 NEW: makerとequipmentをFront Matterに追加
    let frontMatterMaker = maker ? `\nmaker: "${maker.replace(/"/g, '\\"')}"` : '';
    let frontMatterEquipment = equipment ? `\nequipment: "${equipment.replace(/"/g, '\\"')}"` : '';
    
    const finalContent = content.trim(); 
    
    // 7. Markdownファイルの結合と保存
    const frontMatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
author: "${author.replace(/"/g, '\\"')}"
category: "${category}"
image: "${frontMatterImagePath}"${frontMatterReference}${frontMatterMaker}${frontMatterEquipment}
alt: "${altText.replace(/"/g, '\\"')}"
---

${finalContent}`;

    await fs.writeFile(filePathMd, frontMatter, "utf8");

    // 8. 最終スラッグ (ID) を返却
    return NextResponse.json({ message: "記事作成成功", slug: finalSlug }, { status: 200 });
  } catch (error: any) {
    console.error("記事作成エラー:", error);
    return NextResponse.json({ error: error.message || "記事作成に失敗しました" }, { status: 500 });
  }
}