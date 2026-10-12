import { useParams } from 'react-router-dom';
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  Search,
  SlidersHorizontal,
  FileDown,
  Layers,
  Wrench,
  HardHat,
  MessageCircle,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import { BRAND_IDENTITY } from '../../../config/brand';
import { storageAdapter } from '../../../services/storageAdapter';
import { EquipmentItem } from '../../../types';

export interface FleetMachine {
  id: string;
  nameAr: string;
  nameEn: string;
  brand: string;
  category: 'asphalt' | 'excavator' | 'truck' | 'pump' | 'compact';
  categoryAr: string;
  categoryEn: string;
  image: string;
  capacityAr: string;
  capacityEn: string;
  specsAr: string[];
  specsEn: string[];
  modelYear: string;
  unitsCount: number;
  status: 'available' | 'deployed';
}

const FLEET_DATA: FleetMachine[] = [
  {
    id: 'eq-1',
    nameAr: 'كاشطة أسفلت ألمانية عالية الدقة',
    nameEn: 'High-Precision Asphalt Cold Milling Machine',
    brand: 'Wirtgen W 2000',
    category: 'asphalt',
    categoryAr: 'كاشطات ورصاصات الأسفلت',
    categoryEn: 'Asphalt Machinery',
    image: '/images/equipment/wirtgen-milling-machine.jpg',
    capacityAr: 'عرض كشط 2.0 م وعمق حتى 32 سم',
    capacityEn: '2.0m milling width, up to 32cm depth',
    specsAr: [
      'نظام ليزري ثلاثي الأبعاد للتحكم التلقائي بالمناسيب',
      'محرك ديزل كاتربيلر بقوة 433 كيلوواط',
      'كفاءة كشط وتفريغ تصل إلى 450 طن/ساعة',
      'سير ناقل هيدروليكي قابل للدوران والارتفاع',
    ],
    specsEn: [
      '3D Laser level sensor grade control system',
      'High-power 433 kW Caterpillar diesel engine',
      'Up to 450 t/h milling and loading capacity',
      'Multi-angle swiveling folding conveyor belt',
    ],
    modelYear: '2023',
    unitsCount: 4,
    status: 'available',
  },
  {
    id: 'eq-2',
    nameAr: 'مدحلة ورصاصة أسفلت اهتزازية مزدوجة',
    nameEn: 'Tandem Heavy Vibratory Asphalt Roller',
    brand: 'Dynapac CC522',
    category: 'asphalt',
    categoryAr: 'كاشطات ورصاصات الأسفلت',
    categoryEn: 'Asphalt Machinery',
    image: '/images/equipment/dynapac-road-roller.jpg',
    capacityAr: 'وزن تشغيلي 12.5 طن',
    capacityEn: '12.5 ton operating weight',
    specsAr: [
      'نظام رش مياه مضغوط مزدوج لمنع التصاق الأسفلت',
      'تردد وسعة اهتزاز مزدوجة لتحقيق أعلى كثافة دمك',
      'حساسات حرارية مدمجة لقياس درجة حرارة الأسفلت',
      'كابينة قيادة مكيفة بزاوية رؤية بانورامية 360°',
    ],
    specsEn: [
      'Dual pressurized water spray system',
      'Dual vibration amplitude for optimal density',
      'Built-in asphalt surface temperature sensors',
      '360° panoramic air-conditioned cabin',
    ],
    modelYear: '2023',
    unitsCount: 6,
    status: 'available',
  },
  {
    id: 'eq-3',
    nameAr: 'حفار هيدروليكي ثقيل لتمديد قنوات السيول',
    nameEn: 'Heavy Hydraulic Excavator for Drainage Lines',
    brand: 'Caterpillar 320D',
    category: 'excavator',
    categoryAr: 'حفارات وشبكات السيول',
    categoryEn: 'Excavators & Drainage',
    image: '/images/equipment/caterpillar-excavator.jpg',
    capacityAr: 'عمق حفر 6.7 م وسعة باكت 1.2 م³',
    capacityEn: '6.7m digging depth, 1.2 m³ bucket',
    specsAr: [
      'ذراع مقوى ومخصص لتنزيل مواسير السيول الخرسانية',
      'نظام تحكم هيدروليكي فائق الدقة للتسوية والحفر',
      'تجهيزات خاصة وتدريع للعمل في التربة الصخرية',
      'ملحقات شاكوش هيدروليكي لتكسير الصخور',
    ],
    specsEn: [
      'Reinforced boom for concrete drainage pipe laying',
      'Precision hydraulic control for trench profiling',
      'Armored undercarriage for rocky soil excavation',
      'Hydraulic breaker hammer attachment ready',
    ],
    modelYear: '2022',
    unitsCount: 8,
    status: 'available',
  },
  {
    id: 'eq-4',
    nameAr: 'شاحنة قلاب ثقيلة لنقل الأسفلت والركام',
    nameEn: 'Heavy 8x4 Asphalt & Aggregate Dump Truck',
    brand: 'Mercedes-Benz Actros 4140',
    category: 'truck',
    categoryAr: 'شاحنات النقل والقلابات',
    categoryEn: 'Heavy Dump Trucks',
    image: '/images/equipment/mercedes-actros-tipper.jpg',
    capacityAr: 'حمولة 24 م³ (دفع رباعي 8x4)',
    capacityEn: '24 m³ payload capacity (8x4)',
    specsAr: [
      'صندوق معزول حرارياً للحفاظ على حرارة الخلطة الأسفلتية',
      'نظام تفريغ هيدروليكي سريع وآمن مع غطاء أوتوماتيكي',
      'نظام تتبع GPS وإدارة حركة الأسطول اللحظية',
      'محرك صديق للبيئة بمعايير Euro 5 للحد من الانبعاثات',
    ],
    specsEn: [
      'Thermal insulated tipper body for hot asphalt',
      'Fast high-safety hydraulic tipping with auto-cover',
      'Real-time GPS fleet telemetry and tracking',
      'Eco-friendly Euro 5 low emission engine',
    ],
    modelYear: '2023',
    unitsCount: 14,
    status: 'available',
  },
  {
    id: 'eq-5',
    nameAr: 'لودر وحفار هيدروليكي لتركيب الحواجز الخرسانية',
    nameEn: 'Heavy Duty Backhoe Loader for Concrete Barriers',
    brand: 'JCB 3CX Eco Plus',
    category: 'excavator',
    categoryAr: 'حفارات وشبكات السيول',
    categoryEn: 'Excavators & Drainage',
    image: '/images/equipment/jcb-backhoe-loader.jpg',
    capacityAr: 'باكت أمامي 1.1 م³ وعمق حفر 5.4 م',
    capacityEn: '1.1 m³ front loader, 5.4m backhoe',
    specsAr: [
      'دفع رباعي 4WD لتجاوز التضاريس الوعرة ومواقع الردم',
      'باكت أمامي 6 في 1 للتجريف والرفع والتسوية',
      'نظام توفير وقود ذكي EcoDig عالي الكفاءة',
      'مثالي لأعمال تركيب البردورات وصب حواجز نيوجيرسي',
    ],
    specsEn: [
      'Heavy 4WD transmission for rough construction sites',
      '6-in-1 multi-purpose front loader bucket',
      'EcoDig intelligent fuel-efficient hydraulics',
      'Ideal for curbstone installation and barrier placing',
    ],
    modelYear: '2023',
    unitsCount: 7,
    status: 'available',
  },
  {
    id: 'eq-6',
    nameAr: 'مضخة سحب وتصريف مياه السيول عالية التدفق',
    nameEn: 'High-Flow Stormwater Dewatering Pump',
    brand: 'Godwin HL250M Dri-Prime',
    category: 'pump',
    categoryAr: 'مضخات وتصريف السيول',
    categoryEn: 'Dewatering Pumps',
    image: '/images/equipment/godwin-dewatering-pump.jpg',
    capacityAr: 'معدل تدفق 1,200 م³/ساعة',
    capacityEn: '1,200 m³/h discharge rate',
    specsAr: [
      'نظام تشغيل ذاتي فوري للطوارئ المطرية والسيول',
      'قدرة على ضخ الشوائب والرواسب حتى قطر 75 ملم',
      'محرك ديزل صناعي بقدرة تشغيل مستمر 72 ساعة',
      'مقطورة متنقلة سريعة النقل للمواقع الميدانية',
    ],
    specsEn: [
      'Instant automatic dry-priming for storm crisis',
      'Handles solids and debris up to 75mm diameter',
      '72-hour continuous heavy duty diesel operation',
      'Highway-ready mobile trailer mount',
    ],
    modelYear: '2023',
    unitsCount: 6,
    status: 'available',
  },
  {
    id: 'eq-7',
    nameAr: 'حفار مدمج بوبكات للمقابر والمناطق الضيقة',
    nameEn: 'Compact Excavator for Urban & Cemetery Works',
    brand: 'Bobcat E20z',
    category: 'compact',
    categoryAr: 'المعدات المدمجة والمقابر',
    categoryEn: 'Compact & Cemetery',
    image: '/images/equipment/bobcat-mini-excavator.jpg',
    capacityAr: 'وزن 2.0 طن ودوران صفري',
    capacityEn: '2.0 ton, Zero Tail Swing',
    specsAr: [
      'مناورة فائقة في الممرات الضيقة للمقابر بدون عوائق',
      'حفر دقيق بعمق 2.56 م مع حماية القبور المجاورة',
      'جنازير هيدروليكية قابلة للتمديد والتقلص للعبور',
      'ملحقات تسوية وتنظيف وتجهيز للأراضي',
    ],
    specsEn: [
      'Exceptional zero-tail swing in narrow cemetery rows',
      'Precision 2.56m trenching preserving adjacent plots',
      'Hydraulically retractable tracks for tight entries',
      'Grading and leveling multi-tool attachments',
    ],
    modelYear: '2024',
    unitsCount: 5,
    status: 'available',
  },
];

interface EquipmentFleetClientProps {
  locale: 'ar' | 'en';
}

export default function EquipmentFleetClient(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';
const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMachine, setSelectedMachine] = useState<FleetMachine | null>(null);
  const [fleetList, setFleetList] = useState<FleetMachine[]>(FLEET_DATA);

  useEffect(() => {
    const customFleet = storageAdapter.getEquipmentFleet();
    if (customFleet && customFleet.length > 0) {
      const mapped: FleetMachine[] = customFleet.map((item) => ({
        id: item.id,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        brand: `${item.brand} ${item.model}`,
        category: 'asphalt' as const,
        categoryAr: item.categoryAr,
        categoryEn: item.categoryEn,
        image: item.image,
        capacityAr: `${item.count} وحدات متوفرة`,
        capacityEn: `${item.count} units available`,
        specsAr: item.specsAr,
        specsEn: item.specsEn,
        modelYear: item.model || '2024',
        unitsCount: item.count,
        status: item.status === 'maintenance' ? 'deployed' : 'available',
      }));
      setFleetList(mapped);
    }
  }, []);

  const categories = [
    { id: 'all', labelAr: `كافة الأسطول (${fleetList.length})`, labelEn: `All Fleet (${fleetList.length})` },
    { id: 'asphalt', labelAr: 'كاشطات ورصاصات الأسفلت', labelEn: 'Asphalt Equipment' },
    { id: 'excavator', labelAr: 'حفارات وشبكات السيول', labelEn: 'Excavators & Drainage' },
    { id: 'truck', labelAr: 'شاحنات النقل والقلابات', labelEn: 'Heavy Dump Trucks' },
    { id: 'pump', labelAr: 'مضخات وتصريف السيول', labelEn: 'Dewatering Pumps' },
    { id: 'compact', labelAr: 'المعدات المدمجة والمقابر', labelEn: 'Compact & Cemetery' },
  ];

  const filteredMachines = fleetList.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory || item.categoryAr.includes(selectedCategory);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.nameAr.toLowerCase().includes(q) ||
      item.nameEn.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.categoryAr.toLowerCase().includes(q) ||
      item.capacityAr.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const getWhatsAppLink = (machineName: string) => {
    const phone = BRAND_IDENTITY.phone.replace(/[^0-9]/g, '').replace(/^0/, '966');
    const msg = isAr
      ? `السلام عليكم، أود الاستفسار وطلب تخصيص المعدة (${machineName}) لمشروعنا لدى شركة هضاب الخليج.`
      : `Hello, I would like to inquire about deploying the machinery (${machineName}) for our project.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-10">
      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-4 rtl:right-4 rtl:left-auto left-auto top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'البحث بالاسم، الموديل، النوع (مثل: Wirtgen, كاتربيلر, رصاصة...)' : 'Search by name, model, brand (e.g., Wirtgen, CAT, Roller...)'}
              className="w-full pr-11 rtl:pr-11 pl-4 rtl:pl-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 rtl:left-3 rtl:right-auto right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 text-start">
            {isAr
              ? `تم العثور على ${filteredMachines.length} آلية جاهزة للعمل`
              : `Found ${filteredMachines.length} operational units`}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fleet Cards Grid */}
      {filteredMachines.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <Truck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
            {isAr ? 'لم يتم العثور على معدات تطابق بحثك' : 'No machinery matched your search'}
          </h3>
          <p className="text-xs text-slate-500">
            {isAr ? 'جرّب كتابة كلمات بحث أخرى أو اختر فئة مختلفة.' : 'Try different keywords or select another category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMachines.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-sky-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative h-56 w-full bg-slate-950 overflow-hidden">
                <img
                  src={item.image}
                  alt={isAr ? item.nameAr : item.nameEn}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Top Badge: Category */}
                <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                  <span className="px-3 py-1 rounded-xl text-[10px] font-black bg-slate-900/85 backdrop-blur-md text-sky-300 border border-sky-500/40 shadow-sm">
                    {isAr ? item.categoryAr : item.categoryEn}
                  </span>
                </div>

                {/* Units Count Badge */}
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-black/60 backdrop-blur-md text-slate-200 border border-white/10 font-mono">
                    {item.unitsCount} {isAr ? 'وحدات' : 'Units'}
                  </span>
                </div>

                {/* Brand & Status Banner */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-400 font-mono text-sm tracking-wide">
                      {item.brand}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
                      {item.modelYear}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-black shadow-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{isAr ? 'جاهز للتشغيل' : 'Active'}</span>
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-start">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 transition-colors">
                    {isAr ? item.nameAr : item.nameEn}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{isAr ? item.capacityAr : item.capacityEn}</span>
                  </div>
                </div>

                {/* Specs List */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-start">
                  {(isAr ? item.specsAr : item.specsEn).slice(0, 3).map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-650 dark:text-slate-350">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedMachine(item)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isAr ? 'المواصفات' : 'Specs'}</span>
                  </button>

                  <a
                    href={getWhatsAppLink(isAr ? item.nameAr : item.nameEn)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-[#002060] hover:from-sky-500 hover:to-sky-700 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isAr ? 'طلب تخصيص' : 'Inquire'}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Machine Details Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative text-start">
            {/* Modal Image Header */}
            <div className="relative h-64 w-full bg-slate-950">
              <img
                src={selectedMachine.image}
                alt={isAr ? selectedMachine.nameAr : selectedMachine.nameEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              <button
                onClick={() => setSelectedMachine(null)}
                className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-black text-amber-400 font-mono">
                  {selectedMachine.brand} ({selectedMachine.modelYear})
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  {isAr ? selectedMachine.nameAr : selectedMachine.nameEn}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    {isAr ? 'الطاقة الاستيعابية / القدرة التشغيلية' : 'Operating Capacity'}
                  </span>
                  <span className="text-sm sm:text-base font-black text-sky-700 dark:text-sky-300">
                    {isAr ? selectedMachine.capacityAr : selectedMachine.capacityEn}
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black">
                  {selectedMachine.unitsCount} {isAr ? 'آليات متوفرة' : 'Units in Fleet'}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {isAr ? 'المواصفات الفنية والتجهيزات الميدانية' : 'Technical Specifications'}
                </h4>
                <div className="space-y-2.5">
                  {(isAr ? selectedMachine.specsAr : selectedMachine.specsEn).map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal CTAs */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedMachine(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>

                <a
                  href={getWhatsAppLink(isAr ? selectedMachine.nameAr : selectedMachine.nameEn)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'طلب حجز وتخصيص عبر واتساب' : 'Reserve via WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
