import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

function run(cmd, cwd) {
  return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

export async function POST() {
  try {
    const cwd = process.cwd();
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return NextResponse.json(
        { success: false, error: 'GITHUB_TOKEN が .env.local に設定されていません。' },
        { status: 500 }
      );
    }

    // gitignore対象外の全ファイルをステージ
    run('git add -A', cwd);

    // ステージされた変更のみ確認
    const staged = run('git diff --cached --name-only', cwd);
    if (!staged.trim()) {
      return NextResponse.json({ success: true, message: '変更なし。既に最新状態です。' });
    }

    const label = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    run(`git commit -m "Update: ${label}"`, cwd);

    const pushUrl = `https://gtx13b:${githubToken}@github.com/gtx13b/hometheater-saiko.git`;
    run(`git push ${pushUrl} main`, cwd);

    return NextResponse.json({
      success: true,
      message: 'GitHubへのプッシュ完了。Vercelが自動デプロイを開始します（1〜2分で反映）。',
    });
  } catch (err) {
    const message = err.stderr || err.stdout || err.message || String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
