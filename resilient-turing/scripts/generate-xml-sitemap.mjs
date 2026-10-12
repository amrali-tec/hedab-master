import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const baseUrl = 'https://hedabkh.com.sa';
const today = new Date().toISOString().split('T')[0];

// 1. Static Pages Definition
const staticPages = [
  {
    path: '',
    changefreq: 'daily',
    priority: '1.0',
    arTitle: 'شركة هضاب الخليج للمقاولات | الصفحة الرئيسية',
    enTitle: 'Gulf Hills Contracting | Home Page',
    arDesc: 'شركة رائدة ومصنفة سيادياً في مقاولات الطرق والجسور وتصريف السيول والمباني الحكومية في المملكة العربية السعودية',
    enDesc: 'Leading sovereign-classified general contracting firm for roads, bridges, stormwater networks & public facilities in Saudi Arabia',
    image: '/images/hero-bg.webp'
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: '0.85',
    arTitle: 'من نحن - نبذة عن شركة هضاب الخليج للمقاولات',
    enTitle: 'About Us - Gulf Hills Contracting Corporate Profile',
    arDesc: 'تعرف على تاريخ هضاب الخليج، رؤيتنا، رسالتنا، وقيمنا في قيادة قطاع المقاولات والبنية التحتية في المملكة',
    enDesc: 'Learn about Gulf Hills history, vision, mission and values leading infrastructure and contracting in Saudi Arabia',
    image: '/images/about/about-hero.jpg'
  },
  {
    path: '/chairman-message',
    changefreq: 'monthly',
    priority: '0.80',
    arTitle: 'كلمة رئيس مجلس الإدارة | هضاب الخليج',
    enTitle: 'Chairman Message | Gulf Hills Contracting',
    arDesc: 'رسالة رئيس مجلس الإدارة حول التزامنا بدعم مسيرة التنمية وتحقيق مستهدفات رؤية المملكة 2030',
    enDesc: 'Chairman statement emphasizing commitment to Saudi Vision 2030 and sustainable construction development',
    image: '/images/about/chairman.jpg'
  },
  {
    path: '/services',
    changefreq: 'weekly',
    priority: '0.95',
    arTitle: 'خدماتنا الهندسية والمقاولات المتخصصة | هضاب الخليج',
    enTitle: 'Specialized Engineering & Contracting Services | Gulf Hills',
    arDesc: 'تشغيل وصيانة المباني الحكومية، تصريف السيول، كشط وسفلتة الطرق، حواجز نيوجيرسي، ونقل الهدميات',
    enDesc: 'Public building maintenance, stormwater drainage networks, asphalt paving, New Jersey barriers and debris removal',
    image: '/images/services/services-hero.jpg'
  },
  {
    path: '/projects',
    changefreq: 'weekly',
    priority: '0.95',
    arTitle: 'سجل المشاريع المنجزة والجارية | هضاب الخليج',
    enTitle: 'National Projects Portfolio | Gulf Hills Contracting',
    arDesc: 'استعرض أكثر من 25 مشروعاً سيادياً منجزاً وجارياً لصالح وزارات وأمانات المملكة العربية السعودية',
    enDesc: 'Explore 25+ sovereign completed and ongoing projects for Saudi ministries and municipal secretariats',
    image: '/images/projects/projects-hero.jpg'
  },
  {
    path: '/equipment',
    changefreq: 'weekly',
    priority: '0.85',
    arTitle: 'أسطول المعدات والآليات الثقيلة | هضاب الخليج',
    enTitle: 'Heavy Equipment Fleet & Machinery | Gulf Hills Contracting',
    arDesc: 'أسطول متطور يضم كاشطات فيرتغن، شاحنات أكتروس، مداحل، حفارات كوماتسو وكاتربيلر لضمان سرعة الإنجاز',
    enDesc: 'Advanced fleet including Wirtgen cold millers, Actros tippers, Komatsu & CAT heavy excavators',
    image: '/images/equipment/fleet-hero.jpg'
  },
  {
    path: '/certificates',
    changefreq: 'monthly',
    priority: '0.85',
    arTitle: 'الشهادات والاعتمادات والتصنيف السيادي | هضاب الخليج',
    enTitle: 'Certifications, Accreditations & Sovereign Classifications | Gulf Hills',
    arDesc: 'شهادات الآيزو ISO 9001, ISO 14001, ISO 45001 وتصنيف المقاولين المعتمد لدى وزارة الشؤون البلدية والقروية',
    enDesc: 'ISO 9001, ISO 14001, ISO 45001 certifications and official Saudi MOMRA contractor classification',
    image: '/images/certificates/iso-certificates.jpg'
  },
  {
    path: '/team',
    changefreq: 'monthly',
    priority: '0.75',
    arTitle: 'فريق العمل والقيادة التنفيذية | هضاب الخليج',
    enTitle: 'Executive Leadership & Team | Gulf Hills Contracting',
    arDesc: 'نخبة من المهندسين والاستشاريين والخبراء التنفيذيين لقيادة أكبر مشاريع البنية التحتية في المملكة',
    enDesc: 'Elite team of project directors, certified engineers and operational executives',
    image: '/images/team/team-hero.jpg'
  },
  {
    path: '/news',
    changefreq: 'weekly',
    priority: '0.85',
    arTitle: 'المركز الإعلامي وآخر الأخبار | هضاب الخليج',
    enTitle: 'Media Center & Latest Industry News | Gulf Hills Contracting',
    arDesc: 'أحدث التغطيات الإخبارية، تقارير الإنجاز، ومقالات البنية التحتية والمقاولات في المملكة العربية السعودية',
    enDesc: 'Latest news releases, project handover reports and technical infrastructure articles',
    image: '/images/news/news-hero.jpg'
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: '0.85',
    arTitle: 'اتصل بنا وقنوات التواصل | هضاب الخليج',
    enTitle: 'Contact Us & Corporate Inquiries | Gulf Hills Contracting',
    arDesc: 'تواصل مع المقر الرئيسي في الرياض لطلب العروض، الاستفسارات الهندسية والشراكات الاستراتيجية',
    enDesc: 'Connect with Gulf Hills Riyadh headquarters for RFP inquiries and strategic partnerships',
    image: '/images/contact/contact-hero.jpg'
  }
];

// 2. All 25 Projects
const projects = [
  {
    id: 'proj-1',
    arTitle: 'تشغيل وصيانة مقابر المسلمين بمدينة الرياض',
    enTitle: 'Operation and Maintenance of Muslim Cemeteries in Riyadh City',
    image: '/images/projects/project-1.jpg',
    lastmod: '2026-09-01'
  },
  {
    id: 'proj-2',
    arTitle: 'صيانة الشوارع نطاق بلدية شرق بريدة',
    enTitle: 'Street Maintenance - East Buraidah Municipality Scope',
    image: '/images/projects/project-2.jpg',
    lastmod: '2026-09-01'
  },
  {
    id: 'proj-3',
    arTitle: 'معالجة بلاغات 940 والتشوهات البصرية شمال مدينة بريدة',
    enTitle: 'Handling 940 Emergency Reports & Visual Distortion Removal - North Buraidah',
    image: '/images/projects/project-3.jpg',
    lastmod: '2026-08-25'
  },
  {
    id: 'proj-4',
    arTitle: 'إعادة تهيئة خزانات مياه الصرف الصحي ومياه الأمطار ومياه الشرب بالشؤون الصحية بالرياض بوزارة الحرس الوطني',
    enTitle: 'Rehabilitation of Sewage, Stormwater & Potable Water Tanks - National Guard Health Affairs Riyadh',
    image: '/images/projects/project-4.jpg',
    lastmod: '2026-08-20'
  },
  {
    id: 'proj-5',
    arTitle: 'تشغيل وصيانة مباني ومرافق بلدية محافظة الخرج',
    enTitle: 'Operation and Maintenance of Buildings & Facilities - Al-Kharj Municipality',
    image: '/images/projects/project-5.jpg',
    lastmod: '2026-08-20'
  },
  {
    id: 'proj-6',
    arTitle: 'تشغيل وصيانة مقبرة غير المسلمين بمدينة الرياض',
    enTitle: 'Operation and Maintenance of Non-Muslim Cemetery in Riyadh City',
    image: '/images/projects/project-6.jpg',
    lastmod: '2026-08-20'
  },
  {
    id: 'proj-7',
    arTitle: 'إزالة عناصر التشوه البصري بالمحاور الرئيسية بمدينة الرياض',
    enTitle: 'Removal of Visual Pollution on Main Arterial Corridors in Riyadh City',
    image: '/images/projects/project-7.jpg',
    lastmod: '2026-08-15'
  },
  {
    id: 'proj-8',
    arTitle: 'صيانة وتشغيل شبكات تصريف السيول والمياه الأرضية بمدينة الرياض نطاق بلدية العزيزية',
    enTitle: 'Maintenance and Operation of Stormwater & Groundwater Drainage Networks - Al-Aziziyah Municipality Scope',
    image: '/images/projects/project-8.jpg',
    lastmod: '2026-08-15'
  },
  {
    id: 'proj-9',
    arTitle: 'صيانة وتشغيل شبكات تصريف السيول والمياه الأرضية بمدينة الرياض نطاق بلدية الشفا والحائر',
    enTitle: 'Maintenance and Operation of Stormwater & Groundwater Drainage Networks - Al-Shifa & Al-Haer Municipalities Scope',
    image: '/images/projects/project-9.jpg',
    lastmod: '2026-08-15'
  },
  {
    id: 'proj-10',
    arTitle: 'نقل وترحيل السيارات المهملة داخل أحياء مدينة الرياض',
    enTitle: 'Transport and Removal of Abandoned Vehicles within Riyadh City Neighborhoods',
    image: '/images/projects/project-10.jpg',
    lastmod: '2026-08-10'
  },
  {
    id: 'proj-11',
    arTitle: 'تنفيذ أعمال سفلتة وأرصفة بمخططات شمال الرياض',
    enTitle: 'Asphalt Paving & Sidewalk Execution in North Riyadh Land Subdivisions',
    image: '/images/projects/project-11.jpg',
    lastmod: '2026-08-10'
  },
  {
    id: 'proj-12',
    arTitle: 'إنشاء قنوات تصريف مياه الأمطار الرئيسية بوادي حنيفة',
    enTitle: 'Construction of Main Stormwater Drainage Channels in Wadi Hanifa',
    image: '/images/projects/project-12.jpg',
    lastmod: '2026-08-10'
  },
  {
    id: 'proj-13',
    arTitle: 'تأهيل وتطوير البنية التحتية للمنطقة الصناعية الثانية بالرياض',
    enTitle: 'Infrastructure Rehabilitation & Upgrading of Second Industrial City in Riyadh',
    image: '/images/projects/project-13.jpg',
    lastmod: '2026-08-05'
  },
  {
    id: 'proj-14',
    arTitle: 'توريد وتركيب حواجز نيوجيرسي الخرسانية على طريق الدائري الشرقي',
    enTitle: 'Supply & Installation of Precast Concrete New Jersey Barriers on Eastern Ring Road',
    image: '/images/projects/project-14.jpg',
    lastmod: '2026-08-05'
  },
  {
    id: 'proj-15',
    arTitle: 'صيانة وتأهيل إنارة الشوارع بنطاق بلدية الروضة',
    enTitle: 'Street Lighting Maintenance & LED Upgrades - Al-Rawdah Municipality',
    image: '/images/projects/project-15.jpg',
    lastmod: '2026-08-05'
  },
  {
    id: 'proj-16',
    arTitle: 'أعمال الحفر وتمديد شبكات تصريف المياه السطحية بغرب الرياض',
    enTitle: 'Excavation and Surface Water Network Extension in West Riyadh',
    image: '/images/projects/project-16.jpg',
    lastmod: '2026-08-01'
  },
  {
    id: 'proj-17',
    arTitle: 'إعادة كشط ورصف تقاطعات طريق الملك فهد',
    enTitle: 'Milling and Re-asphalting of Intersections on King Fahd Road',
    image: '/images/projects/project-17.jpg',
    lastmod: '2026-08-01'
  },
  {
    id: 'proj-18',
    arTitle: 'تشغيل وصيانة شبكات المياه والمرافق بالقصيم',
    enTitle: 'Operation and Maintenance of Water Networks & Public Utilities in Qassim',
    image: '/images/projects/project-18.jpg',
    lastmod: '2026-08-01'
  },
  {
    id: 'proj-19',
    arTitle: 'إنشاء عبارات تصريف السيول الخرسانية بطريق الخرج القديم',
    enTitle: 'Construction of Precast Concrete Stormwater Culverts on Old Al-Kharj Road',
    image: '/images/projects/project-19.jpg',
    lastmod: '2026-07-28'
  },
  {
    id: 'proj-20',
    arTitle: 'أعمال تسوية الأراضي وإزالة الهدميات بمخططات الخير',
    enTitle: 'Land Grading & Debris Removal in Al-Khair Masterplans',
    image: '/images/projects/project-20.jpg',
    lastmod: '2026-07-28'
  },
  {
    id: 'proj-21',
    arTitle: 'صيانة وتأهيل الأرصفة وممرات المشاة بوسط الرياض',
    enTitle: 'Maintenance & Paving of Pedestrian Walkways & Curbs in Downtown Riyadh',
    image: '/images/projects/project-21.jpg',
    lastmod: '2026-07-25'
  },
  {
    id: 'proj-22',
    arTitle: 'تركيب مصائد الأمطار ومضخات خفض المنسوب بنفق ديراب',
    enTitle: 'Installation of Stormwater Inlets & Dewatering Pumps at Dirab Underpass',
    image: '/images/projects/project-22.jpg',
    lastmod: '2026-07-25'
  },
  {
    id: 'proj-23',
    arTitle: 'تنفيذ أعمال الإنترلوك والبردورات بمشاريع جودة الحياة ببريدة',
    enTitle: 'Interlock and Curbstone Installation for Quality of Life Projects in Buraidah',
    image: '/images/projects/project-23.jpg',
    lastmod: '2026-07-20'
  },
  {
    id: 'proj-24',
    arTitle: 'مشروع صيانة المرافق البلدية والساحات العامة بالخرج',
    enTitle: 'Municipal Facilities & Public Plazas Maintenance Project in Al-Kharj',
    image: '/images/projects/project-24.jpg',
    lastmod: '2026-07-20'
  },
  {
    id: 'proj-25',
    arTitle: 'مشروع درء أخطار السيول وتصريف مياه الأمطار بجنوب الرياض',
    enTitle: 'Flood Mitigation and Stormwater Drainage Master Project in South Riyadh',
    image: '/images/projects/project-25.jpg',
    lastmod: '2026-07-15'
  }
];

// 3. News / Articles
const articles = [
  {
    slug: 'riyadh-infrastructure-road-paving-2026',
    arTitle: 'هضاب الخليج تعلن إنجاز 75% من أعمال إعادة سفلتة وتأهيل المحاور الرئيسية بمدينة الرياض',
    enTitle: 'Gulf Hills Announces 75% Completion of Road Rehabilitation in Riyadh',
    image: '/images/projects/project-2.jpg',
    lastmod: '2026-08-15'
  },
  {
    slug: 'iso-certifications-quality-safety-accreditations',
    arTitle: 'تجديد اعتمادات الآيزو العالمية (ISO 9001 / 14001 / 45001) لشركة هضاب الخليج للمقاولات',
    enTitle: 'Renewal of Global ISO Certifications for Gulf Hills Contracting',
    image: '/images/certificates/iso-certificates.jpg',
    lastmod: '2026-08-01'
  },
  {
    slug: 'technical-specs-precast-new-jersey-barriers',
    arTitle: 'المواصفات الهندسية لحواجز نيوجيرسي الخرسانية مسبقة الصب المعتمدة في مشاريع الطرق السريعة',
    enTitle: 'Engineering Specifications for Precast Concrete New Jersey Barriers',
    image: '/images/equipment/fleet-hero.jpg',
    lastmod: '2026-07-20'
  }
];

// Helper to clean XML strings
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Build XML Sitemap
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

// 1. Add Static Pages (Arabic & English)
staticPages.forEach((page) => {
  const arUrl = `${baseUrl}/ar${page.path}`;
  const enUrl = `${baseUrl}/en${page.path}`;
  const defaultUrl = `${baseUrl}/ar${page.path}`;

  // Arabic entry
  xml += `  <url>
    <loc>${escapeXml(arUrl)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arUrl)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}" />
    <image:image>
      <image:loc>${baseUrl}${page.image}</image:loc>
      <image:title>${escapeXml(page.arTitle)}</image:title>
      <image:caption>${escapeXml(page.arDesc)}</image:caption>
    </image:image>
  </url>
`;

  // English entry
  xml += `  <url>
    <loc>${escapeXml(enUrl)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arUrl)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}" />
    <image:image>
      <image:loc>${baseUrl}${page.image}</image:loc>
      <image:title>${escapeXml(page.enTitle)}</image:title>
      <image:caption>${escapeXml(page.enDesc)}</image:caption>
    </image:image>
  </url>
`;
});

// 2. Add All 25 Projects (Arabic & English)
projects.forEach((proj) => {
  const arUrl = `${baseUrl}/ar/projects/${proj.id}`;
  const enUrl = `${baseUrl}/en/projects/${proj.id}`;
  const defaultUrl = `${baseUrl}/ar/projects/${proj.id}`;

  // Arabic project entry
  xml += `  <url>
    <loc>${escapeXml(arUrl)}</loc>
    <lastmod>${proj.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arUrl)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}" />
    <image:image>
      <image:loc>${baseUrl}${proj.image}</image:loc>
      <image:title>${escapeXml(proj.arTitle)}</image:title>
      <image:caption>${escapeXml(proj.arTitle)} - شركة هضاب الخليج للمقاولات</image:caption>
    </image:image>
  </url>
`;

  // English project entry
  xml += `  <url>
    <loc>${escapeXml(enUrl)}</loc>
    <lastmod>${proj.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arUrl)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}" />
    <image:image>
      <image:loc>${baseUrl}${proj.image}</image:loc>
      <image:title>${escapeXml(proj.enTitle)}</image:title>
      <image:caption>${escapeXml(proj.enTitle)} - Gulf Hills Contracting</image:caption>
    </image:image>
  </url>
`;
});

// 3. Add All Articles (Arabic & English)
articles.forEach((art) => {
  const arUrl = `${baseUrl}/ar/news/${art.slug}`;
  const enUrl = `${baseUrl}/en/news/${art.slug}`;
  const defaultUrl = `${baseUrl}/ar/news/${art.slug}`;

  // Arabic article entry
  xml += `  <url>
    <loc>${escapeXml(arUrl)}</loc>
    <lastmod>${art.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arUrl)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}" />
    <image:image>
      <image:loc>${baseUrl}${art.image}</image:loc>
      <image:title>${escapeXml(art.arTitle)}</image:title>
      <image:caption>${escapeXml(art.arTitle)}</image:caption>
    </image:image>
  </url>
`;

  // English article entry
  xml += `  <url>
    <loc>${escapeXml(enUrl)}</loc>
    <lastmod>${art.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arUrl)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}" />
    <image:image>
      <image:loc>${baseUrl}${art.image}</image:loc>
      <image:title>${escapeXml(art.enTitle)}</image:title>
      <image:caption>${escapeXml(art.enTitle)}</image:caption>
    </image:image>
  </url>
`;
});

xml += `</urlset>\n`;

// Robots.txt content
const robotsTxt = `# ==============================================================================
# HEDAB AL-KHALEEJ GENERAL CONTRACTING (شركة هضاب الخليج للمقاولات)
# Official Website: https://hedabkh.com.sa
# ==============================================================================

User-agent: *
Allow: /
Allow: /images/
Allow: /documents/
Allow: /uploads/
Allow: /assets/
Disallow: /admin/
Disallow: /ar/admin/
Disallow: /en/admin/
Disallow: /api/
Disallow: /_next/

# Host & Sitemaps
Host: https://hedabkh.com.sa
Sitemap: https://hedabkh.com.sa/sitemap.xml
`;

// Destinations to write files
const destinations = [
  path.join(rootDir, 'public'),
  path.join(rootDir, '..', 'hedabkh-react-php', 'public'),
  path.join(rootDir, '..', 'HEDABKH_UPLOAD', 'HEDABKH_UPLOAD_20260825_0150', 'public_html'),
  path.join(rootDir, '..', 'HEDABKH_UPLOAD')
];

destinations.forEach((dest) => {
  if (fs.existsSync(dest)) {
    fs.writeFileSync(path.join(dest, 'sitemap.xml'), xml, 'utf8');
    fs.writeFileSync(path.join(dest, 'robots.txt'), robotsTxt, 'utf8');
    console.log(`[OK] Successfully wrote sitemap.xml & robots.txt to: ${dest}`);
  }
});

const totalUrls = (staticPages.length + projects.length + articles.length) * 2;
console.log(`\n======================================================`);
console.log(` SITEMAP GENERATION SUMMARY `);
console.log(`======================================================`);
console.log(`- Domain: https://hedabkh.com.sa`);
console.log(`- Static Core Pages: ${staticPages.length} (x2 locales = ${staticPages.length * 2} URLs)`);
console.log(`- Sovereign Projects: ${projects.length} (x2 locales = ${projects.length * 2} URLs)`);
console.log(`- News & Media: ${articles.length} (x2 locales = ${articles.length * 2} URLs)`);
console.log(`- TOTAL INDEXED URLS: ${totalUrls}`);
console.log(`======================================================\n`);
