"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Shield, 
  Route, 
  Award, 
  Layers, 
  Sparkles, 
  ArrowUpRight, 
  Play, 
  Pause, 
  RotateCw,
  Eye,
  X,
  MapPin,
  Landmark,
  CheckCircle2,
  FileCheck2,
  FileBadge2,
  LucideIcon
} from 'lucide-react';

export interface TimelineItem {
  id: string;
  year: string;
  dateLabelAr: string;
  dateLabelEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  clientAr: string;
  clientEn: string;
  locationAr: string;
  locationEn: string;
  badgeAr: string;
  badgeEn: string;
  regDocAr: string;
  regDocEn: string;
  colorCard: string; // RGB string e.g. "0, 176, 240"
  descriptionAr: string;
  descriptionEn: string;
  highlightsAr: string[];
  highlightsEn: string[];
  image: string;
  link: string;
  icon: LucideIcon;
}

export const ALL_TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 'm-2021',
    year: '2021',
    dateLabelAr: '15 يونيو 2021',
    dateLabelEn: 'June 15, 2021',
    titleAr: 'تأسيس الشركة وإصدار السجل التجاري الرسمي',
    titleEn: 'Company Establishment & Official Commercial Registration',
    subtitleAr: 'الانطلاقة الرسمية بالسجل التجاري والرقم الموحد 700',
    subtitleEn: 'Official launch with Commercial Registration & Unified 700 ID',
    clientAr: 'وزارة التجارة والغرفة التجارية',
    clientEn: 'Ministry of Commerce & Chamber of Commerce',
    locationAr: 'الرياض',
    locationEn: 'Riyadh',
    badgeAr: 'سجل تجاري: 7023600179',
    badgeEn: 'CR: 7023600179',
    regDocAr: 'الرقم الموحد: 7023600179 | اشتراك غرفة الرياض',
    regDocEn: 'Unified 700 No: 7023600179 | Riyadh Chamber',
    colorCard: '0, 176, 240', // Sky Blue
    descriptionAr: 'الانطلاقة الرسمية لشركة هضاب الخليج العربي للمقاولات بمدينة الرياض وصدور السجل التجاري رقم 7023600179 وتفعيل الرقم الموحد 700، وتدشين أعمال مقاولات البنية التحتية والأسطول الأولي.',
    descriptionEn: 'Official launch of Arabian Gulf Hills Contracting in Riyadh, obtaining Commercial Registration No. 7023600179, activating Unified 700 ID, and deploying initial civil machinery fleet.',
    highlightsAr: [
      'إصدار السجل التجاري الرسمي رقم 7023600179 وتفعيل الرقم الموحد 700',
      'عضوية الغرفة التجارية بالرياض وتفعيل التراخيص البلدية الرسمية',
      'تدشين المقر الرئيسي بالرياض وإرساء الهيكل الإداري والهندسي',
    ],
    highlightsEn: [
      'Official Commercial Registration No. 7023600179 & Unified 700 ID activation',
      'Riyadh Chamber of Commerce membership & official municipal licensing',
      'Establishing Riyadh headquarters and engineering leadership team',
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    link: '/about',
    icon: Building2,
  },
  {
    id: 'm-2022',
    year: '2022',
    dateLabelAr: 'عام 2022',
    dateLabelEn: 'Year 2022',
    titleAr: 'الاعتمادات الحكومية وحواجز نيوجيرسي الخرسانية',
    titleEn: 'Government Approvals & Precast New Jersey Barriers',
    subtitleAr: 'التسجيل الضريبي (ZATCA) وتصاريح منصة بلدي والسلامة المرورية',
    subtitleEn: 'ZATCA Tax Registration, Balady Permits & Road Safety',
    clientAr: 'وزارة النقل وهيئة الزكاة والضريبة والجمارك',
    clientEn: 'Ministry of Transport & ZATCA',
    locationAr: 'المنطقة الوسطى',
    locationEn: 'Central Region',
    badgeAr: 'ضريبة: 310989009900003',
    badgeEn: 'VAT: 310989009900003',
    regDocAr: 'شهادة ZATCA | تصاريح منصة بلدي | SASO',
    regDocEn: 'ZATCA Certificate | Balady Platform Permits | SASO',
    colorCard: '0, 112, 186', // Executive Blue
    descriptionAr: 'استخراج شهادة التسجيل بضريبة القيمة المضافة وتصاريح منصة بلدي، وتدشين خطوط إنتاج وتوريد حواجز نيوجيرسي الخرسانية مسبقة الصب لتأمين مسارات الطرق والتحويلات الإنشائية.',
    descriptionEn: 'VAT registration certificate and Balady platform excavation licenses, launching production lines for precast concrete New Jersey barriers for highway traffic safety.',
    highlightsAr: [
      'شهادة التسجيل بضريبة القيمة المضافة برقم 310989009900003',
      'استخراج تصاريح وموافقات منصة بلدي لأعمال الحفر والخدمات البلدية',
      'توريد وتركيب أكثر من 25,000 متر طولي من قواطع نيوجيرسي الخرسانية',
    ],
    highlightsEn: [
      'VAT Registration Certificate No. 310989009900003',
      'Balady municipal platform approvals for road excavation and public works',
      'Supplied & installed 25,000+ linear meters of precast concrete barriers',
    ],
    image: '/images/projects/project-2.jpg',
    link: '/services',
    icon: Shield,
  },
  {
    id: 'm-2023',
    year: '2023',
    dateLabelAr: 'عام 2023',
    dateLabelEn: 'Year 2023',
    titleAr: 'شهادة التأمينات (GOSI) وشبكات تصريف السيول',
    titleEn: 'GOSI Compliance & Flood Stormwater Networks Expansion',
    subtitleAr: 'تمديد شبكات السيول العملاقة وممرات الإنترلوك والامتثال العمالي',
    subtitleEn: 'Stormwater drainage pipelines, interlock pavers & labor compliance',
    clientAr: 'أمانة منطقة الرياض وأمانة القصيم والتأمينات',
    clientEn: 'Riyadh & Al-Qassim Municipalities & GOSI',
    locationAr: 'الرياض والقصيم',
    locationEn: 'Riyadh & Al-Qassim',
    badgeAr: 'شهادة امتثال التأمينات GOSI',
    badgeEn: 'GOSI Compliance Certificate',
    regDocAr: 'شهادة التأمينات الاجتماعية | عقود الأمانات',
    regDocEn: 'GOSI Certificate | Municipal Tenders & Execution',
    colorCard: '16, 185, 129', // Emerald
    descriptionAr: 'الحصول على شهادة الامتثال والتأمينات الاجتماعية، والتوسع في تنفيذ عقود البنية التحتية البلدية وتمديد شبكات تصريف مياه الأمطار والسيول وتركيب ممرات الإنترلوك والبردورات.',
    descriptionEn: 'GOSI compliance certificate acquisition, expanding municipal infrastructure contracts, laying stormwater drainage trunk lines, and paving urban pedestrian corridors.',
    highlightsAr: [
      'شهادة الامتثال للمؤسسة العامة للتأمينات الاجتماعية (GOSI)',
      'تمديد أكثر من 450 كم من خطوط وقنوات تصريف السيول ومصائد الأمطار',
      'تركيب أكثر من 350 ألف م² من الإنترلوك والبردورات للأرصفة الحضرية',
    ],
    highlightsEn: [
      'General Organization for Social Insurance (GOSI) compliance certificate',
      'Installed over 450+ km of flood drainage networks and catch basins',
      'Installed 350,000+ m² of interlock tiles and kerbstones for urban sidewalks',
    ],
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
    link: '/projects',
    icon: Route,
  },
  {
    id: 'm-2024',
    year: '2024',
    dateLabelAr: 'عام 2024',
    dateLabelEn: 'Year 2024',
    titleAr: 'منظومة الآيزو الثلاثية وتصنيف المقاولين الحكومي',
    titleEn: 'Triple ISO Certifications & Government Contractor Classification',
    subtitleAr: 'شهادات ISO 9001, 14001, 45001 وتصنيف المقاولين المعتمد',
    subtitleEn: 'ISO 9001, 14001, 45001 & Official National Classification',
    clientAr: 'هيئة المواصفات والمقاييس ووزارة البلديات',
    clientEn: 'Saudi Standards Metrology (SASO) & Ministry of Municipalities',
    locationAr: 'المملكة العربية السعودية',
    locationEn: 'Kingdom of Saudi Arabia',
    badgeAr: 'شهادة تصنيف المقاولين',
    badgeEn: 'Contractor Classification',
    regDocAr: 'ISO 9001:2015 | ISO 14001:2015 | ISO 45001:2018',
    regDocEn: 'ISO 9001:2015 | ISO 14001:2015 | ISO 45001:2018',
    colorCard: '245, 158, 11', // Amber
    descriptionAr: 'نيل منظومة شهادات الآيزو العالمية الثلاثية في إدارة الجودة الشاملة والسلامة والصحة المهنية والبيئة، والحصول على شهادة تصنيف المقاولين الرسمية للتأهيل في المناقصات الحكومية الكبرى.',
    descriptionEn: 'Achieved Integrated Management System (IMS) triple ISO certifications (Quality, Environment, OH&S) and official Contractor Classification for major public tenders.',
    highlightsAr: [
      'شهادة ISO 9001:2015 لنظام إدارة الجودة الشاملة',
      'شهادة ISO 14001:2015 للإدارة البيئية وشهادة ISO 45001:2018 للسلامة',
      'شهادة تصنيف المقاولين المعتمدة في مجالات الطرق والإنشاءات والشبكات',
    ],
    highlightsEn: [
      'ISO 9001:2015 Quality Management System certification',
      'ISO 14001:2015 Environmental & ISO 45001:2018 Occupational Health & Safety',
      'Certified Contractor Classification in Road Works, Civil Works & Networks',
    ],
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    link: '/certificates',
    icon: Award,
  },
  {
    id: 'm-2025',
    year: '2025',
    dateLabelAr: 'عام 2025',
    dateLabelEn: 'Year 2025',
    titleAr: 'مشاريع الحرس الوطني وبلدية الخرج وبلاغات 940',
    titleEn: 'National Guard Water Projects & 940 Municipal Operations',
    subtitleAr: 'تأهيل الخزانات ومعالجة بلاغات التشوه البصري بنسبة 100%',
    subtitleEn: 'Water tanks rehabilitation & 100% 940 visual pollution clearance',
    clientAr: 'وزارة الحرس الوطني وبلدية الخرج وأمانة القصيم',
    clientEn: 'Ministry of National Guard, Al-Kharj & Al-Qassim Municipalities',
    locationAr: 'الرياض والخرج وبريدة',
    locationEn: 'Riyadh, Al-Kharj & Buraidah',
    badgeAr: 'إنجاز كامل 100%',
    badgeEn: '100% Milestone Handover',
    regDocAr: 'عقود حكومية منجزة | محاضر استلام نهائية',
    regDocEn: 'Completed Government Contracts | Final Handover Protocols',
    colorCard: '99, 102, 241', // Indigo
    descriptionAr: 'تنفيذ تأهيل وعزل وصيانة خزانات مياه الصرف والشروب بمدينة الملك سعود السكنية للحرس الوطني وتشغيل مباني بلدية الخرج ومعالجة بلاغات التشوه البصري 940 بنطاق شمال بريدة بنجاح تام.',
    descriptionEn: 'Rehabilitation and insulation of sewage and drinking water reservoirs for National Guard King Saud City, Al-Kharj municipal building O&M, and resolving 940 visual pollution alerts.',
    highlightsAr: [
      'تأهيل وعزل خزانات المياه بسعة تخزينية تفوق 50,000 م³',
      'تشغيل وصيانة المباني والمرافق الخدمية التابعة لبلدية محافظة الخرج',
      'معالجة بلاغات 940 الطارئة بدقة وسرعة استجابة قياسية وفق المعايير',
    ],
    highlightsEn: [
      'Rehabilitation & waterproofing of reservoirs exceeding 50,000 m³ capacity',
      'Operation & maintenance of service facilities for Al-Kharj Governorate Municipality',
      'Fast-response resolution of emergency 940 visual pollution municipal reports',
    ],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    link: '/projects',
    icon: Layers,
  },
  {
    id: 'm-2026',
    year: '2026',
    dateLabelAr: 'عام 2026 (نشط)',
    dateLabelEn: 'Year 2026 (Active)',
    titleAr: 'تشغيل مقابر المسلمين بالرياض وصيانة شوارع بريدة',
    titleEn: 'Riyadh Muslim Cemeteries O&M & Buraidah Road Milling',
    subtitleAr: 'أضخم عقود التشغيل والصيانة الحضرية وتأهيل المحاور',
    subtitleEn: 'Major municipal O&M contracts and urban street asphalt rehabilitation',
    clientAr: 'أمانة منطقة الرياض وأمانة منطقة القصيم',
    clientEn: 'Riyadh Municipality & Al-Qassim Municipality',
    locationAr: 'الرياض وبريدة',
    locationEn: 'Riyadh & Buraidah',
    badgeAr: 'عقود تشغيلية كبرى نشطة',
    badgeEn: 'Major Active O&M Contracts',
    regDocAr: 'عقود أمانة الرياض وأمانة القصيم السارية',
    regDocEn: 'Active Riyadh & Al-Qassim Municipal Contracts',
    colorCard: '255, 192, 0', // Gold / Yellow
    descriptionAr: 'تنفيذ أضخم عقود التشغيل والصيانة الشاملة والنظافة لمقابر المسلمين بمدينة الرياض وتأهيل الممرات وتجهيز القبور، وأعمال كشط وسفلتة الشوارع الحضرية بنطاق شرق بريدة.',
    descriptionEn: 'Executing major comprehensive operation, maintenance, and cleanliness contracts for major Muslim cemeteries in Riyadh, along with urban street asphalt milling and paving in East Buraidah.',
    highlightsAr: [
      'إدارة وتشغيل وصيانة مقابر المسلمين الرئيسية بمدينة الرياض وفق الضوابط الشرعية',
      'كشط وإعادة سفلتة أكثر من 1.2 مليون م² من الطرق والشوارع الحضرية',
      'تشغيل أسطول ميداني يضم أكثر من 120 آلية ومعدة ثقيلة متخصصة',
    ],
    highlightsEn: [
      'Operation & maintenance of main Riyadh Muslim cemeteries per certified guidelines',
      'Asphalt milling and resurfacing for over 1.2M m² of urban avenues',
      'Deploying an active field fleet of 120+ specialized heavy equipment units',
    ],
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    link: '/projects',
    icon: Sparkles,
  },
  {
    id: 'm-2026-vision',
    year: '2026+',
    dateLabelAr: 'المستقبل ورؤية 2030',
    dateLabelEn: 'Future & Saudi Vision 2030',
    titleAr: 'التوسع الرقمي ومشاريع رؤية السعودية 2030',
    titleEn: 'Digital Expansion & Saudi Vision 2030 Projects',
    subtitleAr: 'الأسطول المتقدم (120+ آلية) والمنظومة السحابية المحدثة',
    subtitleEn: 'Advanced Fleet (120+ units) & Next-Gen Cloud Field Platform',
    clientAr: 'الجهات الحكومية والقطاعات الوطنية',
    clientEn: 'Government Entities & National Sectors',
    locationAr: 'كافة مناطق المملكة',
    locationEn: 'All Kingdom Regions',
    badgeAr: 'رؤية السعودية 2030',
    badgeEn: 'Saudi Vision 2030',
    regDocAr: 'منصة هضاب الخليج الرقمية لإدارة العمليات الميدانية',
    regDocEn: 'Gulf Hills Digital Field Operations Management Platform',
    colorCard: '14, 165, 233', // Sky / Cyan
    descriptionAr: 'التوسع في أسطول الآليات والمعدات الثقيلة (12 فئة متخصصة)، وتدشين المنصة الرقمية المحدثة لإدارة العمليات الميدانية، والمساهمة الفاعلة في مشاريع جودة الحياة والبنية التحتية المستدامة لرؤية 2030.',
    descriptionEn: 'Expanding the heavy machinery fleet across 12 categories, launching the next-generation digital operations portal, and actively participating in national Vision 2030 infrastructure initiatives.',
    highlightsAr: [
      'أسطول متكامل يضم أكثر من 120 آلية ثقيلة ومعدة تخصصية',
      'منظومة رقمية محدثة للربط الفوري ومتابعة نسب الإنجاز الميداني',
      'التوسع في مشاريع البنية التحتية الخضراء وتحسين المشهد الحضري',
    ],
    highlightsEn: [
      'Comprehensive fleet of 120+ heavy machinery and specialized vehicles',
      'Real-time operations portal tracking field execution milestones',
      'Expanding into sustainable civil works and urban visual enhancement',
    ],
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    link: '/contact',
    icon: FileBadge2,
  },
];

import { storageAdapter } from '../../services/storageAdapter';

interface Rotating3DTimelineCarouselProps {
  locale: 'ar' | 'en';
  customItems?: TimelineItem[];
}

export function Rotating3DTimelineCarousel({ locale, customItems }: Rotating3DTimelineCarouselProps) {
  const isAr = locale === 'ar';
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineItem | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const [storedItems, setStoredItems] = useState<TimelineItem[]>(ALL_TIMELINE_ITEMS);

  useEffect(() => {
    if (customItems && customItems.length > 0) {
      setStoredItems(customItems);
    } else {
      const list = storageAdapter.getTimelineItems();
      if (list && list.length > 0) {
        setStoredItems(list as any);
      }
    }
  }, [customItems]);

  const items = customItems && customItems.length > 0 ? customItems : storedItems;
  const quantity = Math.max(1, items.length);
  const stepAngle = 360 / quantity;

  // Continuous smooth auto-rotation when playing & not dragging
  useEffect(() => {
    if (!isPlaying || isDragging) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = time - lastTimeRef.current;
        // Rotate ~12 degrees per second
        setRotationAngle((prev) => (prev + (delta * 0.015)) % 360);
      }
      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isDragging]);

  // Card click handler: smoothly rotates the selected card directly to front center & pauses rotation
  const handleCardClick = useCallback((item: TimelineItem, idx: number) => {
    setIsPlaying(false);
    setSelectedIdx(idx);
    setSelectedMilestone(item);
    // Bring the clicked card to front (angle = -idx * stepAngle)
    const targetAngle = -(idx * stepAngle);
    setRotationAngle(targetAngle);
  }, [stepAngle]);

  const handleNext = useCallback(() => {
    const nextIdx = selectedIdx === null ? 0 : (selectedIdx + 1) % quantity;
    handleCardClick(items[nextIdx], nextIdx);
  }, [selectedIdx, quantity, items, handleCardClick]);

  const handlePrev = useCallback(() => {
    const prevIdx = selectedIdx === null ? 0 : (selectedIdx - 1 + quantity) % quantity;
    handleCardClick(items[prevIdx], prevIdx);
  }, [selectedIdx, quantity, items, handleCardClick]);

  // Keyboard navigation listener
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (isAr) handlePrev();
      else handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (isAr) handleNext();
      else handlePrev();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  // Touch / Mouse Drag Handling for manual 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPlaying(false);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    setRotationAngle((prev) => prev + deltaX * 0.35);
    startXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      role="region"
      aria-label={isAr ? 'أسطوانة الإنجازات والمسار الزمني التفاعلي 360 درجة' : 'Company Milestones 360 3D Interactive Timeline'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full py-6 select-none overflow-hidden text-start focus:outline-none focus:ring-1 focus:ring-sky-500/40 rounded-3xl"
    >
      {/* Top Header & Controller Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002060]/10 dark:bg-sky-500/10 text-[#002060] dark:text-sky-400 text-[11px] font-mono font-bold">
            <RotateCw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{isAr ? 'المسار الدائري التفاعلي 360° (اختر أي كارت مباشرة)' : '360° 3D CYLINDER ROTATING TIMELINE'}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAr
              ? 'انقر على أي كارت لتدويره للأمام وعرض تفاصيله بالكامل، أو اسحب بالماوس / استخدم الأسهم للتدوير.'
              : 'Click any card to bring it to front, drag with mouse, or use Left/Right arrows.'}
          </p>
        </div>

        {/* Play/Pause Control Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? (isAr ? 'إيقاف الدوران' : 'Pause rotation') : (isAr ? 'تشغيل الدوران' : 'Play rotation')}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0070BA] dark:hover:border-sky-400 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'إيقاف الدوران' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isAr ? 'تشغيل الدوران' : 'Play'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Jump Year Nodes */}
      <div className="flex items-center justify-center flex-wrap gap-1.5 pt-3 pb-1">
        {items.map((item, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={item.id}
              onClick={() => handleCardClick(item, idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#002060] text-white dark:bg-sky-500 dark:text-black shadow-sm scale-105'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {item.year}
            </button>
          );
        })}
      </div>

      {/* 3D Cylinder Arena Container with Compact Dimensioning */}
      <div
        className="cylinder-wrapper relative w-full h-[270px] sm:h-[310px] lg:h-[340px] flex items-center justify-center cursor-grab active:cursor-grabbing my-2"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="cylinder-inner"
          style={{
            transform: `perspective(1200px) rotateX(-8deg) rotateY(${rotationAngle}deg)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            ['--quantity' as string]: quantity,
          } as React.CSSProperties}
        >
          {items.map((item, idx) => {
            const Icon = item.icon || Sparkles;
            const isSelected = selectedIdx === idx;
            const title = isAr ? item.titleAr : item.titleEn;
            const badge = isAr ? item.badgeAr : item.badgeEn;

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(item, idx);
                }}
                className="cylinder-card group cursor-pointer"
                style={{
                  ['--index' as string]: idx,
                  ['--color-card' as string]: item.colorCard,
                } as React.CSSProperties}
              >
                {/* 3D Glass Surface - Compact, Sharp & Clear */}
                <div
                  className={`relative w-full h-full rounded-xl overflow-hidden bg-slate-950/92 border shadow-lg flex flex-col justify-between p-2 text-start transition-all duration-300 ${
                    isSelected
                      ? 'border-sky-400 ring-2 ring-sky-400/50 scale-105 shadow-sky-500/30'
                      : 'border-white/20 hover:border-sky-400/80 hover:scale-105'
                  }`}
                >
                  {/* Background Image with Ambient Glow */}
                  <img
                    src={item.image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, rgba(${item.colorCard}, 0.5) 0%, rgba(8, 12, 20, 0.9) 75%)`,
                    }}
                  />

                  {/* Top: Year Pill & Icon */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-white font-mono font-black text-[10px] border border-white/10 shadow-xs">
                      {item.year}
                    </span>
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center text-white backdrop-blur-md border border-white/20"
                      style={{ backgroundColor: `rgba(${item.colorCard}, 0.7)` }}
                    >
                      <Icon className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Bottom: Milestone Title & Click hint */}
                  <div className="relative z-10 space-y-0.5 pt-1">
                    <span className="text-[7.5px] font-bold text-sky-300 line-clamp-1 block">
                      {badge}
                    </span>
                    <h4 className="text-[9px] font-black text-white leading-tight line-clamp-2 drop-shadow">
                      {title}
                    </h4>
                    <div className="pt-0.5 border-t border-white/15 flex items-center justify-between text-[7.5px] font-bold text-slate-300 group-hover:text-white">
                      <span>{isAr ? 'عرض' : 'View'}</span>
                      <Eye className="w-2 h-2 text-sky-400" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Modal Sheet for Clicked Milestone */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-start animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Image Header */}
            <div className="relative h-48 sm:h-56 w-full bg-slate-950 overflow-hidden">
              <img
                src={selectedMilestone.image}
                alt={isAr ? selectedMilestone.titleAr : selectedMilestone.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedMilestone(null)}
                aria-label="Close"
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Badges on Image */}
              <div className="absolute bottom-4 start-4 end-4 flex items-end justify-between gap-2">
                <div className="space-y-1">
                  <span className="px-2.5 py-1 rounded-md bg-sky-500 text-black font-mono font-black text-xs">
                    {selectedMilestone.year} - {isAr ? selectedMilestone.dateLabelAr : selectedMilestone.dateLabelEn}
                  </span>
                  <h3 className="text-base sm:text-xl font-black text-white drop-shadow-md">
                    {isAr ? selectedMilestone.titleAr : selectedMilestone.titleEn}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold">
                <div className="flex items-center gap-2 text-[#0070BA] dark:text-sky-400">
                  <FileCheck2 className="w-4 h-4" />
                  <span>{isAr ? selectedMilestone.badgeAr : selectedMilestone.badgeEn}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {isAr ? selectedMilestone.regDocAr : selectedMilestone.regDocEn}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-[#0070BA] dark:text-sky-400" />
                  <span>{isAr ? selectedMilestone.clientAr : selectedMilestone.clientEn}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0070BA] dark:text-sky-400" />
                  <span>{isAr ? selectedMilestone.locationAr : selectedMilestone.locationEn}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {isAr ? selectedMilestone.descriptionAr : selectedMilestone.descriptionEn}
              </p>

              {/* Highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isAr ? 'أبرز الإنجازات والوثائق المعتمدة:' : 'Key Deliverables & Accreditations:'}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {(isAr ? selectedMilestone.highlightsAr : selectedMilestone.highlightsEn).map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
                <Link
                  href={`/${locale}${selectedMilestone.link}`}
                  className="px-6 py-2.5 rounded-xl bg-[#002060] dark:bg-sky-500 text-white dark:text-black font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#003399]"
                >
                  <span>{isAr ? 'استعراض القسم ذو الصلة' : 'Explore Section'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Styles for Compact Cylinder Rotation */}
      <style jsx>{`
        .cylinder-wrapper {
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        .cylinder-inner {
          --w: 100px;
          --h: 145px;
          --translateZ: 175px;
          position: absolute;
          width: var(--w);
          height: var(--h);
          transform-style: preserve-3d;
        }

        @media (min-width: 640px) {
          .cylinder-inner {
            --w: 120px;
            --h: 165px;
            --translateZ: 220px;
          }
        }

        @media (min-width: 1024px) {
          .cylinder-inner {
            --w: 135px;
            --h: 185px;
            --translateZ: 260px;
          }
        }

        .cylinder-card {
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          transform-style: preserve-3d;
          transform: rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ));
          backface-visibility: visible;
        }
      `}</style>
    </div>
  );
}
