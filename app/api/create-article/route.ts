// my-homepage\app\api\create-article\route.ts

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
// 🔥 修正: require() 構文を使用
const slugify = require("slugify"); 

// スラッグの理想的な最大文字数を定義
const MAX_SLUG_LENGTH = 60; 

/**
 * 日本語タイトルをSEOフレンドリーな短縮英数字スラッグに変換する
 */
function createBaseSlug(title: string): string {
    // 1. slugifyを使って、小文字、ハイフン区切り、特殊文字除去のスラッグを生成
    let slug = slugify(title, {
        lower: true,         
        strict: true,        
        locale: 'ja',        
        remove: /[*+~.()'"!:@]/g 
    });
    
    // 2. スラッグが長すぎる場合、指定した長さに切り詰める
    if (slug.length > MAX_SLUG_LENGTH) {
        // MAX_SLUG_LENGTHまで切り取る
        slug = slug.substring(0, MAX_SLUG_LENGTH);
    }
    
    // 3. 末尾の不要なハイフンを除去して整形
    slug = slug.replace(/-+/g, "-");
    slug = slug.replace(/^-|-$/g, "");
    
    if (!slug) {
        return "article";
    }

    return slug;
}

/**
 * スラッグの重複をチェックし、必要に応じて連番を付けて一意なスラッグを生成する
 */
async function findUniqueSlug(baseSlug: string): Promise<string> {
    const dataDir = path.join(process.cwd(), "data/blog-articles");
    let currentSlug = baseSlug;
    let counter = 1;

    while (true) {
        const filePathMd = path.join(dataDir, `${currentSlug}.md`);
        
        try {
            await fs.access(filePathMd, fs.constants.F_OK);
            // ファイルが存在した場合、連番を増やして次のスラッグを試行
            counter++;
            currentSlug = `${baseSlug}-${counter}`;
        } catch (error: any) {
            // ENOENT (ファイルが存在しない) の場合、ユニークである
            if (error.code === 'ENOENT') {
                return currentSlug;
            }
            // その他のエラーの場合は、エラーを投げる
            throw error;
        }
    }
}

/**
 * アップロードされた画像をディスクに書き込む
 */
async function writeImageToDisk(file: File, slug: string, category: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name || "").toLowerCase();
    const imageName = `${slug}${ext}`;
    const destDir = path.join(process.cwd(), "public", "images", category);
    
    await fs.mkdir(destDir, { recursive: true });
    const destPath = path.join(destDir, imageName);
    await fs.writeFile(destPath, buffer);
    
    return `/images/${category}/${imageName}`;
}


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 必須フィールド
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    
    // オプションフィールド
    const description = (formData.get("description") as string) || "";
    const author = (formData.get("author") as string) || "";
    const imageFile = formData.get("image") as File | null;
    
    // 追加入力フィールド
    const imageUrl = (formData.get("imageUrl") as string) || "";
    const imageLinkName = (formData.get("imageLinkName") as string) || "";
    const altText = (formData.get("altText") as string) || "";

    if (!title || !date || !content || !category) {
      return NextResponse.json({ error: "タイトル・日付・本文・カテゴリーは必須です" }, { status: 400 });
    }
    
    // スラッグ生成と重複チェック
    const baseSlug = createBaseSlug(title); 
    const slug = await findUniqueSlug(baseSlug); 

    if (!slug) {
        return NextResponse.json({ error: "有効なファイル名を生成できませんでした。タイトルを見直してください。" }, { status: 400 });
    }

    // 4. 画像アップロード
    let imagePath = "";
    if (imageFile && imageFile.size > 0) {
      imagePath = await writeImageToDisk(imageFile, slug, category); 
    }

    // 5. Markdown生成
    const filenameMd = `${slug}.md`;
    const dataDir = path.join(process.cwd(), "data/blog-articles");
    const filePathMd = path.join(dataDir, filenameMd);

    await fs.mkdir(dataDir, { recursive: true });

    // Front Matter用の参照URLとリンク名
    const referenceValue = imageUrl ? `${imageUrl}|${imageLinkName}` : "";
    let frontMatterReference = referenceValue ? `\n参照: "${referenceValue.replace(/"/g, '\\"')}"` : '';
    
    // HTML形式の画像参照ブロックを生成
    let imageReferenceBlock = "";
    
    if (imagePath) {
        const finalAltText = altText || title; 
        const escapedAltText = finalAltText.replace(/"/g, ''); 

        const displayLinkName = imageLinkName || imageUrl;
        
        const figCaption = imageUrl && displayLinkName
            ? `参照：<a href="${imageUrl}" target="_blank" style="color: #1d4ed8; text-decoration: underline;">${displayLinkName}</a>`
            : ''; 

        imageReferenceBlock = `
<figure style="text-align: center; margin: 20px auto;">
  <img src="${imagePath}" alt="${escapedAltText}" width="800" height="450" style="display: block; margin: 0 auto; border-radius: 8px;" />
  <figcaption style="margin-top: 8px; font-size: 0.9em; color: #6b7280;">
    ${figCaption}
  </figcaption>
</figure>\n\n`;
    }

    // Front Matterの結合
    const frontMatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
author: "${author.replace(/"/g, '\\"')}"
category: "${category}"
image: "${imagePath}"${frontMatterReference}
---

${imageReferenceBlock}${content}`;

    await fs.writeFile(filePathMd, frontMatter, "utf8");

    return NextResponse.json({ message: "記事作成成功", slug }, { status: 200 });
  } catch (error: any) {
    console.error("記事作成エラー:", error);
    return NextResponse.json({ error: error.message || "記事作成に失敗しました" }, { status: 500 });
  }
}