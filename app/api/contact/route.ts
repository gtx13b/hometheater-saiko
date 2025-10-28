// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
// import nodemailer from 'nodemailer'; // 💡 ビルドエラー回避のため、一時的にコメントアウト

// 💡 注意: Nodemailer関連のコード（transporter定義、sendMail関数）はすべて削除またはコメントアウトされています。

// POSTリクエストを処理する関数（フォームデータを受け取る）
export async function POST(request: NextRequest) {
  try {
    // リクエストボディからフォームデータを取得
    const data = await request.json();
    const { name, email, message } = data;

    // データの検証（簡易チェック）
    if (!name || !email || !message) {
      return NextResponse.json({ message: '必須項目が不足しています。' }, { status: 400 });
    }

    // 💡 サーバーのコンソール（Vercelのログ）にフォームデータを出力するだけにする
    console.log('--- フォームデータを受信しました ---');
    console.log('お名前:', name);
    console.log('メールアドレス:', email);
    console.log('お問い合わせ内容:', message);
    console.log('---------------------------------');

    // 成功レスポンスを返す
    // フォーム送信は成功したとクライアント（ブラウザ）に伝える
    return NextResponse.json({ message: 'データ受信に成功しました。' }, { status: 200 });

  } catch (error) {
    // 処理中にエラーが発生した場合
    console.error('API Error:', error);
    return NextResponse.json({ message: 'データ処理中にサーバーエラーが発生しました。' }, { status: 500 });
  }
}