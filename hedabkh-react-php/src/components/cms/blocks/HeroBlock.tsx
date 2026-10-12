"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Home,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Truck,
  Layers,
  Send,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { HeroBlockConfig } from '../../../lib/cms/blockSchemas';
import { Button, Badge, Container } from '../../ui/primitives';
import { QuickQuoteModal } from '../../ui/QuickQuoteModal';

interface HeroBlockProps {
  config: HeroBlockConfig;
  locale: 'ar' | 'en';
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ config, locale }) => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const isAr = locale === 'ar';
  const pathname = usePathname() || '';
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  // Determine if this hero is rendered on a subpage vs homepage
  const isHomepage = pathname === '/' || pathname === '/ar' || pathname === '/en';

  if (!isHomepage) {
    // Determine Page Title Label for Breadcrumbs
    let pageLabelAr = 'الفرعية';
    let pageLabelEn = 'Page';
    if (pathname.includes('/about')) { pageLabelAr = 'عن الشركة'; pageLabelEn = 'About Us'; }
    else if (pathname.includes('/services')) { pageLabelAr = 'خدماتنا الإنشائية'; pageLabelEn = 'Engineering Services'; }
    else if (pathname.includes('/projects')) { pageLabelAr = 'سجل المشاريع'; pageLabelEn = 'Project Portfolio'; }
    else if (pathname.includes('/equipment')) { pageLabelAr = 'أسطول الآليات'; pageLabelEn = 'Equipment Fleet'; }
    else if (pathname.includes('/certificates')) { pageLabelAr = 'الشهادات والاعتمادات'; pageLabelEn = 'Certificates'; }
    else if (pathname.includes('/news')) { pageLabelAr = 'المركز الإعلامي'; pageLabelEn = 'Media Center'; }
    else if (pathname.includes('/team')) { pageLabelAr = 'الهيكل الإداري'; pageLabelEn = 'Executive Team'; }
    else if (pathname.includes('/contact')) { pageLabelAr = 'تواصل معنا'; pageLabelEn = 'Contact Us'; }
    else if (pathname.includes('/chairman-message')) { pageLabelAr = 'كلمة رئيس مجلس الإدارة'; pageLabelEn = 'Chairman Message'; }

    return (
      <header className="w-full mb-8 rounded-3xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 md:p-10 shadow-sm backdrop-blur-xl text-slate-900 dark:text-white transition-all duration-300">
        <Container width="standard" className="space-y-4">
          {/* Breadcrumb Navigation Trail */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">
            <Link 
              href={`/${locale}`}
              className="flex items-center gap-1.5 hover:text-[#0070BA] dark:hover:text-sky-400 transition-colors duration-200"
            >
              <Home className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>{isAr ? "الرئيسية" : "Home"}</span>
            </Link>

            <ChevronIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />

            <span className="text-[#0070BA] dark:text-sky-400 font-extrabold" aria-current="page">
              {isAr ? pageLabelAr : pageLabelEn}
            </span>
          </nav>

          <div className="space-y-3 pt-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {isAr ? config.titleAr : config.titleEn || config.titleAr}
            </h1>

            {config.subtitleAr && (
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed font-medium">
                {isAr ? config.subtitleAr : config.subtitleEn || config.subtitleAr}
              </p>
            )}
          </div>
        </Container>
      </header>
    );
  }

  // Sovereign Capability Badges Data
  const capabilities = [
    {
      icon: Award,
      titleAr: 'تصنيف بلدي معتمد',
      titleEn: 'Balady Classified',
      subAr: 'درجة 2 (طرق) ودرجة 5 (صيانة)',
      subEn: 'Grade 2 Roads / Grade 5 O&M',
      color: 'text-amber-400',
    },
    {
      icon: ShieldCheck,
      titleAr: '52.97% محتوى محلي',
      titleEn: '52.97% Local Content',
      subAr: 'شهادة معتمدة من هيئة المحتوى LCGPA',
      subEn: 'Official LCGPA Certified',
      color: 'text-emerald-400',
    },
    {
      icon: Truck,
      titleAr: '+60 آلية ومعدة ثقيلة',
      titleEn: '+60 Machinery Fleet',
      subAr: 'قاشطات Wirtgen ومعدات سفلتة متكاملة',
      subEn: 'Wirtgen millers & paving fleet',
      color: 'text-sky-400',
    },
    {
      icon: Layers,
      titleAr: '5 شهادات آيزو دولية',
      titleEn: '5 ISO Certifications',
      subAr: 'الجودة ISO 9001 والسلامة والبيئة',
      subEn: 'ISO 9001 / 45001 / 14001',
      color: 'text-purple-400',
    },
  ];

  // Main Homepage Hero Banner
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-slate-100/80 via-white to-slate-100/80 dark:from-[#070B14] dark:via-[#0D1527] dark:to-[#070B14] text-slate-900 dark:text-white overflow-hidden pt-28 pb-16 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Background LCP Image for Instant Browser Discovery */}
      <img
        src={config.bgImageUrl || '/hero-bg.webp'}
        alt="هضاب الخليج للمقاولات"
        width={1440}
        height={800}
        // @ts-ignore
        fetchpriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-20 scale-105 transition-transform duration-1000 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50/90 via-transparent to-transparent dark:from-[#070B14] dark:via-[#070B14]/85 dark:to-transparent pointer-events-none" />
      <div className="absolute -top-40 start-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container width="standard" className="relative z-10 text-center space-y-8">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0070BA]/10 dark:bg-sky-500/10 border border-[#0070BA]/20 dark:border-sky-500/20 text-[#0070BA] dark:text-sky-300 text-xs font-bold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>{isAr ? 'الشريك الهندسي المعتمد للأمانات والوزارات بالمملكة' : 'Trusted Sovereign Contracting Partner for Ministries & Municipalities'}</span>
        </div>

        {/* Powerful Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            {isAr ? 'نبني البنية التحتية... ونحقق الجودة وفق رؤية 2030' : 'Engineering Modern Infrastructure, Empowering Vision 2030'}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            {isAr
              ? 'رواد مقاولات كشط وسفلتة الطرق، شبكات درء أخطار السيول، تصنيع الحواجز الخرسانية، وعقود تشغيل مقابر الرياض بأعلى معايير الحوكمة والسرعة.'
              : 'Leading civil contractors specializing in urban road paving, stormwater drainage networks, precast concrete barriers, and municipal maintenance.'}
          </p>
        </div>

        {/* Dual High-Conversion Call To Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pt-2">
          {/* Primary RFQ Trigger */}
          <button
            type="button"
            onClick={() => setIsQuoteOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0070BA] to-[#002060] dark:from-sky-500 dark:to-[#002060] text-white text-sm sm:text-base font-black hover:shadow-2xl hover:shadow-sky-500/30 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-sky-400/30 shadow-lg"
          >
            <Send className="w-4 h-4 text-sky-200" />
            <span>{isAr ? 'طلب عرض سعر / مناقصة لمشروعك' : 'Request Project RFQ & Quotation'}</span>
          </button>

          {/* Secondary Catalog Link */}
          <Link href={`/${locale}/projects`} className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4 text-[#0070BA] dark:text-slate-400" />
              <span>{isAr ? 'سابقة الأعمال والكتالوج' : 'Portfolio & Catalog'}</span>
            </button>
          </Link>
        </div>

        {/* Sovereign Capability Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto pt-6 text-start">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md flex flex-col gap-2 hover:border-[#0070BA] dark:hover:border-sky-500/40 transition-colors group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center ${cap.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {isAr ? cap.titleAr : cap.titleEn}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                    {isAr ? cap.subAr : cap.subEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Interactive Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        locale={locale}
      />
    </section>
  );
};


