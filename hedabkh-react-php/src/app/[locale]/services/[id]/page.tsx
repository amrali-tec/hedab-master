"use client";

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Link from 'next/link';
import {
  Wrench,
  CheckCircle2,
  Truck,
  Layers,
  Building2,
  Construction,
  ShieldCheck,
  Award,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Send,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useServices, useProjects, useEquipment } from '../../../../hooks';
import { mockData } from '../../../../data/mockData';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { QuickQuoteModal } from '../../../../components/ui/QuickQuoteModal';

// Rich Engineering Details for each Service
const SERVICE_ENGINEERING_DETAILS: Record<string, {
  scopeAr: string[];
  scopeEn: string[];
  workflowAr: { title: string; desc: string }[];
  workflowEn: { title: string; desc: string }[];
  machineryAr: string[];
  machineryEn: string[];
  faqsAr: { q: string; a: string }[];
  faqsEn: { q: string; a: string }[];
  quoteServiceId: string;
}> = {
  'srv-1': {
    quoteServiceId: 'facility-maintenance',
    scopeAr: [
      'إدارة وتشغيل وصيانة أنظمة التكييف المركزي والمبردات (Chillers) ومجاري الهواء',
      'الصيانة الوقائية للوحات التوزيع الكهربائية والمحولات ومولدات الطوارئ الاحتياطية',
      'صيانة شبكات السباكة ومضخات الرفع وخزانات المياه الأرضية والعلوية',
      'أعمال الترميمات المعمارية والدهانات المقاومة للرطوبة وتغيير الأسقف المستعارة',
      'تطبيق خطط الطوارئ وإدارة المخاطر وتأمين متطلبات الدفاع المدني والسلامة المهنية',
    ],
    scopeEn: [
      'O&M of central HVAC chillers, air handlers, and duct distribution networks',
      'Preventive maintenance of main electrical switchgears, transformers, and emergency diesel generators',
      'Plumbing networks, booster pumps, and water reservoir maintenance',
      'Architectural rehabilitation, damp-proof paints, and suspended ceiling replacements',
      'Civil defense compliance, emergency response protocols, and workplace safety',
    ],
    workflowAr: [
      { title: '1. الفحص الفني المبدئي', desc: 'إجراء مسح هندسي شامل لكافة الأنظمة الميكانيكية والكهربائية وإعداد سجل الأصول والحالة التشغيلية.' },
      { title: '2. خطة الصيانة الوقائية (PPM)', desc: 'جدولة دورية لمهام الفحص الأسبوعي والشهري وتغيير الفلاتر والزيوت قبل حدوث أي أعطال مفاجئة.' },
      { title: '3. الاستجابة الفورية للبلاغات', desc: 'فريق طوارئ متواجد على مدار 24 ساعة للتعامل مع أي انقطاعات أو تسربات لضمان استمرارية العمل الحكومي.' },
      { title: '4. ضبط الجودة والتقارير الدورية', desc: 'إصدار تقارير الأداء الشهرية والامتثال لمعايير الآيزو 9001 و 45001 ومؤشرات الكفاءة التشغيلية.' },
    ],
    workflowEn: [
      { title: '1. Technical Asset Survey', desc: 'Comprehensive engineering survey of all MEP systems, asset tagging, and baseline condition assessment.' },
      { title: '2. Preventive Maintenance Schedule (PPM)', desc: 'Scheduled weekly and monthly servicing, filter and fluid replacements to eliminate unexpected downtime.' },
      { title: '3. Rapid Emergency Response', desc: '24/7 on-call technical response teams for rapid fault rectification and continuity of government operations.' },
      { title: '4. QA/QC & Performance Audits', desc: 'Monthly KPI reporting, ISO 9001 & ISO 45001 compliance verification, and energy efficiency audits.' },
    ],
    machineryAr: [
      'رافعات تلسكوبية لصيانة الواجهات والأسقف العالية',
      'أجهزة كشف التسربات الحرارية والكاميرات التفتيشية FLIR',
      'مولدات طوارئ ديزل كاتربيلر Caterpillar 500kVA',
      'ورش صيانة متنقلة مجهزة بكافة العدد والأدوات القياسية',
    ],
    machineryEn: [
      'Telescopic boom lifts for high ceiling & facade maintenance',
      'FLIR thermal imaging and pipe leak detectors',
      'Caterpillar 500kVA emergency standby diesel generators',
      'Fully equipped mobile MEP workshop vans',
    ],
    faqsAr: [
      { q: 'ما هي معايير استجابة طوارئ الصيانة؟', a: 'يتم الرد على البلاغات الحرجة خلال 15 إلى 30 دقيقة عبر فرقنا الميدانية المتمركزة في مواقع العقود.' },
      { q: 'هل توفرون قطع الغيار المعتمدة؟', a: 'نعم، نوفر سلاسل إمداد موثوقة لقطع الغيار الأصلية والمطابقة لمواصفات الهيئة السعودية للمواصفات والمقاييس (SASO).' },
    ],
    faqsEn: [
      { q: 'What is the emergency response turnaround time?', a: 'Critical emergency calls are addressed within 15 to 30 minutes by our stationed on-site engineers.' },
      { q: 'Do you provide certified OEM replacement parts?', a: 'Yes, we maintain certified supply chains guaranteeing authentic SASO-compliant spare parts.' },
    ],
  },
  'srv-2': {
    quoteServiceId: 'cemeteries-om',
    scopeAr: [
      'التشغيل اليومي والإشراف الميداني على تجهيز وحفر القبور وفق الضوابط الشرعية والبلدية',
      'نظافة شاملة وتأهيل الممرات الداخلية وشبكات الإنترلوك والإنارة الموفرة',
      'صيانة الأسوار الأمنية والمباني الملحقة وصالات استقبال الجنائز والمواقف الخارجية',
      'تشغيل شبكات الري والتسوير البيئي للأشجار المحيطة لدرء التصحر',
      'توفير الآليات المتخصصة المدمجة للحفر في الممرات الضيقة بأمان تام',
    ],
    scopeEn: [
      'Daily operational management and grave site preparation under Sharia and municipal codes',
      'Comprehensive cleaning, interlock walkways maintenance, and energy-efficient lighting',
      'Perimeter security walls, administrative facilities, condolence halls, and parking lot upkeep',
      'Automated irrigation networks and perimeter green landscaping maintenance',
      'Compact precision machinery fleet for safe digging in restricted corridors',
    ],
    workflowAr: [
      { title: '1. التنسيق والجدولة الميدانية', desc: 'الربط المباشر مع أمانة منطقة الرياض وإدارة شؤون الجنائز لتجهيز المقابر على مدار الساعة.' },
      { title: '2. الحفر والتجهيز المتقن', desc: 'استخدام حفارات بوبكات مدمجة مع تسوية التربة وعزل القبور وفق الأبعاد المعتمدة رسمياً.' },
      { title: '3. أعمال النظافة والصيانة المستمرة', desc: 'كنس ورفع الأتربة وإصلاح الإنارة والأسوار وصيانة بوابات الدخول وممرات ذوي الاحتياجات.' },
      { title: '4. الرقابة والتوثيق الإلكتروني', desc: 'توثيق المواقع بدقة عبر الأنظمة الرقمية ومطابقة معايير السلامة والصحة البيئية.' },
    ],
    workflowEn: [
      { title: '1. Municipal Dispatch & Coordination', desc: 'Direct integration with Riyadh Municipality and funeral directorates for 24/7 readiness.' },
      { title: '2. Precision Excavation & Setup', desc: 'Deploying compact Bobcat excavators with laser leveling and compliant grave dimensioning.' },
      { title: '3. Continuous Sanitation & Upkeep', desc: 'Daily debris sweeping, walkway repairs, security lighting, and barrier-free access maintenance.' },
      { title: '4. Digital Spatial Recording', desc: 'GIS-aligned recording and compliance with municipal public health and environmental codes.' },
    ],
    machineryAr: [
      'حفارات بوبكات Bobcat E20 صغيرة الحجم مخصصة للمقابر',
      'شاحنات خلط ونقل خرسانة الأسوار الجاهزة',
      'معدات تسوية ترابية ورصاصات يدوية دقيقة',
      'صهاريج مياه مجهزة لغسيل الممرات وشبكات الري',
    ],
    machineryEn: [
      'Compact Bobcat E20 excavators tailored for narrow corridors',
      'Ready-mix concrete trucks for wall foundations',
      'Precision plate compactors and walk-behind rollers',
      'High-pressure water washing trucks for pathway sanitation',
    ],
    faqsAr: [
      { q: 'هل تعمل فرق التشغيل في عطلات نهاية الأسبوع؟', a: 'نعم، فرقنا تعمل على مدار 24 ساعة طوال أيام الأسبوع بما فيها العطلات الرسمية والأعياد.' },
      { q: 'ما هي معايير حفر وتجهيز القبور؟', a: 'نلتزم بالمعايير الشرعية الصارمة وكود أمانة منطقة الرياض مع العزل الكامل وضبط الأعماق.' },
    ],
    faqsEn: [
      { q: 'Do operations run during weekends and holidays?', a: 'Yes, our teams operate 24/7/365 without interruption including public holidays.' },
      { q: 'What codes govern grave preparation?', a: 'We strictly follow Saudi municipal codes and Sharia guidelines with laser depth control.' },
    ],
  },
  'srv-3': {
    quoteServiceId: 'stormwater',
    scopeAr: [
      'تمديد أنابيب تصريف المياه الخرسانية المسلحة والـ GRP بأقطار تصل إلى 2400 ملم',
      'إنشاء مصائد ومصبات مياه الأمطار وغرف التفتيش (Manholes) الإنشائية الكبرى',
      'أعمال الحفر العميق، وتدعيم جوانب الحفر (Shoring)، وسحب المياه الجوفية (Dewatering)',
      'الربط الهيدروليكي مع القنوات الصندوقية الرئيسية (Box Culverts) ومحطات الضخ',
      'إعادة تأهيل وسفلتة الطرق فوق مسارات خطوط التصريف وفق أصول الصنعة',
    ],
    scopeEn: [
      'Laying reinforced concrete (RCP) & GRP drainage pipes up to 2400mm diameter',
      'Construction of heavy stormwater catch basins, culverts, and junction manholes',
      'Deep trench excavation, shoring systems, and dewatering groundwater management',
      'Hydraulic connection with master box culverts and regional retention reservoirs',
      'Full asphalt reinstatement and surface paving above drainage corridors',
    ],
    workflowAr: [
      { title: '1. الرفع المساحي والهيدروليكي', desc: 'دراسة مناسيب الانحدار الطبوغرافي ونمذجة تصريف مياه الأمطار لضمان التدفق الانسيابي.' },
      { title: '2. الحفر وتدعيم الجوانب', desc: 'تنفيذ أعمال الحفر العميق باستخدام شاشات الحماية وسحب المياه لضمان استقرار التربة.' },
      { title: '3. تركيب الأنابيب والمناهل', desc: 'تركيب الأنابيب الخرسانية واختبار الوصلات المطاطية والعزل المائي المزدوج.' },
      { title: '4. الاختبار الهيدروليكي وإعادة الرصف', desc: 'إجراء اختبارات ضغط التدفق والردم على طبقات مدروسة وإعادة السفلتة النهائية.' },
    ],
    workflowEn: [
      { title: '1. Topographic & Hydraulic Survey', desc: 'Gradient contour modeling and stormwater simulation to ensure gravity-assisted natural outflow.' },
      { title: '2. Trenching & Shoring Defense', desc: 'Deep excavation supported by certified shoring boxes and continuous groundwater dewatering pumps.' },
      { title: '3. Pipe Laying & Joint Gasketing', desc: 'Laser-guided placement of RCP/GRP pipes, double waterproof gasketing, and manhole casting.' },
      { title: '4. Hydrostatic Testing & Reinstatement', desc: 'Flow pressure testing, controlled layer compaction, and final asphalt reinstatement.' },
    ],
    machineryAr: [
      'حفارات عملاقة كوماتسو Komatsu PC300 و CAT-320D',
      'روافع هيدروليكية لإنزال وتثبيت الأنابيب العملاقة',
      'مضخات نزح مياه جوفية غاطسة عالية التدفق',
      'رصاصات دكاكة هيدروليكية لردم الخنادق',
    ],
    machineryEn: [
      'Heavy Komatsu PC300 and CAT-320D hydraulic excavators',
      'Heavy crane hoists for large diameter pipe rigging',
      'High-capacity submersible dewatering pump systems',
      'Trench vibratory compactors for layer stabilization',
    ],
    faqsAr: [
      { q: 'ما هي أنواع الأنابيب المستخدمة في شبكات السيول؟', a: 'نستخدم أنابيب الخرسانة المسلحة (RCP) وأنابيب الفايبر جلاس (GRP) المعتمدة من وزارة البلديات.' },
      { q: 'كيف تضمنون عدم هبوط الأسفلت فوق خنادق التصريف؟', a: 'يتم الردم على طبقات (Layers) لا تتجاوز 30 سم مع الدمك والاختبار المخبري لنسبة الدمك (98%+).' },
    ],
    faqsEn: [
      { q: 'What pipe specifications are deployed?', a: 'We install certified Reinforced Concrete Pipes (RCP) and GRP pipes certified by MOMRAH.' },
      { q: 'How do you prevent post-excavation asphalt settlement?', a: 'Controlled 30cm layered compaction with certified laboratory proctor tests achieving 98%+ density.' },
    ],
  },
  'srv-4': {
    quoteServiceId: 'road-paving',
    scopeAr: [
      'كشط الأسفلت التالف بدقة هندسية بواسطة قاشطات Wirtgen الألمانية المتطورة',
      'معالجة الشقوق وطبقة الأساس الحجري (Aggregate Base Course) والرش الرابط (MC1 / RC2)',
      'سفلتة الطرق بالخلطات الأسفلتية الحارة (طبقة رابطة Binder وطبقة سطحية Wearing)',
      'تركيب البردورات والإنترلوك والخرسانة المطبوعة للأرصفة وممرات المشاة',
      'تخطيط الطرق بالدهانات الحرارية العاكسة (Thermoplastic) وتركيب اللوحات الإرشادية وعيون القطط',
    ],
    scopeEn: [
      'High-precision cold milling of damaged asphalt using German Wirtgen millers',
      'Base course aggregate stabilization, prime coat (MC1), and tack coat (RC2) spraying',
      'Hot mix asphalt paving (Superpave specifications for Binder and Wearing courses)',
      'Interlock paving, curbstone installation, and stamped concrete pedestrian corridors',
      'Thermoplastic reflective road markings, cat-eyes, and regulatory traffic signage',
    ],
    workflowAr: [
      { title: '1. الكشط والتنظيف الهوائي', desc: 'كشط الطبقات السطحية التالفة وتنظيف الشارع بالهواء المضغوط لإزالة كافة الشوائب.' },
      { title: '2. رش الطبقة اللاصقة والتحضير', desc: 'رش مستحلب الأسفلت الرابط بدرجة حرارة معتمدة لضمان تماسك الطبقات الإنشائية.' },
      { title: '3. الفرش بالفرادات الحديثة', desc: 'فرش الخلطة الأسفلتية الحارة عند درجات حرارة 140-160° مئوية بسماكات منتظمة ومحكومة بالليزر.' },
      { title: '4. الدك والدمك النهائي', desc: 'دك الأسفلت بالرصاصات الفولاذية والمطاطية للوصول لنسبة الدمك القياسية والنعومة الملساء.' },
    ],
    workflowEn: [
      { title: '1. Cold Milling & Air Cleaning', desc: 'Milling deteriorated asphalt surfaces followed by high-pressure air sweeping for spotless bonding.' },
      { title: '2. Prime/Tack Coat Spraying', desc: 'Applying calibrated MC1/RC2 bituminous emulsion for permanent interlayer bonding.' },
      { title: '3. Laser-Guided Asphalt Laying', desc: 'Laying hot mix asphalt at 140-160°C using automated laser-leveled pavers.' },
      { title: '4. Tandem & Pneumatic Compaction', desc: 'Multi-pass steel and pneumatic roller compaction achieving certified surface smoothness.' },
    ],
    machineryAr: [
      'قاشطات أسفلت Wirtgen W2000 الألمانية عريضة المسار',
      'فرادات أسفلت Vögele Super 1800 مع حساسات استواء ليزرية',
      'رصاصات أسفلت ثنائية واهتزازية Dynapac CC522 و Hamm',
      'شاحنات رش مستحلبات بيتومينية معزولة حرارياً',
    ],
    machineryEn: [
      'German Wirtgen W2000 heavy asphalt cold milling machines',
      'Vögele Super 1800 asphalt pavers with automated sonic grade sensors',
      'Dynapac CC522 and Hamm tandem vibratory & pneumatic rollers',
      'Calibrated insulated bitumen distributor tankers',
    ],
    faqsAr: [
      { q: 'ما هي الطاقة الإنتاجية اليومية للسفلتة؟', a: 'يمتلك أسطولنا القدرة على فرد ودك أكثر من 3,500 طن أسفلت يومياً في المشاريع الكبرى.' },
      { q: 'هل الخلطات الأسفلتية مطابقة لكود وزارة النقل؟', a: 'نعم، جميع الخلطات مصممة ومختبرة في مختبرات معتمدة وفق نظام السوبربيف (Superpave).' },
    ],
    faqsEn: [
      { q: 'What is your daily asphalt paving output capacity?', a: 'Our mechanized paving fleet can lay and compact over 3,500 tons of hot asphalt daily.' },
      { q: 'Do mixes comply with Ministry of Transport standards?', a: 'Yes, all mixes undergo rigorous Marshall & Superpave laboratory performance testing.' },
    ],
  },
  'srv-5': {
    quoteServiceId: 'fleet-rental',
    scopeAr: [
      'إزالة الأنقاض والمخلفات الإنشائية مجهولة المصدر من المخططات والأراضي الفضاء',
      'تسوية ونظافة الأراضي الفضاء وتأهيلها لتحسين المشهد الحضري والحد من التشوه البصري',
      'توفير الشاحنات الثقيلة واللوابد لنقل الهدميات للمدافن والمقالب البيئية المعتمدة',
      'إصدار شهادات الامتثال البيئي والتخلص الآمن المعتمدة من أمانات المناطق',
    ],
    scopeEn: [
      'Clearing construction debris and undocumented demolition waste from urban plots',
      'Ground grading, site leveling, and visual pollution removal across municipal zones',
      'Deploying dump truck fleets and heavy lowbeds for transport to authorized landfills',
      'Issuing municipal environmental compliance certificates for authorized waste disposal',
    ],
    workflowAr: [
      { title: '1. حصر وتحديد الكميات', desc: 'مسح الموقع وتحديد حجم الأنقاض ونوعيتها واختيار المعدات المناسبة للتحميل.' },
      { title: '2. التحميل الآمن بالمعدات الثقيلة', desc: 'استخدام الشيولات والبلدوزرات لتحميل الشاحنات مع تغطية الحمولات لمنع التطاير.' },
      { title: '3. النقل للمقالب المعتمدة', desc: 'نقل المخلفات عبر مسارات معتمدة وتفريغها بالمردم العام للأمانة وفق الضوابط البيئية.' },
      { title: '4. تسوية الموقع وتسليمه', desc: 'تسوية الأرض بالممهدات (Graders) وإصدار محضر خلو الموقع من التشوهات.' },
    ],
    workflowEn: [
      { title: '1. Volume Estimation & Site Survey', desc: 'Quantifying debris volumes and classifying waste materials to dispatch appropriate load fleets.' },
      { title: '2. Heavy Mechanized Loading', desc: 'Loading dump trucks with heavy wheel loaders and securing tarpaulins to prevent road spillage.' },
      { title: '3. Regulated Transport to Landfills', desc: 'Hauling debris via designated municipality corridors for eco-compliant disposal.' },
      { title: '4. Final Grading & Handover', desc: 'Motor grader site smoothing and issuing municipal site clearance handover certificates.' },
    ],
    machineryAr: [
      'شيولات كوماتسو Komatsu WA470 و CAT-966H',
      'بلدوزرات ثقيلة Caterpillar D8T لتجريف وتسوية الأراضي',
      'أسطول شاحنات قلاب Mercedes Actros حمولة 24 إلى 32 م³',
      'ممهدات طرق كاتربيلر CAT 140K Graders',
    ],
    machineryEn: [
      'Komatsu WA470 and CAT-966H heavy front wheel loaders',
      'Caterpillar D8T crawler bulldozers for bulk ground scraping',
      'Mercedes-Benz Actros heavy tipper fleet (24-32 m³ payload)',
      'Caterpillar 140K precision motor graders',
    ],
    faqsAr: [
      { q: 'هل توفرون تصاريح نقل الأنقاض الرسمية؟', a: 'نعم، مرخصون من الهيئة العامة للنقل والأمانات لنقل وتفريغ المخلفات بموجب بوالص رسمية.' },
      { q: 'كم تبلغ الطاقة اليومية لنقل الأنقاض؟', a: 'نستطيع نقل وتفريغ ما يزيد عن 5,000 م³ من الأنقاض يومياً بفضل أسطولنا المملوك.' },
    ],
    faqsEn: [
      { q: 'Do you hold official waste transport permits?', a: 'Yes, we are licensed by TGA and regional municipalities for regulated landfill haulage.' },
      { q: 'What is your daily debris transport capacity?', a: 'Our fleet can haul over 5,000 m³ of construction waste daily.' },
    ],
  },
  'srv-6': {
    quoteServiceId: 'fleet-rental',
    scopeAr: [
      'عقود تشغيل وإدارة أساطيل الآليات والمعدات الثقيلة التابعة للأمانات والبلديات الفرعية',
      'توفير الكوادر الفنية والمشغلين المعتمدين والميكانيكيين للتدخل السريع والطوارئ',
      'تأسيس وإدارة ورش الصيانة الميدانية المتنقلة وتوفير قطع الغيار الأصلية',
      'تطبيق أنظمة التتبع اللوجستي GPS والمراقبة اللحظية لساعات عمل واستهلاك المعدات',
    ],
    scopeEn: [
      'Fleet operations and maintenance management for municipal sub-directorates',
      'Supplying certified operators, mechanical technicians, and rapid response crews',
      'Setting up mobile maintenance depots and supplying certified OEM replacement parts',
      'GPS telematics tracking, utilization logging, and preventive maintenance automation',
    ],
    workflowAr: [
      { title: '1. تدشين الأسطول وجدولة المشغلين', desc: 'توزيع الآليات على القطاعات البلدية وفق خطط التشغيل المعتمدة وساعات المناوبة.' },
      { title: '2. الصيانة الوقائية والمتابعة اللحظية', desc: 'فحص يومي لسوائل المحركات وضغط الهيدروليك وتزييت المحاور قبل بدء الورديات.' },
      { title: '3. التدخل السريع للطوارئ', desc: 'ورش صيانة متنقلة جاهزة لإصلاح أي عطل ميداني خلال فترات زمنية قياسية.' },
      { title: '4. تقارير الكفاءة والاستهلاك', desc: 'تحليل استهلاك الوقود وساعات التشغيل الفعلية لرفع كفاءة الإنتاجية وتقليل التكاليف.' },
    ],
    workflowEn: [
      { title: '1. Fleet Commissioning & Crew Rostering', desc: 'Deploying machinery across municipal sectors according to operational schedules.' },
      { title: '2. Pre-Shift Inspection & Fluid Checks', desc: 'Daily inspections of hydraulic pressures, oil levels, and greasing points before shifts.' },
      { title: '3. Rapid Mobile Repair Units', desc: 'Fully equipped field service trucks to rectify unexpected mechanical issues on site.' },
      { title: '4. Telematics & Efficiency Analytics', desc: 'Fuel consumption tracking and run-time optimization reports to maximize asset productivity.' },
    ],
    machineryAr: [
      'شاحنات ورش متنقلة مجهزة بأجهزة تشخيص الأعطال الإلكترونية',
      'شاحنات تزيت وتزويد وقود ديزل ميدانية',
      'لوابد هيدروليكية لنقل المعدات الثقيلة بين المواقع',
      'رافعات شوكية ورافعات هيدروليكية للورش المركزية',
    ],
    machineryEn: [
      'Mobile mechanical repair trucks equipped with computerized diagnostics',
      'Field fuel tankers and high-volume mobile lube dispensing units',
      'Hydraulic lowbed heavy equipment transporters',
      'Industrial forklifts and overhead gantry cranes for depot workshops',
    ],
    faqsAr: [
      { q: 'هل توفرون السائقين والمشغلين مع المعدات؟', a: 'نعم، نوفر مشغلين وسائقين محترفين حاصلين على رخص قيادة معدات ثقيلة وشهادات سلامة معتمدة.' },
      { q: 'كيف يتم التعامل مع أعطال المعدات أثناء العمل؟', a: 'تصل ورشة الصيانة المتنقلة للموقع فوراً، وفي حال استغرق الإصلاح وقتاً يتم توفير معدة بديلة فوراً.' },
    ],
    faqsEn: [
      { q: 'Do equipment rentals include certified operators?', a: 'Yes, our operators hold certified heavy equipment licenses and rigorous safety training.' },
      { q: 'What happens in case of an on-site equipment breakdown?', a: 'Mobile workshops dispatch immediately; if a major repair is required, a replacement unit is mobilized.' },
    ],
  },
};

export default function ServiceDetailPage(props?: any) {
  const routerParams = useParams<{ locale?: string; id?: string }>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const id = props?.id || routerParams?.id || '';
  const isAr = locale === 'ar';

  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const { data: apiServices } = useServices(locale);
  const { data: apiProjects } = useProjects(locale);
  
  const fallbackServices = mockData[locale]?.services || [];
  const servicesList = (apiServices && apiServices.length > 0) ? apiServices : fallbackServices;
  const service = servicesList.find((s) => s.id === id);

  const fallbackProjects = mockData[locale]?.projects || [];
  const projectsList = (apiProjects && apiProjects.length > 0) ? apiProjects : fallbackProjects;

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center space-y-8 min-h-[70vh] text-slate-900 dark:text-white">
        <h1 className="text-2xl font-black">{isAr ? 'الخدمة المطلوبة غير موجودة' : 'Service Not Found'}</h1>
        <p className="text-slate-500 text-sm">
          {isAr ? 'نعتذر، لم نتمكن من العثور على تفاصيل الخدمة التي تبحث عنها.' : 'Sorry, the requested service details could not be found.'}
        </p>
        <Link
          href={`/${locale}/services`}
          className="inline-block px-6 py-3 bg-[#0070BA] text-white rounded-2xl text-xs font-bold"
        >
          {isAr ? 'العودة لقائمة الخدمات' : 'Back to Services'}
        </Link>
      </div>
    );
  }

  const details = SERVICE_ENGINEERING_DETAILS[service.id] || SERVICE_ENGINEERING_DETAILS['srv-4'];

  // Filter related projects that match this service category or title
  const relatedProjects = projectsList.filter((p) => {
    const pCat = p.category?.toLowerCase() || '';
    const sTitle = service.title?.toLowerCase() || '';
    return pCat.includes(sTitle.slice(0, 10)) || sTitle.includes(pCat.slice(0, 10)) || p.category === service.title;
  }).slice(0, 3);

  // If no exact match, grab top 3 projects as representative portfolio
  const displayProjects = relatedProjects.length > 0 ? relatedProjects : projectsList.slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white pt-24 pb-20">
      {/* 1. Header Banner */}
      <PageHeader
        title={service.title}
        subtitle={service.description}
        badge={isAr ? 'الخدمات الإنشائية والتشغيلية المعتمدة' : 'Certified Engineering Services'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-8">
        
        {/* Top Summary & Dual CTA Ribbon */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-100/90 via-white to-slate-100/90 dark:from-slate-900 dark:via-[#002060] dark:to-[#0070BA] text-slate-900 dark:text-white border border-slate-200/90 dark:border-sky-500/20 shadow-lg dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-start max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0070BA]/10 dark:bg-white/10 text-[#0070BA] dark:text-sky-200 text-xs font-bold font-mono">
              <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              {isAr ? 'تنفيذ مطابق لمواصفات وزارة البلديات والإسكان' : 'Compliant with MOMRAH & Municipal Standards'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isAr ? 'جاهزية كاملة للتنفيذ المباشر والمناقصات' : 'Fully Mobilized for Immediate Project Execution & Tenders'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-sky-100/90 leading-relaxed font-medium">
              {isAr
                ? 'نوفر الكوادر الهندسية والآليات الثقيلة والمختبرات الميدانية لضمان أعلى معايير الجودة والتسليم في المواعيد المحددة.'
                : 'Dedicated engineering personnel, heavy machinery fleet, and QA/QC teams for on-time delivery.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#0070BA] dark:bg-white text-white dark:text-[#002060] text-xs font-black hover:bg-sky-600 dark:hover:bg-sky-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-sky-200 dark:text-[#0070BA]" />
              <span>{isAr ? 'طلب عرض سعر لهذه الخدمة' : 'Request RFQ for this Service'}</span>
            </button>

            <Link href={`/${locale}/projects`} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                <FileText className="w-4 h-4 text-[#0070BA] dark:text-sky-300" />
                <span>{isAr ? 'استعراض سابقة الأعمال' : 'View Projects'}</span>
              </button>
            </Link>
          </div>
        </div>

        {/* 2. Scope of Work (نطاق العمل الهندسي المعتمد) */}
        <section className="space-y-6 text-start">
          <div className="border-s-4 border-[#0070BA] ps-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {isAr ? 'نطاق العمل الهندسي والمواصفات الفنية' : 'Engineering Scope of Work & Technical Specs'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isAr ? 'تفصيل دقيق للأعمال والاشتراطات الميدانية المعتمدة' : 'Detailed breakdown of engineering deliverables and field standards'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isAr ? details.scopeAr : details.scopeEn).map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 shadow-sm hover:border-sky-500/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Execution Workflow (مراحل التنفيذ الميداني - 4 مراحل) */}
        <section className="space-y-6 text-start">
          <div className="border-s-4 border-amber-500 ps-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {isAr ? 'منهجية ومراحل التنفيذ الميداني' : 'Field Execution Methodology & Workflow'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isAr ? 'إجراءات متسلسلة تضمن سرعة الإنجاز ودقة الجودة والمطابقة' : 'Sequential engineering protocols ensuring rapid delivery and QA/QC compliance'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(isAr ? details.workflowAr : details.workflowEn).map((wf, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0070BA]/10 text-[#0070BA] dark:text-sky-400 font-mono font-black text-xs flex items-center justify-center">
                    0{idx + 1}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#0070BA] dark:group-hover:text-sky-400 transition-colors">
                    {wf.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {wf.desc}
                  </p>
                </div>
                <div className="h-1 w-12 bg-sky-500/20 group-hover:w-full group-hover:bg-[#0070BA] transition-all rounded-full" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Assigned Machinery & Fleet (الأسطول والآليات المخصصة) */}
        <section className="space-y-6 text-start">
          <div className="border-s-4 border-emerald-500 ps-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>{isAr ? 'أسطول الآليات والمعدات المخصصة للخدمة' : 'Dedicated Equipment & Machinery Fleet'}</span>
              <Truck className="w-6 h-6 text-emerald-500" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isAr ? 'معدات ثقيلة مملوكة بالكامل ومجهزة بأحدث أنظمة التوجيه والمراقبة' : 'Company-owned heavy fleet equipped with modern laser guidance and safety systems'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(isAr ? details.machineryAr : details.machineryEn).map((mach, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center shrink-0">
                  <Construction className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {mach}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Executed Projects Linked to Service */}
        <section className="space-y-6 text-start">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-s-4 border-purple-500 ps-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {isAr ? 'مشاريع منجزة مرتبطة بهذه الخدمة' : 'Executed Projects Under this Service'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isAr ? 'نماذج حية من أعمالنا المنفذة لدى أمانات المناطق والجهات الحكومية' : 'Live samples of our delivered municipal and governmental contracts'}
              </p>
            </div>

            <Link
              href={`/${locale}/projects`}
              className="text-xs font-bold text-[#0070BA] dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>{isAr ? 'استعراض كافة المشاريع' : 'View All Projects'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayProjects.map((proj) => (
              <Link
                key={proj.id}
                href={`/${locale}/projects/${proj.id}`}
                className="group block rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:border-sky-500/40 transition-all"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={proj.image || '/images/hero-bg.webp'}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 start-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0070BA] text-white text-[10px] font-bold">
                      {isAr ? 'إنجاز 100%' : '100% Completed'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#0070BA] dark:group-hover:text-sky-400 transition-colors">
                    {proj.title}
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{proj.client || (isAr ? 'أمانة منطقة الرياض' : 'Riyadh Municipality')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{proj.location || (isAr ? 'منطقة الرياض' : 'Riyadh Region')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Technical FAQ Accordion */}
        <section className="space-y-6 text-start">
          <div className="border-s-4 border-sky-500 ps-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isAr ? 'الأسئلة الشائعة حول الخدمة' : 'Frequently Asked Technical Questions'}</span>
              <HelpCircle className="w-5 h-5 text-sky-500" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isAr ? 'إجابات على استفسارات جهات الترسية والمطورين العقاريين' : 'Answers for procurement officers and engineering developers'}
            </p>
          </div>

          <div className="space-y-3">
            {(isAr ? details.faqsAr : details.faqsEn).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start font-black text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#0070BA]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Bottom Final RFQ Banner */}
        <div className="text-center py-12 px-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 space-y-6 shadow-xl dark:shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-amber-500/5 dark:from-sky-500/10 dark:to-amber-500/10 pointer-events-none" />
          <div className="space-y-2 relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isAr ? 'هل تبحث عن تسعير رسمي أو دراسة فنية لمشروعك؟' : 'Looking for a Formal Project Quote or Technical Study?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {isAr
                ? 'فريقنا الهندسي جاهز لتقديم دراسة الجداول والكميات والتسعير التنافسي خلال 24 ساعة.'
                : 'Our estimating engineers are ready to evaluate your BOQ and submit competitive proposals within 24 hours.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-[#002060] text-white text-xs font-black hover:shadow-xl hover:shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'طلب عرض سعر مباشر الآن' : 'Request Immediate Quotation'}</span>
            </button>

            <Link href={`/${locale}/contact`} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer">
                {isAr ? 'تواصل مع الإدارة الهندسية' : 'Contact Engineering Dept'}
              </button>
            </Link>
          </div>
        </div>

      </div>

      {/* Interactive Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        locale={locale}
        defaultService={details.quoteServiceId}
      />
    </div>
  );
}
