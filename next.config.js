/** @type {import('next').NextConfig} */
const nextConfig = {
  // 💡 webpack設定を追加して、ts/tsxファイルにpathsエイリアスを適用させる
  // 修正: config引数に型を適用するために、関数をnextConfigオブジェクト内ではなく外で定義します
  // @ts-ignore コメントを追加し、VS Codeの型チェック警告を無視します。
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  webpack: (config, { isServer }) => {
    // isServer を使用して、サーバー側のビルドとクライアント側のビルドを区別できますが、
    // エイリアス設定は通常どちらでも必要です。
    
    config.resolve.alias = {
      ...config.resolve.alias,
      // __dirname は Node.js のグローバル変数で、現在のディレクトリを示します
      '@': __dirname, 
    };

    return config;
  },
};

module.exports = nextConfig;
