"use client";

import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { storageAdapter } from '../../services/storageAdapter';

interface PartnersShowcaseProps {
  locale?: 'ar' | 'en';
  configOverride?: {
    tagAr?: string;
    tagEn?: string;
    titleAr?: string;
    titleEn?: string;
    subtitleAr?: string;
    subtitleEn?: string;
    speedDuration?: number;
    pauseOnHover?: boolean;
    showProjectsCount?: boolean;
    displayMode?: 'marquee' | 'grid';
  };
}

export interface PartnerItem {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  badgeAr: string;
  badgeEn: string;
  projectsCount?: number;
  logoUrl?: string;
}

export const PARTNERS_LIST: PartnerItem[] = [
  {
    id: 'p-1',
    nameAr: 'وزارة الشؤون البلدية والقروية والإسكان',
    nameEn: 'Ministry of Municipal & Rural Affairs and Housing',
    categoryAr: 'وزارة سيادية',
    categoryEn: 'Ministry',
    badgeAr: 'اعتماد رسمي شامل',
    badgeEn: 'Full Accreditation',
    projectsCount: 18,
    logoUrl: '/images/logos/momrah-user-logo.jpg',
  },
  {
    id: 'p-2',
    nameAr: 'أمانة منطقة الرياض',
    nameEn: 'Riyadh Region Municipality',
    categoryAr: 'أمانات المناطق',
    categoryEn: 'Municipality',
    badgeAr: 'مشاريع حيوية كبرى',
    badgeEn: 'Major Infrastructure',
    projectsCount: 14,
    logoUrl: '/images/logos/riyadh-municipality-official.png',
  },
  {
    id: 'p-3',
    nameAr: 'أمانة منطقة القصيم',
    nameEn: 'Al-Qassim Region Municipality',
    categoryAr: 'أمانات المناطق',
    categoryEn: 'Municipality',
    badgeAr: 'عقود صيانة وتشغيل',
    badgeEn: 'O&M Contracts',
    projectsCount: 8,
    logoUrl: '/images/logos/qassim-user-logo.png',
  },
  {
    id: 'p-4',
    nameAr: 'وزارة الحرس الوطني',
    nameEn: 'Ministry of National Guard',
    categoryAr: 'قطاع أمني وسيادي',
    categoryEn: 'Defense & Security',
    badgeAr: 'مواقع عسكرية خاصة',
    badgeEn: 'Special Military Sites',
    projectsCount: 5,
    logoUrl: '/images/logos/national-guard-user-logo.png',
  },
  {
    id: 'p-5',
    nameAr: 'بلدية محافظة الخرج',
    nameEn: 'Al-Kharj Governorate Municipality',
    categoryAr: 'بلديات المحافظات',
    categoryEn: 'Governorate Municipality',
    badgeAr: 'تصريف سيول وطرق',
    badgeEn: 'Drainage & Roads',
    projectsCount: 9,
    logoUrl: '/images/logos/kharj-user-logo.jpg',
  },
  {
    id: 'p-6',
    nameAr: 'بلدية محافظة الزلفي',
    nameEn: 'Al-Zulfi Governorate Municipality',
    categoryAr: 'بلديات المحافظات',
    categoryEn: 'Governorate Municipality',
    badgeAr: 'تأسيس وتطوير ميداني',
    badgeEn: 'Site Preparation',
    projectsCount: 6,
    logoUrl: '/images/logos/zulfi-user-logo.jpg',
  },
  {
    id: 'p-7',
    nameAr: 'المركز السعودي للأعمال',
    nameEn: 'Saudi Business Center',
    categoryAr: 'منظومة الأعمال',
    categoryEn: 'Business Hub',
    badgeAr: 'منصة ممارسة الأعمال',
    badgeEn: 'Certified Business Hub',
    projectsCount: 12,
    logoUrl: '/images/logos/saudi-business-center.jpg',
  },
  {
    id: 'p-8',
    nameAr: 'وزارة التجارة',
    nameEn: 'Ministry of Commerce',
    categoryAr: 'سجل تجاري معتمد',
    categoryEn: 'Commerce Ministry',
    badgeAr: 'سجل تجاري موثق',
    badgeEn: 'Verified CR',
    projectsCount: 10,
    logoUrl: '/images/logos/ministry-of-commerce.png',
  },
  {
    id: 'p-9',
    nameAr: 'منصة بلدي الرقمية',
    nameEn: 'Balady Digital Platform',
    categoryAr: 'منصة حكومية رقمية',
    categoryEn: 'Digital Gov Platform',
    badgeAr: 'رخص تشغيل معتمدة',
    badgeEn: 'Verified Permits',
    projectsCount: 22,
    logoUrl: '/images/logos/balady-platform.png',
  },
  {
    id: 'p-10',
    nameAr: 'هيئة الزكاة والضريبة والجمارك',
    nameEn: 'Zakat, Tax and Customs Authority',
    categoryAr: 'التزام مالي وضريبي',
    categoryEn: 'Tax & Customs Compliance',
    badgeAr: 'شهادة ضريبية سارية',
    badgeEn: 'Active Tax Cert',
    projectsCount: 15,
    logoUrl: '/images/logos/zatca-vat.png',
  },
  {
    id: 'p-11',
    nameAr: 'رؤية المملكة 2030',
    nameEn: 'Saudi Vision 2030',
    categoryAr: 'المستهدفات الوطنية',
    categoryEn: 'National Vision',
    badgeAr: 'شريك التنمية المستدامة',
    badgeEn: 'Sustainable Partner',
    projectsCount: 30,
    logoUrl: '/images/logos/vision-2030-logo.jpg',
  },
];

export default function PartnersShowcase({ locale = 'ar', configOverride }: PartnersShowcaseProps) {
  const isAr = locale === 'ar';
  const [partnerItems, setPartnerItems] = useState<PartnerItem[]>(PARTNERS_LIST);
  const [partnersConfig, setPartnersConfig] = useState<any>(null);

  useEffect(() => {
    try {
      const data = storageAdapter.getPartners();
      if (Array.isArray(data) && data.length > 0) {
        const normalized: PartnerItem[] = data.map((item: any, idx: number) => {
          const fallback = PARTNERS_LIST[idx % PARTNERS_LIST.length] || PARTNERS_LIST[0];
          return {
            id: item.id || `partner-${idx}`,
            nameAr: item.nameAr || item.name || fallback.nameAr,
            nameEn: item.nameEn || fallback.nameEn,
            categoryAr: item.categoryAr || item.category || fallback.categoryAr,
            categoryEn: item.categoryEn || fallback.categoryEn,
            badgeAr: item.badgeAr || fallback.badgeAr,
            badgeEn: item.badgeEn || fallback.badgeEn,
            projectsCount: item.projectsCount ?? fallback.projectsCount ?? 10,
            logoUrl: item.logoUrl || fallback.logoUrl,
          };
        });
        setPartnerItems(normalized);
      }
      const homeData = storageAdapter.getHomeContent();
      if (homeData && homeData.partnersPreview) {
        setPartnersConfig(homeData.partnersPreview);
      }
    } catch (e) {
      console.warn('Failed to load partners from storage, using initial seed', e);
    }
  }, []);

  const cfg = configOverride || partnersConfig || {};
  const tagText = isAr
    ? cfg.tagAr || 'شركاء النجاح والجهات المعتمدة'
    : cfg.tagEn || 'Strategic Partners & Official Clients';
  const titleText = isAr
    ? cfg.titleAr || 'الشركاء والجهات التنفيذية المتعاونة'
    : cfg.titleEn || 'Collaborating Strategic Entities';
  const subtitleText = isAr
    ? cfg.subtitleAr || 'نفخر في شركة هضاب الخليج العربي للمقاولات بالتعاون والشراكة المباشرة مع الوزارات السيادية وأمانات المناطق وبلديات المحافظات بالمملكة'
    : cfg.subtitleEn || 'Arabian Gulf Hills Contracting proudly collaborates with sovereign ministries, regional municipalities, and governorates across Saudi Arabia.';

  const speedDuration = cfg.speedDuration || 35;
  const pauseOnHover = cfg.pauseOnHover !== false;
  const showProjectsCount = cfg.showProjectsCount !== false;

  // Duplicate items array multiple times to guarantee seamless infinite slider without gaps
  const marqueeItems = [
    ...partnerItems,
    ...partnerItems,
    ...partnerItems,
    ...partnerItems,
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-100 dark:bg-slate-950 relative overflow-hidden border-t border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
      {/* Background Subtle Glows */}
      <div className="absolute top-1/2 start-1/4 -translate-y-1/2 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-[#0070BA] dark:text-sky-400 text-xs font-bold">
            <Award className="w-4 h-4 text-[#0070BA] dark:text-sky-400" />
            <span>{tagText}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {titleText}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {subtitleText}
          </p>
        </div>
      </div>

      {/* Embedded CSS for 100% Guaranteed Animation Execution */}
      <style>{`
        @keyframes partnersMarqueeLtrKeyframes {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes partnersMarqueeRtlKeyframes {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .hedabkh-marquee-ltr {
          animation: partnersMarqueeLtrKeyframes ${speedDuration}s linear infinite !important;
        }
        .hedabkh-marquee-rtl {
          animation: partnersMarqueeRtlKeyframes ${speedDuration}s linear infinite !important;
        }
        .hedabkh-marquee-ltr:hover, .hedabkh-marquee-rtl:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Infinite Slow Continuous Slider Marquee Container */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Fade Gradient Masks for Seamless Edge Effect */}
        <div className="absolute top-0 bottom-0 start-0 w-24 sm:w-40 bg-gradient-to-r from-slate-100 via-slate-100/80 dark:from-slate-950 dark:via-slate-950/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 end-0 w-24 sm:w-40 bg-gradient-to-l from-slate-100 via-slate-100/80 dark:from-slate-950 dark:via-slate-950/80 to-transparent z-20 pointer-events-none" />

        {/* Marquee Track */}
        <div
          className={`flex gap-5 sm:gap-6 w-max ${isAr ? 'hedabkh-marquee-rtl' : 'hedabkh-marquee-ltr'}`}
        >
          {marqueeItems.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="w-[260px] sm:w-[300px] h-[190px] p-5 rounded-3xl bg-white/90 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 hover:border-sky-500/60 shadow-xl dark:shadow-2xl transition-all duration-300 group shrink-0 flex flex-col justify-between items-center text-center"
            >
              {/* Top Bar Badges */}
              <div className="w-full flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 text-[#0070BA] dark:text-sky-400 border border-sky-500/20 text-[10px] font-bold">
                  {isAr ? partner.categoryAr : partner.categoryEn}
                </span>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? partner.badgeAr : partner.badgeEn}</span>
                </div>
              </div>

              {/* Large Centered Logo Container */}
              <div className="w-40 h-24 rounded-2xl bg-white p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-md group-hover:shadow-sky-500/20 group-hover:border-sky-400/50 transition-all duration-300 my-auto overflow-hidden">
                {partner.logoUrl ? (
                  <img
                    src={partner.logoUrl}
                    alt={isAr ? partner.nameAr : partner.nameEn}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-slate-700" />
                )}
              </div>

              {/* Bottom Footer Tag */}
              <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                <span className="text-slate-800 dark:text-slate-300 truncate max-w-[170px]">
                  {isAr ? partner.nameAr : partner.nameEn}
                </span>
                <span className="font-mono text-[#0070BA] dark:text-sky-400 font-black shrink-0">
                  {partner.projectsCount}+ {isAr ? 'مشروع' : 'Projects'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
