/**
 * Visual CMS Content Engine & Multi-Page Publishing Service
 * Handles Multiple Pages (Home, About, Services, Projects, Equipment, Certificates, Chairman, Team, News, Contact),
 * Content Locks, Multi-version Drafts, Block Composition, Publishing, and Rollbacks.
 */

import { ContentPage, PageVersion, ContentBlock, BlockType } from '../lib/cms/blockSchemas';
import { BLOCK_REGISTRY } from '../lib/cms/blockRegistry';

// ----------------------------------------------------
// Initial Seeded Blocks for Core Pages
// ----------------------------------------------------

// 1. Home Page Blocks
const DEFAULT_HOME_BLOCKS: ContentBlock[] = [
  {
    id: 'block-home-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: BLOCK_REGISTRY.hero.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-about-1',
    type: 'aboutOverview',
    sortOrder: 1,
    isVisible: true,
    config: BLOCK_REGISTRY.aboutOverview.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-services-1',
    type: 'serviceCollection',
    sortOrder: 2,
    isVisible: true,
    config: BLOCK_REGISTRY.serviceCollection.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-timeline-1',
    type: 'timeline',
    sortOrder: 3,
    isVisible: true,
    config: BLOCK_REGISTRY.timeline.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-projects-1',
    type: 'projectCollection',
    sortOrder: 4,
    isVisible: true,
    config: BLOCK_REGISTRY.projectCollection.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-map-1',
    type: 'saudiMap',
    sortOrder: 5,
    isVisible: true,
    config: BLOCK_REGISTRY.saudiMap.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-partners-1',
    type: 'partners',
    sortOrder: 6,
    isVisible: true,
    config: BLOCK_REGISTRY.partners.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-stats-1',
    type: 'statistics',
    sortOrder: 7,
    isVisible: true,
    config: BLOCK_REGISTRY.statistics.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-catalog-1',
    type: 'catalogCenter',
    sortOrder: 8,
    isVisible: true,
    config: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-cta-1',
    type: 'cta',
    sortOrder: 9,
    isVisible: true,
    config: BLOCK_REGISTRY.cta.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-home-whatsapp-1',
    type: 'whatsapp',
    sortOrder: 10,
    isVisible: true,
    config: BLOCK_REGISTRY.whatsapp.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 2. About Us Page Blocks
const DEFAULT_ABOUT_BLOCKS: ContentBlock[] = [
  {
    id: 'block-about-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: {
      tagAr: 'من نحن — شركة هضاب الخليج العربي للمقاولات',
      tagEn: 'ABOUT US — ARABIAN GULF HILLS CONTRACTING',
      titleAr: 'شركة هضاب الخليج العربي للمقاولات',
      titleEn: 'Arabian Gulf Hills Contracting Company',
      subtitleAr: 'شركة وطنية سعودية مصنفة تقدم خدمات إنشائية وهندسية متكاملة بأسطول متطور وأعلى معدلات المحتوى المحلي وفق رؤية 2030.',
      subtitleEn: 'A premier classified Saudi contracting company executing civil infrastructure, road paving, stormwater drainage networks, and municipal facility O&M.',
      primaryCtaTextAr: 'استعراض الهيكل الإداري والفني',
      primaryCtaTextEn: 'Executive Leadership',
      primaryCtaLink: '/team',
      secondaryCtaTextAr: 'الشهادات والاعتمادات الرسمية',
      secondaryCtaTextEn: 'Accreditations & Certificates',
      secondaryCtaLink: '/certificates',
      bgImageUrl: '/images/company-overview.jpg',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-about-overview-1',
    type: 'aboutOverview',
    sortOrder: 1,
    isVisible: true,
    config: BLOCK_REGISTRY.aboutOverview.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-about-values-user-exact',
    type: 'richText',
    sortOrder: 2,
    isVisible: true,
    config: {
      badgeAr: 'القيم الجوهرية',
      badgeEn: 'Our Core Values',
      titleAr: 'القيم الجوهرية (Our Core Values)',
      titleEn: 'Core Values Driving Our Engineering Strength',
      contentAr: `* **الجودة والتميز:** تطبيق أعلى المعايير الفنية والهندسية في كافة مراحل التنفيذ والإشراف لضمان دقة المخرجات واستدامتها.

* **الالتزام والموثوقية:** الانضباط الكامل بالجداول الزمنية، والمواصفات الفنية، والوفاء بالعقود لبناء شراكات متينة وطويلة الأمد.

* **السلامة المهنية والبيئة:** توفير بيئة عمل آمنة خالية من الحوادث وحماية الموارد الطبيعية وفق المعايير والشهادات الدولية.

* **الابتكار والكفاءة:** توظيف أحدث الآليات والمعدات والتقنيات الحديثة لإدارة الموارد بأعلى كفاءة تشغيلية وتحقيق أفضل قيمة للمشاريع.

* **المسؤولية الوطنية والمجتمعية:** تعزيز نسبة المحتوى المحلي ودعم التنمية المستدامة بما يتماشى مع التوجهات الوطنية وتطوير البنية التحتية للمدن.`,
      contentEn: `* **Quality & Excellence:** Applying the highest technical and engineering standards across all execution and supervision phases to ensure output accuracy and durability.

* **Commitment & Reliability:** Complete schedule discipline, technical compliance, and contract fulfillment to build strong, long-term partnerships.

* **Occupational Safety & Environment:** Providing a zero-accident safe workplace and preserving natural resources according to international standards.

* **Innovation & Efficiency:** Deploying advanced machinery and modern technologies to manage resources with top operational efficiency and value.

* **National & Social Responsibility:** Enhancing local content score and advancing sustainable development aligned with national urban infrastructure goals.`,
      align: 'right',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-about-chairman-statement',
    type: 'richText',
    sortOrder: 4,
    isVisible: true,
    config: {
      badgeAr: 'الرسالة القيادية والحوكمة',
      badgeEn: 'Governance & Leadership',
      titleAr: 'كلمة الإدارة التنفيذية وموجّهات الحوكمة',
      titleEn: 'Executive Management & Governance Directives',
      contentAr: `> *"إن ما حققته شركة هضاب الخليج العربي للمقاولات من نجاحات متتالية ومشاريع سيادية ناجحة في مختلف مناطق المملكة لم يكن ليتأتى لولا توفيق الله ثم الالتزام الصارم بأعلى المعايير الهندسية والاعتماد على الكوادر الوطنية المؤهلة بأسطول متطور وأعلى معدلات الكفاءة التشغيلية."*

---

### 🏛️ التخطيط الهيكلي والجودة الإنشائية المستدامة
منذ انطلاقة الشركة ووفق سجلها التجاري الرسمي رقم \`1010720712\` والرقم الوطني الموحد \`7023600179\` ومقرها الرئيسي بالرياض، أخذنا على عاتقنا أن نكون الذراع التنفيذي الموثوق في مشاريع البنية التحتية، رصف الطرق، وشبكات تصريف مياه الأمطار والسيول. إننا نؤمن بأن الهندسة الحديثة ليست مجرد معدات وخرسانة، بل هي تخطيط دقيق ورؤية مستقبلية تؤسس لنمو حضري مستدام يخدم الأجيال القادمة.`,
      contentEn: `> *"The continuous milestones and landmark infrastructure projects delivered by Arabian Gulf Hills Contracting are driven by uncompromising engineering standards, continuous investment in specialized heavy machinery, and an empowered Saudi workforce."*`,
      align: 'right',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-about-stats-1',
    type: 'statistics',
    sortOrder: 5,
    isVisible: true,
    config: BLOCK_REGISTRY.statistics.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-about-catalog-1',
    type: 'catalogCenter',
    sortOrder: 6,
    isVisible: true,
    config: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-about-partners-1',
    type: 'partners',
    sortOrder: 7,
    isVisible: true,
    config: BLOCK_REGISTRY.partners.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-about-cta-1',
    type: 'cta',
    sortOrder: 8,
    isVisible: true,
    config: BLOCK_REGISTRY.cta.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 3. Services Page Blocks
const DEFAULT_SERVICES_BLOCKS: ContentBlock[] = [
  {
    id: 'block-services-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: {
      tagAr: 'المجالات والخدمات الهندسية — شركة هضاب الخليج',
      tagEn: 'ENGINEERING SERVICES — ARABIAN GULF HILLS',
      titleAr: 'لوحة التحكم والمجالات الخدمية والهندسية',
      titleEn: 'Engineering Services & Capabilities Blueprint',
      subtitleAr: 'نقدم خدمات إنشائية وتنفيذية متكاملة تشمل كشط وسفلتة الطرق، شبكات تصريف مياه الأمطار والسيول، وحواجز النيوجيرسي الخرسانية.',
      subtitleEn: 'Comprehensive civil infrastructure, asphalt paving, stormwater drainage networks, and New Jersey precast barriers.',
      primaryCtaTextAr: 'طلب عرض سعر للخدمات',
      primaryCtaTextEn: 'Request RFQ Quotation',
      primaryCtaLink: '/contact',
      secondaryCtaTextAr: 'استعراض أسطول الآليات',
      secondaryCtaTextEn: 'Heavy Equipment Fleet',
      secondaryCtaLink: '/equipment',
      bgImageUrl: '/images/hero-bg.webp',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-services-collection-1',
    type: 'serviceCollection',
    sortOrder: 1,
    isVisible: true,
    config: BLOCK_REGISTRY.serviceCollection.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-services-stats-1',
    type: 'statistics',
    sortOrder: 2,
    isVisible: true,
    config: BLOCK_REGISTRY.statistics.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-services-cta-1',
    type: 'cta',
    sortOrder: 3,
    isVisible: true,
    config: BLOCK_REGISTRY.cta.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 4. Projects Page Blocks
const DEFAULT_PROJECTS_BLOCKS: ContentBlock[] = [
  {
    id: 'block-projects-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: {
      tagAr: 'معرض المشاريع والعقود السيادية',
      tagEn: 'SOVEREIGN PROJECTS & TRACK RECORD',
      titleAr: 'مشاريعنا المنفذة والعقود الإنشائية الكبرى',
      titleEn: 'Landmark Infrastructure Projects & Major Contracts',
      subtitleAr: 'سجل حافل بتنفيذ مشاريع صيانة الطرق والبنية التحتية لحساب الأمانات والوزارات في كافة مناطق المملكة.',
      subtitleEn: 'Extensive track record delivering municipal road paving and stormwater drainage projects across KSA.',
      primaryCtaTextAr: 'استعراض خريطة المشاريع',
      primaryCtaTextEn: 'View Project Map',
      primaryCtaLink: '#saudi-map',
      secondaryCtaTextAr: 'تحميل الكتالوج التجاري',
      secondaryCtaTextEn: 'Download Corporate Profile',
      secondaryCtaLink: '/certificates',
      bgImageUrl: '/images/hero-bg.webp',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-projects-collection-1',
    type: 'projectCollection',
    sortOrder: 1,
    isVisible: true,
    config: BLOCK_REGISTRY.projectCollection.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-projects-map-1',
    type: 'saudiMap',
    sortOrder: 2,
    isVisible: true,
    config: BLOCK_REGISTRY.saudiMap.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-projects-partners-1',
    type: 'partners',
    sortOrder: 3,
    isVisible: true,
    config: BLOCK_REGISTRY.partners.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-projects-cta-1',
    type: 'cta',
    sortOrder: 4,
    isVisible: true,
    config: BLOCK_REGISTRY.cta.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 5. Equipment Fleet Page Blocks
const DEFAULT_EQUIPMENT_BLOCKS: ContentBlock[] = [
  {
    id: 'block-equipment-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: {
      tagAr: 'الأسطول والقدرات التشغيلية',
      tagEn: 'FLEET & OPERATIONAL CAPABILITIES',
      titleAr: 'أسطول الآليات والمعدات الثقيلة واللوجستيات',
      titleEn: 'Heavy Machinery Fleet & Logistics Operations',
      subtitleAr: 'أسطول متطور يضم أكثر من 150 معدة وآلية ثقيلة مزودة بنظم التتبع اللحظي IoT لتنفيذ المشاريع بكفاءة عالية.',
      subtitleEn: 'Specialized fleet exceeding 150 heavy machines powered by real-time IoT telematics for continuous high-rate execution.',
      primaryCtaTextAr: 'طلب استئجار وتأهيل أسطول',
      primaryCtaTextEn: 'Fleet Rental & Leasing',
      primaryCtaLink: '/contact',
      secondaryCtaTextAr: 'الاعتمادات والتراخيص',
      secondaryCtaTextEn: 'Transport Licenses',
      secondaryCtaLink: '/certificates',
      bgImageUrl: '/images/hero-bg.webp',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-equipment-stats-1',
    type: 'statistics',
    sortOrder: 1,
    isVisible: true,
    config: BLOCK_REGISTRY.statistics.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-equipment-cta-1',
    type: 'cta',
    sortOrder: 2,
    isVisible: true,
    config: BLOCK_REGISTRY.cta.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 6. Certificates & Accreditations Page Blocks
const DEFAULT_CERTIFICATES_BLOCKS: ContentBlock[] = [
  {
    id: 'block-certificates-catalog-1',
    type: 'catalogCenter',
    sortOrder: 0,
    isVisible: true,
    config: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-certificates-cta-1',
    type: 'cta',
    sortOrder: 1,
    isVisible: true,
    config: BLOCK_REGISTRY.cta.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 7. Chairman's Message Page Blocks
const DEFAULT_CHAIRMAN_BLOCKS: ContentBlock[] = [
  {
    id: 'block-chairman-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: {
      tagAr: 'القيادة الاستراتيجية — شركة هضاب الخليج العربي للمقاولات',
      tagEn: 'EXECUTIVE LEADERSHIP — ARABIAN GULF HILLS CONTRACTING',
      titleAr: 'كلمة رئيس مجلس الإدارة والرئيس التنفيذي',
      titleEn: "Chairman & Chief Executive Officer's Message",
      subtitleAr: 'نعمل بعزيمة وطنية ورؤية هندسية راسخة لبناء وتطوير بنية تحتية مستدامة تحاكي طموحات المملكة وتتجاوز تطلعات شركائنا في مختلف القطاعات.',
      subtitleEn: 'Building resilient infrastructure driven by national dedication, engineering excellence, and alignment with Saudi Vision 2030 targets.',
      primaryCtaTextAr: 'الملف التعريفي والاعتمادات الرسمية',
      primaryCtaTextEn: 'Corporate Prequalification Dossier',
      primaryCtaLink: '/about',
      secondaryCtaTextAr: 'تواصل مع الإدارة التنفيذية',
      secondaryCtaTextEn: 'Contact Executive Office',
      secondaryCtaLink: '/contact',
      bgImageUrl: '/images/hero-bg.webp',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-chairman-statement-user-exact',
    type: 'richText',
    sortOrder: 1,
    isVisible: true,
    config: {
      badgeAr: 'الرسالة القيادية والموجهات الاستراتيجية',
      badgeEn: 'Executive Statement',
      titleAr: 'نحو مستقبل إنشائي وتنموي يتزامن مع مستهدفات رؤية المملكة 2030',
      titleEn: 'Towards an Advanced Construction Future Aligned with Saudi Vision 2030',
      contentAr: `> *"إن ما حققته شركة هضاب الخليج العربي للمقاولات من نجاحات متتالية ومشاريع سيادية ناجحة في مختلف مناطق المملكة لم يكن ليتأتى لولا توفيق الله ثم الالتزام الصارم بأعلى المعايير الهندسية والاعتماد على الكوادر الوطنية المؤهلة بأسطول متطور وأعلى معدلات الكفاءة التشغيلية."*

---

### 🏛️ التخطيط الهيكلي والجودة الإنشائية المستدامة
منذ انطلاقة الشركة ووفق سجلها التجاري الرسمي رقم \`1010720712\` والرقم الوطني الموحد \`7023600179\` ومقرها الرئيسي بالرياض، أخذنا على عاتقنا أن نكون الذراع التنفيذي الموثوق في مشاريع البنية التحتية، رصف الطرق، وشبكات تصريف مياه الأمطار والسيول. إننا نؤمن بأن الهندسة الحديثة ليست مجرد معدات وخرسانة، بل هي تخطيط دقيق ورؤية مستقبلية تؤسس لنمو حضري مستدام يخدم الأجيال القادمة.

### 📜 الجودة الشاملة والاعتمادات الدولية ISO
حرصت القيادة التنفيذية للشركة على بناء منظومة إدارة جودة متكاملة تُوجت بالحصول على 5 شهادات آيزو دولية مرادفة للتميز:
* **ISO 9001:2015** — نظام إدارة الجودة الشاملة في كافة مراحل التنفيذ والإشراف الميداني.
* **ISO 14001:2015** — نظام الإدارة البيئية لضمان الاستدامة وتقليل الأثر البيئي للمشاريع.
* **ISO 45001:2018** — نظام إدارة السلامة والصحة المهنية لحماية الكوادر والعمالة الميدانية.
* **ISO 26000** — المسؤولية المجتمعية والمساهمة الفاعلة في دعم المجتمع المحلي.
* **ISO 31000** — إدارة المخاطر الاستراتيجية والتشغيلية للمشاريع الكبرى.

### 🚜 الاستثمار في الأسطول الرقمي والقدرات التشغيلية
لضمان السرعة والدقة في تسليم العقود والمشاريع التنموية، قمنا بتنويع وتحديث أسطولنا الآلي المتكامل والذي يتجاوز **150 آليّة ومعدة ثقيلة** (شاملة مكائن كشط ومداحل الفرد والفرادات ومحطات تصنيع الخرسانة ومصانع الحواجز المسبقة الصنع كحواجز نيوجيرسي). يدار هذا الأسطول بنظم تتبع رقمية حديثة تضمن الاستجابة السريعة لمشاريع الأمانات والوزارات على مدار الساعة.

### 🇸🇦 التمكين الوطني ونسبة المحتوى المحلي (52.97%)
استجابةً للتوجهات الوطنية السامية، نفخر بحصول الشركة على شهادة المحتوى المحلي بنسبة **52.97%** (شهادة رقم \`216243\`)، والتي تجسد حرصنا المستمر على توطين الوظائف الهندسية والإدارية، وتفضيل المنتجات الوطنية والموردين المحاليين، وبناء شراكات موثوقة مع وزارة البلديات والإسكان، أمانة منطقة الرياض، أمانة منطقة القصيم، ووزارة الحرس الوطني.`,
      contentEn: `> *"The continuous milestones and landmark infrastructure projects delivered by Arabian Gulf Hills Contracting are driven by uncompromising engineering standards, continuous investment in specialized heavy machinery, and an empowered Saudi workforce."*

---

### 🏛️ Engineering Foundation & Urban Infrastructure
Since our foundation under Commercial Registration No. \`1010720712\` and Unified National ID \`7023600179\`, headquartered in Riyadh, we have dedicated our resources to delivering resilient infrastructure projects—spanning asphalt road paving, bulk earthworks, and stormwater drainage networks.

### 📜 Integrated Management Systems & ISO Accreditation
Under executive stewardship, the company established an integrated management system certified across 5 international standards:
* **ISO 9001:2015** — Quality Management Systems across site supervision and project execution.
* **ISO 14001:2015** — Environmental Management Systems safeguarding natural ecosystems.
* **ISO 45001:2018** — Occupational Health & Safety Systems ensuring zero-accident job sites.
* **ISO 26000** — Social Responsibility guiding community development initiatives.
* **ISO 31000** — Risk Management Frameworks securing complex municipal contracts.

### 🚜 Heavy Equipment Fleet & Digital Mobility
To guarantee timely delivery across large-scale public tenders, we operate a specialized heavy fleet exceeding **150 advanced machines**—including milling cold planers, asphalt pavers, pneumatic rollers, mobile batching plants, and precast New Jersey barrier production yards.

### 🇸🇦 National Empowerment & Local Content (52.97%)
In alignment with Saudi Vision 2030, we proudly achieved a **52.97% Local Content Score** (Certificate No. \`216243\`), reinforcing our commitment to localizing technical engineering talents and partnering with sovereign ministries and municipalities.`,
      align: 'right',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-chairman-pillars-user-exact',
    type: 'richText',
    sortOrder: 2,
    isVisible: true,
    config: {
      badgeAr: 'الركائز الاستراتيجية للقيادة',
      badgeEn: 'Executive Strategic Pillars',
      titleAr: 'الركائز الاستراتيجية لقيادة الشركة',
      titleEn: 'Four Strategic Pillars Driving Executive Growth',
      contentAr: `* **التميز الهندسي وضبط الجودة:** تطبيق الكود السعودي للبناء والتفتيش الدوري لضمان جودة الأداء وإطالة العمر الافتراضي للمشاريع.

* **التمكين الوطني والمحتوى المحلي:** رفع كفاءة الكادر الوطني والتوسع في توطين الصناعات الإنشائية بركيزة محتوى محلي تصل إلى 52.97%.

* **التحول الرقمي وإدارة الأسطول الذكي:** تتبع الأسطول لحظياً باستخدام تقنيات IoT وتحليل البيانات التشغيلية لتحقيق أعلى كفاءة فرد وكشط.

* **السلامة المهنية والاستدامة البيئية:** بيئة عمل آمنة خالية من الحوادث مع التدوير البيئي واستخدام المواد المعتمدة محلياً ودولياً.`,
      contentEn: `* **Engineering Excellence & Quality Control:** Adhering to Saudi Building Code and strict inspection to maximize asset lifespans.

* **National Empowerment & Local Content:** Elevating Saudi engineering cadres and optimizing local supply chains up to 52.97% local content ratio.

* **Digital Transformation & Fleet Intelligence:** Real-time IoT machinery tracking and operational data analytics ensuring maximum daily paving output.

* **Occupational Safety & Environmental Sustainability:** Zero-accident job sites utilizing recyclable eco-friendly construction materials.`,
      align: 'right',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-chairman-stats-1',
    type: 'statistics',
    sortOrder: 3,
    isVisible: true,
    config: BLOCK_REGISTRY.statistics.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-chairman-partners-1',
    type: 'partners',
    sortOrder: 4,
    isVisible: true,
    config: BLOCK_REGISTRY.partners.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-chairman-cta-1',
    type: 'cta',
    sortOrder: 5,
    isVisible: true,
    config: BLOCK_REGISTRY.cta.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 8. Team & Executive Leadership Page Blocks
const DEFAULT_TEAM_BLOCKS: ContentBlock[] = [
  {
    id: 'block-team-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: {
      tagAr: 'الكوادر الفنية والقيادية',
      tagEn: 'EXECUTIVE LEADERSHIP & ENGINEERING CADRES',
      titleAr: 'الهيكل الإداري والقيادة الفنية والتشغيلية',
      titleEn: 'Corporate Organizational Structure & Leadership',
      subtitleAr: 'فريق هندسي وإداري متكامل يمتلك خبرات عريقة في إدارة المشاريع السيادية وضبط الجودة واشتراطات السلامة.',
      subtitleEn: 'Experienced executive leaders and specialized engineers directing sovereign infrastructure contracts across KSA.',
      primaryCtaTextAr: 'تواصل مع القيادة التنفيذية',
      primaryCtaTextEn: 'Contact Leadership Desk',
      primaryCtaLink: '/contact',
      secondaryCtaTextAr: 'كلمة رئيس مجلس الإدارة',
      secondaryCtaTextEn: "Chairman's Address",
      secondaryCtaLink: '/chairman-message',
      bgImageUrl: '/images/hero-bg.webp',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-team-cta-1',
    type: 'cta',
    sortOrder: 1,
    isVisible: true,
    config: BLOCK_REGISTRY.cta.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 9. News & Media Center Page Blocks
const DEFAULT_NEWS_BLOCKS: ContentBlock[] = [
  {
    id: 'block-news-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: {
      tagAr: 'المركز الإعلامي والمستجدات',
      tagEn: 'MEDIA CENTER & NEWS UPDATES',
      titleAr: 'المركز الإعلامي والأخبار والمستجدات',
      titleEn: 'Corporate News & Milestone Achievements',
      subtitleAr: 'تابع آخر مستجدات وتغطيات إنجازات شركة هضاب الخليج العربي في مشاريع البنية التحتية وتحديثات الأسطول.',
      subtitleEn: 'Latest news, project completions, fleet expansion updates, and official press releases from Arabian Gulf Hills.',
      primaryCtaTextAr: 'تواصل مع المركز الإعلامي',
      primaryCtaTextEn: 'Media Contact',
      primaryCtaLink: '/contact',
      secondaryCtaTextAr: 'تحميل الكتالوج الرسمي',
      secondaryCtaTextEn: 'Corporate Profile',
      secondaryCtaLink: '/certificates',
      bgImageUrl: '/images/hero-bg.webp',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-news-cta-1',
    type: 'cta',
    sortOrder: 1,
    isVisible: true,
    config: BLOCK_REGISTRY.cta.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 10. Contact & RFQ Page Blocks
const DEFAULT_CONTACT_BLOCKS: ContentBlock[] = [
  {
    id: 'block-contact-hero-1',
    type: 'hero',
    sortOrder: 0,
    isVisible: true,
    config: {
      tagAr: 'قنوات التواصل المباشرة',
      tagEn: 'DIRECT CONTACT CHANNELS',
      titleAr: 'تواصل معنا لطلب عروض الأسعار والاستشارات',
      titleEn: 'Connect With Us for Inquiries & RFQ Tenders',
      subtitleAr: 'فريقنا الهندسي في إدارة المشاريع والمبيعات على أتم الاستعداد لخدمتكم وتقديم عروض الأسعار التنافسية لجميع مشاريع البنية التحتية.',
      subtitleEn: 'Our engineering project management and sales desk is ready to assist you with tailored quotations.',
      primaryCtaTextAr: 'الخط الساخن: 00966115126774',
      primaryCtaTextEn: 'Call Hotline',
      primaryCtaLink: 'tel:00966115126774',
      secondaryCtaTextAr: 'محادثة واتساب فورية',
      secondaryCtaTextEn: 'WhatsApp Chat',
      secondaryCtaLink: 'https://wa.me/966555123456',
      bgImageUrl: '/images/hero-bg.webp',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-contact-form-1',
    type: 'contactForm',
    sortOrder: 1,
    isVisible: true,
    config: BLOCK_REGISTRY.contactForm.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-contact-whatsapp-1',
    type: 'whatsapp',
    sortOrder: 2,
    isVisible: true,
    config: BLOCK_REGISTRY.whatsapp.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'block-contact-footer-1',
    type: 'footer',
    sortOrder: 3,
    isVisible: true,
    config: BLOCK_REGISTRY.footer.defaultConfig,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ----------------------------------------------------
// Initial Multi-Page Store (All 10 Public Pages)
// ----------------------------------------------------
const INITIAL_PAGES: ContentPage[] = [
  {
    id: 'page-home',
    slug: 'home',
    titleAr: 'الصفحة الرئيسية',
    titleEn: 'Corporate Home Page',
    template: 'home',
    status: 'published',
    publishedVersionId: 'ver-home-v1',
    draftVersionId: 'ver-home-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-about',
    slug: 'about',
    titleAr: 'عن الشركة (الرؤية والرسالة)',
    titleEn: 'About Us (Vision & Mission)',
    template: 'about',
    status: 'published',
    publishedVersionId: 'ver-about-v1',
    draftVersionId: 'ver-about-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-services',
    slug: 'services',
    titleAr: 'المجالات والخدمات الهندسية',
    titleEn: 'Engineering Services & Capabilities',
    template: 'services',
    status: 'published',
    publishedVersionId: 'ver-services-v1',
    draftVersionId: 'ver-services-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-projects',
    slug: 'projects',
    titleAr: 'معرض المشاريع والعقود الإنشائية',
    titleEn: 'Infrastructure Projects & Contracts',
    template: 'projects',
    status: 'published',
    publishedVersionId: 'ver-projects-v1',
    draftVersionId: 'ver-projects-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-equipment',
    slug: 'equipment',
    titleAr: 'أسطول الآليات والمعدات الثقيلة',
    titleEn: 'Heavy Equipment Fleet & Logistics',
    template: 'custom',
    status: 'published',
    publishedVersionId: 'ver-equipment-v1',
    draftVersionId: 'ver-equipment-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-certificates',
    slug: 'certificates',
    titleAr: 'مركز الاعتمادات والكتالوج الرسمي',
    titleEn: 'Corporate Licenses & Catalog Center',
    template: 'custom',
    status: 'published',
    publishedVersionId: 'ver-certificates-v1',
    draftVersionId: 'ver-certificates-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-chairman',
    slug: 'chairman-message',
    titleAr: 'كلمة رئيس مجلس الإدارة',
    titleEn: "Chairman's Message",
    template: 'custom',
    status: 'published',
    publishedVersionId: 'ver-chairman-v1',
    draftVersionId: 'ver-chairman-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-team',
    slug: 'team',
    titleAr: 'الهيكل الإداري والقيادة الفنية',
    titleEn: 'Executive Leadership & Engineering Team',
    template: 'team',
    status: 'published',
    publishedVersionId: 'ver-team-v1',
    draftVersionId: 'ver-team-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-news',
    slug: 'news',
    titleAr: 'المركز الإعلامي والأخبار',
    titleEn: 'Media Center & News',
    template: 'news',
    status: 'published',
    publishedVersionId: 'ver-news-v1',
    draftVersionId: 'ver-news-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-contact',
    slug: 'contact',
    titleAr: 'صفحة التواصل وطلب عروض الأسعار',
    titleEn: 'Contact & RFQ Inquiries',
    template: 'custom',
    status: 'published',
    publishedVersionId: 'ver-contact-v1',
    draftVersionId: 'ver-contact-draft',
    createdBy: 'admin@hedabkh.com.sa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_VERSIONS: Record<string, PageVersion> = {
  'ver-home-v1': {
    id: 'ver-home-v1',
    pageId: 'page-home',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد الأولي (Production V1.0)',
    titleEn: 'Initial Production Release V1.0',
    blocks: DEFAULT_HOME_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد التأسيسي للواجهة المرئية الرئيسية',
  },
  'ver-home-draft': {
    id: 'ver-home-draft',
    pageId: 'page-home',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة العمل للرئيسية',
    titleEn: 'Home Working Draft',
    blocks: JSON.parse(JSON.stringify(DEFAULT_HOME_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'تعديلات مسودة الصفحة الرئيسية',
  },
  'ver-about-v1': {
    id: 'ver-about-v1',
    pageId: 'page-about',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد لصفحة عن الشركة',
    titleEn: 'About Us Published V1.0',
    blocks: DEFAULT_ABOUT_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد لصفحة عن الشركة والرؤية والرسالة',
  },
  'ver-about-draft': {
    id: 'ver-about-draft',
    pageId: 'page-about',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة صفحة عن الشركة',
    titleEn: 'About Us Working Draft',
    blocks: JSON.parse(JSON.stringify(DEFAULT_ABOUT_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'مسودة عمل عن الشركة',
  },
  'ver-services-v1': {
    id: 'ver-services-v1',
    pageId: 'page-services',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد لصفحة الخدمات الهندسية',
    titleEn: 'Services Page Published V1.0',
    blocks: DEFAULT_SERVICES_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد لصفحة الخدمات واللوحة التشغيلية',
  },
  'ver-services-draft': {
    id: 'ver-services-draft',
    pageId: 'page-services',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة صفحة الخدمات الهندسية',
    titleEn: 'Services Page Working Draft',
    blocks: JSON.parse(JSON.stringify(DEFAULT_SERVICES_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'مسودة عمل صفحة الخدمات',
  },
  'ver-projects-v1': {
    id: 'ver-projects-v1',
    pageId: 'page-projects',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد لصفحة المشاريع والعقود',
    titleEn: 'Projects Page Published V1.0',
    blocks: DEFAULT_PROJECTS_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد لصفحة المشاريع وخريطة التغطية',
  },
  'ver-projects-draft': {
    id: 'ver-projects-draft',
    pageId: 'page-projects',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة صفحة المشاريع',
    titleEn: 'Projects Page Working Draft',
    blocks: JSON.parse(JSON.stringify(DEFAULT_PROJECTS_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'مسودة عمل صفحة المشاريع',
  },
  'ver-equipment-v1': {
    id: 'ver-equipment-v1',
    pageId: 'page-equipment',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد لصفحة أسطول الآليات',
    titleEn: 'Equipment Fleet Published V1.0',
    blocks: DEFAULT_EQUIPMENT_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد لصفحة أسطول الآليات واللوجستيات',
  },
  'ver-equipment-draft': {
    id: 'ver-equipment-draft',
    pageId: 'page-equipment',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة صفحة أسطول الآليات',
    titleEn: 'Equipment Fleet Working Draft',
    blocks: JSON.parse(JSON.stringify(DEFAULT_EQUIPMENT_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'مسودة عمل صفحة الأسطول',
  },
  'ver-certificates-v1': {
    id: 'ver-certificates-v1',
    pageId: 'page-certificates',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد لمركز الكتالوجات والاعتمادات',
    titleEn: 'Certificates Center Published V1.0',
    blocks: DEFAULT_CERTIFICATES_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد لصفحة الاعتمادات والتراخيص السيادية',
  },
  'ver-certificates-draft': {
    id: 'ver-certificates-draft',
    pageId: 'page-certificates',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة مركز الكتالوجات والاعتمادات',
    titleEn: 'Certificates Center Working Draft',
    blocks: JSON.parse(JSON.stringify(DEFAULT_CERTIFICATES_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'مسودة عمل مركز الاعتمادات والكتالوجات',
  },
  'ver-chairman-v1': {
    id: 'ver-chairman-v1',
    pageId: 'page-chairman',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد لكلمة رئيس المجلس',
    titleEn: "Chairman Message Published V1.0",
    blocks: DEFAULT_CHAIRMAN_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد لكلمة رئيس مجلس الإدارة',
  },
  'ver-chairman-draft': {
    id: 'ver-chairman-draft',
    pageId: 'page-chairman',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة كلمة رئيس المجلس',
    titleEn: "Chairman Message Working Draft",
    blocks: JSON.parse(JSON.stringify(DEFAULT_CHAIRMAN_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'مسودة عمل كلمة رئيس المجلس',
  },
  'ver-team-v1': {
    id: 'ver-team-v1',
    pageId: 'page-team',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد لصفحة الهيكل الإداري',
    titleEn: 'Team Page Published V1.0',
    blocks: DEFAULT_TEAM_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد لصفحة الفريق والهيكل الإداري',
  },
  'ver-team-draft': {
    id: 'ver-team-draft',
    pageId: 'page-team',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة صفحة الهيكل الإداري',
    titleEn: 'Team Page Working Draft',
    blocks: JSON.parse(JSON.stringify(DEFAULT_TEAM_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'مسودة عمل صفحة الهيكل الإداري',
  },
  'ver-news-v1': {
    id: 'ver-news-v1',
    pageId: 'page-news',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد لصفحة المركز الإعلامي',
    titleEn: 'News Page Published V1.0',
    blocks: DEFAULT_NEWS_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد لصفحة الأخبار والمركز الإعلامي',
  },
  'ver-news-draft': {
    id: 'ver-news-draft',
    pageId: 'page-news',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة صفحة المركز الإعلامي',
    titleEn: 'News Page Working Draft',
    blocks: JSON.parse(JSON.stringify(DEFAULT_NEWS_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'مسودة عمل صفحة المركز الإعلامي',
  },
  'ver-contact-v1': {
    id: 'ver-contact-v1',
    pageId: 'page-contact',
    versionNumber: 1,
    state: 'published',
    titleAr: 'الإصدار المعتمد لصفحة التواصل',
    titleEn: 'Contact Page Published V1.0',
    blocks: DEFAULT_CONTACT_BLOCKS,
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    changeNote: 'الإصدار المعتمد لصفحة التواصل والـ RFQ',
  },
  'ver-contact-draft': {
    id: 'ver-contact-draft',
    pageId: 'page-contact',
    versionNumber: 2,
    state: 'draft',
    titleAr: 'مسودة صفحة التواصل',
    titleEn: 'Contact Working Draft',
    blocks: JSON.parse(JSON.stringify(DEFAULT_CONTACT_BLOCKS)),
    createdBy: 'مدير النظام',
    createdAt: new Date().toISOString(),
    publishedAt: null,
    changeNote: 'مسودة عمل صفحة التواصل',
  },
};

// ----------------------------------------------------
// Content Locks Interface & Store
// ----------------------------------------------------
export interface ContentLock {
  pageId: string;
  userId: string;
  userName: string;
  token: string;
  acquiredAt: string;
  expiresAt: number;
}

const STORAGE_KEYS = {
  PAGES: 'gulf_hills_cms_pages',
  VERSIONS: 'gulf_hills_cms_versions',
  LOCKS: 'gulf_hills_cms_locks',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

const memoryStore: Record<string, string> = {};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = isBrowser() ? localStorage.getItem(key) : memoryStore[key];
    if (!raw) {
      const serialized = JSON.stringify(defaultValue);
      if (isBrowser()) localStorage.setItem(key, serialized);
      else memoryStore[key] = serialized;
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    if (isBrowser()) localStorage.setItem(key, serialized);
    else memoryStore[key] = serialized;
  } catch (err) {
    console.error('ContentEngine save error:', err);
  }
}

export const contentEngine = {
  // --- Pages ---
  getPages: (): ContentPage[] => {
    const stored = getItem<ContentPage[]>(STORAGE_KEYS.PAGES, INITIAL_PAGES);
    const existingIds = new Set(stored.map((p) => p.id));
    let updated = false;

    // Auto-merge all seed pages into stored list
    for (const initPage of INITIAL_PAGES) {
      if (!existingIds.has(initPage.id)) {
        stored.push(initPage);
        existingIds.add(initPage.id);
        updated = true;
      }
    }

    if (updated) {
      setItem(STORAGE_KEYS.PAGES, stored);
    }
    return stored;
  },

  getPageBySlug: (slug: string): ContentPage | undefined => {
    const pages = contentEngine.getPages();
    return pages.find((p) => p.slug === slug);
  },

  getPageById: (id: string): ContentPage | undefined => {
    const pages = contentEngine.getPages();
    return pages.find((p) => p.id === id);
  },

  // --- Versions ---
  getVersions: (): Record<string, PageVersion> => {
    const stored = getItem<Record<string, PageVersion>>(STORAGE_KEYS.VERSIONS, INITIAL_VERSIONS);
    let updated = false;

    // Auto-merge all seed versions into stored record
    for (const [key, ver] of Object.entries(INITIAL_VERSIONS)) {
      if (!stored[key]) {
        stored[key] = ver;
        updated = true;
      }
    }

    if (updated) {
      setItem(STORAGE_KEYS.VERSIONS, stored);
    }
    return stored;
  },

  getVersionById: (versionId: string): PageVersion | undefined => {
    const versions = contentEngine.getVersions();
    return versions[versionId];
  },

  getDraftVersion: (pageId: string): PageVersion => {
    const page = contentEngine.getPageById(pageId);
    const versions = contentEngine.getVersions();

    if (page?.draftVersionId && versions[page.draftVersionId]) {
      const ver = versions[page.draftVersionId];
      if (pageId === 'page-about' && (!ver.blocks.some(b => b.id === 'block-about-overview-1') || ver.blocks.some(b => b.id === 'block-about-vision-user-exact'))) {
        ver.blocks = JSON.parse(JSON.stringify(DEFAULT_ABOUT_BLOCKS));
        versions[page.draftVersionId] = ver;
        setItem(STORAGE_KEYS.VERSIONS, versions);
      }
      if (pageId === 'page-chairman' && !ver.blocks.some(b => b.id === 'block-chairman-statement-user-exact')) {
        ver.blocks = JSON.parse(JSON.stringify(DEFAULT_CHAIRMAN_BLOCKS));
        versions[page.draftVersionId] = ver;
        setItem(STORAGE_KEYS.VERSIONS, versions);
      }
      return ver;
    }

    // Default blocks based on page
    let fallbackBlocks = DEFAULT_HOME_BLOCKS;
    if (pageId === 'page-about') fallbackBlocks = DEFAULT_ABOUT_BLOCKS;
    else if (pageId === 'page-services') fallbackBlocks = DEFAULT_SERVICES_BLOCKS;
    else if (pageId === 'page-projects') fallbackBlocks = DEFAULT_PROJECTS_BLOCKS;
    else if (pageId === 'page-equipment') fallbackBlocks = DEFAULT_EQUIPMENT_BLOCKS;
    else if (pageId === 'page-certificates') fallbackBlocks = DEFAULT_CERTIFICATES_BLOCKS;
    else if (pageId === 'page-chairman') fallbackBlocks = DEFAULT_CHAIRMAN_BLOCKS;
    else if (pageId === 'page-team') fallbackBlocks = DEFAULT_TEAM_BLOCKS;
    else if (pageId === 'page-news') fallbackBlocks = DEFAULT_NEWS_BLOCKS;
    else if (pageId === 'page-contact') fallbackBlocks = DEFAULT_CONTACT_BLOCKS;

    const published = page?.publishedVersionId ? versions[page.publishedVersionId] : null;
    const newDraftId = `ver-${pageId}-draft-${Date.now()}`;
    const newDraft: PageVersion = {
      id: newDraftId,
      pageId,
      versionNumber: (published?.versionNumber || 0) + 1,
      state: 'draft',
      titleAr: `مسودة عمل جديدة (${page?.titleAr || pageId})`,
      titleEn: `Working Draft (${page?.titleEn || pageId})`,
      blocks: published ? JSON.parse(JSON.stringify(published.blocks)) : JSON.parse(JSON.stringify(fallbackBlocks)),
      createdBy: 'مدير النظام',
      createdAt: new Date().toISOString(),
      publishedAt: null,
    };

    versions[newDraftId] = newDraft;
    setItem(STORAGE_KEYS.VERSIONS, versions);

    if (page) {
      page.draftVersionId = newDraftId;
      const pages = contentEngine.getPages().map((p) => (p.id === pageId ? page : p));
      setItem(STORAGE_KEYS.PAGES, pages);
    }

    return newDraft;
  },

  getPublishedVersion: (pageId: string): PageVersion => {
    const page = contentEngine.getPageById(pageId);
    const versions = contentEngine.getVersions();

    if (page?.publishedVersionId && versions[page.publishedVersionId]) {
      const ver = versions[page.publishedVersionId];
      if (pageId === 'page-home' && !ver.blocks.some(b => b.id === 'block-home-about-1')) {
        ver.blocks = JSON.parse(JSON.stringify(DEFAULT_HOME_BLOCKS));
        versions[page.publishedVersionId] = ver;
        setItem(STORAGE_KEYS.VERSIONS, versions);
      }
      if (pageId === 'page-about' && (!ver.blocks.some(b => b.id === 'block-about-overview-1') || ver.blocks.some(b => b.id === 'block-about-vision-user-exact'))) {
        ver.blocks = JSON.parse(JSON.stringify(DEFAULT_ABOUT_BLOCKS));
        versions[page.publishedVersionId] = ver;
        setItem(STORAGE_KEYS.VERSIONS, versions);
      }
      if (pageId === 'page-chairman' && !ver.blocks.some(b => b.id === 'block-chairman-statement-user-exact')) {
        ver.blocks = JSON.parse(JSON.stringify(DEFAULT_CHAIRMAN_BLOCKS));
        versions[page.publishedVersionId] = ver;
        setItem(STORAGE_KEYS.VERSIONS, versions);
      }
      return ver;
    }

    const fallbackKey = `ver-${pageId.replace('page-', '')}-v1`;
    return versions[fallbackKey] || INITIAL_VERSIONS[fallbackKey] || INITIAL_VERSIONS['ver-home-v1'];
  },

  // --- Content Locks (Concurrency Protection) ---
  getLocks: (): Record<string, ContentLock> => {
    return getItem<Record<string, ContentLock>>(STORAGE_KEYS.LOCKS, {});
  },

  acquireLock: (pageId: string, userId: string, userName: string): { acquired: boolean; currentLock?: ContentLock } => {
    const locks = contentEngine.getLocks();
    const existing = locks[pageId];
    const now = Date.now();

    if (existing && existing.userId !== userId && existing.expiresAt > now) {
      return { acquired: false, currentLock: existing };
    }

    const newLock: ContentLock = {
      pageId,
      userId,
      userName,
      token: `lock-${userId}-${Date.now()}`,
      acquiredAt: new Date().toISOString(),
      expiresAt: now + 15 * 60 * 1000,
    };

    locks[pageId] = newLock;
    setItem(STORAGE_KEYS.LOCKS, locks);
    return { acquired: true, currentLock: newLock };
  },

  releaseLock: (pageId: string, userId: string): boolean => {
    const locks = contentEngine.getLocks();
    const existing = locks[pageId];

    if (!existing || existing.userId === userId || existing.expiresAt <= Date.now()) {
      delete locks[pageId];
      setItem(STORAGE_KEYS.LOCKS, locks);
      return true;
    }
    return false;
  },

  // --- Block Operations on Draft ---
  saveDraft: (pageId: string, blocks: ContentBlock[], changeNote?: string): PageVersion => {
    const versions = contentEngine.getVersions();
    const draft = contentEngine.getDraftVersion(pageId);

    draft.blocks = blocks.map((b, idx) => ({ ...b, sortOrder: idx, updatedAt: new Date().toISOString() }));
    if (changeNote) draft.changeNote = changeNote;
    draft.createdAt = new Date().toISOString();

    versions[draft.id] = draft;
    setItem(STORAGE_KEYS.VERSIONS, versions);
    return draft;
  },

  addBlockToDraft: (pageId: string, blockType: BlockType): ContentBlock => {
    const draft = contentEngine.getDraftVersion(pageId);
    const blockDef = BLOCK_REGISTRY[blockType];

    const newBlock: ContentBlock = {
      id: `block-${blockType}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: blockType,
      sortOrder: draft.blocks.length,
      isVisible: true,
      config: JSON.parse(JSON.stringify(blockDef.defaultConfig)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    draft.blocks.push(newBlock);
    contentEngine.saveDraft(pageId, draft.blocks);
    return newBlock;
  },

  updateBlockInDraft: (pageId: string, blockId: string, configUpdates: Record<string, any>): ContentBlock | null => {
    const draft = contentEngine.getDraftVersion(pageId);
    const targetBlock = draft.blocks.find((b) => b.id === blockId);

    if (!targetBlock) return null;

    targetBlock.config = { ...targetBlock.config, ...configUpdates };
    targetBlock.updatedAt = new Date().toISOString();

    contentEngine.saveDraft(pageId, draft.blocks);
    return targetBlock;
  },

  removeBlockFromDraft: (pageId: string, blockId: string): boolean => {
    const draft = contentEngine.getDraftVersion(pageId);
    const filtered = draft.blocks.filter((b) => b.id !== blockId);

    if (filtered.length === draft.blocks.length) return false;

    contentEngine.saveDraft(pageId, filtered);
    return true;
  },

  reorderBlocksInDraft: (pageId: string, startIndex: number, endIndex: number): ContentBlock[] => {
    const draft = contentEngine.getDraftVersion(pageId);
    const blocks = [...draft.blocks];
    const [removed] = blocks.splice(startIndex, 1);
    blocks.splice(endIndex, 0, removed);

    contentEngine.saveDraft(pageId, blocks);
    return blocks;
  },

  // --- Publish, Review & Schedule ---
  submitForReview: (pageId: string, reviewerNote?: string): { success: boolean; draftVersion: PageVersion } => {
    const page = contentEngine.getPageById(pageId);
    if (!page) throw new Error('Page not found');

    const draft = contentEngine.getDraftVersion(pageId);
    const versions = contentEngine.getVersions();

    draft.state = 'review';
    if (reviewerNote) draft.changeNote = reviewerNote;
    draft.createdAt = new Date().toISOString();

    versions[draft.id] = draft;
    setItem(STORAGE_KEYS.VERSIONS, versions);

    page.status = 'review';
    page.reviewRequestedBy = 'محرر النظام';
    page.reviewRequestedAt = new Date().toISOString();
    page.updatedAt = new Date().toISOString();

    const pages = contentEngine.getPages().map((p) => (p.id === pageId ? page : p));
    setItem(STORAGE_KEYS.PAGES, pages);

    return { success: true, draftVersion: draft };
  },

  schedulePublish: (pageId: string, scheduledDate: string, publishNote?: string): { success: boolean; page: ContentPage } => {
    const page = contentEngine.getPageById(pageId);
    if (!page) throw new Error('Page not found');

    const draft = contentEngine.getDraftVersion(pageId);
    const versions = contentEngine.getVersions();

    draft.scheduledPublishAt = scheduledDate;
    if (publishNote) draft.changeNote = publishNote;
    versions[draft.id] = draft;
    setItem(STORAGE_KEYS.VERSIONS, versions);

    page.scheduledPublishAt = scheduledDate;
    page.updatedAt = new Date().toISOString();

    const pages = contentEngine.getPages().map((p) => (p.id === pageId ? page : p));
    setItem(STORAGE_KEYS.PAGES, pages);

    return { success: true, page };
  },

  publishDraft: (pageId: string, publishNote?: string): { success: boolean; publishedVersion: PageVersion } => {
    const page = contentEngine.getPageById(pageId);
    if (!page) throw new Error('Page not found');

    const draft = contentEngine.getDraftVersion(pageId);
    const versions = contentEngine.getVersions();

    const newVersionNumber = (page.publishedVersionId ? versions[page.publishedVersionId]?.versionNumber || 1 : 1) + 1;
    const newPublishedId = `ver-${pageId}-v${newVersionNumber}-${Date.now()}`;

    const publishedRecord: PageVersion = {
      id: newPublishedId,
      pageId,
      versionNumber: newVersionNumber,
      state: 'published',
      titleAr: `الإصدار المعتمد v${newVersionNumber} (${page.titleAr})`,
      titleEn: `Published Release v${newVersionNumber} (${page.titleEn})`,
      blocks: JSON.parse(JSON.stringify(draft.blocks)),
      createdBy: 'مدير النظام',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      scheduledPublishAt: null,
      changeNote: publishNote || `تم نشر وتثبيت إصدار صفحة [${page.titleAr}] بنجاح للجمهور`,
    };

    versions[newPublishedId] = publishedRecord;
    setItem(STORAGE_KEYS.VERSIONS, versions);

    page.publishedVersionId = newPublishedId;
    page.status = 'published';
    page.scheduledPublishAt = null;
    page.reviewRequestedBy = null;
    page.reviewRequestedAt = null;
    page.updatedAt = new Date().toISOString();

    const pages = contentEngine.getPages().map((p) => (p.id === pageId ? page : p));
    setItem(STORAGE_KEYS.PAGES, pages);

    return { success: true, publishedVersion: publishedRecord };
  },

  rollbackToVersion: (pageId: string, versionId: string): { success: boolean; restoredVersion: PageVersion } => {
    const targetVersion = contentEngine.getVersionById(versionId);
    if (!targetVersion) throw new Error('Target version not found');

    const page = contentEngine.getPageById(pageId);
    if (!page) throw new Error('Page not found');

    const versions = contentEngine.getVersions();
    const currentPublished = page.publishedVersionId ? versions[page.publishedVersionId] : null;
    const newVersionNumber = (currentPublished?.versionNumber || 1) + 1;
    const rollbackVersionId = `ver-${pageId}-v${newVersionNumber}-rollback-${Date.now()}`;

    const newPublished: PageVersion = {
      id: rollbackVersionId,
      pageId,
      versionNumber: newVersionNumber,
      state: 'published',
      titleAr: `استرجاع إلى الإصدار v${targetVersion.versionNumber}`,
      titleEn: `Rollback to Release v${targetVersion.versionNumber}`,
      blocks: JSON.parse(JSON.stringify(targetVersion.blocks)),
      createdBy: 'مدير النظام',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      changeNote: `استرجاع آمن من النسخة السابقة (${targetVersion.titleAr})`,
    };

    versions[rollbackVersionId] = newPublished;
    setItem(STORAGE_KEYS.VERSIONS, versions);

    page.publishedVersionId = rollbackVersionId;
    page.status = 'published';
    page.updatedAt = new Date().toISOString();

    contentEngine.saveDraft(pageId, newPublished.blocks, `مزامنة المسودة بعد الاسترجاع للإصدار v${targetVersion.versionNumber}`);

    const pages = contentEngine.getPages().map((p) => (p.id === pageId ? page : p));
    setItem(STORAGE_KEYS.PAGES, pages);

    return { success: true, restoredVersion: newPublished };
  },

  getPageHistory: (pageId: string): PageVersion[] => {
    const versions = contentEngine.getVersions();
    return Object.values(versions)
      .filter((v) => v.pageId === pageId && v.publishedAt)
      .sort((a, b) => b.versionNumber - a.versionNumber);
  },
};
