"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Link from 'next/link';
import {
  Building,
  Layers,
  Waves,
  Route,
  Trash2,
  Truck,
  HardHat,
  Check,
  Search,
  ChevronRight,
  Send,
  Award,
  Activity,
  ArrowRight,
  CheckCircle2,
  BadgeCheck,
  Boxes,
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  Briefcase,
  FileText
} from 'lucide-react';
import { useServices, useProjects, useEquipment, useCertificates, useStatistics } from '../../../hooks';
import { PageHeader } from '../../../components/ui/PageHeader';
import { getCategoryTheme } from '../../../utils/categoryThemes';
import { QuickQuoteModal } from '../../../components/ui/QuickQuoteModal';

// Helper component to map string codes to Lucide icons
const ServiceIcon = ({ icon, className = "w-5 h-5" }: { icon: string; className?: string }) => {
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

// Engineering Workflows by Service Category
const SERVICE_WORKFLOWS: Record<string, { stepAr: string; stepEn: string; descAr: string; descEn: string }[]> = {
  roads: [
    { stepAr: "الرفع المساحي وتحديد المناسيب", stepEn: "Topographic Survey & Leveling", descAr: "مسح طبوغرافي بمحطات Total Station لضبط الميول وتصريف المياه السطحية.", descEn: "Total Station surveying and precise grade establishment for road alignment." },
    { stepAr: "كشط الأسفلت وتجهيز الأساس", stepEn: "Milling & Base Stabilization", descAr: "كشط الطبقات المتضررة ومعالجة الأساس الحجري والرش التأسيسي (MC1).", descEn: "Cold milling and aggregate sub-base stabilization with MC1 prime coat." },
    { stepAr: "فرد ودك الأسفلت الساخن", stepEn: "Hot Asphalt Paving & Compaction", descAr: "فرد الطبقات بفرادات Vogele والدمك الميكانيكي بمداحل Hamm المعتمدة.", descEn: "Laying binder & wearing courses followed by vibratory roller compaction." },
    { stepAr: "الفحص المخبري والتسليم QA/QC", stepEn: "QC Testing & Handover", descAr: "فحص نسب الدمك (≥98%) واستخراج عينات الكور وفق مواصفات MOMRAH/MOT.", descEn: "Marshall stability, core testing (≥98%), and formal client commissioning." },
  ],
  drainage: [
    { stepAr: "الدراسة الهيدرولوجية والمناسيب", stepEn: "Hydrological Survey & Inverts", descAr: "تحليل كميات التدفق السطحي ومناسيب خطوط التصريف وفق مخطط الأمانة.", descEn: "Catchment analysis and runoff calculations matching municipal master plans." },
    { stepAr: "أعمال الحفر وتدعيم الخنادق", stepEn: "Trench Excavation & Shoring", descAr: "حفر مسارات الخطوط الرئيسية وتأمين الخنادق لسلامة خطوط الخدمات المجاورة.", descEn: "Precision trenching with trench-box shoring and utility protection systems." },
    { stepAr: "تمديد الأنابيب وتركيب المناهل", stepEn: "Pipe Laying & Precast Vaults", descAr: "تركيب أنابيب الخرسانة المسلحة RCP وغرف التفتيش ومصائد السيول المعتمدة.", descEn: "Installing reinforced concrete pipes, catch basins, and precast chambers." },
    { stepAr: "اختبار الانسيابية والردم الهندسي", stepEn: "Hydrostatic Testing & Backfill", descAr: "فحص انسيابية المياه وكاميرات CCTV والردم على طبقات معتمدة مع الفحص المخبري.", descEn: "Flow testing, CCTV line inspection, and layer-by-layer compacted backfilling." },
  ],
  barriers: [
    { stepAr: "تحديد المسارات والدراسة المرورية", stepEn: "Traffic Safety Planning", descAr: "تحديد مواقع الحواجز الخرسانية وفق اشتراطات السلامة المرورية المعتمدة.", descEn: "Determining barrier alignment according to traffic safety guidelines." },
    { stepAr: "صب وتصنيع الحواجز مسبقة الصنع", stepEn: "Precast Concrete Fabrication", descAr: "صب قوالب حواجز نيوجيرسي بخرسانة عالية المقاومة ومسلحة بحديد تسليح معتمد.", descEn: "Casting high-strength reinforced concrete New Jersey barriers." },
    { stepAr: "النقل والتركيب بالرافعات", stepEn: "Crane Transport & Alignment", descAr: "نقل الحواجز وتثبيتها بدقة على مسارات الطرق والتحويلات المرورية.", descEn: "Transporting and installing barriers using specialized cranes and boom trucks." },
    { stepAr: "الدهان التحذيري والعيون العاكسة", stepEn: "Reflective Paint & Delineators", descAr: "دهان الحواجز بدهانات مقاومة للعوامل الجوية وتثبيت العواكس الفسفورية الليلية.", descEn: "Applying weather-resistant safety coatings and high-visibility road reflectors." },
  ],
  default: [
    { stepAr: "الدراسة الفنية واعتماد الجداول", stepEn: "Technical BOQ Evaluation", descAr: "مراجعة المخططات الهندسية وجداول الكميات المعتمدة من الجهة المالكة.", descEn: "Engineering review and client BOQ specification compliance check." },
    { stepAr: "حشد الكوادر والأسطول الميداني", stepEn: "Site Mobilization", descAr: "تجهيز الآليات المتخصصة والفرق الهندسية المؤهلة لموقع المشروع.", descEn: "Dispatching specialized machinery and certified engineers to the site." },
    { stepAr: "التنفيذ وفق الكود السعودي", stepEn: "Execution per Saudi Code", descAr: "إنجاز الأعمال الإنشائية بأعلى معايير السلامة ومطابقة المواصفات.", descEn: "Full execution strictly complying with Saudi Building Code and HSE standards." },
    { stepAr: "المعاينة الفنية والتسليم", stepEn: "Inspection & Handover", descAr: "إجراء الاختبارات النهائية وتوثيق محاضر التسليم والاعتمادات الرسمية.", descEn: "Final punch-list verification and official municipal commissioning." },
  ]
};

// Fallback machinery data aligned with fleet CMS
const SERVICE_EQUIPMENT_FALLBACK: Record<string, { nameAr: string; nameEn: string; model: string; count: string; image: string }[]> = {
  roads: [
    { nameAr: "كشاطات أسفلت ثقيلة", nameEn: "Cold Milling Machines", model: "Wirtgen W 2000", count: "8 آليات", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "فرادات أسفلت مجنزرة", nameEn: "Tracked Asphalt Pavers", model: "Vögele Super 1800-3", count: "12 آلية", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "مداحل أسفلت ترادفية", nameEn: "Tandem Rollers", model: "Hamm HD+ 90", count: "16 آلية", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "شاحنات قلاب للخلطة", nameEn: "Heavy Dump Trucks", model: "Actros 4140", count: "+35 شاحنة", image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=500&q=80" },
  ],
  drainage: [
    { nameAr: "شاحنات ضغط عالي Jetting", nameEn: "High-Pressure Jetters", model: "Kaiser Hydro-Vac", count: "10 صهاريج", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "شاحنات شفط فاكيوم", nameEn: "Vacuum Tankers", model: "MAN TGS 18m³", count: "14 صهريج", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "حفارات هيدروليكية ثقيلة", nameEn: "Hydraulic Excavators", model: "CAT 320D", count: "15 آلية", image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "مضخات نزح مياه ديزل", nameEn: "Dewatering Pumps", model: "Godwin 6-inch", count: "+25 مضخة", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=500&q=80" },
  ],
  barriers: [
    { nameAr: "رافعات وناقلات هيدروليكية", nameEn: "Boom Trucks & Cranes", model: "Tadano 25-Ton", count: "6 رافعات", image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "شاحنات نقل مسطحة", nameEn: "Flatbed Transporters", model: "Mercedes Flatbed", count: "12 شاحنة", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "بوبكات ومعدات تحميل", nameEn: "Skid Steer Loaders", model: "Bobcat S590", count: "10 آليات", image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "ورش صيانة ودهان متنقلة", nameEn: "Mobile Coating Units", model: "Graco Rigs", count: "4 ورش", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80" },
  ],
  default: [
    { nameAr: "آليات ثقيلة متعددة المهام", nameEn: "Multi-Purpose Units", model: "CAT / Komatsu Fleet", count: "+45 آلية", image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=500&q=80" },
    { nameAr: "شاحنات لوجستية ونقل", nameEn: "Logistics Transport", model: "Isuzu / Hino Units", count: "+30 شاحنة", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80" },
  ]
};

// Trust Accreditations for conversion banner
const TRUST_ACCREDITATIONS = [
  { code: "MOMRAH Class 2 & 5", nameAr: "تصنيف بلدي معتمد (درجة 2 و 5)", nameEn: "MOMRAH Certified (Grade 2 & 5)" },
  { code: "LCGPA 52.97%", nameAr: "نسبة محتوى محلي معتمدة 52.97%", nameEn: "Local Content Score 52.97%" },
  { code: "SCA Certified", nameAr: "ترخيص الهيئة السعودية للمقاولين", nameEn: "Saudi Contractors Authority" },
  { code: "ISO 9001 & 45001", nameAr: "أنظمة الجودة والسلامة المهنية", nameEn: "ISO 9001 / ISO 45001" },
];

export default function ServicesExplorerPage(props?: any) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';

  const { data: services, isLoading: isServicesLoading } = useServices(locale);
  const { data: projects, isLoading: isProjectsLoading } = useProjects(locale);
  const { data: statistics } = useStatistics(locale);

  // State Management
  const [activeTabId, setActiveTabId] = useState<string>('srv-1');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [quoteServiceTitle, setQuoteServiceTitle] = useState<string>('');

  // Auto-select first service when loaded
  useEffect(() => {
    if (services && services.length > 0 && !services.some(s => s.id === activeTabId)) {
      setActiveTabId(services[0].id);
    }
  }, [services, activeTabId]);

  // Filtering Logic
  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter((srv) => {
      const matchQuery = searchQuery.trim() === '' ||
        srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      if (selectedDomain === 'all') return matchQuery;
      if (selectedDomain === 'roads') {
        return matchQuery && (srv.title.includes('سفلت') || srv.title.includes('كشط') || srv.title.includes('طرق') || srv.title.toLowerCase().includes('paving') || srv.title.toLowerCase().includes('road'));
      }
      if (selectedDomain === 'drainage') {
        return matchQuery && (srv.title.includes('سيول') || srv.title.includes('تصريف') || srv.title.toLowerCase().includes('drainage') || srv.title.toLowerCase().includes('stormwater'));
      }
      if (selectedDomain === 'barriers') {
        return matchQuery && (srv.title.includes('خرسان') || srv.title.includes('نيوجيرسي') || srv.title.includes('حواجز') || srv.title.toLowerCase().includes('barrier') || srv.title.toLowerCase().includes('concrete'));
      }
      if (selectedDomain === 'maintenance') {
        return matchQuery && (srv.title.includes('تشغيل') || srv.title.includes('صيانة') || srv.title.includes('مقابر') || srv.title.toLowerCase().includes('maintenance') || srv.title.toLowerCase().includes('operation'));
      }
      return matchQuery;
    });
  }, [services, selectedDomain, searchQuery]);

  const activeService = useMemo(() => {
    return services?.find((s) => s.id === activeTabId) || filteredServices[0] || services?.[0];
  }, [services, activeTabId, filteredServices]);

  // Map service ID / title to project count
  const serviceProjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!services || !projects) return counts;
    services.forEach(s => {
      const matchCount = projects.filter(p => {
        return p.category?.toLowerCase().includes(s.title.toLowerCase()) ||
          s.title.toLowerCase().includes(p.category?.toLowerCase() || '');
      }).length;
      counts[s.id] = matchCount;
    });
    return counts;
  }, [services, projects]);

  // Workflow logic based on service title
  const currentWorkflows = useMemo(() => {
    if (!activeService) return SERVICE_WORKFLOWS.default;
    const title = activeService.title.toLowerCase();
    if (title.includes('سفلت') || title.includes('كشط') || title.includes('طرق') || title.includes('road') || title.includes('paving')) {
      return SERVICE_WORKFLOWS.roads;
    }
    if (title.includes('سيول') || title.includes('تصريف') || title.includes('drainage') || title.includes('stormwater')) {
      return SERVICE_WORKFLOWS.drainage;
    }
    if (title.includes('خرسان') || title.includes('نيوجيرسي') || title.includes('حواجز') || title.includes('barrier')) {
      return SERVICE_WORKFLOWS.barriers;
    }
    return SERVICE_WORKFLOWS.default;
  }, [activeService]);

  // Equipment logic based on service title
  const currentEquipment = useMemo(() => {
    if (!activeService) return SERVICE_EQUIPMENT_FALLBACK.default;
    const title = activeService.title.toLowerCase();
    if (title.includes('سفلت') || title.includes('كشط') || title.includes('طرق') || title.includes('road') || title.includes('paving')) {
      return SERVICE_EQUIPMENT_FALLBACK.roads;
    }
    if (title.includes('سيول') || title.includes('تصريف') || title.includes('drainage') || title.includes('stormwater')) {
      return SERVICE_EQUIPMENT_FALLBACK.drainage;
    }
    if (title.includes('خرسان') || title.includes('نيوجيرسي') || title.includes('حواجز') || title.includes('barrier')) {
      return SERVICE_EQUIPMENT_FALLBACK.barriers;
    }
    return SERVICE_EQUIPMENT_FALLBACK.default;
  }, [activeService]);

  // Related Projects for active service (Real data from CMS/API)
  const relatedProjects = useMemo(() => {
    if (!projects || !activeService) return [];
    return projects.filter(p => {
      const matchCategory = p.category?.toLowerCase().includes(activeService.title.toLowerCase()) ||
        activeService.title.toLowerCase().includes(p.category?.toLowerCase() || '');
      return matchCategory;
    }).slice(0, 3);
  }, [projects, activeService]);

  const handleOpenRFQ = (serviceTitle?: string) => {
    setQuoteServiceTitle(serviceTitle || activeService?.title || '');
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-text-main transition-colors duration-300 pb-16 space-y-8">
      
      {/* 1. HERO SECTION: Engineering Capability Center Header */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-8 sm:pt-10">
        <PageHeader
          title={isAr ? "خدمات المقاولات والحلول الهندسية" : "Engineering Services & Contracting Solutions"}
          subtitle={isAr
            ? "حلول متكاملة لأعمال الطرق والبنية التحتية والتصريف والتشغيل والصيانة، مدعومة بقدرات تنفيذية ميدانية وأسطول متخصص لتنفيذ المشاريع في المملكة العربية السعودية."
            : "Integrated contracting solutions for road networks, civil infrastructure, stormwater drainage, and municipal operation & maintenance, backed by field execution capabilities and a specialized machinery fleet across Saudi Arabia."}
          currentPageLabel={isAr ? "مركز القدرات الهندسية" : "Engineering Capability Center"}
          badge={isAr ? "بوابة القدرات والمواصفات التنفيذية" : "Engineering Capability Center"}
          locale={locale}
        />

        {/* Compact Hero Key Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs text-start">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              {isAr ? "المجالات الهندسية" : "Specialized Domains"}
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {services?.length || 6} <span className="text-xs font-normal text-slate-500">{isAr ? "قطاعات" : "Sectors"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs text-start">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              {isAr ? "المشاريع المنفذة والمعتمدة" : "Completed Projects"}
            </span>
            <div className="text-lg sm:text-xl font-black text-[#0070BA] dark:text-sky-400 mt-0.5">
              +{projects?.length || 24} <span className="text-xs font-normal text-slate-500">{isAr ? "مشروعاً" : "Projects"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs text-start">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              {isAr ? "أسطول الآليات والمعدات" : "Machinery Fleet"}
            </span>
            <div className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              +120 <span className="text-xs font-normal text-slate-500">{isAr ? "معدة" : "Units"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs text-start">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
              {isAr ? "نسبة المحتوى المحلي" : "Local Content"}
            </span>
            <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              52.97% <span className="text-xs font-normal text-slate-500">LCGPA</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Streamlined Master-Detail Capability Center */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        {/* SKELETON LOADING STATE */}
        {isServicesLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-2.5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-16 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
            <div className="lg:col-span-8 h-[550px] bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse" />
          </div>
        ) : filteredServices.length === 0 ? (
          /* EMPTY STATE */
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isAr ? "لم يتم العثور على خدمات مطابقة" : "No Matching Engineering Services Found"}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? "يرجى تعديل معايير البحث أو اختيار قطاع آخر." : "Try adjusting your search criteria or domain filter."}
            </p>
            <button
              onClick={() => { setSelectedDomain('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#0070BA] text-white text-xs font-bold cursor-pointer"
            >
              {isAr ? "إعادة تعيين الفلاتر" : "Reset Filters"}
            </button>
          </div>
        ) : activeService ? (
          /* ========================================================================= */
          /* STREAMLINED MASTER-DETAIL STAGE (Compact & Height-Reduced)                */
          /* ========================================================================= */
          (() => {
            const catTheme = getCategoryTheme(activeService.title);
            const projectCount = serviceProjectCounts[activeService.id] || 0;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Sticky Services Navigator (4 Cols on Desktop) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-3 w-full self-start">
                  
                  {/* Category Pills Filter */}
                  <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs backdrop-blur-md flex items-center gap-1 overflow-x-auto scrollbar-none">
                    {[
                      { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                      { id: 'roads', labelAr: 'طرق', labelEn: 'Roads' },
                      { id: 'drainage', labelAr: 'تصريف', labelEn: 'Drain' },
                      { id: 'barriers', labelAr: 'حواجز', labelEn: 'Barriers' },
                      { id: 'maintenance', labelAr: 'صيانة', labelEn: 'O&M' },
                    ].map((tab) => {
                      const isSelected = selectedDomain === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedDomain(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-[#0070BA] dark:bg-sky-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isAr ? "بحث في الخدمات والمواصفات..." : "Search services & specs..."}
                      className="w-full ps-8 pe-3 py-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0070BA]"
                    />
                  </div>

                  {/* Services List Navigation */}
                  <div className="space-y-2">
                    {filteredServices.map((srv) => {
                      const isActive = srv.id === activeService.id;
                      const itemTheme = getCategoryTheme(srv.title);
                      const count = serviceProjectCounts[srv.id] || 0;

                      return (
                        <button
                          key={srv.id}
                          onClick={() => setActiveTabId(srv.id)}
                          className={`w-full text-start p-3 sm:p-3.5 rounded-2xl transition-all duration-200 border flex items-center justify-between group cursor-pointer ${
                            isActive
                              ? `bg-white dark:bg-slate-900 ${itemTheme.cardBorder} ${itemTheme.cardShadow} shadow-md scale-[1.01]`
                              : 'bg-white/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900/80 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                            <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 border shrink-0 ${
                              isActive
                                ? `${itemTheme.badgeBg} ${itemTheme.badgeBorder} ${itemTheme.accentText}`
                                : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:text-slate-900'
                            }`}>
                              <ServiceIcon icon={srv.icon} className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className={`text-xs font-black truncate ${
                                isActive ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                {srv.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {srv.sectors?.[0] || (isAr ? 'بنية تحتية' : 'Civil Infrastructure')}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1">
                            {count > 0 && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                                {count}
                              </span>
                            )}
                            <ChevronRight className={`w-3.5 h-3.5 rtl:rotate-180 transition-transform ${
                              isActive ? `${itemTheme.accentText} translate-x-0.5 rtl:-translate-x-0.5` : 'text-slate-300 dark:text-slate-600'
                            }`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Compact Active Service Detail Canvas (8 Cols on Desktop) */}
                <div className="lg:col-span-8 w-full space-y-4">
                  
                  {/* MODULE 1: Unified Executive Overview & Approved Scope */}
                  <div className={`w-full p-5 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 border ${catTheme.cardBorder} shadow-lg relative overflow-hidden text-start backdrop-blur-xl transition-all space-y-5`}>
                    
                    {/* Header: Identity, Sovereign Badge, Title & Overview */}
                    <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg ${catTheme.badgeBg} ${catTheme.accentText} text-[10px] font-mono font-black border ${catTheme.badgeBorder} flex items-center gap-1.5`}>
                          <span>{activeService.id.toUpperCase()}</span>
                          <span>•</span>
                          <span>{isAr ? 'مجال هندسي معتمد' : 'Certified Discipline'}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <BadgeCheck className="w-3 h-3" />
                          <span>{isAr ? "معتمد لدى أمانات المناطق ووزارة البلديات" : "MOMRAH Approved"}</span>
                        </span>
                      </div>

                      <div className="flex items-start gap-3 pt-1">
                        <div className={`w-11 h-11 ${catTheme.badgeBg} border ${catTheme.badgeBorder} flex items-center justify-center rounded-xl ${catTheme.accentText} shrink-0 mt-0.5`}>
                          <ServiceIcon icon={activeService.icon} className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {activeService.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-1">
                            {activeService.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Scope Checklist Grid */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">
                        {isAr ? "نطاق الأعمال والاشتراطات الفنية المعتمدة" : "APPROVED TECHNICAL SCOPE & DELIVERABLES"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeService.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 flex items-start space-x-2.5 rtl:space-x-reverse"
                          >
                            <Check className={`w-3.5 h-3.5 ${catTheme.accentText} flex-shrink-0 mt-0.5`} />
                            <span className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-tight">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* MODULE 2: Side-by-Side Capabilities (Fleet) & Execution Workflow */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Sub-Card A: Mobilized Machinery Fleet */}
                    <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 text-start">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#0070BA] dark:text-sky-400" />
                          <span>{isAr ? "الأسطول والآليات المخصصة" : "Mobilized Machinery Fleet"}</span>
                        </span>
                        <Link href={`/${locale}/equipment`} className="text-[10px] font-bold text-[#0070BA] dark:text-sky-400 hover:underline">
                          {isAr ? "عرض الكل" : "View All"}
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {currentEquipment.map((eq, idx) => (
                          <div key={idx} className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 p-2 space-y-1">
                            <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                              <img src={eq.image} alt={eq.nameAr} className="w-full h-full object-cover" />
                              <span className="absolute bottom-1 start-1 px-1.5 py-0.2 rounded bg-black/75 text-white font-mono text-[8px] font-bold">
                                {eq.count}
                              </span>
                            </div>
                            <h5 className="text-[10px] font-black text-slate-900 dark:text-white truncate">
                              {isAr ? eq.nameAr : eq.nameEn}
                            </h5>
                            <p className="text-[8px] font-mono text-slate-400 truncate">{eq.model}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sub-Card B: 4-Stage Execution Workflow */}
                    <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 text-start">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#0070BA] dark:text-sky-400" />
                          <span>{isAr ? "مراحل التنفيذ (ISO 9001)" : "Execution Workflow"}</span>
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 font-bold">4 STAGES</span>
                      </div>

                      <div className="space-y-2">
                        {currentWorkflows.map((step, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5">
                            <span className={`w-5 h-5 rounded-md ${catTheme.badgeBg} ${catTheme.accentText} text-[10px] font-mono font-black flex items-center justify-center shrink-0 border ${catTheme.badgeBorder}`}>
                              0{idx + 1}
                            </span>
                            <div className="min-w-0">
                              <h5 className="text-[11px] font-black text-slate-900 dark:text-white leading-tight">
                                {isAr ? step.stepAr : step.stepEn}
                              </h5>
                              <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-1 mt-0.5">
                                {isAr ? step.descAr : step.descEn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* MODULE 3: Proven Reference Projects */}
                  {relatedProjects.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 text-start">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#0070BA] dark:text-sky-400" />
                          <span>{isAr ? "نماذج المشاريع المنفذة المرتبطة بهذا النطاق" : "Executed Reference Projects"}</span>
                        </span>
                        <Link
                          href={`/${locale}/projects?category=${encodeURIComponent(activeService.title)}`}
                          className="text-[10px] font-bold text-[#0070BA] dark:text-sky-400 hover:underline"
                        >
                          {isAr ? "استعراض كافة المشاريع" : "View All Projects"}
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {relatedProjects.map((proj) => (
                          <Link
                            key={proj.id}
                            href={`/${locale}/projects/${proj.id}`}
                            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-[#0070BA] transition-all flex items-center gap-2.5 group text-start"
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                              <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                                {proj.contractNumber ? `#${proj.contractNumber}` : (isAr ? 'منجز' : 'Done')}
                              </span>
                              <h5 className="text-[11px] font-black text-slate-900 dark:text-white truncate group-hover:text-[#0070BA] transition-colors">
                                {proj.title}
                              </h5>
                              <p className="text-[9px] text-slate-500 truncate">{proj.client}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MODULE 4: Unified Accreditations & High-Conversion RFQ Banner */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-100/90 via-white to-slate-100/90 dark:from-[#002060] dark:via-[#003080] dark:to-[#0070BA] text-slate-900 dark:text-white border border-slate-200/90 dark:border-sky-400/30 space-y-4 shadow-md text-start">
                    
                    {/* Accreditations Trust Badges Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-sky-400/20 pb-3">
                      <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isAr ? "الاعتمادات والتراخيص السارية" : "Official Accreditations & Standards"}</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {TRUST_ACCREDITATIONS.map((acc, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-sky-400/30 text-[9px] font-mono font-bold text-slate-700 dark:text-sky-200">
                            {acc.code}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* RFQ Trigger Headline */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {isAr
                            ? `طلب دراسة فنية أو تسعير رسمي لنطاق (${activeService.title})`
                            : `Request Formal Tender Quote for (${activeService.title})`}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-sky-100 mt-0.5">
                          {isAr
                            ? "فريق تقدير التكاليف والمناقصات جاهز لدراسة جداول الكميات والرد خلال 24 ساعة."
                            : "Estimation & tendering team is ready to evaluate BOQ and submit quotes within 24h."}
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenRFQ(activeService.title)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5 text-slate-950" />
                        <span>{isAr ? "طلب تسعير مباشر" : "Request Direct Quote"}</span>
                      </button>
                    </div>

                    {/* Secondary Navigation Links */}
                    <div className="flex items-center gap-3 pt-1 border-t border-slate-200/50 dark:border-sky-400/20 text-xs">
                      <Link
                        href={`/${locale}/contact`}
                        className="text-slate-700 dark:text-sky-200 hover:text-[#0070BA] dark:hover:text-white font-bold flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3 text-[#0070BA] dark:text-sky-400" />
                        <span>{isAr ? "التواصل مع الإدارة الهندسية" : "Contact Engineering Team"}</span>
                      </Link>
                      <span>•</span>
                      <Link
                        href={`/${locale}/services/${activeService.id}`}
                        className="text-slate-700 dark:text-sky-200 hover:text-[#0070BA] dark:hover:text-white font-bold flex items-center gap-1"
                      >
                        <span>{isAr ? "الملف الهندسي التفصيلي" : "Full Technical Profile"}</span>
                        <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                      </Link>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()
        ) : null}

      </div>

      {/* 3. Pre-filled Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        locale={locale}
        defaultService={quoteServiceTitle}
      />

    </div>
  );
}
