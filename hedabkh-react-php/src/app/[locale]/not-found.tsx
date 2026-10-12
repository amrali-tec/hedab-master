import { useParams } from 'react-router-dom';
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FolderKanban,
  Truck,
  Phone,
  ArrowRight,
  Compass,
  AlertTriangle,
  Search,
  MessageCircle,
  HardHat,
} from 'lucide-react';
import { BRAND_IDENTITY } from '../../config/brand';

export default function NotFound(props?: any) {
  const routerParams = useParams<{ locale?: string }>();
  const pathname = usePathname();
  const isAr = !pathname?.startsWith('/en') && routerParams?.locale !== 'en';
  const locale = isAr ? 'ar' : 'en';

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden select-none">
      {/* Background Architectural Grid Accent */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0070BA 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-3xl relative z-10 text-center space-y-8">
        {/* Animated 404 Beacon Card */}
        <div className="relative inline-block">
          <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-gradient-to-br from-sky-500/10 via-[#002060]/10 to-brand-blue/20 dark:from-sky-500/20 dark:to-[#002060]/40 border border-sky-500/30 dark:border-sky-400/20 backdrop-blur-xl flex items-center justify-center shadow-2xl relative">
            {/* Pulsing rings */}
            <span className="absolute inset-0 rounded-3xl bg-sky-500/20 animate-ping" style={{ animationDuration: '3s' }} />
            <Compass className="w-14 h-14 sm:w-18 sm:h-18 text-sky-600 dark:text-sky-400 stroke-1" />
          </div>

          <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 px-3 py-1 rounded-xl bg-amber-500 text-white text-[11px] sm:text-xs font-black shadow-lg flex items-center gap-1.5 border-2 border-white dark:border-slate-900">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>404 ERROR</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tracking-widest uppercase block font-mono">
            {isAr ? 'خطأ في المسار الهندسي (404)' : 'COORDINATE NOT FOUND (404)'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr
              ? 'عفواً، الصفحة التي تبحث عنها غير متاحة'
              : 'Oops! The page you are looking for does not exist'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {isAr
              ? 'يبدو أنك سلكت مساراً قيد التطوير أو تم نقله إلى موقع آخر ضمن شبكتنا الهندسية. يمكنك استخدام الروابط السريعة أدناه للعودة لمسارك الصحيح.'
              : 'The requested route or engineering sector is unavailable or has been relocated. Please use the quick navigation shortcuts below.'}
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
          <Link
            href={`/${locale}`}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-start"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {isAr ? 'الرئيسية' : 'Home'}
            </span>
          </Link>

          <Link
            href={`/${locale}/projects`}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-start"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {isAr ? 'المشاريع' : 'Projects'}
            </span>
          </Link>

          <Link
            href={`/${locale}/equipment`}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-start"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {isAr ? 'الأسطول' : 'Machinery'}
            </span>
          </Link>

          <Link
            href={`/${locale}/contact`}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-start"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {isAr ? 'اتصل بنا' : 'Contact Us'}
            </span>
          </Link>
        </div>

        {/* Action Button & WhatsApp fallback */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/${locale}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-[#002060] text-white text-xs md:text-sm font-black hover:shadow-xl shadow-sky-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isAr ? 'العودة للصفحة الرئيسية' : 'Return to Homepage'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>

          <a
            href={`https://wa.me/${BRAND_IDENTITY.phone.replace(/[^0-9]/g, '').replace(/^0/, '966')}?text=${encodeURIComponent(
              isAr ? 'مرحباً، واجهت صفحة غير موجودة بالموقع وأحتاج للمساعدة.' : 'Hello, I reached an unlinked page on your website.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isAr ? 'مساعدة فورية عبر واتساب' : 'WhatsApp Support'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
