// app/gear-guide/page.tsx

import { Metadata } from 'next';
import Image from 'next/image'; // Imageコンポーネントをインポート

// ページのメタデータを設定（SEO対策）
export const metadata: Metadata = {
  title: '【初心者必見】失敗しないホームシアター機材選びの基本ガイド | ホームシアター最高！',
  description: 'ホームシアター機材の選び方を、映像、音響、周辺機器の3つの柱で徹底解説。あなたの部屋に最適なプロジェクターやAVアンプを見つけるための完全ガイド。',
};

const GearGuidePage = () => {
  return (
    // 背景を白に設定
    <div className="bg-white text-gray-700 min-h-screen">
      
      {/* ヒーローセクション: タイトル */}
      <div className="bg-gray-50 border-b border-gray-200 py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-2">
            GEAR GUIDE
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-4 leading-snug">
            【初心者必見】失敗しない機材選びの基本
          </h1>
          <p className="text-lg sm:text-xl font-light text-gray-500 max-w-2xl mx-auto">
            最高の感動は、正しい機材選びから始まる。あなたの部屋に最適な「最適解」を見つけましょう。
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* 導入文 */}
        <section className="mb-24">
          <p className="text-xl leading-relaxed mb-6 text-gray-700 border-l-4 border-gray-300 pl-4">
            ホームシアターの扉を開けたあなたへ。「何から揃えればいいのか分からない」「高価なものを買って後悔したくない」―そうした不安はすべて、私が解消します。ホームシアターは、ただスペックが高い機材を揃えれば良いわけではありません。
            <strong className="text-gray-900">あなたの部屋の広さ、視聴スタイル、そして予算に合った「最適解」</strong>を見つけることが、最高の感動への最短ルートです。
          </p>
          <p className="text-lg leading-relaxed text-gray-500">
            私が数々の試行錯誤から学んだ、失敗しない機材選びの３つの基本を、初心者の方にも分かりやすいように徹底的に解説します。知識は、感動のための道具です。さあ、一緒にあなたの「最高！」を見つけに行きましょう。
          </p>
        </section>

        {/* -------------------- １．映像の核心 -------------------- */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-3">
            １．【映像の核心】プロジェクターとスクリーン選び
          </h2>
          {/* 映像セクションの画像 */}
          <div className="relative w-full h-80 sm:h-96 bg-gray-100 mb-2 overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/images/gear_guide/projector_screen.webp" 
              alt="映画が映し出されたプロジェクターとスクリーン"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              priority
            />
          </div>
          
          {/* 💡 画像引用の注釈 (blockquoteとaタグを使用) */}
          <blockquote className="text-right text-xs text-gray-400 mb-10 border-l-2 border-gray-100 pl-2">
            <a 
              href="https://gemini.google.com/app"
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-600 transition duration-150 ease-in-out"
            >
              参照：Gemini 画像生成
            </a>
          </blockquote>

          <p className="text-lg leading-relaxed mb-8 text-gray-700">
            最高の没入感は、まず「大画面」から始まります。プロジェクターとスクリーンの組み合わせは、あなたのシアタースタイルを決定づける最重要ポイントです。
          </p>

          {/* 1-1. プロジェクター */}
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            1-1. プロジェクター：選び方の４つのチェックポイント
          </h3>
          <ul className="space-y-4 text-lg text-gray-700 ml-4">
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">① 設置方法と焦点距離（投写距離）</strong>：短焦点/超短焦点（設置の自由度）、長焦点（画質優先）のどちらが部屋に適しているか。
            </li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">② 明るさ（ルーメン）</strong>：遮光できる環境なら1,500～2,500ルーメン。リビングなら3,000ルーメン以上を推奨。
            </li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">③ 解像度とHDR</strong>：4KとHDR（ハイダイナミックレンジ）対応で、明暗差と色彩表現をチェック。
            </li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">④ 駆動方式</strong>：DLP方式（シャープ）かLCD方式（色彩豊か）か、好みを検討。
            </li>
          </ul>

          {/* 1-2. スクリーン */}
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            1-2. スクリーン：素材とサイズの最適な選び方
          </h3>
          <p className="text-lg leading-relaxed mb-4 text-gray-700">
            スクリーンは、プロジェクターの性能を最大限に引き出すための「キャンバス」です。最適な視聴距離からサイズを逆算しましょう。
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 ml-4">
            <li><strong className="text-gray-900">素材</strong>：ホワイトマット（標準）、ゲイン（明るさ）、サウンドスクリーン（音透過）から選ぶ。</li>
            <li><strong className="text-gray-900">種類</strong>：電動式（収納）、固定式（常設）を設置環境に応じて決定。</li>
          </ul>
        </section>

        {/* -------------------- ２．音響の魂 -------------------- */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-3">
            ２．【音響の魂】AVアンプとスピーカーシステム
          </h2>
          {/* 音響セクションの画像 */}
          <div className="relative w-full h-80 sm:h-96 bg-gray-100 mb-2 overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/images/gear_guide/speaker_av_amp.webp" // 実際のパスに修正してください
              alt="洗練されたAVアンプとスピーカーシステム"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            />
          </div>
          
          {/* 💡 画像引用の注釈 (blockquoteとaタグを使用) */}
          <blockquote className="text-right text-xs text-gray-400 mb-10 border-l-2 border-gray-100 pl-2">
            <a 
              href="https://gemini.google.com/app" // 実際の引用元URLに修正してください
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-600 transition duration-150 ease-in-out"
            >
              参照：Gemini 画像生成
            </a>
          </blockquote>
          
          <p className="text-lg leading-relaxed mb-8 text-gray-700">
            映像が「目」なら、音響は「魂」です。ホームシアターの臨場感の8割は音響で決まると言っても過言ではありません。
          </p>

          {/* 2-1. AVアンプ */}
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            2-1. AVアンプ：システムの心臓部の選び方
          </h3>
          <p className="text-lg leading-relaxed mb-4 text-gray-700">
            AVアンプは、すべての機材を接続し、音を増幅・制御する「司令塔」です。
          </p>
          <ul className="space-y-4 text-lg text-gray-700 ml-4">
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">① チャンネル数（〇.〇.〇）</strong>：5.1ch、7.1ch、そして立体音響を実現するDolby Atmos対応（5.1.2chなど） を検討。
            </li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">② パワーと端子数</strong>：接続スピーカーを鳴らす定格出力と、必要なHDMI入力端子数をチェック。
            </li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">③ 自動音場補正機能</strong>：部屋に合わせて音響を最適化する機能（Audyssey, YPAOなど）があると設置が楽になります。
            </li>
          </ul>
          
          {/* 2-2. スピーカー */}
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            2-2. スピーカー：種類と配置の基本
          </h3>
          <ul className="space-y-4 text-lg text-gray-700 ml-4">
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">フロント/センター</strong>：音場の中心とセリフを担当。特にセンタースピーカーの性能は重要。
            </li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">サラウンド</strong>：音の移動や包囲感を担当。壁掛けや埋め込みも検討可能。
            </li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold">
              <strong className="text-gray-900">サブウーファー</strong>：低音域の迫力。密閉型（締まった音）かバスレフ型（豊かな音）かを選びます。
            </li>
          </ul>
        </section>

        {/* -------------------- ３．周辺機器のチェックリスト -------------------- */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-3">
            ３．【体験を向上させる】周辺機器のチェックリスト
          </h2>
          {/* 周辺機器セクションの画像 */}
          <div className="relative w-full h-80 sm:h-96 bg-gray-100 mb-2 overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/images/gear_guide/cables_accessories.webp" // 実際のパスに修正してください
              alt="HDMIケーブルや電源タップなどの周辺機器"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            />
          </div>
          
          {/* 💡 画像引用の注釈 (blockquoteとaタグを使用) */}
          <blockquote className="text-right text-xs text-gray-400 mb-10 border-l-2 border-gray-100 pl-2">
            <a 
              href="https://gemini.google.com/app" // 実際の引用元URLに修正してください
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-600 transition duration-150 ease-in-out"
            >
              参照：Gemini 画像生成
            </a>
          </blockquote>

          <p className="text-lg leading-relaxed mb-8 text-gray-700">
            最高の機材が揃っても、周辺機器で手を抜くと、その性能は半減します。最後の仕上げも完璧に。
          </p>

          {/* 3-1. プレーヤーとソース機器 */}
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            3-1. プレーヤーとソース機器
          </h3>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 ml-4">
            <li><strong className="text-gray-900">4K UHD Blu-rayプレーヤー</strong>：最高の画質・音質を楽しむための必須アイテム。</li>
            <li><strong className="text-gray-900">ストリーミングデバイス</strong>：Dolby VisionやDolby Atmos対応状況をチェック。</li>
          </ul>

          {/* 3-2. ケーブルと電源 */}
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 border-l-4 border-gray-300 pl-3">
            3-2. ケーブルと電源
          </h3>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 ml-4">
            <li><strong className="text-gray-900">HDMIケーブル</strong>：4K/8Kに対応するハイスピード規格（HDMI 2.0以上）を選びましょう。</li>
            <li><strong className="text-gray-900">スピーカーケーブル</strong>：音質に直結。純度の高いOFCケーブルを推奨。</li>
            <li><strong className="text-gray-900">電源環境</strong>：ノイズ対策のための電源タップやフィルターも重要です。</li>
          </ul>
        </section>

        {/* 結論 */}
        <section className="text-center pt-10 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            結論：あなたの「最高！」は、あなただけのもの。
          </h2>
          <p className="text-xl leading-relaxed mb-6 font-light text-gray-500 max-w-3xl mx-auto">
            機材選びに「絶対の正解」はありません。予算の5割を音響に、3割を映像に、2割を周辺機器に、といった「予算配分の考え方」こそが重要です。
          </p>
          <p className="text-2xl font-black text-gray-900 mb-8 tracking-tight">
            このガイドを参考に、ご自身の環境と希望を整理し、一歩を踏み出してください。
          </p>
          {/* CTA (次のアクション) */}
          <p className="text-lg text-gray-600">
            迷ったときは、次の記事「予算別おすすめシステム」 や 「設置・空間設計ガイド」 を参考にしてください。
          </p>
        </section>

      </div>
    </div>
  );
};

export default GearGuidePage;