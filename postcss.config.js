// 既存の CommonJS 形式 (module.exports) を
// ES Module 形式 (export default) に変更します。

const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// 💡 修正点: export default に変更
export default config;