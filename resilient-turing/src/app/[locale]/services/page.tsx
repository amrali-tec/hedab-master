"use client";

import React, { use, useState, useEffect } from 'react';
import { 
  Building, Layers, Waves, Route, Trash2, Truck, HardHat, Check
} from 'lucide-react';
import { useServices } from '../../../hooks';
import { RevealText, MagneticButton } from '../../../animations/motion-components';
import Link from 'next/link';
import { getCategoryTheme } from '../../../utils/categoryThemes';

// Helper component to map string codes to Lucide icons
const ServiceIcon = ({ icon, className = "w-6 h-6" }: { icon: string; className?: string }) => {
  switch (icon) {
    case 'building-icon':
      return <Building className={className} />;
    case 'cemetery-icon':
      return <Layers className={className} />;
    case 'drainage-icon':
      return <Waves className={className} />;
    case 'road-icon':
      return <Route className={className} />;
    case 'debris-icon':
      return <Trash2 className={className} />;
    case 'equipment-icon':
      return <Truck className={className} />;
    default:
      return <HardHat className={className} />;
  }
};

import { PageHeader } from '../../../components/ui/PageHeader';

interface ServicesPageProps {
  params: Promise<{ locale: 'ar' | 'en' }>;
}

export default function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = use(params);
  const { data: services, isLoading } = useServices(locale);
  const isAr = locale === 'ar';
  
  const [activeTabId, setActiveTabId] = useState<string>('srv-1');

  useEffect(() => {
    if (services && services.length > 0) {
      setActiveTabId(services[0].id);
    }
  }, [services]);

  const activeService = services?.find((s) => s.id === activeTabId);

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 pt-8 sm:pt-10 pb-20 space-y-16 min-h-[85vh] bg-transparent text-text-main transition-colors duration-300">
      
      <PageHeader
        title={isAr ? 'لوحة التحكم والمجالات الخدمية' : 'Engineering Services Blueprint Dashboard'}
        subtitle={isAr
          ? 'تلتزم شركة هضاب الخليج بتوفير خدمات تشغيل وصيانة وتشييد متطابقة مع أعلى المواصفات الفنية لوزارة النقل والبلديات.'
          : 'Arabian Gulf Hills provides municipal operation, road paving, and stormwater drainage services strictly matching Saudi municipal guidelines.'}
        currentPageLabel={isAr ? 'الخدمات والقطاعات' : 'Services & Scopes'}
        locale={locale}
      />

      {/* 2. Interactive Blueprint Dashboard Layout */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-14 bg-slate-100/50 dark:bg-slate-900/20 border border-gray-200/20 dark:border-gray-800/30 rounded-2xl"></div>
            ))}
          </div>
          <div className="lg:col-span-8 h-[400px] bg-slate-100/50 dark:bg-slate-900/20 border border-gray-200/20 dark:border-gray-800/30 rounded-3xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tabs Sidebar (35% on large screens) */}
          <div className="lg:col-span-4 space-y-3 w-full">
            {/* Mobile horizontal scrollable track */}
            <div className="flex lg:hidden overflow-x-auto pb-3 gap-3 snap-x scrollbar-none">
              {services?.map((srv) => {
                const isActive = srv.id === activeTabId;
                const catTheme = getCategoryTheme(srv.title);
                return (
                  <button
                    key={srv.id}
                    onClick={() => setActiveTabId(srv.id)}
                    className={`flex-shrink-0 snap-center px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border flex items-center space-x-2 rtl:space-x-reverse cursor-pointer ${
                      isActive 
                        ? `bg-white dark:bg-slate-900 ${catTheme.badgeText} ${catTheme.cardBorder} ${catTheme.cardShadow}` 
                        : 'bg-slate-100 dark:bg-slate-900/40 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900/80'
                    }`}
                  >
                    <ServiceIcon icon={srv.icon} className="w-3.5 h-3.5" />
                    <span>{srv.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop vertical sidebar */}
            <div className="hidden lg:flex flex-col gap-3">
              {services?.map((srv) => {
                const isActive = srv.id === activeTabId;
                const catTheme = getCategoryTheme(srv.title);
                return (
                  <button
                    key={srv.id}
                    onClick={() => setActiveTabId(srv.id)}
                    className={`w-full text-start p-5 rounded-3xl transition-all duration-500 border flex items-center justify-between group cursor-pointer ${
                      isActive 
                        ? `bg-white/95 dark:bg-slate-900/90 ${catTheme.cardBorder} ${catTheme.cardShadow} text-slate-900 dark:text-white backdrop-blur-2xl shadow-lg` 
                        : 'bg-slate-100/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                      <div className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 border ${
                        isActive 
                          ? `${catTheme.badgeBg} ${catTheme.badgeBorder} ${catTheme.accentText}` 
                          : 'bg-slate-200/60 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                      }`}>
                        <ServiceIcon icon={srv.icon} className="w-5 h-5" />
                      </div>
                      <span className={`text-xs md:text-sm font-black tracking-tight transition-colors duration-300 ${
                        isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                      }`}>
                        {srv.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono transition-opacity duration-300 ${
                      isActive ? `opacity-100 font-bold ${catTheme.accentText}` : 'opacity-50 group-hover:opacity-90 text-slate-500 dark:text-slate-400'
                    }`}>
                      {srv.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Canvas (65% on large screens) */}
          <div className="lg:col-span-8 w-full min-h-[500px]">
            {activeService ? (() => {
              const activeCatTheme = getCategoryTheme(activeService.title);
              return (
                <div 
                  key={activeService.id}
                  className={`w-full p-8 md:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/90 border ${activeCatTheme.cardBorder} ${activeCatTheme.cardShadow} shadow-xl dark:shadow-2xl relative overflow-hidden transition-all duration-500 ease-in-out text-start backdrop-blur-2xl`}
                >
                  {/* Spotlight Radial Glow in Catalog Theme */}
                  <div className={`absolute top-0 right-0 w-96 h-96 ${activeCatTheme.glowBg} rounded-full blur-[120px] pointer-events-none`} />

                  {/* Architectural watermark accent */}
                  <div className="absolute top-0 right-0 p-8 opacity-[0.04] text-slate-900 dark:text-white pointer-events-none select-none">
                    <ServiceIcon icon={activeService.icon} className="w-64 h-64" />
                  </div>

                  <div className="space-y-8 relative z-10">
                    {/* Service Meta Title */}
                    <div className="space-y-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className={`w-14 h-14 ${activeCatTheme.badgeBg} border ${activeCatTheme.badgeBorder} flex items-center justify-center rounded-2xl ${activeCatTheme.accentText} shadow-lg`}>
                            <ServiceIcon icon={activeService.icon} className="w-7 h-7" />
                          </div>
                          <h2 className="text-xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            {activeService.title}
                          </h2>
                        </div>
                        <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed max-w-2xl font-medium">
                          {activeService.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 self-start md:self-center">
                        {activeService.sectors.map((sec, secIdx) => (
                          <span
                            key={secIdx}
                            className={`px-3 py-1.5 ${activeCatTheme.badgeBg} ${activeCatTheme.badgeText} rounded-xl text-[10px] font-bold tracking-wider uppercase border ${activeCatTheme.badgeBorder}`}
                          >
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Scope of Work Bullet Cards */}
                    <div className="space-y-4">
                      <h3 className={`text-xs font-black tracking-widest ${activeCatTheme.accentText} uppercase`}>
                        {isAr ? 'نطاق العمل والتفاصيل الفنية المعتمدة' : 'TECHNICAL SCOPE & IMPLEMENTATION'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeService.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className={`group p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border ${activeCatTheme.badgeBorder} hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300 flex items-start space-x-3.5 rtl:space-x-reverse shadow-md`}
                          >
                            <div className={`w-7 h-7 ${activeCatTheme.badgeBg} border ${activeCatTheme.badgeBorder} flex items-center justify-center rounded-xl ${activeCatTheme.accentText} flex-shrink-0 mt-0.5`}>
                              <Check className="w-4 h-4" />
                            </div>
                            <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                              {feat}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explore Projects Button Link */}
                    <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex justify-end">
                      <MagneticButton range={25} strength={0.3}>
                        <Link
                          href={`/${locale}/projects?category=${encodeURIComponent(activeService.title)}`}
                          className={`inline-flex items-center space-x-2 rtl:space-x-reverse px-7 py-4 ${activeCatTheme.badgeBg} text-white border ${activeCatTheme.badgeBorder} hover:border-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl ${activeCatTheme.cardShadow} hover:-translate-y-0.5`}
                        >
                          <span>{isAr ? 'استعرض مشاريعنا المعتمدة في هذا القطاع' : 'Explore Certified Projects In This Sector'}</span>
                          <span className="text-sm font-extrabold">{isAr ? '←' : '→'}</span>
                        </Link>
                      </MagneticButton>
                    </div>

                  </div>
                </div>
              );
            })() : (
              <div className="w-full flex items-center justify-center min-h-[350px] border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-500 dark:text-slate-400 text-sm">{isAr ? 'يرجى اختيار خدمة من القائمة' : 'Please select a service from the sidebar'}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. Heavy Machinery & Equipment Fleet Showcase */}
      <section className="space-y-10 pt-12 text-start border-t border-slate-200/60 dark:border-gray-800/30">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest bg-brand-sky/10 text-[#0070BA] dark:text-brand-sky px-3 py-1 rounded-full uppercase">
            {isAr ? "الجاهزية والقدرة التنفيذية الميدانية" : "FLEET LOGISTICS & HEAVY MACHINERY READINESS"}
          </span>
          <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {isAr ? "أسطول الآليات والمعدات الثقيلة المتخصصة" : "Specialised Heavy Machinery & Equipment Fleet"}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-text-sub max-w-3xl leading-relaxed font-semibold">
            {isAr
              ? "نمتلك أسطولاً متكاملاً يتجاوز ١٢٠ آلية ثقيلة ومعدة متخصصة مجهزة بأحدث التقنيات، لتغطية كافة مراحل مشاريع الطرق والبنية التحتية من الكشط والسفلتة وحتى شبكات السيول والصيانة البلدية."
              : "We own and operate an integrated fleet exceeding 120 heavy machinery and specialised units, fully equipped to support highway paving, stormwater drainage networks, and municipal maintenance."}
          </p>
        </div>

        {/* Equipment Grid: 2 cols mobile / 3 cols tablet / 4-6 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            {
              nameAr: 'كشاطة أسفلت',
              nameEn: 'Asphalt Milling Machine',
              categoryAr: 'معدات أسفلت',
              categoryEn: 'Asphalt Equipment',
              img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'فرادة أسفلت',
              nameEn: 'Asphalt Paver',
              categoryAr: 'معدات أسفلت',
              categoryEn: 'Asphalt Equipment',
              img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'مكنسة شوارع',
              nameEn: 'Road Sweeper',
              categoryAr: 'معدات أسفلت',
              categoryEn: 'Asphalt Equipment',
              img: 'https://images.unsplash.com/photo-1573048613026-a75c5c88b0b0?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'بوبكات',
              nameEn: 'Bobcat / Skid Steer',
              categoryAr: 'معدات أسفلت',
              categoryEn: 'Asphalt Equipment',
              img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'شيول / لودر',
              nameEn: 'Wheel Loader',
              categoryAr: 'معدات أسفلت',
              categoryEn: 'Asphalt Equipment',
              img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'صهريج جيت',
              nameEn: 'Water Jetter Truck',
              categoryAr: 'تصريف السيول',
              categoryEn: 'Stormwater Drainage',
              img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'صهريج فاكيوم',
              nameEn: 'Vacuum Tanker Truck',
              categoryAr: 'تصريف السيول',
              categoryEn: 'Stormwater Drainage',
              img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'وانيت ميداني',
              nameEn: 'Field Pickup Truck',
              categoryAr: 'شاحنات ونقل',
              categoryEn: 'Transport & Fleet',
              img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'دينا نقل خفيف',
              nameEn: 'Light Truck (Dyna)',
              categoryAr: 'شاحنات ونقل',
              categoryEn: 'Transport & Fleet',
              img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'شاحنة قلاب',
              nameEn: 'Dump Truck',
              categoryAr: 'شاحنات ونقل',
              categoryEn: 'Transport & Fleet',
              img: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'JCB حفار',
              nameEn: 'JCB Backhoe / Excavator',
              categoryAr: 'شاحنات ونقل',
              categoryEn: 'Transport & Fleet',
              img: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=800&q=80',
            },
            {
              nameAr: 'رصاصة / مدحلة',
              nameEn: 'Vibratory Road Roller',
              categoryAr: 'شاحنات ونقل',
              categoryEn: 'Transport & Fleet',
              img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80',
            },
          ].map((eq, idx) => {
            const catTheme = getCategoryTheme(eq.categoryAr);
            return (
              <div
                key={idx}
                className={`group relative flex flex-col rounded-3xl overflow-hidden border ${catTheme.cardBorder} ${catTheme.hoverBorder} bg-white/90 dark:bg-slate-900/90 ${catTheme.cardShadow} transition-all duration-500 hover:-translate-y-2 cursor-default backdrop-blur-2xl shadow-md`}
              >
                {/* Image */}
                <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 aspect-video">
                  <img
                    src={eq.img}
                    alt={isAr ? eq.nameAr : eq.nameEn}
                    loading="lazy"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
                  {/* Category Badge */}
                  <span className={`absolute top-3 start-3 ${catTheme.badgeBg} backdrop-blur-md ${catTheme.badgeText} text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border ${catTheme.badgeBorder} shadow-md`}>
                    {isAr ? eq.categoryAr : eq.categoryEn}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-4 gap-1 text-start relative z-10">
                  <h4 className={`text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug line-clamp-2 ${catTheme.titleHover} transition-colors duration-300`}>
                    {isAr ? eq.nameAr : eq.nameEn}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">
                    {isAr ? eq.nameEn : eq.nameAr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
