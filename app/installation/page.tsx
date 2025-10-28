// app/category/installation/page.tsx

import { Metadata } from 'next';
import Image from 'next/image';

// ページのメタデータを設定（SEO対策）
export const metadata: Metadata = {
  title: '【完全ガイド】ホームシアターの設置・空間設計の基本と応用 | ホームシアター最高！',
  description: '最高のホームシアター体験は、機材だけでなく「部屋づくり」で決まります。スピーカーの理想的な配置、視聴距離、遮光、吸音のノウハウを徹底解説。',
};

const InstallationGuidePage = () => {
  return (
    <div className="bg-white text-gray-700 min-h-screen">
      
      {/* ヒーローセクション: タイトル */}
      <div className="bg-gray-50 border-b border-gray-200 py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-2">
            INSTALLATION & DESIGN
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-4 leading-snug">
            設置・空間設計ガイド：感動を呼ぶ「部屋づくり」
          </h1>
          <p className="text-lg sm:text-xl font-light text-gray-500 max-w-2xl mx-auto">
            機材の性能を100%引き出し、最高の没入感を生むための、スピーカー配置、視聴距離、そして音響調整のノウハウ。
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* 導入文 */}
        <section className="mb-24">
          <p className="text-xl leading-relaxed mb-6 text-gray-700 border-l-4 border-gray-300 pl-4">
            高価な機材を買ったのに「なぜか感動が足りない」と感じることはありませんか？その原因は、ほとんどの場合、<strong className="text-gray-900">「設置」と「空間」</strong>にあります。部屋の壁、天井、家具の一つ一つが音と映像に影響を与え、視聴体験を良くも悪くもします。
          </p>
          <p className="text-lg leading-relaxed text-gray-500">
            このガイドでは、あなたの機材のポテンシャルを最大限に引き出し、映画館のような「完璧な没入空間」を自宅に作るための、科学的かつ実践的なノウハウを解説します。
          </p>
        </section>

        {/* -------------------- １．音響設計の基礎：スピーカー配置と結線 -------------------- */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-3">
            １．音響設計の基礎：スピーカーの理想配置と結線
          </h2>
          
          {/* 画像：スピーカー配置図 */}
          <div className="relative w-full h-80 sm:h-96 bg-gray-100 mb-2 overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/images/installation_guide/speaker_layout.webp" // 実際のパスに修正してください
              alt="理想的な5.1chスピーカー配置図"
              fill
              style={{ objectFit: 'contain' }} // 配置図なのでcontainが適切
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              priority
            />
          </div>
          
          {/* 💡 画像引用の注釈 */}
          <blockquote className="text-right text-xs text-gray-400 mb-10 border-l-2 border-gray-100 pl-2">
            <a 
              href="https://www.dolby.com/ja/about/support/guide/setup-guides/5.1-virtual-speakers-setup" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-600 transition duration-150 ease-in-out"
            >
              参照：dolby.com (理想的な5.1chスピーカー配置図)
            </a>
          </blockquote>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            1-1. 5.1chの基本：黄金の60度ルール
          </h3>
          <p className="text-lg leading-relaxed mb-4 text-gray-700">
            最高のサラウンド効果を得るために、フロントスピーカー2本と視聴位置が作る角度が、左右それぞれ30度になるように設置します（合計60度）。サラウンドスピーカーは視聴位置の真横か、わずかに後方（100〜120度）に、耳の高さに合わせるのが基本です。
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            1-2. Dolby Atmos（立体音響）の高さの配置
          </h3>
          <p className="text-lg leading-relaxed mb-4 text-gray-700">
            Dolby Atmos（〇.〇.2chや〇.〇.4chなど）で重要なのは「高さ方向」の音です。専用スピーカー（トップスピーカー）は、天井に埋め込むか、または天井反射型（イネーブルドスピーカー）を使用します。最も効果的なのは、視聴位置から見て「前上方」と「後上方」の4か所に配置することです。
          </p>
          
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            1-3. ケーブル処理とノイズ対策
          </h3>
          <p className="text-lg leading-relaxed text-gray-700">
            配線は、ホームシアターの完成度を大きく左右します。壁内配線やモールを活用してケーブルを隠すことで、安全で美観を保った空間になります。特に長いHDMIケーブル（5m以上）を使う場合は、伝送エラーを防ぐために<strong className="text-gray-900">光ファイバーHDMIケーブル（AOC）</strong>の採用を推奨します。
          </p>
        </section>

        {/* -------------------- ２．映像設計の基礎：視聴距離と視界の確保 -------------------- */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-3">
            ２．映像設計の基礎：視聴距離と視界の確保
          </h2>

          {/* 画像：視聴距離の計算図 */}
          <div className="relative w-full h-80 sm:h-96 bg-gray-100 mb-2 overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/images/installation_guide/viewing_distance.webp"
              alt="画質による最適視聴距離"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            />
          </div>
          
          {/* 💡 画像引用の注釈 */}
          <blockquote className="text-right text-xs text-gray-400 mb-10 border-l-2 border-gray-100 pl-2">
            
              画質による最適視聴距離

          </blockquote>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            2-1. 画面サイズと最適視聴距離の計算
          </h3>
          <p className="text-lg leading-relaxed mb-4 text-gray-700">
            大画面の感動と、目に負担がかからないバランスの取れた距離を知ることが重要です。
          </p>
          <ul className="space-y-3 text-lg text-gray-700 ml-4">
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">4K映像</strong>: 画面の高さ × 1.5倍 が最適距離（ドットが見えなくなる距離）。
            </li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">Full HD映像</strong>: 画面の高さ × 3.0倍 が最適距離。
            </li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              例：100インチスクリーン（高さ約1.24m）の場合、4Kなら約1.8mの視聴距離が必要です。
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            2-2. プロジェクターの設置位置とオフセット
          </h3>
          <p className="text-lg leading-relaxed text-gray-700">
            プロジェクターは、床置き、天吊り、棚置きのいずれかになりますが、最も理想的なのは天吊りです。映像が歪まず、レンズの中心とスクリーンの中心が一直線上にくるため、最高の画質が得られます。天吊りが難しい場合は、<strong className="text-gray-900">レンズシフト機能</strong>や台形補正機能を使って調整しますが、画質劣化を避けるため、極力これらの機能に頼らない配置を目指しましょう。
          </p>
        </section>

        {/* -------------------- ３．空間設計：光、色、音響調整 -------------------- */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-3">
            ３．空間設計：光、色、音響調整で部屋を最適化
          </h2>
          
          {/* 画像：理想的な専用室 */}
          <div className="relative w-full h-80 sm:h-96 bg-gray-100 mb-2 overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/images/installation_guide/dedicated_room.webp"
              alt="暗く遮光されたホームシアター専用室"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            />
          </div>
          
          {/* 💡 画像引用の注釈 */}
          <blockquote className="text-right text-xs text-gray-400 mb-10 border-l-2 border-gray-100 pl-2">
            <a 
              href="https://gemini.google.com/app"
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-600 transition duration-150 ease-in-out"
            >
              参照：Gemini画像生成
            </a>
          </blockquote>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            3-1. 遮光と反射：映像のコントラストを最大化
          </h3>
          <p className="text-lg leading-relaxed mb-4 text-gray-700">
            プロジェクターを使う場合、部屋の遮光は必須です。窓には遮光性の高いカーテンを設置し、壁や天井の反射光にも注意を払う必要があります。専用室では、壁や天井を濃い色（暗いグレーや黒）にすることで、映像のコントラストが格段に向上します。
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            3-2. 反響対策：吸音と拡散
          </h3>
          <p className="text-lg leading-relaxed text-gray-700">
            「音が響きすぎる（エコー）」と感じる部屋では、音の輪郭がぼやけてしまいます。
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 ml-4">
            <li><strong className="text-gray-900">吸音</strong>：スピーカーの真後ろの壁や、初期反射がある側壁に吸音材（パネル、厚手のカーテン）を設置。</li>
            <li><strong className="text-gray-900">拡散</strong>：音をあえて複雑に散らす拡散材を後方の壁に設置すると、音場に広がりが生まれます。</li>
            <li>リビングの場合は、大型のラグ、厚手のソファ、本棚などが自然な吸音材として機能します。</li>
          </ul>
        </section>

        {/* 結論 */}
        <section className="text-center pt-10 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            結論：空間は、最高の機材である。
          </h2>
          <p className="text-xl leading-relaxed mb-6 font-light text-gray-500 max-w-3xl mx-auto">
            設置・空間設計は、費用対効果が最も高いチューニングです。高価なアンプをアップグレードする前に、ケーブルの取り回し、スピーカーの角度、カーテンの色を見直すことが、感動への近道です。
          </p>
          <p className="text-2xl font-black text-gray-900 mb-8 tracking-tight">
            このガイドを参考に、あなたの部屋を、世界に一つだけの最高の劇場にしてください。
          </p>
          {/* CTA (次のアクション) */}
          <p className="text-lg text-gray-600">
            機材選びに戻る場合は「機材選びの基本ガイド」を、予算に合わせた構成を知りたい場合は「予算別おすすめシステム」をご覧ください。
          </p>
        </section>

      </div>
    </div>
  );
};

export default InstallationGuidePage;