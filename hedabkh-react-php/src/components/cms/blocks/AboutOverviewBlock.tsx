import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  Truck, 
  Target, 
  Rocket, 
  ChevronLeft, 
  Sparkles, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { Container, Badge } from '../../ui/primitives';

interface AboutOverviewBlockProps {
  config?: {
    tagAr?: string;
    tagEn?: string;
    titleAr?: string;
    titleEn?: string;
    subtitleAr?: string;
    subtitleEn?: string;
  };
  locale: 'ar' | 'en';
}

export const AboutOverviewBlock: React.FC<AboutOverviewBlockProps> = ({ config = {}, locale }) => {
  const isAr = locale === 'ar';

  const highlights = [
    {
      icon: Award,
      titleAr: 'تصنيف بلدي معتمد',
      titleEn: 'Balady Classified',
      descAr: 'درجة ثانية في البناء والإنشاء، ودرجة خامسة في التشغيل والصيانة.',
      descEn: 'Grade 2 in Construction & Grade 5 in Operations & Maintenance.',
      badge: 'بلدي MOMRAH',
      color: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-500/30',
      bgGlow: 'bg-amber-500/10',
    },
    {
      icon: ShieldCheck,
      titleAr: 'محتوى محلي 52.97%',
      titleEn: '52.97% Local Content',
      descAr: 'شهادة معتمدة رقم 216243 لتعزيز سلاسل الإمداد والكوادر الوطنية.',
      descEn: 'Certified Score (#216243) reinforcing national capabilities.',
      badge: 'رؤية 2030',
      color: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'bg-emerald-500/10',
    },
    {
      icon: FileCheck,
      titleAr: '5 شهادات ISO دولية',
      titleEn: '5 Integrated ISO Certs',
      descAr: 'نظام إدارة متكامل للجودة والبيئة والسلامة وإدارة المخاطر.',
      descEn: 'ISO 9001, 14001, 45001, 26000 & 31000 certified management.',
      badge: 'ISO Standards',
      color: 'text-[#0070BA] dark:text-sky-400',
      borderColor: 'border-sky-500/30',
      bgGlow: 'bg-sky-500/10',
    },
    {
      icon: Truck,
      titleAr: 'أسطول آلي وميداني ضخم',
      titleEn: 'Extensive Heavy Fleet',
      descAr: 'كاشطات ورصاصات أسفلت، حفارات، ومضخات سيول بنظم تتبع لحظية.',
      descEn: 'Milling machines, pavers, excavators & dewatering units.',
      badge: '+60 آلية ثقيلة',
      color: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-500/30',
      bgGlow: 'bg-purple-500/10',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#070B14] dark:via-[#090E1A] dark:to-[#070B14] relative overflow-hidden border-y border-slate-200/80 dark:border-slate-800/80" suppressHydrationWarning>
      {/* Background Decorative Glows */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <Container width="standard">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 text-start max-w-3xl">
            <Badge variant="brand" size="md" className="mb-2 uppercase tracking-widest px-4 py-1.5 font-bold shadow-lg shadow-sky-500/10">
              {isAr ? config.tagAr || 'من نحن — شركة هضاب الخليج للمقاولات' : config.tagEn || 'ABOUT US — GULF HILLS'}
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {isAr 
                ? config.titleAr || 'شريككم الإنشائي الموثوق في البنية التحتية وصيانة المرافق'
                : config.titleEn || 'Your Trusted Infrastructure & Municipal Services Partner'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium">
              {isAr
                ? config.subtitleAr || 'شركة سعودية وطنية معتمدة تقدم حلولاً هندسية رائدة في رصف وسفلتة الطرق، تصريح السيول، وحواجز النيوجيرسي الخرسانية وفق أعلى معايير الجودة والسلامة.'
                : config.subtitleEn || 'A classified Saudi contracting firm delivering engineering solutions in asphalt paving, drainage trunk lines, and precast infrastructure.'}
            </p>
          </div>

          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070BA] to-[#002060] hover:from-sky-600 hover:to-[#003080] text-white font-bold text-xs uppercase tracking-wider group transition-all duration-300 shadow-md hover:shadow-lg shrink-0"
          >
            <span>{isAr ? 'الملف التعريفي الكامل والرؤية' : 'Explore Full Corporate Profile'}</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" />
          </Link>
        </div>

        {/* 2-Column Grid: Vision & Mission Overview + Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Vision & Mission Spotlight (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            {/* Vision Card */}
            <div className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-sky-500/30 shadow-xl dark:shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-sky-400 transition-all duration-300 text-start">
              <div className="absolute top-0 right-0 w-36 h-36 bg-sky-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="px-3.5 py-1 rounded-lg bg-sky-500/10 text-[#0070BA] dark:text-sky-400 text-xs font-black uppercase tracking-wider border border-sky-500/30">
                  {isAr ? 'الرؤية (Our Vision)' : 'Our Vision'}
                </span>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-[#0070BA] dark:text-sky-400">
                  <Target className="w-5 h-5" />
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-medium relative z-10">
                {isAr
                  ? 'أن نصبح من الشركات الرائدة في قطاع المقاولات والتشغيل والصيانة بالمملكة، والخيار الأول للجهات الحكومية والبلديات من خلال الابتكار، والجودة الصارمة، والمساهمة الفاعلة في تحقيق مستهدفات رؤية المملكة 2030.'
                  : 'To become one of the premier leaders in contracting, operation, and maintenance across Saudi Arabia, recognized as the premier partner for government and municipal clients.'}
              </p>
            </div>

            {/* Mission Card */}
            <div className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-emerald-500/30 shadow-xl dark:shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-emerald-400 transition-all duration-300 text-start">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="px-3.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  {isAr ? 'الرسالة (Our Mission)' : 'Our Mission'}
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Rocket className="w-5 h-5" />
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-medium relative z-10">
                {isAr
                  ? 'تقديم خدمات هندسية وإنشائية متكاملة تلبي تطلعات شركائنا بحلول مبتكرة وكفاءة تشغيلية عالية وفق كود البناء السعودي وكود الطرق، مع الالتزام التام بمعايير السلامة المهنية والاستدامة البيئية.'
                  : 'Delivering turnkey civil engineering solutions that exceed client expectations through innovative methods, high uptime, and strict adherence to Saudi building and safety codes.'}
              </p>
            </div>

            {/* Registration Metadata Strip */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0070BA] dark:text-sky-400" />
                <span>{isAr ? 'سجل تجاري: 1010720712' : 'CR: 1010720712'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isAr ? 'الرقم الوطني الموحد: 7023600179' : 'Unified Number: 7023600179'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{isAr ? 'المقر الرئيسي: الرياض' : 'HQ: Riyadh, KSA'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Key Pillar Highlights (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {highlights.map((h, idx) => {
              const IconComponent = h.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border ${h.borderColor} shadow-md hover:shadow-xl transition-all duration-300 flex items-start gap-4 text-start group`}
                >
                  <div className={`w-12 h-12 rounded-xl ${h.bgGlow} border ${h.borderColor} flex items-center justify-center ${h.color} shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {isAr ? h.titleAr : h.titleEn}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${h.bgGlow} ${h.color}`}>
                        {h.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isAr ? h.descAr : h.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </Container>
    </section>
  );
};
