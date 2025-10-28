// app/contact/page.tsx

import React from 'react';
import ContactForm from '@/components/ContactForm'; // 3.で作成するフォームをインポート（パスは後述）

const ContactPage: React.FC = () => {
  return (
    // min-h-screen はフッターを画面下部に固定するために重要です
    <main className="min-h-screen bg-gray-50 p-8 md:p-12">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg">
        
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b-4 border-amber-400 pb-2">
          お問い合わせ
        </h1>
        
        <p className="text-gray-600 mb-8">
          ご意見、ご質問、ご要望などございましたら、以下のフォームよりお気軽にお問い合わせください。
        </p>

        {/* フォームコンポーネントをここに配置 */}
        <ContactForm />
        
      </div>
    </main>
  );
};

export default ContactPage;