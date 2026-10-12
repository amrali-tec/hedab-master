"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroBlockConfig } from '../../../lib/cms/blockSchemas';
import { Button, Badge, Container } from '../../ui/primitives';

interface HeroBlockProps {
  config: HeroBlockConfig;
  locale: 'ar' | 'en';
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ config, locale }) => {
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
      <header className="w-full pt-28 pb-8 md:pt-32 md:pb-10 mb-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-transparent text-slate-900 dark:text-white">
        <Container width="standard" className="space-y-4">
          {/* Breadcrumb Navigation Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 rtl:space-x-reverse text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">
            <Link 
              href={`/${locale}`}
              className="flex items-center gap-1.5 hover:text-[#0070BA] dark:hover:text-brand-sky transition-colors duration-200"
            >
              <Home className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>{isAr ? "الرئيسية" : "Home"}</span>
            </Link>

            <ChevronIcon className="w-4 h-4 text-slate-400 dark:text-slate-600" />

            <span className="text-[#002060] dark:text-brand-sky font-extrabold" aria-current="page">
              {isAr ? pageLabelAr : pageLabelEn}
            </span>
          </nav>

          <div className="space-y-3 pt-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              {isAr ? config.titleAr : config.titleEn || config.titleAr}
            </h1>

            {config.subtitleAr && (
              <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed font-medium">
                {isAr ? config.subtitleAr : config.subtitleEn || config.subtitleAr}
              </p>
            )}
          </div>
        </Container>
      </header>
    );
  }

  // Main Homepage Hero Banner
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center bg-[#070B14] text-white overflow-hidden py-24 border-b border-slate-800/80">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url(${config.bgImageUrl || '/images/hero-bg.webp'})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent" />

      <Container width="standard" className="relative z-10 text-center">
        <Badge variant="brand" size="lg" icon={<Sparkles className="w-3.5 h-3.5" />} className="mb-6">
          {isAr ? config.tagAr || 'المقاول الإنشائي والتشغيلي الرائد بالمملكة' : config.tagEn || 'PREMIER SAUDI INFRASTRUCTURE CONTRACTOR'}
        </Badge>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
          {isAr ? config.titleAr || 'نبني البنية التحتية... لنرتقي بجودة الحياة' : config.titleEn || 'Engineering Infrastructure, Elevating Quality of Life'}
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          {isAr
            ? config.subtitleAr || 'أكثر من 15 عاماً من التميز في مقاولات الطرق، شبكات السيول، الحواجز الخرسانية والتشغيل البلدي وفق أعلى معايير رؤية 2030.'
            : config.subtitleEn || '15+ years of excellence in road paving, stormwater networks, precast concrete barriers, and municipal maintenance.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          {config.primaryCtaTextAr && (
            <Link href={config.primaryCtaLink || '/projects'} className="w-full sm:w-auto">
              <Button variant="primary" size="lg" fullWidth>
                {isAr ? config.primaryCtaTextAr : config.primaryCtaTextEn || config.primaryCtaTextAr}
              </Button>
            </Link>
          )}

          {config.secondaryCtaTextAr && (
            <Link href={config.secondaryCtaLink || '/contact'} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" fullWidth>
                {isAr ? config.secondaryCtaTextAr : config.secondaryCtaTextEn || config.secondaryCtaTextAr}
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
};

