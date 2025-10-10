// tailwind.config.js (新規作成)

/** @type {import('tailwindcss').Config} */
// 💡 デフォルトのテーマ設定をインポート
const defaultTheme = require('tailwindcss/defaultTheme'); 

module.exports = {
  // コンテンツの場所を指定 (あなたの環境に合わせて確認)
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 💡 フォント設定を拡張
      fontFamily: {
        // Noto Sans JPをデフォルトのサンセリフとして設定
        sans: ['var(--font-noto-sans-jp)', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: '0.625rem', // 10px相当
      },
      // ... その他の設定は省略
    },
  },
  plugins: [],
};