// app/budget-systems/page.tsx

import { Metadata } from 'next';
import Image from 'next/image';

// ページのメタデータを設定（SEO対策）
export const metadata: Metadata = {
  title: '【予算別】ホームシアターおすすめシステム構成ガイド (10万円/60万円/150万円) | ホームシアター最高！',
  description: '予算10万円、60万円、150万円の3つのクラスに分け、初心者でも失敗しないホームシアター機材の具体的な組み合わせを提案。予算内で最高の感動を得るためのガイド。',
};

// 予算ごとのデータ構造
const budgetSystems = [
  {
    title: '１．【エントリークラス】10万円から始める5.1chサラウンド',
    subtitle: 'まずはホームシアターを始めるための「体験」を重視。',
    imagePath: '/images/budget_systems/entry_system.webp', 
    altText: 'YAMAHA NS-PA41スピーカーパッケージ',
     citationUrl: 'https://jp.yamaha.com/products/audio_visual/speaker_systems/ns-pa41/index.html', 
    description: '「まずは音の迫力を体験したい」「リビングに手軽に導入したい」方向けの構成です。現在は比較的テレビのサイズも大きくなってきていますのでまずは予算の全てを、「音の基礎」に集中させます。',
    strategy: 'AVアンプ（5.1ch）+スピーカーセットが基本ですが、もっとお手軽に最新のサウンドバーを買うという手もありですね。',
    table: [
      { category: '映像 (プロジェクター/スクリーン)', detail: '現在のテレビを使用', budget: '0万円' },
      { category: '音響 (AVアンプ/スピーカー)', detail: 'AVアンプ (5.1ch) + 5.1chスピーカーセット（又はサウンドバー）', budget: '10万円～' },
      { category: '合計', detail: '最高のコスパでテレビ音質を脱却', budget: '10万円～' },
    ],
  },
  {
    title: '２．【ミドルクラス】60万円で実現する「劇的」な感動（5.1.2ch Atmos入門）',
    subtitle: '音響・映像の質が大きく向上する「感動レベル」を重視。',
    imagePath: '/images/budget_systems/middle_system.webp', 
    altText: 'Gemini 画像生成',
    citationUrl: 'https://gemini.google.com/app',
    description: 'ホームシアターの「音質の劇的な向上」と「立体音響への第一歩」を踏み出すための構成です。長く使える機材を選び、将来的なアップグレードの余地を残します。',
    strategy: 'FULL HDプロジェクターで映像の解像度を上げ、画質を大幅に改善。AVアンプはDolby Atmos対応モデルを選び、天井埋め込み不要の「イネーブルドスピーカー」 で立体音響を構築します。',
    table: [
      { category: '映像 (プロジェクター/スクリーン)', detail: 'FULL HDプロジェクター + 100〜120インチ電動スクリーン', budget: '30万円' },
      { category: '音響 (AVアンプ/スピーカー)', detail: 'AVアンプ (7.1ch以上/Atmos対応) + 5.1chスピーカーセット + イネーブルドスピーカー', budget: '30万円' },
      { category: '合計', detail: '音響と映像のバランスがとれた構成', budget: '60万円' },
    ],
  },
  {
    title: '３．【ハイエンド入門】150万円で極める究極の没入感（7.1.4ch）',
    subtitle: '4K対応の映像と、完全な立体音響を含めた「没入感」を重視。',
    imagePath: '/images/budget_systems/high_end_system.webp', 
    altText: 'Bowers & Wilkins 700シリーズ',
    citationUrl: 'https://www.bowerswilkins.com/ja-jp/home-audio/700-series',
    description: '「最高のホームシアター体験」 を自宅で実現するための構成です。4K対応プロジェクターと完全な立体音響を構築し、画質、音質、そして設置方法のすべてにおいて妥協を排除します。',
    strategy: 'AVアンプは、9ch以上のパワーアンプ内蔵モデルを選び、天井に4つのスピーカーを埋め込む（7.1.4ch）ことで完全な立体音響空間を構築します。映像は、高性能な4K対応（疑似4K）プロジェクターと、高精細な映像の再現性が高い固定式テンションスクリーンの組み合わせで、高画質を追求します。',
    table: [
      { category: '映像 (プロジェクター/スクリーン)', detail: '4K対応HDRプロジェクター + 120インチ固定式テンションスクリーン', budget: '50万円' },
      { category: '音響 (AVアンプ/スピーカー)', detail: 'AVアンプ (9ch以上/Atmos/Auro-3D対応) + 7.1.4chスピーカー（トールボーイ含む）', budget: '100万円' },
      { category: '合計', detail: '映画館のような最高の没入体験を実現', budget: '150万円' },
    ],
  },
];

const BudgetSystemsPage = () => {
  return (
    <div className="bg-white text-gray-700 min-h-screen">
      
      {/* ヒーローセクション: タイトル */}
      <div className="bg-gray-50 border-b border-gray-200 py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-2">
            BUDGET SYSTEMS
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-4 leading-snug">
            【予算別】ホームシアターおすすめシステム構成ガイド
          </h1>
          <p className="text-lg sm:text-xl font-light text-gray-500 max-w-2xl mx-auto">
            10万円、60万円、150万円。あなたの予算と最高の感動を両立させる「最適解」を具体的に提案します。
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* 導入文 */}
        <section className="mb-24">
          <p className="text-xl leading-relaxed mb-6 text-gray-700 border-l-4 border-gray-300 pl-4">
            ホームシアター作りは、無限の選択肢があるがゆえに迷いがちです。高額な機材を揃えなくても、<strong className="text-gray-900">予算内で最大の「感動の体験」</strong>を得る方法が必ずあります。
          </p>
          <p className="text-lg leading-relaxed text-gray-500">
            このガイドでは、私が数多くの構築経験から導き出した、3つの主要な予算帯における「最強のシステム構成案」を具体的に提案します。無駄のない最高の買い物を実現しましょう。
          </p>
        </section>

        {/* 予算別セクションのループ */}
        {budgetSystems.map((system, index) => (
          <section key={index} className="mb-24 border border-gray-100 rounded-xl shadow-lg p-6 sm:p-10 bg-white">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">
              {system.title}
            </h2>
            <p className="text-lg font-medium text-gray-500 mb-6 border-b border-gray-200 pb-4">
              {system.subtitle}
            </p>

            {/* 予算システムの画像 */}
            <div className="relative w-full h-72 sm:h-80 bg-gray-100 mb-2 overflow-hidden rounded-lg">
              <Image
                src={system.imagePath} 
                alt={system.altText}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              />
            </div>
            
            {/* 💡 画像引用の注釈 (個別URLを使用) */}
            <blockquote className="text-right text-xs text-gray-400 mb-8 border-l-2 border-gray-100 pl-2">
              <a 
                href={system.citationUrl} // 💡 個別のURLを参照
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-600 transition duration-150 ease-in-out"
              >
                参照：{system.altText}
              </a>
            </blockquote>

            <p className="text-lg leading-relaxed mb-8 text-gray-700">
              {system.description}
            </p>
            
            {/* 構成テーブル */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">機材カテゴリ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推奨構成と予算配分</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予算目安</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {system.table.map((row, i) => (
                    <tr key={i} className={row.category === '合計' ? 'bg-gray-100 font-bold' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{row.detail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.budget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 最適解戦略 */}
            <div className="mt-6 p-4 border-l-4 border-gray-400 bg-gray-50 rounded-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">💡 {system.table[0].category === 'ハイエンド入門' ? 'ハイエンド入門' : system.table[0].category
  }の最適解</h3>
              <p className="text-lg text-gray-700">{system.strategy}</p>
            </div>
          </section>
        ))}

        {/* 結論 */}
        <section className="text-center pt-10 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            結論：最高の買い物とは、納得感で決まる。
          </h2>
          <p className="text-xl leading-relaxed mb-6 font-light text-gray-500 max-w-3xl mx-auto">
            この予算別ガイドは、あくまで「おすすめの構成案」です。最も重要なのは、<strong className="text-gray-900">「あなたが何を重視するか」</strong>です。
          </p>
          <div className="flex justify-center space-x-6 mb-8 text-lg font-medium text-gray-700">
            <span className="p-2 bg-gray-100 rounded-md">映画の迫力？ (→ 低音やサラウンド感)</span>
            <span className="p-2 bg-gray-100 rounded-md">ゲームの臨場感？ (→ 応答速度や画面の綺麗さ)</span>
          </div>
          
          <p className="text-2xl font-black text-gray-900 mb-8 tracking-tight">
            予算と希望を照らし合わせ、最高の買い物と最高の感動を実現してください。
          </p>
        </section>

      </div>
    </div>
  );
};

export default BudgetSystemsPage;