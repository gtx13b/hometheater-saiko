// app/about/page.tsx

import { Metadata } from 'next';

// ページのメタデータを設定（SEO対策）
export const metadata: Metadata = {
  title: '【理念】日常を感動で満たす - ホームシアター最高！',
  description: 'サイト運営者がホームシアターの魅力を伝えるために、このサイトを立ち上げた熱い理由。最高の体験を共有するための３つの誓い。',
};

const AboutPage = () => {
  return (
    // 背景を白に設定
    <div className="bg-white text-gray-700 min-h-screen">
      
      {/* ヒーローセクション: ページの顔となるインパクトのあるタイトル */}
      <div className="bg-gray-50 border-b border-gray-200 py-20 sm:py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-2">
            OUR PHILOSOPHY
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-gray-900 mb-6 leading-snug">
            日常を「感動」で満たす。
          </h1>
          <p className="text-lg sm:text-xl font-light text-gray-500 max-w-2xl mx-auto">
            私がホームシアターを創る、シンプルで熱い理由。このサイトは、あなたの人生を豊かにする最高の体験を届けるために存在します。
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        
        {/* セクション 1: なぜ「最高！」なのか？ (背景色を付けて強調) */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            １．なぜ、私はホームシアターを「最高！」と叫ぶのか
          </h2>
          <p className="text-xl leading-relaxed mb-6 text-gray-700">
            初めてホームシアターを体験した時の感動を、今でも鮮明に覚えています。それは、ただ映像が大きくなった、音が良くなった、というレベルではありませんでした。
          </p>
          <p className="text-xl leading-relaxed mb-6 text-gray-700">
            リビングが、一瞬にして静寂に包まれた映画館の最前列に変わり、登場人物の息づかいまでが伝わってくるような臨場感。コンサート会場の熱狂的な歓声に包まれ、まるで自分がステージ上に立っているかのような錯覚。
          </p>
          <p className="text-2xl font-semibold italic text-gray-700 p-4 border-l-4 border-gray-400 bg-gray-100 rounded-md">
            私自身、この「日常から非日常へワープする、究極の没入感」こそが、ホームシアターの最大の価値だと確信しています。
          </p>
        </section>

        {/* セクション 2: ライフスタイルとしての提案 */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            ２．ホームシアターは「趣味」ではなく「人生を豊かにするもの」
          </h2>
          <p className="text-xl leading-relaxed mb-8 text-gray-700">
            ホームシアターと聞くと、「高価な機材が必要」「専門的な知識が必要」「広い部屋が必要」といったハードルを想像するかもしれません。ですが、私はホームシアターを<strong className="text-gray-900">「特別な趣味」ではなく、「人生を豊かにする新しいライフスタイル」</strong>だと考えています。
          </p>
          <ul className="space-y-4 pl-8 text-xl text-gray-700">
            {/* 箇条書きの色をグレーに変更 */}
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold"><strong className="text-gray-900">最高の家族時間</strong>: 外出の準備なく、週末の夜に家族全員で大画面を囲む温かい時間。</li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold"><strong className="text-gray-900">自分だけの聖域</strong>: 一日の終わりに、誰にも邪魔されない空間で、心ゆくまでゲームや音楽に没頭する至福の時間。</li>
            <li className="relative before:content-['•'] before:absolute before:left-[-1.5rem] before:text-gray-500 before:font-bold"><strong className="text-gray-900">新しい体験</strong>: 旅行やイベントに行かなくても、自宅が最高のエンターテイメント空間に変わる喜び。</li>
          </ul>
        </section>

        {/* セクション 3: サイト立ち上げの理由（最も熱い部分） */}
        <section className="mb-24 border-t border-gray-200 pt-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            ３．このサイト「ホームシアター最高！」を立ち上げた、私の熱意
          </h2>
          <p className="text-xl leading-relaxed mb-6 text-gray-700">
            このサイトは、私自身の「この感動を、一人でも多くの人に味わってほしい！」 という、シンプルで熱い想いから生まれました。
          </p>
          <p className="text-xl leading-relaxed mb-6 text-gray-700">
            私自身、数々の環境でホームシアターを構築し、試行錯誤を重ねてきました。巷の情報は製品スペックばかりで、本当に知りたい「この機材を買ったら、自分の部屋でどんな体験が得られるのか？」という核心的な情報が不足していました。
          </p>
          {/* 強調部分の色をグレー系に変更 */}
          <p className="text-2xl font-semibold text-gray-900 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-md">
            「ホームシアター最高！」は、そうした疑問や不安を持つすべての人々のために存在します。私の失敗談や成功体験が、あなたの最高のシアター作りの近道になれば、これ以上の喜びはありません。
          </p>
        </section>

        {/* セクション 4: ３つの誓い（信頼性・権威性を示す） */}
        <section className="mb-24 border-t border-gray-200 pt-16">
          <h2 className="text-3xl font-bold mb-10 text-gray-900">
            ４．私の「３つの誓い」
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* 誓い 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg border-t-2 border-gray-400"> {/* 線の色もグレーに変更 */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2 text-gray-500">I.</span>公正な情報提供
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                特定のメーカーに左右されず、実際に使用し、比較した生の声だけをお届けします。予算や環境に寄り添った、具体的な解決策を提示します。
              </p>
            </div>
            
            {/* 誓い 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg border-t-2 border-gray-400">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2 text-gray-500">II.</span>感動への翻訳
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                難解な専門用語を、最高の体験に直結する言葉に翻訳してお伝えします。知識は、感動のための道具でなければなりません。
              </p>
            </div>

            {/* 誓い 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg border-t-2 border-gray-400">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2 text-gray-500">III.</span>最高の体験を追求
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                部屋の大小に関わらず、空間の特性を活かした最適なシステム構築を追求し、最大限のパフォーマンスを引き出す知恵をお届けします。
              </p>
            </div>
          </div>
        </section>

        {/* 最終メッセージ */}
        <section className="text-center pt-20 border-t border-gray-200">
          <p className="text-2xl leading-relaxed mb-6 font-light text-gray-500 max-w-3xl mx-auto">
            ホームシアターの世界は、一歩踏み出せば、想像を遥かに超える感動が待っています。
          </p>
          {/* 最終メッセージの強調色もグレーに変更 */}
          <p className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
            ぜひ、この感動の旅を一緒に始めましょう！
          </p>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;