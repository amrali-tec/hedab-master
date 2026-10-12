import { useParams } from 'react-router-dom';
import React from 'react';
import Link from 'next/link';
import { Check, Truck, Calendar, MapPin, Activity, ArrowLeft } from 'lucide-react';
import { useProjects } from '../../../../hooks';
import { mockData } from '../../../../data/mockData';
import { PageHeader } from '../../../../components/ui/PageHeader';

interface ProjectDetailsPageProps {
  params: Promise<{ locale: 'ar' | 'en'; id: string }>;
}

export default function ProjectDetailsPage(props?: any) {
  const routerParams = useParams<{ locale?: string; id?: string }>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const id = props?.id || routerParams?.id || '';
  const isAr = locale === 'ar';
  
  const { data: apiProjects } = useProjects(locale);
  const fallbackProjects = mockData[locale as 'ar' | 'en']?.projects || [];
  const projectsList = (apiProjects && apiProjects.length > 0) ? apiProjects : fallbackProjects;
  const project = projectsList.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center space-y-8 min-h-[70vh] bg-transparent text-text-main">
        <h1 className="text-2xl font-black text-text-main">
          {isAr ? 'المشروع غير موجود' : 'Project Not Found'}
        </h1>
        <p className="text-text-sub text-sm">
          {isAr
            ? 'نعتذر، لم نتمكن من العثور على المشروع الذي تبحث عنه.'
            : 'Sorry, we could not find the project you are looking for.'}
        </p>
        <div className="pt-4">
          <Link
            href={`/${locale}/projects`}
            className="px-6 py-3 bg-brand-blue text-white rounded text-xs font-bold uppercase tracking-wider"
          >
            {isAr ? 'العودة لصفحة المشاريع' : 'Back to Projects'}
          </Link>
        </div>
      </div>
    );
  }

  const getMachineryList = (projId: string, category: string = '') => {
    switch (projId) {
      case "proj-1":
        return isAr
          ? ["مولدات طاقة Caterpillar 500kVA", "رافعات تكييف مركزي للارتفاعات العالية", "أجهزة اختبار ومعايرة الأنظمة"]
          : ["Caterpillar 500kVA Generators", "Heavy HVAC Hoisting Cranes", "Systems calibration tools"];
      case "proj-2":
      case "proj-6":
        return isAr
          ? ["حفارات بوبكات Bobcat E20 للقبور", "شاحنات خلط خرسانة الأسوار", "أجهزة مسح وتحديد إحداثيات"]
          : ["Compact Bobcat E20 Excavators", "Boundary wall concrete mixers", "Precision laser scanners"];
      case "proj-3":
        return isAr
          ? ["حفارات عملاقة CAT-320D للتمديد", "شاحنات نقل ورافعات أنابيب 2400ملم", "مضخات سحب وضخ مياه السيول"]
          : ["Heavy Excavators CAT-320D", "Heavy pipe hoisting cranes (2400mm)", "Submersible high-flow pumps"];
      case "proj-4":
      case "proj-14":
      case "proj-16":
        return isAr
          ? ["كاشطات أسفلت Wirtgen W2000 دقيقة", "رصاصات أسفلت ثنائية Dynapac CC522", "شاحنات صيانة أعمدة الإنارة"]
          : ["Asphalt Millers Wirtgen W2000", "Vibratory Rollers Dynapac CC522", "Bucket trucks for lamp repairs"];
      case "proj-5":
        return isAr
          ? ["شيولات وبلدوزرات CAT D8T لإزالة الأنقاض", "شاحنات قلاب Mercedes Actros 24م³", "معدات تسوية ونظافة الأراضي"]
          : ["Bulldozers CAT D8T grading", "Mercedes Actros dump trucks (24m³)", "Land clearing graders"];
      case "proj-7":
        return isAr
          ? ["بلدوزرات وشيولات CAT لإزالة الأنقاض", "قلابات مرسيدس أكتروس 24م³", "رافعات سحب عوائق الطرق"]
          : ["CAT Bulldozers and Loaders", "Mercedes Actros dump trucks 24m³", "Heavy road barrier towing cranes"];
      case "proj-8":
      case "proj-9":
      case "proj-13":
      case "proj-15":
        return isAr
          ? ["مضخات سحب السيول عالية التدفق", "شاحنات صيانة قنوات تصريف السيول", "أجهزة رصد مناسيب المياه"]
          : ["High-flow stormwater pumps", "Drainage channel maintenance trucks", "Water level monitoring sensors"];
      case "proj-10":
        return isAr
          ? ["ناقلات سحب سيارات هيدروليكية", "رافعات شوكية ثقيلة", "شاحنات نقل الهياكل المعدنية"]
          : ["Hydraulic vehicle towing flatbeds", "Heavy forklift units", "Scrap metal transport trucks"];
      default: {
        if (category.includes('مقابر') || category.toLowerCase().includes('cemetery')) {
          return isAr ? ["حفارات بوبكات Bobcat للمقابر", "شاحنات خلط خرسانية", "معدات مسح ليزري"] : ["Bobcat Compact Excavators", "Concrete Transit Mixers", "Surveying Lasers"];
        }
        if (category.includes('طرق') || category.includes('سفلتة') || category.toLowerCase().includes('road') || category.toLowerCase().includes('asphalt')) {
          return isAr ? ["كاشطات أسفلت Wirtgen دقيقة", "رصاصات أسفلت ثنائية Dynapac", "شاحنات نقل أسفلت حراري"] : ["Wirtgen Asphalt Millers", "Dynapac Vibratory Rollers", "Hot-mix Asphalt Dumpers"];
        }
        if (category.includes('سيول') || category.includes('أمطار') || category.toLowerCase().includes('drainage') || category.toLowerCase().includes('flood')) {
          return isAr ? ["حفارات عملاقة CAT-320D", "مضخات سحب سيول عالية التدفق", "رافعات مد الأنابيب"] : ["Heavy Excavators CAT-320D", "High-Flow Submersible Pumps", "Pipe Laying Cranes"];
        }
        return isAr ? ["آليات ومعدات ثقيلة متخصصة", "شاحنات نقل مساندة"] : ["Specialized Heavy Machinery Units", "Support Logistic Trucks"];
      }
    }
  };

  const projectIdx = parseInt(project.id.replace('proj-', '')) || 1;
  const projectCode = `GH-PROJ-${String(projectIdx).padStart(2, '0')}`;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "Project",
    "name": project.title,
    "description": project.description,
    "url": `https://hedabkh.com.sa/${locale}/projects/${project.id}`,
    "image": project.image.startsWith('http') ? project.image : `https://hedabkh.com.sa${project.image}`,
    "location": {
      "@type": "Place",
      "name": project.location,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "SA"
      }
    },
    "provider": {
      "@type": "GeneralContractor",
      "name": "شركة هضاب الخليج العربي للمقاولات",
      "url": "https://hedabkh.com.sa"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-10 pb-20 space-y-12 min-h-[85vh] bg-transparent text-text-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-gray-800/30">
        <PageHeader
          title={project.title}
          subtitle={project.category}
          currentPageLabel={project.title}
          locale={locale}
          parentPath={{
            label: isAr ? 'سجل المشاريع' : 'Projects Record',
            href: `/${locale}/projects`
          }}
        />
        <Link
          href={`/${locale}/projects`}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-gray-800/40 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          {isAr ? 'العودة للمشاريع' : 'Back to Projects'}
        </Link>
      </div>

      {/* Main Showcase Hero Banner */}
      <div className="relative h-[300px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800/10">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 md:p-10">
          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 text-white text-start">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest bg-brand-sky text-black px-2.5 py-1 rounded-full uppercase">
                {projectCode}
              </span>
              <h1 className="text-xl md:text-3xl font-black leading-tight max-w-4xl drop-shadow-md">
                {project.title}
              </h1>
            </div>
            {project.progress !== undefined && (
              <div className="w-full md:max-w-[240px] space-y-2 shrink-0 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                  <span>{isAr ? 'نسبة الإنجاز الميداني' : 'FIELD COMPLETION'}</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-sky to-[#00B0F0] transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Technical Spec Sheet & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        {/* Left: Spec Sheet & Scopes */}
        <div className="lg:col-span-8 space-y-10 text-start">
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0070BA] dark:text-brand-sky" />
              {isAr ? 'الوصف الفني للمشروع' : 'Technical Project Overview'}
            </h2>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {project.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-[#0070BA] dark:text-brand-sky" />
              {isAr ? 'النقاط الفنية والمهام المنفذة' : 'Key Specifications & Executed Scope'}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {project.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3.5 rtl:space-x-reverse text-xs md:text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-gray-800/40 shadow-xs"
                >
                  <div className="w-6 h-6 bg-[#0070BA]/5 dark:bg-brand-sky/5 border border-[#0070BA]/10 dark:border-brand-sky/10 text-[#0070BA] dark:text-[#00B0F0] flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed font-semibold">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Meta Details & Financial spec sheet */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/20 p-8 rounded-2xl border border-slate-200 dark:border-gray-850/20 h-fit space-y-6 text-start">
            <h3 className="text-xs font-black tracking-widest text-[#0070BA] dark:text-brand-sky uppercase border-b border-slate-200/60 dark:border-gray-800/30 pb-3">
              {isAr ? 'بطاقة البيانات الفنية للمشروع' : 'Project Technical Spec Sheet'}
            </h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">
                  {isAr ? 'الجهة المالكة' : 'Client Organization'}
                </span>
                <span className="text-slate-900 dark:text-white font-extrabold text-sm mt-0.5 block">
                  {project.client}
                </span>
              </div>

              {project.contractNumber && (
                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-gray-800/30 pt-3">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">
                    {isAr ? 'رقم المشروع / العقد' : 'Contract / Project No.'}
                  </span>
                  <span className="text-slate-900 dark:text-white font-black text-xs font-mono bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {project.contractNumber}
                  </span>
                </div>
              )}

              {project.durationMonths && (
                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-gray-800/30 pt-3">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">
                    {isAr ? 'مدة التنفيذ التعاقدية' : 'Contract Duration'}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-extrabold text-xs">
                    {project.durationMonths} {isAr ? 'شهراً' : 'Months'}
                  </span>
                </div>
              )}

              {project.contractRole && (
                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-gray-800/30 pt-3">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">
                    {isAr ? 'دور المنشأة في التنفيذ' : 'Contractor Role'}
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-extrabold text-xs">
                    {project.contractRole}
                  </span>
                </div>
              )}
              
              <div className="border-t border-slate-200/60 dark:border-gray-800/30 pt-3">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">
                  {isAr ? 'الموقع الجغرافي' : 'Project Location'}
                </span>
                <span className="text-slate-900 dark:text-white font-extrabold text-xs mt-0.5 block">
                  {project.location}
                </span>
              </div>

              {project.contractSignDate && (
                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-gray-800/30 pt-3">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block font-bold">
                    {isAr ? 'تاريخ بدء التنفيذ' : 'Start Date'}
                  </span>
                  <span className="text-slate-900 dark:text-white font-extrabold text-xs font-mono">
                    {project.contractSignDate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Machinery Fleet */}
          <div className="bg-slate-50 dark:bg-slate-900/20 p-8 rounded-2xl border border-slate-200 dark:border-gray-850/20 text-start space-y-6">
            <h3 className="text-xs font-black tracking-widest text-[#0070BA] dark:text-brand-sky uppercase border-b border-slate-200/60 dark:border-gray-800/30 pb-3">
              {isAr ? 'الآليات والمعدات المخصصة' : 'Allocated Heavy Machinery'}
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {getMachineryList(project.id, project.category).map((mach: string, mIdx: number) => (
                <div
                  key={mIdx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-gray-850/30 bg-white dark:bg-slate-900/30 text-xs flex items-center space-x-3 rtl:space-x-reverse"
                >
                  <div className="w-8 h-8 bg-brand-blue/5 dark:bg-brand-sky/5 border border-brand-blue/10 dark:border-brand-sky/10 flex items-center justify-center rounded-lg text-[#0070BA] dark:text-brand-sky shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 leading-snug">{mach}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Site Handover Realism Showcase */}
      <div className="space-y-4 pt-10 text-start">
        <h3 className="text-xs font-mono font-bold text-[#0070BA] dark:text-brand-sky tracking-widest uppercase flex items-center gap-2">
          <span>{isAr ? 'توثيق المراحل الميدانية للمشروع' : 'PROJECT LIFECYCLE & EXECUTION STAGES'}</span>
        </h3>
        
        <div className={`grid grid-cols-1 ${project.executionPhaseImage ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          {/* 1. Site Prep */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 bg-slate-100 dark:bg-slate-900/40 shadow-md flex flex-col justify-between">
            <div className="h-56 md:h-64 lg:h-72 w-full relative">
              <img
                src={project.sitePrepImage || project.image}
                alt="Site Preparation"
                loading="lazy"
                className={`object-cover w-full h-full ${!project.sitePrepImage ? 'grayscale filter contrast-125 brightness-90' : ''}`}
              />
            </div>
            <div className="p-4 text-center bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200/60 dark:border-gray-800/30">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                {isAr ? '1. تمهيد وتأسيس الموقع' : '1. Site Preparation & Foundation'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {isAr ? 'أعمال الحفر، التسوية، والشبكات التحتية' : 'Excavation & groundwork stage'}
              </span>
            </div>
          </div>

          {/* 2. Construction Phase (if available) */}
          {project.executionPhaseImage && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 bg-slate-100 dark:bg-slate-900/40 shadow-md flex flex-col justify-between">
              <div className="h-56 md:h-64 lg:h-72 w-full relative">
                <img
                  src={project.executionPhaseImage}
                  alt="Construction Phase"
                  loading="lazy"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 text-center bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200/60 dark:border-gray-800/30">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block">
                  {isAr ? '2. مرحلة التنفيذ والتشييد' : '2. Construction & Paving Phase'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {isAr ? 'مد الأسفلت، صب الخرسانة، والمطابقة' : 'Paving, concrete casting & installation'}
                </span>
              </div>
            </div>
          )}

          {/* 3. Final Handover */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 bg-slate-100 dark:bg-slate-900/40 shadow-md flex flex-col justify-between">
            <div className="h-56 md:h-64 lg:h-72 w-full relative">
              <img
                src={project.finalHandoverImage || project.image}
                alt="Final Handover"
                loading="lazy"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4 text-center bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200/60 dark:border-gray-800/30">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                {project.executionPhaseImage
                  ? isAr ? '3. التسليم الميداني النهائي' : '3. Final Handover & Operation'
                  : isAr ? '2. التسليم الميداني النهائي' : '2. Final Handover & Operation'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {isAr ? 'المظهر النهائي بعد اكتمال المشروع والجاهزية' : 'Completed project & official handover'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200/50 dark:border-gray-850/20 flex justify-end">
        <Link
          href={`/${locale}/projects`}
          className="w-full md:w-auto px-8 py-3.5 bg-[#0070BA] dark:bg-brand-sky text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:bg-[#0070BA]/90 dark:hover:bg-brand-sky/90 cursor-pointer shadow-md text-center"
        >
          {isAr ? 'العودة لصفحة المشاريع الرئيسية' : 'Back to Main Projects'}
        </Link>
      </div>
    </div>
  );
}
