// tailwind.config.js (または .cjs)
module.exports = {
  content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}', // 👈 このパスは重要
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  // 他のパスは一時的に削除またはコメントアウトしてテスト
],
  theme: {
    extend: {},
  },
  plugins: [],
};