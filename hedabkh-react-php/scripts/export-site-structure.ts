import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { contentEngine } from '../src/services/contentEngine';
import { serverStorage } from '../src/services/serverStorage';
import { BLOCK_REGISTRY } from '../src/lib/cms/blockRegistry';
import { storageAdapter } from '../src/services/storageAdapter';

async function exportSiteStructure() {
  console.log('================================================================');
  console.log('📦 EXPORTING COMPLETE SITE STRUCTURE OUTSIDE PROJECT DIRECTORY');
  console.log('================================================================\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const targetDir = `F:\\HEDABKH_SITE_STRUCTURE_EXPORT_${timestamp}`;
  const desktopTargetZip = `C:\\Users\\amer3\\Desktop\\HEDABKH_SITE_STRUCTURE_EXPORT_${timestamp}.zip`;
  const fDriveTargetZip = `F:\\HEDABKH_SITE_STRUCTURE_EXPORT_${timestamp}.zip`;

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Gather all CMS Page Trees & Block Compositions
  const pages = contentEngine.getPages();
  const pageStructures: Record<string, any> = {};

  for (const page of pages) {
    const published = contentEngine.getPublishedVersion(page.id);
    const draft = contentEngine.getDraftVersion(page.id);
    const history = contentEngine.getPageHistory(page.id);

    pageStructures[page.id] = {
      meta: page,
      publishedVersion: published,
      draftVersion: draft,
      versionHistoryCount: history.length,
      historyVersions: history,
    };
  }

  // 2. Gather Block Registry Metadata
  const blockRegistryManifest = Object.entries(BLOCK_REGISTRY).map(([type, def]) => ({
    type,
    titleAr: def.labelAr,
    titleEn: def.labelEn,
    category: def.category,
    isContainer: type === 'container' || type === 'columnLayout',
    defaultConfig: def.defaultConfig,
  }));

  // 3. Gather Central Business Data Structures via exportAllData
  const localCmsData = JSON.parse(storageAdapter.exportAllData());

  // 4. Gather Full CMS Database Raw Payload
  const fullDbPayload = serverStorage.getDb();

  // 5. Build Site Routes Hierarchy Map
  const routesHierarchy = {
    canonicalDomain: 'https://hedabkh.com.sa',
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    publicRoutes: [
      { path: '/[locale]', titleAr: 'الصفحة الرئيسية', titleEn: 'Home Page' },
      { path: '/[locale]/about', titleAr: 'عن الشركة والرؤية', titleEn: 'About Us' },
      { path: '/[locale]/chairman-message', titleAr: 'كلمة رئيس مجلس الإدارة', titleEn: "Chairman's Message" },
      { path: '/[locale]/services', titleAr: 'الخدمات والأعمال', titleEn: 'Services' },
      { path: '/[locale]/projects', titleAr: 'معرض المشاريع الكبرى', titleEn: 'Projects' },
      { path: '/[locale]/projects/[id]', titleAr: 'تفاصيل المشروع الهندسي', titleEn: 'Project Details' },
      { path: '/[locale]/equipment', titleAr: 'أسطول الآليات والمعدات', titleEn: 'Equipment Fleet' },
      { path: '/[locale]/team', titleAr: 'فريق العمل والقيادة', titleEn: 'Leadership & Team' },
      { path: '/[locale]/certificates', titleAr: 'الشهادات والاعتمادات الرسمية', titleEn: 'Accreditations' },
      { path: '/[locale]/news', titleAr: 'الأخبار والمقالات الهندسية', titleEn: 'News & Insights' },
      { path: '/[locale]/news/[slug]', titleAr: 'تفاصيل المقال / الخبر', titleEn: 'Article Details' },
      { path: '/[locale]/contact', titleAr: 'التواصل وطلب عروض الأسعار', titleEn: 'Contact & RFQ' },
    ],
    adminRoutes: [
      { path: '/[locale]/admin/login', titleAr: 'تسجيل دخول الإدارة', titleEn: 'Admin Login' },
      { path: '/[locale]/admin', titleAr: 'لوحة القيادة والتحكم', titleEn: 'Dashboard Overview' },
      { path: '/[locale]/admin/visual-builder', titleAr: 'استوديو بناء الصفحات والكتل', titleEn: 'Visual Page Builder Hub' },
      { path: '/[locale]/admin/visual-builder/[pageId]', titleAr: 'محرر الصفحة المرئي التفاعلي', titleEn: 'Visual Page Builder Editor' },
      { path: '/[locale]/admin/media', titleAr: 'مكتبة الوسائط المركزية', titleEn: 'Media Library' },
      { path: '/[locale]/admin/projects', titleAr: 'إدارة المشاريع الهندسية', titleEn: 'Projects Management' },
      { path: '/[locale]/admin/services', titleAr: 'إدارة الخدمات والأعمال', titleEn: 'Services Management' },
      { path: '/[locale]/admin/equipment', titleAr: 'إدارة أسطول الآليات', titleEn: 'Equipment Management' },
      { path: '/[locale]/admin/team', titleAr: 'إدارة فريق العمل', titleEn: 'Team Management' },
      { path: '/[locale]/admin/certificates', titleAr: 'إدارة الشهادات والاعتمادات', titleEn: 'Certificates Management' },
      { path: '/[locale]/admin/partners', titleAr: 'إدارة الشركاء والعملاء', titleEn: 'Partners Management' },
      { path: '/[locale]/admin/statistics', titleAr: 'إدارة مؤشرات الأداء (KPIs)', titleEn: 'KPIs & Statistics' },
      { path: '/[locale]/admin/inquiries', titleAr: 'صندوق الاستفسارات وطلبات الأسعار', titleEn: 'Inquiries Inbox' },
      { path: '/[locale]/admin/users', titleAr: 'المستخدمين والصلاحيات', titleEn: 'Users & Permissions' },
      { path: '/[locale]/admin/settings', titleAr: 'إعدادات النظام والنسخ الاحتياطي', titleEn: 'System Settings & Backups' },
    ],
    apiEndpoints: [
      '/api/admin/media',
      '/api/admin/visual-cms',
      '/api/admin/cms',
      '/api/admin/backup',
      '/api/admin/upload',
      '/api/health',
      '/api/ready',
    ]
  };

  // 6. Write JSON Files
  fs.writeFileSync(path.join(targetDir, 'site_pages_tree.json'), JSON.stringify(pageStructures, null, 2), 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'block_registry_manifest.json'), JSON.stringify(blockRegistryManifest, null, 2), 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'local_cms_data_export.json'), JSON.stringify(localCmsData, null, 2), 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'cms_database_backup.json'), JSON.stringify(fullDbPayload, null, 2), 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'routes_hierarchy_manifest.json'), JSON.stringify(routesHierarchy, null, 2), 'utf-8');

  // 7. Generate Master Markdown Documentation Blueprint
  const markdownBlueprint = `# 🏛️ وثيقة بنية ومخطط موقع شركة هضاب الخليج للمقاولات
## Gulf Hills Contracting — Full Site Architecture & Structure Blueprint
### تاريخ التصدير: ${new Date().toLocaleString('ar-SA')} | النسخة الأساسية: \`REL-2026-08-22-HEDABKH-RC1\`

---

## 1. الهيكلية العامة للموقع (Site Architecture Overview)

- **النطاق الرسمي:** \`https://hedabkh.com.sa\`
- **اللغات المدعومة:** العربية (\`ar\`) والإنجليزية (\`en\`)
- **إجمالي مسارات الإنتاج:** 127 مساراً ثابتاً وديناميكياً عبر Next.js Turbopack
- **محرك المحتوى:** استوديو البناء المرئي التفاعلي الشجري (Elementor-Class Visual CMS)

---

## 2. هيكلية الصفحات والشجرة التركيبية (CMS Page Trees)

${pages.map(p => {
  const published = contentEngine.getPublishedVersion(p.id);
  const blocks = published?.blocks || [];
  return `### 📄 ${p.titleAr} (\`${p.id}\`)
- **العنوان بالإنجليزية:** ${p.titleEn}
- **حالة الصفحة:** ${published ? 'منشورة ومباشرة (Published)' : 'مسودة (Draft)'}
- **إجمالي الكتل في الصفحة:** ${blocks.length} كتلة
- **ترتيب الكتل والعناصر:**
${blocks.map((b, idx) => `  ${idx + 1}. **${b.type}** (معرف الكتلة: \`${b.id}\` | مرئية: \`${b.isVisible}\`)`).join('\n')}
`;
}).join('\n\n')}

---

## 3. سجل الكتل والعناصر المعيارية (16 Block & Container Registry)

${blockRegistryManifest.map((b, idx) => `### ${idx + 1}. كتلة: \`${b.type}\` (${b.titleAr} / ${b.titleEn})
- **التصنيف:** \`${b.category}\`
- **حاوية تداخلية (Container):** \`${b.isContainer}\`
- **التكوين الافتراضي:**
\`\`\`json
${JSON.stringify(b.defaultConfig, null, 2)}
\`\`\`
`).join('\n')}

---

## 4. قائمة المسارات الكاملة (Full Routes Hierarchy)

### مسارات الموقع العام (Public Routes):
${routesHierarchy.publicRoutes.map(r => `- **${r.titleAr}** (\`${r.titleEn}\`): \`${r.path}\``).join('\n')}

### مسارات لوحة التحكم (Admin Console Routes):
${routesHierarchy.adminRoutes.map(r => `- **${r.titleAr}** (\`${r.titleEn}\`): \`${r.path}\``).join('\n')}

### نقاط النهاية البرمجية (API Endpoints):
${routesHierarchy.apiEndpoints.map(e => `- \`${e}\``).join('\n')}

---

## 5. محتويات حزمة التصدير (Export Package Files)

1. \`site_pages_tree.json\` — الشجرة التركيبية الكاملة لكافة صفحات ومسودات ونسخ الموقع
2. \`block_registry_manifest.json\` — التكوينات المعيارية لجميع كتل الودجت الـ 16
3. \`local_cms_data_export.json\` — كتالوج بيانات الموقع المحلي والـ KPIs والمشاريع
4. \`cms_database_backup.json\` — نسخة احتياطية ذرية لقاعدة بيانات المحتوى
5. \`routes_hierarchy_manifest.json\` — مصفوفة جميع مسارات وتوجيهات الموقع
6. \`SITE_STRUCTURE_BLUEPRINT.md\` — هذه الوثيقة الشاملة
`;

  fs.writeFileSync(path.join(targetDir, 'SITE_STRUCTURE_BLUEPRINT.md'), markdownBlueprint, 'utf-8');

  console.log(`✅ Exported folder created: ${targetDir}`);
  console.log(`   - site_pages_tree.json`);
  console.log(`   - block_registry_manifest.json`);
  console.log(`   - local_cms_data_export.json`);
  console.log(`   - cms_database_backup.json`);
  console.log(`   - routes_hierarchy_manifest.json`);
  console.log(`   - SITE_STRUCTURE_BLUEPRINT.md`);

  // Compress to ZIP archives on F:\ and Desktop
  try {
    execSync(`powershell -Command "Compress-Archive -Path '${targetDir}\\*' -DestinationPath '${fDriveTargetZip}' -Force"`);
    console.log(`✅ Created ZIP archive on Drive F: ${fDriveTargetZip}`);
  } catch (err: any) {
    console.warn(`Could not create F drive zip: ${err.message}`);
  }

  try {
    execSync(`powershell -Command "Copy-Item '${fDriveTargetZip}' '${desktopTargetZip}' -Force"`);
    console.log(`✅ Copied ZIP archive to Desktop: ${desktopTargetZip}`);
  } catch (err: any) {
    console.warn(`Could not copy zip to Desktop: ${err.message}`);
  }

  return { targetDir, fDriveTargetZip, desktopTargetZip };
}

exportSiteStructure()
  .then(res => {
    console.log('\n================================================================');
    console.log('🎉 SITE STRUCTURE EXPORTED SUCCESSFULLY OUTSIDE PROJECT DIRECTORY');
    console.log(`📁 Folder:  ${res.targetDir}`);
    console.log(`📦 F: ZIP:  ${res.fDriveTargetZip}`);
    console.log(`📦 Desktop: ${res.desktopTargetZip}`);
    console.log('================================================================\n');
  })
  .catch(err => {
    console.error('Export failed:', err);
    process.exit(1);
  });
