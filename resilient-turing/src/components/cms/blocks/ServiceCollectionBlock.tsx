import React from 'react';
import Link from 'next/link';
import { Wrench, Building, Layers, Waves, Route, Trash2, Truck, HardHat, ArrowLeft } from 'lucide-react';
import { ServiceCollectionBlockConfig } from '../../../lib/cms/blockSchemas';
import { Container, Badge } from '../../ui/primitives';
import { getCategoryTheme } from '../../../utils/categoryThemes';

interface ServiceCollectionBlockProps {
  config: ServiceCollectionBlockConfig;
  services: Array<{ id: string; title: string; description: string; category?: string; icon?: string }>;
  locale: 'ar' | 'en';
}

const ServiceIcon = ({ icon, className = "w-6 h-6" }: { icon?: string; className?: string }) => {
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
      return <Wrench className={className} />;
  }
};

export const ServiceCollectionBlock: React.FC<ServiceCollectionBlockProps> = ({ config, services, locale }) => {
  const isAr = locale === 'ar';

  return (
    <section className="py-24 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#070B14] dark:via-[#0D1527] dark:to-[#070B14] relative overflow-hidden border-y border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
      <div className="absolute top-10 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Container width="standard">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 text-start">
            <Badge variant="brand" size="md" className="mb-2 uppercase tracking-widest px-4 py-1.5 font-bold shadow-lg shadow-sky-500/10">
              {isAr ? config.tagAr || 'مجالات التميز والحلول الإنشائية' : config.tagEn || 'CORE SERVICES'}
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {isAr ? config.titleAr || 'خدماتنا الرئيسية المعتمدة' : config.titleEn || 'Our Certified Engineering Services'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-2xl font-medium">
              {isAr
                ? config.subtitleAr || 'حلول هندسية متكاملة مدعومة بأحدث المعدات الثقيلة والكوادر المتخصصة وفق المعايير السعودية والآيزو.'
                : config.subtitleEn || 'End-to-end civil engineering solutions backed by advanced equipment fleets and ISO certifications.'}
            </p>
          </div>

          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0070BA] dark:hover:border-sky-500 text-[#0070BA] dark:text-sky-400 font-bold text-xs uppercase tracking-wider group transition-all duration-300 shadow-md hover:shadow-lg shrink-0"
          >
            <span>{isAr ? 'عرض كافة الخدمات والتفاصيل' : 'View All Services & Scopes'}</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services || []).slice(0, config.maxItems || 6).map((serv, idx) => {
            const catTheme = getCategoryTheme(serv.title);

            return (
              <Link
                key={serv.id}
                href={`/${locale}/services`}
                className={`relative group rounded-3xl bg-white/90 dark:bg-slate-900/90 border ${catTheme.cardBorder} ${catTheme.hoverBorder} p-8 ${catTheme.cardShadow} transition-all duration-500 hover:-translate-y-2.5 backdrop-blur-2xl flex flex-col justify-between overflow-hidden text-start cursor-pointer`}
              >
                {/* Radial Glow Spotlight in Catalog Color */}
                <div className={`absolute top-0 right-0 w-36 h-36 ${catTheme.glowBg} rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl ${catTheme.badgeBg} border ${catTheme.badgeBorder} ${catTheme.accentText} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <ServiceIcon icon={serv.icon} className="w-7 h-7" />
                    </div>
                    <span className={`px-3.5 py-1.5 rounded-xl ${catTheme.badgeBg} ${catTheme.badgeText} text-xs font-mono font-bold border ${catTheme.badgeBorder}`}>
                      #{idx + 1}
                    </span>
                  </div>

                  <h3 className={`text-xl font-black text-slate-900 dark:text-white ${catTheme.titleHover} transition-colors tracking-tight leading-snug`}>
                    {serv.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium line-clamp-3">
                    {serv.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 relative z-10">
                  <span>{isAr ? "اعتماد كود البناء السعودي" : "Saudi Code Compliant"}</span>
                  <span className={`${catTheme.accentText} font-bold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform`}>
                    {isAr ? "التفاصيل ←" : "Details →"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
