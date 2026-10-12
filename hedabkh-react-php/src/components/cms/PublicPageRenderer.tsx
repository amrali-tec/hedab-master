'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Phone, MessageCircle, Target, Rocket, Award, ShieldCheck, CheckCircle2, Zap, Building2, Quote, Truck, BadgeCheck, FileText } from 'lucide-react';
import { ContentBlock } from '../../lib/cms/blockSchemas';
import { Rotating3DTimelineCarousel } from '../ui/Rotating3DTimelineCarousel';
import InteractiveSaudiMap from '../ui/InteractiveSaudiMap';
import { mockData } from '../../data/mockData';
import { storageAdapter } from '../../services/storageAdapter';
import { Container, Card } from '../ui/primitives';

import { HeroBlock } from './blocks/HeroBlock';
import { ServiceCollectionBlock } from './blocks/ServiceCollectionBlock';
import { ProjectCollectionBlock } from './blocks/ProjectCollectionBlock';
import { StatisticsBlock } from './blocks/StatisticsBlock';
import { PartnersBlock } from './blocks/PartnersBlock';
import { CtaBlock } from './blocks/CtaBlock';
import { AboutOverviewBlock } from './blocks/AboutOverviewBlock';
import { TechnicalCatalogCenter } from '../ui/TechnicalCatalogCenter';

import { BlockErrorBoundary } from './BlockErrorBoundary';

import { useProjects, useServices, usePartners, useStatistics } from '../../hooks';

interface PublicPageRendererProps {
  blocks: ContentBlock[];
  locale?: 'ar' | 'en';
  isStandalone?: boolean;
  depth?: number;
}

export const PublicPageRenderer: React.FC<PublicPageRendererProps> = ({
  blocks,
  locale = 'ar',
  isStandalone = false,
  depth = 0,
}) => {
  if (depth > 6) {
    return null;
  }
  const isAr = locale === 'ar';
  const localizedData = mockData[locale] || mockData.ar;

  const { data: apiProjects } = useProjects(locale);
  const { data: apiServices } = useServices(locale);
  const { data: apiPartners } = usePartners();
  const { data: apiStats } = useStatistics(locale);

  const projectsList = apiProjects && apiProjects.length > 0 ? apiProjects : (localizedData.projects || []);
  const servicesList = apiServices && apiServices.length > 0 ? apiServices : (localizedData.services || []);
  const partnersList = apiPartners && apiPartners.length > 0 ? apiPartners : (storageAdapter.getPartners() || []);

  const dynamicKpis = (apiStats && apiStats.length > 0)
    ? apiStats.map((s) => ({
        id: s.id,
        value: `${s.prefix || ''}${s.value}${s.suffix || ''}`,
        label: s.label,
        icon: Sparkles,
        sub: s.label || '',
      }))
    : (isAr
        ? [
            { id: 'kpi-1', value: '+15', label: 'عاماً من الريادة والتميز الإنشائي', icon: Sparkles, sub: 'منذ عام 2011م' },
            { id: 'kpi-2', value: '+120', label: 'مشروع بنية تحتية وطرق منجز', icon: Sparkles, sub: 'بالمواصفات القياسية' },
            { id: 'kpi-3', value: '100%', label: 'نسبة الالتزام بالكود السعودي والجداول', icon: Sparkles, sub: 'امتثال هندسي شامل' },
            { id: 'kpi-4', value: '4', label: 'مناطق جغرافية نشطة بالمملكة', icon: Sparkles, sub: 'الرياض والقصيم والشرقية' },
          ]
        : [
            { id: 'kpi-1', value: '+15', label: 'Years of Civil Engineering Leadership', icon: Sparkles, sub: 'Established 2011' },
            { id: 'kpi-2', value: '+120', label: 'Completed Infrastructure Works', icon: Sparkles, sub: 'Standard Specifications' },
            { id: 'kpi-3', value: '100%', label: 'Saudi Building Code Adherence', icon: Sparkles, sub: 'Rigorous Compliance' },
            { id: 'kpi-4', value: '4', label: 'Active Operational Regions in KSA', icon: Sparkles, sub: 'Riyadh, Qassim, Eastern' },
          ]);

  return (
    <div className="flex flex-col w-full overflow-hidden" suppressHydrationWarning>
      {(blocks || [])
        .filter((block) => block && typeof block === 'object' && typeof block.id === 'string' && block.isVisible)
        .map((block) => {
          const config = block.config || {};

          switch (block.type) {
            case 'hero':
              return <HeroBlock key={block.id} config={config as any} locale={locale} />;

            case 'aboutOverview':
              return <AboutOverviewBlock key={block.id} config={config as any} locale={locale} />;

            case 'timeline':
              return (
                <section key={block.id} className="py-20 bg-slate-100/90 dark:bg-[#070B14] relative overflow-hidden border-y border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
                  <Container width="narrow" className="mb-12 text-center">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                      {isAr ? config.tagAr || 'مسار الإنجاز والنمو' : config.tagEn || 'GROWTH & MILESTONES'}
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2 mb-4">
                      {isAr ? config.titleAr || 'مسار الإنجازات الزمني ثلاثي الأبعاد' : config.titleEn || '360° Milestones & Achievements'}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      {isAr
                        ? config.subtitleAr || 'استعرض المحطات التاريخية والمشاريع الاستراتيجية التي ساهمت في ترسيخ مكانتنا الريادية.'
                        : config.subtitleEn || 'Explore the milestones and infrastructure achievements defining our corporate heritage.'}
                    </p>
                  </Container>
                  <Rotating3DTimelineCarousel locale={locale} />
                </section>
              );

            case 'saudiMap':
              return (
                <section key={block.id} className="py-20 bg-slate-50 dark:bg-[#070B14]/50 relative border-y border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
                  <Container width="narrow" className="mb-12 text-center">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      {isAr ? config.tagAr || 'الانتشار الجغرافي والمشاريع' : config.tagEn || 'REGIONAL REACH'}
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2 mb-4">
                      {isAr ? config.titleAr || 'خريطة مشاريعنا وفروعنا بالمملكة' : config.titleEn || 'Interactive Regional Projects Map'}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      {isAr
                        ? config.subtitleAr || 'تغطية تشغيلية وميدانية شاملة لكبرى مناطق ومحافظات المملكة العربية السعودية.'
                        : config.subtitleEn || 'Comprehensive operational and project coverage across key Saudi regions.'}
                    </p>
                  </Container>
                  <InteractiveSaudiMap locale={locale} />
                </section>
              );

            case 'projectCollection':
              return (
                <ProjectCollectionBlock
                  key={block.id}
                  config={config as any}
                  projects={projectsList}
                  locale={locale}
                />
              );

            case 'serviceCollection':
              return (
                <ServiceCollectionBlock
                  key={block.id}
                  config={config as any}
                  services={servicesList}
                  locale={locale}
                />
              );

            case 'partners':
              return (
                <PartnersBlock
                  key={block.id}
                  config={config as any}
                  partners={partnersList}
                  locale={locale}
                />
              );

            case 'statistics':
              return (
                <StatisticsBlock
                  key={block.id}
                  config={config as any}
                  kpis={dynamicKpis}
                  locale={locale}
                />
              );

            case 'richText': {
              const textContent = isAr ? (config.contentAr || '') : (config.contentEn || config.contentAr || '');
              const isVisionMission = textContent.includes('الرؤية') || textContent.includes('Vision') || textContent.includes('الرسالة') || textContent.includes('Mission');
              const isValues = textContent.includes('القيم الجوهرية') || textContent.includes('Core Values');
              const isChairman = textContent.includes('الرسالة القيادية') || textContent.includes('Executive Statement') || textContent.includes('1010720712');
              const isExecutivePillars = textContent.includes('الركائز الاستراتيجية للقيادة') || textContent.includes('Executive Strategic Pillars');

              if (isVisionMission) {
                return (
                  <section key={block.id} className="py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#070B14] dark:via-[#0B1120] dark:to-[#070B14] relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
                    <Container width="standard">
                      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
                        {(config.badgeAr || config.badgeEn) && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#0070BA] dark:text-brand-sky text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isAr ? config.badgeAr : config.badgeEn || config.badgeAr}</span>
                          </span>
                        )}
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          {isAr ? config.titleAr : config.titleEn || config.titleAr}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative group rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-sky-500/30 p-8 sm:p-10 shadow-xl dark:shadow-2xl backdrop-blur-xl hover:border-sky-400 transition-all duration-300 flex flex-col justify-between overflow-hidden text-start">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-all" />
                          
                          <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                              <span className="px-3.5 py-1 rounded-lg bg-sky-500/20 text-[#0070BA] dark:text-sky-300 text-xs font-black uppercase tracking-wider border border-sky-500/30">
                                {isAr ? "الرؤية (Our Vision)" : "Our Vision"}
                              </span>
                              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-[#0070BA] dark:text-sky-400 group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6" />
                              </div>
                            </div>

                            <p className="text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
                              أن نصبح من الشركات الرائدة في قطاع المقاولات والتشغيل والصيانة في المملكة العربية السعودية، وأن نكون الخيار الأول لعملائنا من خلال الجودة، والابتكار، والالتزام، والمساهمة الفاعلة في تنفيذ مشاريع تدعم التنمية المستدامة وتواكب مستهدفات رؤية المملكة 2030.
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-[#0070BA] dark:text-sky-400">
                            <Sparkles className="w-4 h-4" />
                            <span>{isAr ? "رؤية مستقبلية تتماشى مع رؤية 2030" : "Aligned with Saudi Vision 2030"}</span>
                          </div>
                        </div>

                        <div className="relative group rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-emerald-500/30 p-8 sm:p-10 shadow-xl dark:shadow-2xl backdrop-blur-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between overflow-hidden text-start">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />

                          <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                              <span className="px-3.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                                {isAr ? "الرسالة (Our Mission)" : "Our Mission"}
                              </span>
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                <Rocket className="w-6 h-6" />
                              </div>
                            </div>

                            <p className="text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
                              نسعى إلى تقديم خدمات هندسية وإنشائية متكاملة تلبي تطلعات عملائنا من خلال حلول مبتكرة، وكفاءة تشغيلية عالية، وجودة تنفيذ تواكب أفضل الممارسات والمعايير العالمية. نؤمن بأن نجاح كل مشروع يبدأ بالتخطيط الهندسي السليم وينتهي بتسليم أعمال تتجاوز التوقعات، مع الالتزام التام بأعلى معايير السلامة والاستدامة البيئية.
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{isAr ? "التزام كامل بأعلى معايير الجودة والسلامة" : "Uncompromised Quality & Safety Standards"}</span>
                          </div>
                        </div>
                      </div>
                    </Container>
                  </section>
                );
              }

              if (isValues) {
                const valuesList = [
                  {
                    titleAr: "الجودة والتميز",
                    titleEn: "Quality & Excellence",
                    descAr: "تطبيق أعلى المعايير الفنية والهندسية في كافة مراحل التنفيذ والإشراف لضمان دقة المخرجات واستدامتها.",
                    icon: Award,
                    color: "text-amber-600 dark:text-amber-400",
                    borderColor: "border-amber-500/30 hover:border-amber-400",
                    bgGlow: "bg-amber-500/10"
                  },
                  {
                    titleAr: "الالتزام والموثوقية",
                    titleEn: "Commitment & Reliability",
                    descAr: "الانضباط الكامل بالجداول الزمنية، والمواصفات الفنية، والوفاء بالعقود لبناء شراكات متينة وطويلة الأمد.",
                    icon: CheckCircle2,
                    color: "text-[#0070BA] dark:text-sky-400",
                    borderColor: "border-sky-500/30 hover:border-sky-400",
                    bgGlow: "bg-sky-500/10"
                  },
                  {
                    titleAr: "السلامة المهنية والبيئة",
                    titleEn: "Occupational Safety & Environment",
                    descAr: "توفير بيئة عمل آمنة خالية من الحوادث وحماية الموارد الطبيعية وفق المعايير والشهادات الدولية.",
                    icon: ShieldCheck,
                    color: "text-emerald-600 dark:text-emerald-400",
                    borderColor: "border-emerald-500/30 hover:border-emerald-400",
                    bgGlow: "bg-emerald-500/10"
                  },
                  {
                    titleAr: "الابتكار والكفاءة",
                    titleEn: "Innovation & Efficiency",
                    descAr: "توظيف أحدث الآليات والمعدات والتقنيات الحديثة لإدارة الموارد بأعلى كفاءة تشغيلية وتحقيق أفضل قيمة للمشاريع.",
                    icon: Zap,
                    color: "text-purple-600 dark:text-purple-400",
                    borderColor: "border-purple-500/30 hover:border-purple-400",
                    bgGlow: "bg-purple-500/10"
                  },
                  {
                    titleAr: "المسؤولية الوطنية والمجتمعية",
                    titleEn: "National & Social Responsibility",
                    descAr: "تعزيز نسبة المحتوى المحلي ودعم التنمية المستدامة بما يتماشى مع التوجهات الوطنية وتطوير البنية التحتية للمدن.",
                    icon: Building2,
                    color: "text-rose-600 dark:text-rose-400",
                    borderColor: "border-rose-500/30 hover:border-rose-400",
                    bgGlow: "bg-rose-500/10"
                  }
                ];

                return (
                  <section key={block.id} className="py-20 bg-slate-100/80 dark:bg-[#070B14] relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
                    <Container width="standard">
                      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isAr ? "القيم الجوهرية (Our Core Values)" : "Our Core Values"}</span>
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          {isAr ? "القيم الجوهرية التي تقود تميزنا الميداني" : "Core Values Driving Our Field Leadership"}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto font-medium">
                          {isAr ? "المبادئ والقواعد الأساسية التي تحكم جودة أعمالنا وتعزز ثقة شركائنا في مختلف المشاريع الوطنية." : "Fundamental engineering values guiding execution standards across KSA projects."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {valuesList.map((val, idx) => {
                          const IconComp = val.icon;
                          return (
                            <div
                              key={idx}
                              className={`relative group rounded-2xl bg-white/90 dark:bg-slate-900/80 border ${val.borderColor} p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between text-start ${idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                            >
                              <div className="space-y-4">
                                <div className={`w-12 h-12 rounded-xl ${val.bgGlow} border ${val.borderColor} flex items-center justify-center ${val.color} group-hover:scale-110 transition-transform`}>
                                  <IconComp className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                  {isAr ? val.titleAr : val.titleEn}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                                  {isAr ? val.descAr : val.descAr}
                                </p>
                              </div>

                              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                                <span>{isAr ? `قيمة جوهرية #${idx + 1}` : `Core Value #${idx + 1}`}</span>
                                <span className={val.color}>★</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Container>
                  </section>
                );
              }

              if (isChairman) {
                return (
                  <section key={block.id} className="py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#070B14] dark:via-[#0B1120] dark:to-[#070B14] relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
                    <Container width="standard">
                      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                          <Quote className="w-3.5 h-3.5" />
                          <span>{isAr ? "الرسالة القيادية والموجهات الاستراتيجية" : "Executive Leadership Statement"}</span>
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          {isAr ? "كلمة رئيس مجلس الإدارة ورئيسنا التنفيذي" : "Message from Chairman of the Board & CEO"}
                        </h2>
                      </div>

                      <div className="space-y-12">
                        <div className="relative group rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-amber-500/30 p-8 sm:p-12 shadow-xl dark:shadow-2xl backdrop-blur-xl text-start space-y-8 overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                          <p className="text-slate-900 dark:text-slate-100 text-lg sm:text-2xl font-bold leading-relaxed tracking-tight border-r-4 border-amber-500 dark:border-amber-400 pr-6">
                            {isAr
                              ? "إن ما حققته شركة هضاب الخليج العربي للمقاولات من نجاحات متتالية ومشاريع سيادية ناجحة في مختلف مناطق المملكة لم يكن ليتأتى لولا توفيق الله ثم الالتزام الصارم بأعلى المعايير الهندسية والاعتماد على الكوادر الوطنية المؤهلة بأسطول متطور وأعلى معدلات الكفاءة التشغيلية."
                              : "The continuous milestones and landmark infrastructure projects delivered by Arabian Gulf Hills Contracting are driven by uncompromising engineering standards, continuous investment in specialized heavy machinery, and an empowered Saudi workforce."}
                          </p>

                          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-black text-lg shadow-md">
                                HG
                              </div>
                              <div>
                                <h4 className="text-base font-black text-slate-900 dark:text-white">
                                  {isAr ? "رئيس مجلس الإدارة والرئيس التنفيذي" : "Chairman & CEO"}
                                </h4>
                                <p className="text-xs text-amber-600 dark:text-amber-400/90 font-bold">
                                  {isAr ? "شركة هضاب الخليج العربي للمقاولات" : "Arabian Gulf Hills Contracting Co."}
                                </p>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold">
                              <FileText className="w-3.5 h-3.5 text-[#0070BA] dark:text-sky-400" />
                              <span>{isAr ? "سجل تجاري: 1010720712 | رقم موحد: 7023600179" : "CR: 1010720712 | Unified: 7023600179"}</span>
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-sky-500/30 p-8 shadow-xl hover:border-sky-400 transition-all space-y-4 text-start">
                            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-[#0070BA] dark:text-sky-400">
                              <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                              {isAr ? "التخطيط الهيكلي والجودة الإنشائية المستدامة" : "Engineering Foundation & Sustainable Quality"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                              {isAr
                                ? "منذ انطلاقة الشركة ومقرها الرئيسي بالرياض، أخذنا على عاتقنا أن نكون الذراع التنفيذي الموثوق في مشاريع البنية التحتية، رصف الطرق، وشبكات تصريف السيول بأسس هندسية مستدامة تخدم الأجيال القادمة."
                                : "Operating from our Riyadh headquarters, we serve as a premier national contractor executing infrastructure, road paving, and stormwater drainage networks."}
                            </p>
                          </div>

                          <div className="rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-emerald-500/30 p-8 shadow-xl hover:border-emerald-400 transition-all space-y-4 text-start">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                              <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                              {isAr ? "الجودة الشاملة وشهادات ISO الـ 5 الدولية" : "Integrated Management & 5 ISO Certifications"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                              {isAr
                                ? "منظومة إدارة معتمدة بـ 5 شهادات آيزو دولية: ISO 9001 (الجودة)، ISO 14001 (البيئة)، ISO 45001 (السلامة)، ISO 26000 (المسؤولية)، ISO 31000 (إدارة المخاطر)."
                                : "Certified integrated system spanning ISO 9001, ISO 14001, ISO 45001, ISO 26000, and ISO 31000 risk management."}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {["ISO 9001", "ISO 14001", "ISO 45001", "ISO 26000", "ISO 31000"].map((iso, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                                  {iso}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-purple-500/30 p-8 shadow-xl hover:border-purple-400 transition-all space-y-4 text-start">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                              <Truck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                              {isAr ? "الأسطول الرقمي والمعدات الثقيلة (+150 آلية)" : "Advanced Machinery Fleet (150+ Heavy Units)"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                              {isAr
                                ? "أسطول آلي متطور يتجاوز 150 آلية ومعدة ثقيلة ومحطات تصنيع الخرسانة الجاهزة وحواجز نيوجيرسي يدار بنظم تتبع رقمية حديثة للاستجابة السريعة."
                                : "Operating over 150 heavy machines including milling planers, pavers, and precast barrier yards with real-time IoT tracking."}
                            </p>
                          </div>

                          <div className="rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-rose-500/30 p-8 shadow-xl hover:border-rose-400 transition-all space-y-4 text-start">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                              {isAr ? "التمكين الوطني والمحتوى المحلي (52.97%)" : "National Empowerment & Local Content (52.97%)"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                              {isAr
                                ? "حصلت الشركة على شهادة المحتوى المحلي بنسبة 52.97% (شهادة رقم 216243) دعماً للرؤية الوطنية وشراكة ممتدة مع أمانة الرياض والوزارات الكبرى."
                                : "Achieved 52.97% certified local content ratio (Cert #216243) reinforcing sovereign partnerships across KSA."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Container>
                  </section>
                );
              }

              if (isExecutivePillars) {
                const pillarsList = [
                  {
                    num: "01",
                    titleAr: "الجودة الصارمة والاعتمادات الدولية",
                    titleEn: "Strict Quality & ISO Accreditations",
                    descAr: "التزام لا يقبل المساومة بأعلى المعايير الهندسية وأنظمة إدارة الجودة المتكاملة ISO 9001 و 14001 و 45001.",
                    descEn: "Uncompromising compliance with top engineering standards and integrated ISO 9001, 14001 & 45001 systems.",
                    tagAr: "5 شهادات ISO دولية",
                    tagEn: "5 Global ISO Certs",
                    icon: Award,
                    color: "text-amber-600 dark:text-amber-400",
                    accentBg: "bg-amber-500/10 dark:bg-amber-500/20",
                    borderColor: "border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-400/80",
                    glowBg: "bg-amber-500/10",
                    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
                  },
                  {
                    num: "02",
                    titleAr: "التمكين الوطني والمحتوى المحلي",
                    titleEn: "National Empowerment & Local Content",
                    descAr: "رفع كفاءة الكادر الوطني والتوسع في توطين الصناعات الإنشائية بركيزة محتوى محلي موثقة تصل إلى 52.97%.",
                    descEn: "Empowering Saudi engineering talent and local supply chains with a verified 52.97% local content ratio.",
                    tagAr: "نسبة معتمدة 52.97%",
                    tagEn: "52.97% Certified Score",
                    icon: ShieldCheck,
                    color: "text-[#0070BA] dark:text-sky-400",
                    accentBg: "bg-sky-500/10 dark:bg-sky-500/20",
                    borderColor: "border-sky-500/30 hover:border-sky-400 dark:hover:border-sky-400/80",
                    glowBg: "bg-sky-500/10",
                    badgeColor: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
                  },
                  {
                    num: "03",
                    titleAr: "التحول الرقمي والأسطول الذكي",
                    titleEn: "Digital Fleet & IoT Intelligence",
                    descAr: "تتبع الأسطول لحظياً باستخدام تقنيات IoT وتحليل البيانات التشغيلية لتحقيق أعلى كفاءة فرد وسفلتة للمشاريع.",
                    descEn: "Real-time heavy machinery tracking with IoT telematics and operational analytics for superior road paving precision.",
                    tagAr: "+150 معدة وآلية ذكية",
                    tagEn: "+150 IoT-Enabled Machines",
                    icon: Zap,
                    color: "text-emerald-600 dark:text-emerald-400",
                    accentBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
                    borderColor: "border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-400/80",
                    glowBg: "bg-emerald-500/10",
                    badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
                  },
                  {
                    num: "04",
                    titleAr: "السلامة المهنية والاستدامة البيئية",
                    titleEn: "Occupational Safety & Sustainability",
                    descAr: "بيئة عمل ميدانية خالية من الحوادث مع التدوير البيئي الكامل للمخلفات واستخدام المواد المعتمدة محلياً ودولياً.",
                    descEn: "Zero-accident site safety culture paired with green recycling practices and certified eco-compliant materials.",
                    tagAr: "بيئة عمل آمنة 100%",
                    tagEn: "100% Zero-Accident Culture",
                    icon: Sparkles,
                    color: "text-purple-600 dark:text-purple-400",
                    accentBg: "bg-purple-500/10 dark:bg-purple-500/20",
                    borderColor: "border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400/80",
                    glowBg: "bg-purple-500/10",
                    badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
                  }
                ];

                return (
                  <section key={block.id} className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#060A12] dark:via-[#090F1C] dark:to-[#060A12] relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
                    {/* Background Light Glows */}
                    <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

                    <Container width="standard">
                      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-widest shadow-md shadow-amber-500/5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>{isAr ? "الركائز الاستراتيجية للقيادة" : "Executive Strategic Pillars"}</span>
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          {isAr ? "الركائز الاستراتيجية لقيادة الشركة" : "Four Strategic Pillars Driving Executive Growth"}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pillarsList.map((val, idx) => {
                          const IconComp = val.icon;
                          return (
                            <div
                              key={idx}
                              className={`relative group rounded-3xl bg-white/90 dark:bg-slate-900/80 border ${val.borderColor} p-8 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between text-start`}
                            >
                              <div className="space-y-4">
                                <div className={`w-14 h-14 rounded-2xl ${val.bgGlow} border ${val.borderColor} flex items-center justify-center ${val.color} group-hover:scale-110 transition-transform`}>
                                  <IconComp className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                  {isAr ? val.titleAr : val.titleEn}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed font-medium">
                                  {isAr ? val.descAr : val.descAr}
                                </p>
                              </div>

                              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                                <span>{isAr ? `ركيزة استراتيجية #${idx + 1}` : `Strategic Pillar #${idx + 1}`}</span>
                                <span className={val.color}>★</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Container>
                  </section>
                );
              }

              return (
                <section key={block.id} className="py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-[#070B14] dark:via-[#0B1120] dark:to-[#070B14] relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
                  <div className="absolute top-1/4 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-10 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

                  <Container width="standard">
                    <div
                      className={`relative group rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-sky-500/40 p-8 sm:p-14 shadow-xl dark:shadow-2xl backdrop-blur-2xl transition-all space-y-8 ${
                        config.align === 'center'
                          ? 'text-center'
                          : config.align === 'left'
                          ? 'text-start'
                          : 'text-start'
                      }`}
                    >
                      {(config.badgeAr || config.badgeEn) && (
                        <div className={config.align === 'center' ? 'flex justify-center' : ''}>
                          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-[#0070BA] dark:text-sky-400 text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/5">
                            <Sparkles className="w-4 h-4" />
                            <span>{isAr ? config.badgeAr : config.badgeEn || config.badgeAr}</span>
                          </span>
                        </div>
                      )}

                      <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        {isAr ? config.titleAr : config.titleEn || config.titleAr}
                      </h2>

                      <div className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed space-y-6 whitespace-pre-line font-medium">
                        {isAr ? config.contentAr : config.contentEn || config.contentAr}
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        <span>{isAr ? "شركة هضاب الخليج العربي للمقاولات" : "Arabian Gulf Hills Contracting"}</span>
                        <span className="text-[#0070BA] dark:text-sky-400">★ ★ ★ ★ ★</span>
                      </div>
                    </div>
                  </Container>
                </section>
              );
            }

            case 'gallery':
              return (
                <section key={block.id} className="py-20 bg-slate-100/90 dark:bg-[#070B14]" suppressHydrationWarning>
                  <Container width="standard">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                      <span className="text-xs font-bold text-[#0070BA] dark:text-[#00B0F0] uppercase tracking-widest">
                        {isAr ? config.tagAr || 'معرض الصور والميدان' : config.tagEn || 'FIELD GALLERY'}
                      </span>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2 mb-4">
                        {isAr ? config.titleAr || 'صور حية من مواقع العمل والتنفيذ' : config.titleEn || 'Live Field & Asset Gallery'}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(config.images || [
                        { url: '/images/hero-bg.webp', captionAr: 'مشاريع كشط وسفلتة الطرق', captionEn: 'Road Paving Works' },
                        { url: '/images/company-overview.jpg', captionAr: 'توريد حواجز نيوجيرسي الخرسانية', captionEn: 'Concrete Barriers' },
                        { url: '/images/equipment-1.jpg', captionAr: 'أسطول المعدات وكاشطات الأسفلت', captionEn: 'Machinery Fleets' },
                      ]).map((img: any, idx: number) => (
                        <Card key={idx} variant="glass" padding="none" className="h-64 group relative overflow-hidden bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
                          <img
                            src={img.url}
                            alt={img.captionAr || 'Project Image'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-4">
                            <span className="text-xs font-bold text-white">
                              {isAr ? img.captionAr : img.captionEn || img.captionAr}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Container>
                </section>
              );

            case 'contactForm':
              return (
                <section key={block.id} className="py-20 bg-slate-100/90 dark:bg-[#070B14]/60 border-y border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
                  <Container width="narrow">
                    <div className="text-center mb-10 space-y-2">
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                        {isAr ? config.titleAr || 'طلب عرض سعر واستفسار' : config.titleEn || 'Request a Tender RFQ'}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                        {isAr
                          ? config.subtitleAr || 'يسعدنا استقبال استفساراتكم ونطاق أعمال مشاريعكم لتقديم عروض الأسعار الفنية والمالية.'
                          : config.subtitleEn || 'Submit your project requirements for customized technical proposals.'}
                      </p>
                    </div>

                    <form className="bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl dark:shadow-2xl space-y-4 text-start">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            {isAr ? 'الاسم الكامل أو اسم المنشأة' : 'Full Name / Company'}
                          </label>
                          <input
                            type="text"
                            placeholder={isAr ? 'م. سلطان القحطاني' : 'John Doe'}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00B0F0]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            {isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}
                          </label>
                          <input
                            type="email"
                            placeholder="name@company.sa"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00B0F0]"
                          />
                        </div>
                      </div>

                      {config.showPhoneField !== false && (
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            {isAr ? 'رقم الجوال للتواصل المباشر' : 'Phone Number'}
                          </label>
                          <input
                            type="tel"
                            placeholder="05XXXXXXXX"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00B0F0] font-mono"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          {isAr ? 'تفاصيل نطاق المشروع أو المواصفات' : 'Project Scope & Requirements'}
                        </label>
                        <textarea
                          rows={4}
                          placeholder={isAr ? 'نود الاستفسار عن توريد حواجز خرسانية أو تنفيذ أعمال سفلتة...' : 'Inquiry details...'}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00B0F0]"
                        />
                      </div>

                      <button
                        type="button"
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00B0F0] to-[#002060] hover:from-sky-400 hover:to-blue-700 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all cursor-pointer"
                      >
                        {isAr ? config.submitButtonTextAr || 'إرسال الطلب' : config.submitButtonTextEn || 'Submit RFQ'}
                      </button>
                    </form>
                  </Container>
                </section>
              );

            case 'cta':
              return <CtaBlock key={block.id} config={config as any} locale={locale} />;

            case 'catalogCenter':
            case 'specCatalog':
              return <TechnicalCatalogCenter key={block.id} locale={locale} />;

            case 'header':
              if (!isStandalone) return null;
              return (
                <header key={block.id} className="w-full bg-slate-950 border-b border-slate-800">
                  <div className="bg-gradient-to-r from-sky-950 to-blue-950 border-b border-sky-900/50 py-2 px-6">
                    <div className="container mx-auto flex items-center justify-between text-xs text-sky-300">
                      <span>{isAr ? config.announcementTextAr || 'الخط الساخن للمشاريع والمناقصات' : config.announcementTextEn || 'Direct Projects Hotline'}</span>
                      <a href={`tel:${config.hotlinePhone || '00966115126774'}`} className="font-mono font-bold text-white flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#00B0F0]" />
                        <span>{config.hotlinePhone || '00966115126774'}</span>
                      </a>
                    </div>
                  </div>
                </header>
              );

            case 'footer':
              if (!isStandalone) return null;
              return (
                <footer key={block.id} className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-xs">
                  <Container width="standard" className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="font-bold text-slate-200 text-sm mb-1">
                        {isAr ? 'شركة هضاب الخليج للمقاولات العامة' : 'Gulf Hills General Contracting Co.'}
                      </p>
                      <p>{isAr ? config.headquartersAr || 'المقر الرئيسي: الرياض، المملكة العربية السعودية' : config.headquartersEn || 'Headquarters: Riyadh, Saudi Arabia'}</p>
                    </div>
                  </Container>
                </footer>
              );

            case 'whatsapp':
              if (!isStandalone) return null;
              return (
                <a
                  key={block.id}
                  href={`https://wa.me/${config.phoneNumber || '966555123456'}?text=${encodeURIComponent(
                    isAr ? config.defaultMessageAr || 'مرحباً، أود الاستفسار عن خدمات هضاب الخليج.' : config.defaultMessageEn || 'Hello, I have an inquiry.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                  title={isAr ? config.tooltipAr || 'محادثة فورية عبر واتساب' : config.tooltipEn || 'WhatsApp Chat'}
                >
                  <MessageCircle className="w-7 h-7" />
                </a>
              );

            case 'container': {
              const directionClass = config.direction === 'row' ? 'flex flex-col md:flex-row' : 'flex flex-col';
              const wrapClass = config.wrap === false ? 'flex-nowrap' : 'flex-wrap';

              let justifyClass = 'justify-start';
              if (config.justify === 'center') justifyClass = 'justify-center';
              else if (config.justify === 'end') justifyClass = 'justify-end';
              else if (config.justify === 'between') justifyClass = 'justify-between';
              else if (config.justify === 'around') justifyClass = 'justify-around';

              let alignClass = 'items-stretch';
              if (config.align === 'center') alignClass = 'items-center';
              else if (config.align === 'start') alignClass = 'items-start';
              else if (config.align === 'end') alignClass = 'items-end';

              let gapClass = 'gap-6';
              if (config.gap === 0) gapClass = 'gap-0';
              else if (config.gap === 4) gapClass = 'gap-1';
              else if (config.gap === 8) gapClass = 'gap-2';
              else if (config.gap === 12) gapClass = 'gap-3';
              else if (config.gap === 16) gapClass = 'gap-4';
              else if (config.gap === 24) gapClass = 'gap-6';
              else if (config.gap === 32) gapClass = 'gap-8';
              else if (config.gap === 48) gapClass = 'gap-12';

              let themeClass = 'bg-transparent text-inherit';
              if (config.theme === 'dark') themeClass = 'bg-slate-950 text-white';
              else if (config.theme === 'navy') themeClass = 'bg-[#0b1329] text-white';
              else if (config.theme === 'slate') themeClass = 'bg-slate-900 text-slate-100';
              else if (config.theme === 'gradient') themeClass = 'bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white';
              else if (config.theme === 'light') themeClass = 'bg-slate-50 text-slate-900';

              let paddingClass = 'p-0';
              if (config.padding === 'compact') paddingClass = 'p-4 md:p-6';
              else if (config.padding === 'normal') paddingClass = 'p-6 md:p-12';
              else if (config.padding === 'spacious') paddingClass = 'p-10 md:p-20';

              const widthStyle: React.CSSProperties = {};
              if (config.customWidthPercent && typeof config.customWidthPercent === 'number') {
                widthStyle.width = `${config.customWidthPercent}%`;
              }
              if (config.minHeight) {
                widthStyle.minHeight = config.minHeight;
              }

              const containerWidthClass =
                config.widthMode === 'boxed'
                  ? 'container mx-auto'
                  : 'w-full';

              return (
                <div
                  key={block.id}
                  style={widthStyle}
                  className={`${containerWidthClass} ${directionClass} ${wrapClass} ${justifyClass} ${alignClass} ${gapClass} ${themeClass} ${paddingClass} transition-all`}
                >
                  {Array.isArray(block.children) && block.children.length > 0 ? (
                    <PublicPageRenderer
                      blocks={block.children}
                      locale={locale}
                      isStandalone={isStandalone}
                      depth={depth + 1}
                    />
                  ) : null}
                </div>
              );
            }

            case 'grid': {
              const colsDesk = config.columnsDesktop || 3;
              const colsTab = config.columnsTablet || 2;
              const colsMob = config.columnsMobile || 1;

              const gridMobMap: Record<number, string> = {
                1: 'grid-cols-1',
                2: 'grid-cols-2',
                3: 'grid-cols-3',
                4: 'grid-cols-4',
                6: 'grid-cols-6',
              };

              const gridTabMap: Record<number, string> = {
                1: 'md:grid-cols-1',
                2: 'md:grid-cols-2',
                3: 'md:grid-cols-3',
                4: 'md:grid-cols-4',
                6: 'md:grid-cols-6',
              };

              const gridDeskMap: Record<number, string> = {
                1: 'lg:grid-cols-1',
                2: 'lg:grid-cols-2',
                3: 'lg:grid-cols-3',
                4: 'lg:grid-cols-4',
                6: 'lg:grid-cols-6',
              };

              const mobClass = gridMobMap[colsMob] || 'grid-cols-1';
              const tabClass = gridTabMap[colsTab] || 'md:grid-cols-2';
              const deskClass = gridDeskMap[colsDesk] || 'lg:grid-cols-3';

              const gridColsClass = `${mobClass} ${tabClass} ${deskClass}`;

              let themeClass = 'bg-transparent text-inherit';
              if (config.theme === 'dark') themeClass = 'bg-slate-950 text-white';
              else if (config.theme === 'navy') themeClass = 'bg-[#0b1329] text-white';
              else if (config.theme === 'slate') themeClass = 'bg-slate-900 text-slate-100';
              else if (config.theme === 'gradient') themeClass = 'bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white';
              else if (config.theme === 'light') themeClass = 'bg-slate-50 text-slate-900';

              let paddingClass = 'p-0';
              if (config.padding === 'compact') paddingClass = 'p-4 md:p-6';
              else if (config.padding === 'normal') paddingClass = 'p-6 md:p-12';
              else if (config.padding === 'spacious') paddingClass = 'p-10 md:p-20';

              const gridStyle: React.CSSProperties = {};
              if (config.columnGap) {
                gridStyle.columnGap = `${config.columnGap}px`;
              }
              if (config.rowGap) {
                gridStyle.rowGap = `${config.rowGap}px`;
              }

              return (
                <div
                  key={block.id}
                  style={gridStyle}
                  className={`w-full grid ${gridColsClass} gap-6 ${themeClass} ${paddingClass} transition-all`}
                >
                  {Array.isArray(block.children) && block.children.length > 0 ? (
                    <PublicPageRenderer
                      blocks={block.children}
                      locale={locale}
                      isStandalone={isStandalone}
                      depth={depth + 1}
                    />
                  ) : null}
                </div>
              );
            }

            default:
              return null;
          }
        })}
    </div>
  );
};
