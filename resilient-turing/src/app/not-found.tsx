import React from 'react';
import Link from 'next/link';
import { Compass, AlertTriangle, Home } from 'lucide-react';
import './globals.css';

export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-xl text-center space-y-8 relative z-10">
          <div className="w-28 h-28 mx-auto rounded-3xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shadow-2xl relative">
            <Compass className="w-14 h-14 text-sky-400" />
            <div className="absolute -bottom-3 -right-3 px-3 py-1 rounded-xl bg-amber-500 text-white text-[11px] font-black shadow-lg flex items-center gap-1.5 border-2 border-slate-900">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>404</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              عفواً، الصفحة غير موجودة | Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              لم نتمكن من العثور على المسار المطلوب في بوابة شركة هضاب الخليج للمقاولات.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ar"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية (العربية)</span>
            </Link>

            <Link
              href="/en"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              <Home className="w-4 h-4" />
              <span>Homepage (English)</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
