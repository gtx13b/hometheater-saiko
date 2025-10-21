// app/articles/page.js
import Link from "next/link";

const articles = [
  { title: "設置・空間設計ガイド", href: "/installation" },
  { title: "スピーカー配置のコツ", href: "/speaker-setup" },
  // 他の記事もここに追加
];

export default function ArticlesPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">全記事一覧</h1>
      <ul className="space-y-4">
        {articles.map((article, index) => (
          <li key={index}>
            <Link href={article.href} className="text-blue-600 hover:underline">
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
