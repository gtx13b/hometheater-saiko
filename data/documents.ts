// data/documents.ts

/**
 * RAG検索に使用するデータの基本構造
 */
export interface Document {
    text: string;
    url: string;
    title: string;
}

/**
 * 💡 静的データ（ハードコードされた記事やページ情報）
 */
export const staticDocuments: Document[] = [
    {
        text: "【初心者必見】失敗しない機材選びの基本。最高の感動は、正しい機材選びから始まる。あなたの部屋に最適な「最適解」を見つけましょう。",
        url: "https://hometheater-saiko.vercel.app/gear-guide",
        title: "【初心者必見】失敗しないホームシアター機材選びの基本ガイド",
    },
    {
        text: "【予算別】ホームシアターおすすめシステム構成ガイド。10万円、60万円、150万円。あなたの予算と最高の感動を両立させる「最適解」を具体的に提案します。",
        url: "https://hometheater-saiko.vercel.app/budget-systems",
        title: "【予算別】ホームシアターおすすめシステム構成ガイド (10万円/60万円/150万円) ",
    },
    {
        text: "設置・空間設計ガイド：感動を呼ぶ「部屋づくり」機材の性能を100%引き出し、最高の没入感を生むための、スピーカー配置、視聴距離、そして音響調整のノウハウ。",
        url: "https://hometheater-saiko.vercel.app/installation",
        title: "【完全ガイド】ホームシアターの設置・空間設計の基本と応用",
    },
    {
        text: "AV機器（プロジェクター・スクリーン・AVアンプ・スピーカー・TVテレビ・再生機器・レコーダー・STBセットトップボックス・appletv firetv chromecast等）の新製品情報、技術トレンド、業界動向の速報をお届けします。",
        url: "https://hometheater-saiko.vercel.app/news",
        title: "ホームシアター 業界ニュース",
    },
    {
        text: "初心者向けガイドから詳細な製品（プロジェクター・AVアンプ・スピーカー）レビューまで。最適なシステム選びに役立つ記事をご覧ください。",
        url: "https://hometheater-saiko.vercel.app/blog",
        title: "ホームシアター ガイド & レビュー",
    },
    // 必要に応じて、さらにデータを追加してください...
];