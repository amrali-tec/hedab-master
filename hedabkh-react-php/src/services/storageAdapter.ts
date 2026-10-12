import { mockData } from '../data/mockData';
import { BRAND_IDENTITY } from '../config/brand';
import {
  Project,
  Service,
  Statistic,
  TeamMember,
  Certificate,
  Inquiry,
  ActivityLog,
  AdminUser,
  HeaderConfig,
  FooterConfig,
  HomeContentConfig,
  EquipmentItem,
  RichArticleItem,
  SitePagesContentConfig,
  EditableResource,
  EditableResourceType,
  PartnerItem,
  MediaItem,
  SeoSettingsConfig,
  TimelineMilestoneItem,
  SaudiRegionItem,
} from '../types';

const STORAGE_KEYS = {
  PROJECTS_AR: 'gulf_hills_projects_ar',
  PROJECTS_EN: 'gulf_hills_projects_en',
  SERVICES_AR: 'gulf_hills_services_ar',
  SERVICES_EN: 'gulf_hills_services_en',
  STATISTICS_AR: 'gulf_hills_statistics_ar',
  STATISTICS_EN: 'gulf_hills_statistics_en',
  TEAM_AR: 'gulf_hills_team_ar',
  TEAM_EN: 'gulf_hills_team_en',
  CERTIFICATES_AR: 'gulf_hills_certificates_ar',
  CERTIFICATES_EN: 'gulf_hills_certificates_en',
  INQUIRIES: 'gulf_hills_inquiries',
  SETTINGS: 'gulf_hills_settings',
  LOGS: 'gulf_hills_activity_logs',
  ADMIN_USERS: 'gulf_hills_admin_users',
  HEADER_CONFIG: 'gulf_hills_header_config',
  FOOTER_CONFIG: 'gulf_hills_footer_config',
  HOME_CONTENT: 'gulf_hills_home_content',
  EQUIPMENT_FLEET: 'gulf_hills_equipment_fleet',
  RICH_ARTICLES: 'gulf_hills_rich_articles',
  SITE_PAGES_CONTENT: 'gulf_hills_site_pages_content',
  EDITABLE_RESOURCES: 'gulf_hills_editable_resources',
  PARTNERS: 'gulf_hills_partners',
  MEDIA_ITEMS: 'gulf_hills_media_items',
  SEO_SETTINGS: 'gulf_hills_seo_settings',
  TIMELINE_ITEMS: 'gulf_hills_timeline_items',
  SAUDI_REGIONS: 'gulf_hills_saudi_regions',
};

// Initial seed inquiries
const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'م. خالد الدوسري',
    email: 'k.aldosari@amana-riyadh.gov.sa',
    phone: '0555123456',
    message: 'نود الاستفسار عن إمكانية توريد حواجز خرسانية (نيوجيرسي) بطول 3000 متر طولي لمشروع صيانة طرق بالرياض.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: 'تمت إحالة الطلب لقسم المبيعات والمشاريع للمتابعة وتجهيز عرض السعر.',
  },
  {
    id: 'inq-2',
    name: 'سلطان القحطاني',
    email: 'sultan@aramco-sub.com',
    phone: '0501987654',
    message: 'طلب عرض سعر لأعمال كشط وسفلتة مواقف سيارات وتركيب إنترلوك لمنشأة لوجستية.',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    notes: 'تم التواصل هاتفياً وتحديد موعد زيارة ميدانية يوم الأحد القادم.',
  },
  {
    id: 'inq-3',
    name: 'شركة رواسي التشييد',
    email: 'projects@rawasi.sa',
    phone: '0544112233',
    message: 'نطلب شهادات تأهيل وتصنيف الشركة لأعمال شبكات تصريف مياه الأمطار والسيول.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    notes: 'تم إرسال الملف التعريفي والشهادات الرسمية بنجاح.',
  },
];

// Initial seed logs
const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    action: 'status_change',
    entity: 'inquiry',
    entityTitle: 'طلب عرض أسعار حواجز نيوجيرسي',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    adminName: 'م. أيمن الحاتم',
  },
  {
    id: 'log-2',
    action: 'update',
    entity: 'project',
    entityTitle: 'تشغيل وصيانة مقابر المسلمين بمدينة الرياض',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    adminName: 'مدير العمليات',
  },
];

// Initial seed admin users & staff permissions
const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-1',
    name: 'م. أيمن جميل الحاتم',
    email: 'admin@hedabkh.com.sa',
    phone: '0555126774',
    role: 'super_admin',
    roleTitleAr: 'مدير النظام الشامل (Super Admin)',
    roleTitleEn: 'Super Administrator',
    permissions: [
      'projects_manage',
      'certificates_manage',
      'services_manage',
      'inquiries_view_reply',
      'statistics_manage',
      'team_manage',
      'settings_manage',
      'users_manage',
      'logs_view',
    ],
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    lastLogin: 'الآن (جلسة نشطة)',
    createdAt: '2024-01-15',
  },
  {
    id: 'user-2',
    name: 'م. فهد بن عبد الله الدوسري',
    email: 'f.dosari@hedabkh.com.sa',
    phone: '0501234567',
    role: 'project_manager',
    roleTitleAr: 'مدير المشاريع والعمليات الميدانية',
    roleTitleEn: 'Projects & Operations Manager',
    permissions: [
      'projects_manage',
      'services_manage',
      'statistics_manage',
      'team_manage',
      'logs_view',
    ],
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    lastLogin: 'أمس الساعة 03:20 م',
    createdAt: '2024-03-10',
  },
  {
    id: 'user-3',
    name: 'أ. سارة المنصور',
    email: 'sara@hedabkh.com.sa',
    phone: '0549876543',
    role: 'inquiries_manager',
    roleTitleAr: 'مسؤولة خدمة العملاء والاستفسارات',
    roleTitleEn: 'Client Inquiries Specialist',
    permissions: [
      'inquiries_view_reply',
      'logs_view',
    ],
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    lastLogin: 'منذ ساعتين',
    createdAt: '2024-05-20',
  },
  {
    id: 'user-4',
    name: 'م. عبد العزيز الشمري',
    email: 'a.shammari@hedabkh.com.sa',
    phone: '0567788990',
    role: 'quality_officer',
    roleTitleAr: 'مسؤول الجودة والاعتمادات الرسمية',
    roleTitleEn: 'Quality & ISO Officer',
    permissions: [
      'certificates_manage',
      'services_manage',
      'logs_view',
    ],
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    lastLogin: 'منذ 3 أيام',
    createdAt: '2024-06-01',
  },
];

const memoryStore: Record<string, string> = {};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = isBrowser() ? localStorage.getItem(key) : memoryStore[key];
    if (!item) {
      const defaultStr = JSON.stringify(defaultValue);
      if (isBrowser()) {
        localStorage.setItem(key, defaultStr);
      } else {
        memoryStore[key] = defaultStr;
      }
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    const str = JSON.stringify(value);
    if (isBrowser()) {
      localStorage.setItem(key, str);
    } else {
      memoryStore[key] = str;
    }
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
}

const INITIAL_EDITABLE_RESOURCES: EditableResource[] = [
  {
    id: 'res-global-header',
    type: 'header',
    name: 'الترويسة الرئيسية الموحدة (Global Executive Header)',
    slug: 'global-header',
    status: 'published',
    target: 'global:header',
    isGlobal: true,
    content: {
      nodes: [
        {
          id: 'node-header-announcement',
          type: 'hero-banner',
          name: 'شريط الإعلانات والخط الساخن',
          props: {
            textAr: 'الخط الساخن المباشر للمشاريع والمناقصات: 00966115126774',
            textEn: 'Direct Projects & Tenders Hotline: 00966115126774',
            btnTextAr: 'طلب عرض سعر',
            btnTextEn: 'Request Quote',
          },
          styles: { bgColor: '#002060', textColor: '#ffffff' },
        },
        {
          id: 'node-header-main',
          type: 'container',
          name: 'الهيدر الرئيسي والشعار',
          props: { logoWidth: 460 },
          styles: { padding: '1rem 2.5rem' },
        },
      ],
      settings: { sticky: true, twoTier: true },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'res-global-footer',
    type: 'footer',
    name: 'الفوتر الرئيسي الموحد (Global Footer)',
    slug: 'global-footer',
    status: 'published',
    target: 'global:footer',
    isGlobal: true,
    content: {
      nodes: [
        {
          id: 'node-footer-about',
          type: 'paragraph',
          name: 'نبذة عن الشركة بالفوتر',
          props: {
            textAr: 'شركة هضاب الخليج العربي للمقاولات - الشريك المعتمد في مقاولات البنية التحتية وتشغيل المرافق.',
            textEn: 'Arabian Gulf Hills Contracting Company - Certified Infrastructure & Operations Partner.',
          },
          styles: { fontSize: '0.875rem' },
        },
      ],
      settings: { showMap: true, showSocials: true },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'res-page-home',
    type: 'page',
    name: 'الصفحة الرئيسية (Homepage)',
    slug: 'home',
    status: 'published',
    target: 'page:home',
    isGlobal: false,
    content: {
      nodes: [
        {
          id: 'node-home-hero',
          type: 'hero-banner',
          name: 'القسم الرئيسي (Hero Section)',
          props: {
            headlineAr: 'الريادة الميدانية في مقاولات البنية التحتية',
            headlineEn: 'Field Leadership in Infrastructure Contracting',
            subAr: 'شركة سعودية معتمدة وفق رؤية المملكة 2030',
            subEn: 'Certified Saudi Company Aligning with Vision 2030',
          },
          styles: { bgColor: '#070C14', textColor: '#ffffff' },
        },
      ],
      settings: { seoTitle: 'هضاب الخليج للمقاولات' },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'res-form-contact',
    type: 'form',
    name: 'نموذج التواصل وطلب التنافس (Contact & RFQ Form)',
    slug: 'contact-form',
    status: 'published',
    target: 'form:contact',
    isGlobal: true,
    content: {
      nodes: [
        {
          id: 'field-name',
          type: 'form-input',
          name: 'حقل الاسم الكامل',
          props: { labelAr: 'الاسم الكامل', placeholderAr: 'أدخل اسمك الكريم', inputType: 'text' },
          behavior: { validation: { required: true } },
          styles: {},
        },
        {
          id: 'field-phone',
          type: 'form-input',
          name: 'حقل رقم الجوال',
          props: { labelAr: 'رقم التواصل', placeholderAr: '05xxxxxxxx', inputType: 'tel' },
          behavior: { validation: { required: true } },
          styles: {},
        },
        {
          id: 'field-submit',
          type: 'form-submit',
          name: 'زر إرسال الطلب',
          props: { btnTextAr: 'إرسال الاستفسار فوراً', btnTextEn: 'Submit Inquiry Now' },
          behavior: { actionType: 'submit_form', submitUrl: '/api/inquiries' },
          styles: { bgColor: '#0070BA' },
        },
      ],
      settings: { notifyEmail: 'info@hedabkh.com.sa' },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'res-template-service',
    type: 'template',
    name: 'قالب تفاصيل الخدمة الهندسي (Single Service Template)',
    slug: 'single-service-template',
    status: 'published',
    target: 'template:service',
    isGlobal: true,
    content: {
      nodes: [
        {
          id: 'service-title-dynamic',
          type: 'dynamic-field',
          name: 'عنوان الخدمة الديناميكي',
          props: { fallbackText: 'اسم الخدمة الهندسية' },
          bindings: { field: 'service.title' },
          styles: { fontSize: '2rem', fontWeight: '900' },
        },
        {
          id: 'service-desc-dynamic',
          type: 'dynamic-field',
          name: 'وصف الخدمة الديناميكي',
          props: { fallbackText: 'تفاصيل ومواصفات الخدمة...' },
          bindings: { field: 'service.description' },
          styles: { fontSize: '1rem' },
        },
      ],
      settings: { layout: 'sidebar-right' },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageAdapter = {
  // --- Visual Site Editor Resources ---
  getEditableResources: (type?: EditableResourceType): EditableResource[] => {
    const list = getItem<EditableResource[]>(STORAGE_KEYS.EDITABLE_RESOURCES, INITIAL_EDITABLE_RESOURCES);
    if (type) {
      return list.filter((r) => r.type === type);
    }
    return list;
  },

  getEditableResourceById: (id: string): EditableResource | null => {
    const list = storageAdapter.getEditableResources();
    return list.find((r) => r.id === id) || null;
  },

  saveEditableResource: (payload: Partial<EditableResource> & { name: string; type: EditableResourceType }): EditableResource => {
    const list = storageAdapter.getEditableResources();
    const now = new Date().toISOString();
    const existingIndex = payload.id ? list.findIndex((r) => r.id === payload.id) : -1;

    let savedResource: EditableResource;

    if (existingIndex >= 0) {
      savedResource = {
        ...list[existingIndex],
        ...payload,
        updatedAt: now,
      };
      list[existingIndex] = savedResource;
    } else {
      savedResource = {
        id: payload.id || `res-${Date.now()}`,
        type: payload.type,
        name: payload.name,
        slug: payload.slug || payload.name.toLowerCase().replace(/\s+/g, '-'),
        status: payload.status || 'published',
        target: payload.target || `${payload.type}:${payload.slug || Date.now()}`,
        isGlobal: payload.isGlobal ?? false,
        content: payload.content || { nodes: [], settings: {} },
        createdAt: now,
        updatedAt: now,
      };
      list.unshift(savedResource);
    }

    setItem(STORAGE_KEYS.EDITABLE_RESOURCES, list);
    storageAdapter.syncGlobalResourceToSiteConfig(savedResource);

    storageAdapter.addLog({
      action: existingIndex >= 0 ? 'update' : 'create',
      entity: 'settings',
      entityTitle: `تطبيق محرر الموقع: ${savedResource.name}`,
      adminName: 'مدير الموقع الهندسي',
    });
    return savedResource;
  },

  syncGlobalResourceToSiteConfig: (resource: EditableResource): void => {
    if (!resource || !resource.content || !resource.content.nodes) return;

    if (resource.type === 'header') {
      const headerConfig = storageAdapter.getHeaderConfig();
      const announcementNode = resource.content.nodes.find((n) => n.id === 'node-header-announcement' || n.type === 'hero-banner');
      if (announcementNode && announcementNode.props) {
        headerConfig.announcement.textAr = announcementNode.props.textAr || headerConfig.announcement.textAr;
        headerConfig.announcement.textEn = announcementNode.props.textEn || headerConfig.announcement.textEn;
        if (announcementNode.props.phone) {
          headerConfig.announcement.phone = announcementNode.props.phone;
        }
        if (announcementNode.props.btnTextAr) {
          headerConfig.announcement.buttonTextAr = announcementNode.props.btnTextAr;
        }
        if (announcementNode.props.btnTextEn) {
          headerConfig.announcement.buttonTextEn = announcementNode.props.btnTextEn;
        }
        storageAdapter.saveHeaderConfig(headerConfig);
      }
    } else if (resource.type === 'footer') {
      const footerConfig = storageAdapter.getFooterConfig();
      const aboutNode = resource.content.nodes.find((n) => n.id === 'node-footer-about' || n.type === 'paragraph');
      if (aboutNode && aboutNode.props) {
        footerConfig.aboutTextAr = aboutNode.props.textAr || footerConfig.aboutTextAr;
        footerConfig.aboutTextEn = aboutNode.props.textEn || footerConfig.aboutTextEn;
        storageAdapter.saveFooterConfig(footerConfig);
      }
    } else if (resource.type === 'page' && (resource.slug === 'home' || resource.target === 'page:home')) {
      const homeContent = storageAdapter.getHomeContent();
      const heroNode = resource.content.nodes.find((n) => n.id === 'node-home-hero' || n.type === 'hero-banner');
      if (heroNode && heroNode.props) {
        homeContent.hero.headlineAr = heroNode.props.headlineAr || homeContent.hero.headlineAr;
        homeContent.hero.headlineEn = heroNode.props.headlineEn || homeContent.hero.headlineEn;
        homeContent.hero.descriptionAr = heroNode.props.subAr || homeContent.hero.descriptionAr;
        homeContent.hero.descriptionEn = heroNode.props.subEn || homeContent.hero.descriptionEn;
        storageAdapter.saveHomeContent(homeContent);
      }
    }
  },

  cloneResourceAsDetached: (resourceId: string): EditableResource | null => {
    const list = storageAdapter.getEditableResources();
    const target = list.find((r) => r.id === resourceId);
    if (!target) return null;

    const cloned: EditableResource = {
      ...target,
      id: `res-detached-${Date.now()}`,
      name: `${target.name} (نسخة مستقلة)`,
      slug: `${target.slug}-detached-${Date.now()}`,
      isGlobal: false,
      linkedResourceId: target.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return storageAdapter.saveEditableResource(cloned);
  },

  deleteEditableResource: (id: string): void => {
    const list = storageAdapter.getEditableResources();
    const updated = list.filter((r) => r.id !== id);
    setItem(STORAGE_KEYS.EDITABLE_RESOURCES, updated);
    storageAdapter.addLog({
      action: 'delete',
      entity: 'settings',
      entityTitle: `حذف عنصر من محرر الموقع: ${id}`,
      adminName: 'مدير الموقع الهندسي',
    });
  },

  // --- Projects ---
  getProjects: (locale: 'ar' | 'en' = 'ar'): Project[] => {
    const key = locale === 'ar' ? STORAGE_KEYS.PROJECTS_AR : STORAGE_KEYS.PROJECTS_EN;
    return getItem<Project[]>(key, mockData[locale].projects);
  },

  saveProject: (project: Project, locale: 'ar' | 'en' = 'ar'): Project => {
    const projects = storageAdapter.getProjects(locale);
    const index = projects.findIndex((p) => p.id === project.id);
    const updatedProject = { ...project };

    if (!updatedProject.id) {
      updatedProject.id = `proj-${Date.now()}`;
    }

    if (index >= 0) {
      projects[index] = updatedProject;
    } else {
      projects.unshift(updatedProject);
    }

    const key = locale === 'ar' ? STORAGE_KEYS.PROJECTS_AR : STORAGE_KEYS.PROJECTS_EN;
    setItem(key, projects);

    // Also mirror to other locale if it doesn't exist
    const otherLocale = locale === 'ar' ? 'en' : 'ar';
    const otherKey = otherLocale === 'ar' ? STORAGE_KEYS.PROJECTS_AR : STORAGE_KEYS.PROJECTS_EN;
    const otherProjects = getItem<Project[]>(otherKey, mockData[otherLocale].projects);
    const otherIndex = otherProjects.findIndex((p) => p.id === updatedProject.id);
    if (otherIndex < 0) {
      otherProjects.unshift(updatedProject);
      setItem(otherKey, otherProjects);
    }

    storageAdapter.addLog({
      action: index >= 0 ? 'update' : 'create',
      entity: 'project',
      entityTitle: updatedProject.title,
      adminName: 'مدير النظام',
    });

    return updatedProject;
  },

  deleteProject: (id: string): void => {
    ['ar', 'en'].forEach((locale) => {
      const key = locale === 'ar' ? STORAGE_KEYS.PROJECTS_AR : STORAGE_KEYS.PROJECTS_EN;
      const projects = getItem<Project[]>(key, mockData[locale as 'ar' | 'en'].projects);
      const filtered = projects.filter((p) => p.id !== id);
      setItem(key, filtered);
    });

    storageAdapter.addLog({
      action: 'delete',
      entity: 'project',
      entityTitle: `مشروع #${id}`,
      adminName: 'مدير النظام',
    });
  },

  toggleProjectPublish: (id: string, locale: 'ar' | 'en' = 'ar'): boolean => {
    const projects = storageAdapter.getProjects(locale);
    const proj = projects.find((p) => p.id === id);
    if (!proj) return false;
    proj.isPublished = proj.isPublished === false ? true : false;
    storageAdapter.saveProject(proj, locale);
    return proj.isPublished;
  },

  // --- Services ---
  getServices: (locale: 'ar' | 'en' = 'ar'): Service[] => {
    const key = locale === 'ar' ? STORAGE_KEYS.SERVICES_AR : STORAGE_KEYS.SERVICES_EN;
    return getItem<Service[]>(key, mockData[locale].services);
  },

  saveService: (service: Service, locale: 'ar' | 'en' = 'ar'): Service => {
    const services = storageAdapter.getServices(locale);
    const index = services.findIndex((s) => s.id === service.id);
    const updated = { ...service };
    if (!updated.id) {
      updated.id = `srv-${Date.now()}`;
    }

    if (index >= 0) {
      services[index] = updated;
    } else {
      services.push(updated);
    }

    const key = locale === 'ar' ? STORAGE_KEYS.SERVICES_AR : STORAGE_KEYS.SERVICES_EN;
    setItem(key, services);

    storageAdapter.addLog({
      action: index >= 0 ? 'update' : 'create',
      entity: 'service',
      entityTitle: updated.title,
      adminName: 'مدير النظام',
    });

    return updated;
  },

  deleteService: (id: string): void => {
    ['ar', 'en'].forEach((locale) => {
      const key = locale === 'ar' ? STORAGE_KEYS.SERVICES_AR : STORAGE_KEYS.SERVICES_EN;
      const services = getItem<Service[]>(key, mockData[locale as 'ar' | 'en'].services);
      setItem(key, services.filter((s) => s.id !== id));
    });

    storageAdapter.addLog({
      action: 'delete',
      entity: 'service',
      entityTitle: `خدمة #${id}`,
      adminName: 'مدير النظام',
    });
  },

  toggleServicePublish: (id: string, locale: 'ar' | 'en' = 'ar'): boolean => {
    const services = storageAdapter.getServices(locale);
    const srv = services.find((s) => s.id === id);
    if (!srv) return false;
    srv.isPublished = srv.isPublished === false ? true : false;
    storageAdapter.saveService(srv, locale);
    return srv.isPublished;
  },

  // --- Certificates ---
  getCertificates: (locale: 'ar' | 'en' = 'ar'): Certificate[] => {
    const key = locale === 'ar' ? STORAGE_KEYS.CERTIFICATES_AR : STORAGE_KEYS.CERTIFICATES_EN;
    return getItem<Certificate[]>(key, mockData[locale].certificates);
  },

  saveCertificate: (cert: Certificate, locale: 'ar' | 'en' = 'ar'): Certificate => {
    const certs = storageAdapter.getCertificates(locale);
    const index = certs.findIndex((c) => c.id === cert.id);
    const updated = { ...cert };
    if (!updated.id) {
      updated.id = `cert-${Date.now()}`;
    }

    if (index >= 0) {
      certs[index] = updated;
    } else {
      certs.unshift(updated);
    }

    const key = locale === 'ar' ? STORAGE_KEYS.CERTIFICATES_AR : STORAGE_KEYS.CERTIFICATES_EN;
    setItem(key, certs);

    storageAdapter.addLog({
      action: index >= 0 ? 'update' : 'create',
      entity: 'certificate',
      entityTitle: updated.title,
      adminName: 'مدير النظام',
    });

    return updated;
  },

  deleteCertificate: (id: string): void => {
    ['ar', 'en'].forEach((locale) => {
      const key = locale === 'ar' ? STORAGE_KEYS.CERTIFICATES_AR : STORAGE_KEYS.CERTIFICATES_EN;
      const certs = getItem<Certificate[]>(key, mockData[locale as 'ar' | 'en'].certificates);
      setItem(key, certs.filter((c) => c.id !== id));
    });

    storageAdapter.addLog({
      action: 'delete',
      entity: 'certificate',
      entityTitle: `شهادة #${id}`,
      adminName: 'مدير النظام',
    });
  },

  toggleCertificatePublish: (id: string, locale: 'ar' | 'en' = 'ar'): boolean => {
    const certs = storageAdapter.getCertificates(locale);
    const cert = certs.find((c) => c.id === id);
    if (!cert) return false;
    cert.isPublished = cert.isPublished === false ? true : false;
    storageAdapter.saveCertificate(cert, locale);
    return cert.isPublished;
  },

  // --- Statistics ---
  getStatistics: (locale: 'ar' | 'en' = 'ar'): Statistic[] => {
    const key = locale === 'ar' ? STORAGE_KEYS.STATISTICS_AR : STORAGE_KEYS.STATISTICS_EN;
    return getItem<Statistic[]>(key, mockData[locale].statistics);
  },

  saveStatistic: (stat: Statistic, locale: 'ar' | 'en' = 'ar'): Statistic => {
    const stats = storageAdapter.getStatistics(locale);
    const index = stats.findIndex((s) => s.id === stat.id);
    const updated = { ...stat };
    if (!updated.id) {
      updated.id = `stat-${Date.now()}`;
    }

    if (index >= 0) {
      stats[index] = updated;
    } else {
      stats.push(updated);
    }

    const key = locale === 'ar' ? STORAGE_KEYS.STATISTICS_AR : STORAGE_KEYS.STATISTICS_EN;
    setItem(key, stats);

    storageAdapter.addLog({
      action: 'update',
      entity: 'statistic',
      entityTitle: updated.label,
      adminName: 'مدير النظام',
    });

    return updated;
  },

  // --- Team ---
  getTeam: (locale: 'ar' | 'en' = 'ar'): TeamMember[] => {
    const key = locale === 'ar' ? STORAGE_KEYS.TEAM_AR : STORAGE_KEYS.TEAM_EN;
    return getItem<TeamMember[]>(key, mockData[locale].team);
  },

  saveTeamMember: (member: TeamMember, locale: 'ar' | 'en' = 'ar'): TeamMember => {
    const team = storageAdapter.getTeam(locale);
    const index = team.findIndex((t) => t.id === member.id);
    const updated = { ...member };
    if (!updated.id) {
      updated.id = `team-${Date.now()}`;
    }

    if (index >= 0) {
      team[index] = updated;
    } else {
      team.push(updated);
    }

    const key = locale === 'ar' ? STORAGE_KEYS.TEAM_AR : STORAGE_KEYS.TEAM_EN;
    setItem(key, team);

    storageAdapter.addLog({
      action: index >= 0 ? 'update' : 'create',
      entity: 'team',
      entityTitle: updated.name,
      adminName: 'مدير النظام',
    });

    return updated;
  },

  deleteTeamMember: (id: string): void => {
    ['ar', 'en'].forEach((locale) => {
      const key = locale === 'ar' ? STORAGE_KEYS.TEAM_AR : STORAGE_KEYS.TEAM_EN;
      const team = getItem<TeamMember[]>(key, mockData[locale as 'ar' | 'en'].team);
      setItem(key, team.filter((t) => t.id !== id));
    });

    storageAdapter.addLog({
      action: 'delete',
      entity: 'team',
      entityTitle: `عضو فريق #${id}`,
      adminName: 'مدير النظام',
    });
  },

  toggleTeamPublish: (id: string, locale: 'ar' | 'en' = 'ar'): boolean => {
    const team = storageAdapter.getTeam(locale);
    const item = team.find((t) => t.id === id);
    if (!item) return false;
    item.isPublished = item.isPublished === false ? true : false;
    storageAdapter.saveTeamMember(item, locale);
    return item.isPublished;
  },

  // --- Inquiries / Leads ---
  getInquiries: (): Inquiry[] => {
    return getItem<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
  },

  saveInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'> & Partial<Inquiry>): Inquiry => {
    const inquiries = storageAdapter.getInquiries();
    const newInquiry: Inquiry = {
      id: inquiry.id || `inq-${Date.now()}`,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      status: inquiry.status || 'new',
      createdAt: inquiry.createdAt || new Date().toISOString(),
      notes: inquiry.notes || '',
    };

    inquiries.unshift(newInquiry);
    setItem(STORAGE_KEYS.INQUIRIES, inquiries);

    storageAdapter.addLog({
      action: 'create',
      entity: 'inquiry',
      entityTitle: `طلب تسعير / استفسار جديد من: ${newInquiry.name} (${newInquiry.phone})`,
      adminName: 'نظام التنبيهات الآلية',
    });

    return newInquiry;
  },

  updateInquiryStatus: (id: string, status: Inquiry['status'], notes?: string): void => {
    const inquiries = storageAdapter.getInquiries();
    const target = inquiries.find((i) => i.id === id);
    if (target) {
      target.status = status;
      if (notes !== undefined) {
        target.notes = notes;
      }
      setItem(STORAGE_KEYS.INQUIRIES, inquiries);

      storageAdapter.addLog({
        action: 'status_change',
        entity: 'inquiry',
        entityTitle: `استفسار من: ${target.name}`,
        adminName: 'مدير النظام',
      });
    }
  },

  deleteInquiry: (id: string): void => {
    const inquiries = storageAdapter.getInquiries();
    setItem(STORAGE_KEYS.INQUIRIES, inquiries.filter((i) => i.id !== id));
  },

  // --- Brand Settings ---
  getBrandSettings: () => {
    return getItem(STORAGE_KEYS.SETTINGS, {
      nameAr: BRAND_IDENTITY.name.ar,
      nameEn: BRAND_IDENTITY.name.en,
      taglineAr: BRAND_IDENTITY.tagline.ar,
      taglineEn: BRAND_IDENTITY.tagline.en,
      phone: BRAND_IDENTITY.phone,
      email: BRAND_IDENTITY.email,
      cr: BRAND_IDENTITY.cr,
      vat: BRAND_IDENTITY.vat,
      addressAr: BRAND_IDENTITY.address.ar,
      addressEn: BRAND_IDENTITY.address.en,
      socials: BRAND_IDENTITY.socials,
      profilePdfUrl: BRAND_IDENTITY.profilePdfUrl || '/gulf-hills-profile.pdf',
      profileReleaseYearAr: 'إصدار الشركة لعام 2026م',
      profileReleaseYearEn: 'Company Release 2026',
      profileDisclaimerAr: 'تنويه رسمي: هذا المستند عبارة عن ملخص استعراضي وتأهيلي مبدئي للتعريف بالقدرات التشغيلية وسابقة الأعمال لشركة هضاب الخليج العربي للمقاولات. لا يُعتبر هذا المستند عقداً ملزماً أو تعهداً مالياً أو إيجاباً قانونياً رتيباً على الشركة، وتخضع كافة الالتزامات والاعتمادات النهائية للعقود الرسمية المنفصلة والموقعة بين الأطراف ذات العلاقة.',
      profileDisclaimerEn: 'Official Notice: This document serves as an informational prequalification summary showcasing the capabilities and track record of Arabian Gulf Hills Contracting Company. It does not constitute a legally binding contract, offer, or financial obligation. All formal commitments are subject to separate fully executed agreements.',
    });
  },

  saveBrandSettings: (settings: any) => {
    setItem(STORAGE_KEYS.SETTINGS, settings);
    storageAdapter.addLog({
      action: 'update',
      entity: 'settings',
      entityTitle: 'بيانات وإعدادات الشركة',
      adminName: 'مدير النظام',
    });
    return settings;
  },

  // --- Admin Users & Permissions Management ---
  getAdminUsers: (): AdminUser[] => {
    return getItem<AdminUser[]>(STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS);
  },

  saveAdminUser: (user: AdminUser): AdminUser => {
    const users = storageAdapter.getAdminUsers();
    const index = users.findIndex((u) => u.id === user.id);
    let updated: AdminUser;

    if (index >= 0) {
      updated = { ...users[index], ...user };
      users[index] = updated;
    } else {
      updated = {
        ...user,
        id: user.id || `user-${Date.now()}`,
        createdAt: user.createdAt || new Date().toISOString().split('T')[0],
      };
      users.unshift(updated);
    }

    setItem(STORAGE_KEYS.ADMIN_USERS, users);
    storageAdapter.addLog({
      action: index >= 0 ? 'update' : 'create',
      entity: 'team',
      entityTitle: `مستخدم الإدارة: ${updated.name}`,
      adminName: 'مدير النظام',
    });

    return updated;
  },

  deleteAdminUser: (id: string): void => {
    const users = storageAdapter.getAdminUsers();
    const target = users.find((u) => u.id === id);
    setItem(STORAGE_KEYS.ADMIN_USERS, users.filter((u) => u.id !== id));

    if (target) {
      storageAdapter.addLog({
        action: 'delete',
        entity: 'team',
        entityTitle: `حذف مستخدم الإدارة: ${target.name}`,
        adminName: 'مدير النظام',
      });
    }
  },

  toggleAdminUserStatus: (id: string): AdminUser | null => {
    const users = storageAdapter.getAdminUsers();
    const target = users.find((u) => u.id === id);
    if (!target) return null;

    target.status = target.status === 'active' ? 'suspended' : 'active';
    setItem(STORAGE_KEYS.ADMIN_USERS, users);

    storageAdapter.addLog({
      action: 'status_change',
      entity: 'team',
      entityTitle: `تغيير حالة المستخدم ${target.name} إلى ${target.status}`,
      adminName: 'مدير النظام',
    });

    return target;
  },

  // --- Header & Navigation Menu CMS ---
  getHeaderConfig: (): HeaderConfig => {
    return getItem<HeaderConfig>(STORAGE_KEYS.HEADER_CONFIG, INITIAL_HEADER_CONFIG);
  },

  saveHeaderConfig: (config: HeaderConfig): HeaderConfig => {
    setItem(STORAGE_KEYS.HEADER_CONFIG, config);
    storageAdapter.addLog({
      action: 'update',
      entity: 'settings',
      entityTitle: 'تخصيص الهيدر وقوائم التصفح',
      adminName: 'مدير النظام',
    });
    return config;
  },

  // --- Footer CMS ---
  getFooterConfig: (): FooterConfig => {
    return getItem<FooterConfig>(STORAGE_KEYS.FOOTER_CONFIG, INITIAL_FOOTER_CONFIG);
  },

  saveFooterConfig: (config: FooterConfig): FooterConfig => {
    setItem(STORAGE_KEYS.FOOTER_CONFIG, config);
    storageAdapter.addLog({
      action: 'update',
      entity: 'settings',
      entityTitle: 'تخصيص الفوتر والروابط السفلية',
      adminName: 'مدير النظام',
    });
    return config;
  },

  // --- Homepage Sections & Content Builder CMS ---
  getHomeContent: (): HomeContentConfig => {
    return getItem<HomeContentConfig>(STORAGE_KEYS.HOME_CONTENT, INITIAL_HOME_CONTENT);
  },

  saveHomeContent: (content: HomeContentConfig): HomeContentConfig => {
    setItem(STORAGE_KEYS.HOME_CONTENT, content);
    storageAdapter.addLog({
      action: 'update',
      entity: 'settings',
      entityTitle: 'محرر أقسام ومحتوى الصفحة الرئيسية',
      adminName: 'مدير النظام',
    });
    return content;
  },

  // --- Equipment Fleet CMS ---
  getEquipmentFleet: (): EquipmentItem[] => {
    return getItem<EquipmentItem[]>(STORAGE_KEYS.EQUIPMENT_FLEET, INITIAL_EQUIPMENT_FLEET);
  },

  saveEquipmentItem: (item: EquipmentItem): EquipmentItem => {
    const fleet = storageAdapter.getEquipmentFleet();
    const index = fleet.findIndex((eq) => eq.id === item.id);
    let updated: EquipmentItem;

    if (index >= 0) {
      updated = { ...fleet[index], ...item };
      fleet[index] = updated;
    } else {
      updated = {
        ...item,
        id: item.id || `eq-${Date.now()}`,
      };
      fleet.unshift(updated);
    }

    setItem(STORAGE_KEYS.EQUIPMENT_FLEET, fleet);
    storageAdapter.addLog({
      action: index >= 0 ? 'update' : 'create',
      entity: 'service',
      entityTitle: `معدة أسطول: ${updated.nameAr}`,
      adminName: 'مدير النظام',
    });

    return updated;
  },

  deleteEquipmentItem: (id: string): void => {
    const fleet = storageAdapter.getEquipmentFleet();
    const target = fleet.find((eq) => eq.id === id);
    setItem(STORAGE_KEYS.EQUIPMENT_FLEET, fleet.filter((eq) => eq.id !== id));

    if (target) {
      storageAdapter.addLog({
        action: 'delete',
        entity: 'service',
        entityTitle: `حذف معدة: ${target.nameAr}`,
        adminName: 'مدير النظام',
      });
    }
  },

  toggleEquipmentPublish: (id: string): boolean => {
    const fleet = storageAdapter.getEquipmentFleet();
    const item = fleet.find((eq) => eq.id === id);
    if (!item) return false;
    item.isPublished = item.isPublished === false ? true : false;
    storageAdapter.saveEquipmentItem(item);
    return item.isPublished;
  },

  // --- Strategic Partners & Clients CMS ---
  getPartners: (): PartnerItem[] => {
    return getItem<PartnerItem[]>(STORAGE_KEYS.PARTNERS, [
      {
        id: 'p-1',
        nameAr: 'وزارة الشؤون البلدية والقروية والإسكان',
        nameEn: 'Ministry of Municipal & Rural Affairs and Housing',
        categoryAr: 'وزارة سيادية',
        categoryEn: 'Ministry',
        badgeAr: 'اعتماد رسمي شامل',
        badgeEn: 'Full Accreditation',
        projectsCount: 18,
        logoUrl: '/images/logos/momrah-user-logo.jpg',
        status: 'active',
      },
      {
        id: 'p-2',
        nameAr: 'أمانة منطقة الرياض',
        nameEn: 'Riyadh Region Municipality',
        categoryAr: 'أمانات المناطق',
        categoryEn: 'Municipality',
        badgeAr: 'مشاريع حيوية كبرى',
        badgeEn: 'Major Infrastructure',
        projectsCount: 14,
        logoUrl: '/images/logos/riyadh-municipality-official.png',
        status: 'active',
      },
      {
        id: 'p-3',
        nameAr: 'أمانة منطقة القصيم',
        nameEn: 'Al-Qassim Region Municipality',
        categoryAr: 'أمانات المناطق',
        categoryEn: 'Municipality',
        badgeAr: 'عقود صيانة وتشغيل',
        badgeEn: 'O&M Contracts',
        projectsCount: 8,
        logoUrl: '/images/logos/qassim-user-logo.png',
        status: 'active',
      },
      {
        id: 'p-4',
        nameAr: 'وزارة الحرس الوطني',
        nameEn: 'Ministry of National Guard',
        categoryAr: 'قطاع أمني وسيادي',
        categoryEn: 'Defense & Security',
        badgeAr: 'مواقع عسكرية خاصة',
        badgeEn: 'Special Military Sites',
        projectsCount: 5,
        logoUrl: '/images/logos/national-guard-user-logo.png',
        status: 'active',
      },
      {
        id: 'p-5',
        nameAr: 'بلدية محافظة الخرج',
        nameEn: 'Al-Kharj Governorate Municipality',
        categoryAr: 'بلديات المحافظات',
        categoryEn: 'Governorate Municipality',
        badgeAr: 'تصريف سيول وطرق',
        badgeEn: 'Drainage & Roads',
        projectsCount: 9,
        logoUrl: '/images/logos/kharj-user-logo.jpg',
        status: 'active',
      },
      {
        id: 'p-6',
        nameAr: 'بلدية محافظة الزلفي',
        nameEn: 'Al-Zulfi Governorate Municipality',
        categoryAr: 'بلديات المحافظات',
        categoryEn: 'Governorate Municipality',
        badgeAr: 'تأسيس وتطوير ميداني',
        badgeEn: 'Site Preparation',
        projectsCount: 6,
        logoUrl: '/images/logos/zulfi-user-logo.jpg',
        status: 'active',
      },
      {
        id: 'p-7',
        nameAr: 'المركز السعودي للأعمال',
        nameEn: 'Saudi Business Center',
        categoryAr: 'منظومة الأعمال',
        categoryEn: 'Business Hub',
        badgeAr: 'منصة ممارسة الأعمال',
        badgeEn: 'Certified Business Hub',
        projectsCount: 12,
        logoUrl: '/images/logos/saudi-business-center.jpg',
        status: 'active',
      },
      {
        id: 'p-8',
        nameAr: 'وزارة التجارة',
        nameEn: 'Ministry of Commerce',
        categoryAr: 'سجل تجاري معتمد',
        categoryEn: 'Commerce Ministry',
        badgeAr: 'سجل تجاري موثق',
        badgeEn: 'Verified CR',
        projectsCount: 10,
        logoUrl: '/images/logos/ministry-of-commerce.png',
        status: 'active',
      },
    ]);
  },

  savePartnerItem: (item: Partial<PartnerItem>): PartnerItem => {
    const list = storageAdapter.getPartners();
    const index = list.findIndex((p) => p.id === item.id);
    let updated: PartnerItem;

    if (index >= 0) {
      updated = {
        ...list[index],
        ...item,
      } as PartnerItem;
      list[index] = updated;
    } else {
      updated = {
        id: item.id || `partner-${Date.now()}`,
        nameAr: item.nameAr || '',
        nameEn: item.nameEn || '',
        categoryAr: item.categoryAr || 'جهات حكومية',
        categoryEn: item.categoryEn || 'Government Entities',
        badgeAr: item.badgeAr || 'شريك معتمد',
        badgeEn: item.badgeEn || 'Official Partner',
        projectsCount: item.projectsCount ?? 5,
        logoUrl: item.logoUrl || '',
        status: item.status || 'active',
      };
      list.unshift(updated);
    }

    setItem(STORAGE_KEYS.PARTNERS, list);
    storageAdapter.addLog({
      action: index >= 0 ? 'update' : 'create',
      entity: 'service',
      entityTitle: `شريك / جهة متعاونة: ${updated.nameAr}`,
      adminName: 'مدير النظام',
    });

    return updated;
  },

  deletePartnerItem: (id: string): void => {
    const list = storageAdapter.getPartners();
    const target = list.find((p) => p.id === id);
    setItem(STORAGE_KEYS.PARTNERS, list.filter((p) => p.id !== id));

    if (target) {
      storageAdapter.addLog({
        action: 'delete',
        entity: 'service',
        entityTitle: `حذف شريك: ${target.nameAr}`,
        adminName: 'مدير النظام',
      });
    }
  },

  togglePartnerPublish: (id: string): boolean => {
    const list = storageAdapter.getPartners();
    const item = list.find((p) => p.id === id);
    if (!item) return false;
    item.isPublished = item.isPublished === false ? true : false;
    storageAdapter.savePartnerItem(item);
    return item.isPublished;
  },

  // --- Rich Articles & Custom Content CMS ---
  getArticles: (): RichArticleItem[] => {
    return getItem<RichArticleItem[]>(STORAGE_KEYS.RICH_ARTICLES, INITIAL_RICH_ARTICLES);
  },

  getPublicArticles: (): RichArticleItem[] => {
    const list = storageAdapter.getArticles();
    const now = new Date();
    return list.filter((a) => {
      if (a.status === 'published') return true;
      if (a.status === 'scheduled') {
        const pubDate = new Date(a.scheduledAt || a.publishedAt);
        return !isNaN(pubDate.getTime()) && pubDate <= now;
      }
      return false;
    });
  },

  getArticleById: (id: string): RichArticleItem | undefined => {
    const articles = storageAdapter.getArticles();
    return articles.find((a) => a.id === id);
  },

  getArticleBySlug: (slug: string): RichArticleItem | undefined => {
    const articles = storageAdapter.getArticles();
    return articles.find((a) => a.slug === slug);
  },

  saveArticle: (article: Partial<RichArticleItem> & { titleAr: string }): RichArticleItem => {
    const articles = storageAdapter.getArticles();
    const index = articles.findIndex((a) => a.id === article.id);
    let updated: RichArticleItem;

    const now = new Date().toISOString();
    const slug =
      article.slug ||
      article.titleAr
        .trim()
        .toLowerCase()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      `article-${Date.now()}`;

    if (index >= 0) {
      updated = {
        ...articles[index],
        ...article,
        updatedAt: now,
      } as RichArticleItem;
      articles[index] = updated;
    } else {
      updated = {
        id: article.id || `art-${Date.now()}`,
        slug,
        titleAr: article.titleAr,
        titleEn: article.titleEn || article.titleAr,
        excerptAr: article.excerptAr || '',
        excerptEn: article.excerptEn || '',
        contentAr: article.contentAr || '',
        contentEn: article.contentEn || '',
        category: article.category || 'news',
        categoryAr: article.categoryAr || 'أخبار وتقارير',
        categoryEn: article.categoryEn || 'News & Reports',
        coverImage: article.coverImage || '/images/projects/project-1.jpg',
        galleryImages: article.galleryImages || [],
        author: article.author || {
          nameAr: 'الإدارة الفنية والإعلامية',
          nameEn: 'Technical & Media Dept',
          roleAr: 'هيئة التحرير',
          roleEn: 'Editorial Board',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        },
        publishedAt: article.publishedAt || now,
        scheduledAt: article.scheduledAt,
        updatedAt: now,
        status: article.status || 'published',
        tags: article.tags || ['بنية تحتية', 'طرق', 'أمانة الرياض'],
        readingTimeMinutes: article.readingTimeMinutes || 3,
        featured: article.featured ?? false,
      };
      articles.unshift(updated);
    }

    setItem(STORAGE_KEYS.RICH_ARTICLES, articles);
    storageAdapter.addLog({
      action: index >= 0 ? 'update' : 'create',
      entity: 'project',
      entityTitle: `مقال/محتوى غني: ${updated.titleAr}`,
      adminName: 'مدير النظام',
    });

    return updated;
  },

  deleteArticle: (id: string): void => {
    const articles = storageAdapter.getArticles();
    const target = articles.find((a) => a.id === id);
    setItem(STORAGE_KEYS.RICH_ARTICLES, articles.filter((a) => a.id !== id));

    if (target) {
      storageAdapter.addLog({
        action: 'delete',
        entity: 'project',
        entityTitle: `حذف مقال: ${target.titleAr}`,
        adminName: 'مدير النظام',
      });
    }
  },

  toggleArticlePublish: (id: string): boolean => {
    const articles = storageAdapter.getArticles();
    const index = articles.findIndex((a) => a.id === id);
    if (index >= 0) {
      const isCurrentlyPublished = articles[index].status === 'published';
      articles[index].status = isCurrentlyPublished ? 'draft' : 'published';
      articles[index].isPublished = !isCurrentlyPublished;
      setItem(STORAGE_KEYS.RICH_ARTICLES, articles);
      storageAdapter.addLog({
        action: 'update',
        entity: 'project',
        entityTitle: `${!isCurrentlyPublished ? 'نشر' : 'إلغاء نشر'} مقال: ${articles[index].titleAr}`,
        adminName: 'مدير النظام',
      });
      return !isCurrentlyPublished;
    }
    return false;
  },

  // --- Site Pages Visual Content CMS (About, Chairman Message, Contact) ---
  getSitePagesContent: (): SitePagesContentConfig => {
    return getItem<SitePagesContentConfig>(STORAGE_KEYS.SITE_PAGES_CONTENT, INITIAL_SITE_PAGES_CONTENT);
  },

  saveSitePagesContent: (config: SitePagesContentConfig): SitePagesContentConfig => {
    setItem(STORAGE_KEYS.SITE_PAGES_CONTENT, config);
    storageAdapter.addLog({
      action: 'update',
      entity: 'settings',
      entityTitle: 'تحديث محتوى صفحات الموقع المرئي',
      adminName: 'مدير النظام',
    });
    return config;
  },

  getAboutContent: (): SitePagesContentConfig['about'] => {
    const pages = storageAdapter.getSitePagesContent();
    return pages.about;
  },

  saveAboutContent: (about: Partial<SitePagesContentConfig['about']>): SitePagesContentConfig['about'] => {
    const pages = storageAdapter.getSitePagesContent();
    pages.about = { ...pages.about, ...about };
    storageAdapter.saveSitePagesContent(pages);
    return pages.about;
  },

  getChairmanContent: (): SitePagesContentConfig['chairmanMessage'] => {
    const pages = storageAdapter.getSitePagesContent();
    return pages.chairmanMessage;
  },

  saveChairmanContent: (chairman: Partial<SitePagesContentConfig['chairmanMessage']>): SitePagesContentConfig['chairmanMessage'] => {
    const pages = storageAdapter.getSitePagesContent();
    pages.chairmanMessage = { ...pages.chairmanMessage, ...chairman };
    storageAdapter.saveSitePagesContent(pages);
    return pages.chairmanMessage;
  },

  getContactContent: (): SitePagesContentConfig['contact'] => {
    const pages = storageAdapter.getSitePagesContent();
    return pages.contact;
  },

  saveContactContent: (contact: Partial<SitePagesContentConfig['contact']>): SitePagesContentConfig['contact'] => {
    const pages = storageAdapter.getSitePagesContent();
    pages.contact = { ...pages.contact, ...contact };
    storageAdapter.saveSitePagesContent(pages);
    return pages.contact;
  },

  // --- Activity Logs ---
  getLogs: (): ActivityLog[] => {
    return getItem<ActivityLog[]>(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  },

  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const logs = storageAdapter.getLogs();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    logs.unshift(newLog);
    // Keep max 50 recent logs
    setItem(STORAGE_KEYS.LOGS, logs.slice(0, 50));
  },

  // --- Reset to Factory Defaults ---
  resetAllToDefaults: () => {
    if (!isBrowser()) return;
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },

  // --- Export & Import All Local CMS Data ---
  exportAllData: (): string => {
    const payload: { version: string; exportedAt: string; data: Record<string, unknown> } = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {},
    };
    Object.values(STORAGE_KEYS).forEach((key) => {
      const item = isBrowser() ? localStorage.getItem(key) : memoryStore[key];
      if (item) {
        try {
          payload.data[key] = JSON.parse(item);
        } catch {
          payload.data[key] = item;
        }
      }
    });
    return JSON.stringify(payload, null, 2);
  },

  importAllData: (jsonString: string): { success: boolean; count: number; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.data || parsed;
      let count = 0;
      Object.entries(data).forEach(([key, val]) => {
        if (typeof key === 'string' && key.startsWith('gulf_hills_')) {
          setItem(key, val);
          count++;
        }
      });
      storageAdapter.addLog({
        action: 'update',
        entity: 'settings',
        entityTitle: `استيراد نسخة احتياطية محلية (${count} مفتاح بيانات)`,
        adminName: 'مدير النظام',
      });
      return { success: true, count };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format';
      return { success: false, count: 0, error: msg };
    }
  },

  // ---------------- MEDIA LIBRARY ----------------
  getMediaItems: (): MediaItem[] => {
    return getItem<MediaItem[]>(STORAGE_KEYS.MEDIA_ITEMS, INITIAL_MEDIA_ITEMS);
  },

  saveMediaItem: (item: Partial<MediaItem>): MediaItem => {
    const list = storageAdapter.getMediaItems();
    let savedItem: MediaItem;
    if (item.id) {
      savedItem = {
        id: item.id,
        name: item.name || 'ملف وسائط',
        url: item.url || '',
        type: item.type || 'image',
        sizeBytes: item.sizeBytes,
        width: item.width,
        height: item.height,
        uploadedAt: item.uploadedAt || new Date().toISOString(),
        category: item.category || 'general',
        altAr: item.altAr,
        altEn: item.altEn,
      };
      const updated = list.map((m) => (m.id === item.id ? savedItem : m));
      setItem(STORAGE_KEYS.MEDIA_ITEMS, updated);
      storageAdapter.addLog({
        action: 'update',
        entity: 'media',
        entityTitle: `تحديث وسائط: ${savedItem.name}`,
        adminName: 'مدير النظام',
      });
    } else {
      savedItem = {
        id: `media-${Date.now()}`,
        name: item.name || 'ملف وسائط جديد',
        url: item.url || '',
        type: item.type || 'image',
        sizeBytes: item.sizeBytes,
        width: item.width,
        height: item.height,
        uploadedAt: new Date().toISOString(),
        category: item.category || 'general',
        altAr: item.altAr,
        altEn: item.altEn,
      };
      const updated = [savedItem, ...list];
      setItem(STORAGE_KEYS.MEDIA_ITEMS, updated);
      storageAdapter.addLog({
        action: 'create',
        entity: 'media',
        entityTitle: `رفع وسائط جديدة: ${savedItem.name}`,
        adminName: 'مدير النظام',
      });
    }
    return savedItem;
  },

  deleteMediaItem: (id: string): boolean => {
    const list = storageAdapter.getMediaItems();
    const target = list.find((m) => m.id === id);
    const updated = list.filter((m) => m.id !== id);
    setItem(STORAGE_KEYS.MEDIA_ITEMS, updated);
    storageAdapter.addLog({
      action: 'delete',
      entity: 'media',
      entityTitle: `حذف وسائط: ${target?.name || id}`,
      adminName: 'مدير النظام',
    });
    return true;
  },

  // ---------------- SEO SETTINGS ----------------
  getSeoSettings: (): SeoSettingsConfig => {
    return getItem<SeoSettingsConfig>(STORAGE_KEYS.SEO_SETTINGS, INITIAL_SEO_SETTINGS);
  },

  saveSeoSettings: (settings: SeoSettingsConfig): SeoSettingsConfig => {
    setItem(STORAGE_KEYS.SEO_SETTINGS, settings);
    storageAdapter.addLog({
      action: 'update',
      entity: 'settings',
      entityTitle: 'تحديث إعدادات محركات البحث وميتا الصفحات (SEO Meta)',
      adminName: 'مدير النظام',
    });
    return settings;
  },

  // ---------------- TIMELINE MILESTONES ----------------
  getTimelineItems: (): TimelineMilestoneItem[] => {
    return getItem<TimelineMilestoneItem[]>(STORAGE_KEYS.TIMELINE_ITEMS, INITIAL_TIMELINE_ITEMS);
  },

  saveTimelineItem: (item: Partial<TimelineMilestoneItem>): TimelineMilestoneItem => {
    const list = storageAdapter.getTimelineItems();
    let savedItem: TimelineMilestoneItem;
    if (item.id && list.some((m) => m.id === item.id)) {
      savedItem = {
        id: item.id,
        year: item.year || '2026',
        dateLabelAr: item.dateLabelAr || '',
        dateLabelEn: item.dateLabelEn || '',
        titleAr: item.titleAr || '',
        titleEn: item.titleEn || '',
        subtitleAr: item.subtitleAr || '',
        subtitleEn: item.subtitleEn || '',
        clientAr: item.clientAr || '',
        clientEn: item.clientEn || '',
        locationAr: item.locationAr || '',
        locationEn: item.locationEn || '',
        badgeAr: item.badgeAr || '',
        badgeEn: item.badgeEn || '',
        regDocAr: item.regDocAr || '',
        regDocEn: item.regDocEn || '',
        colorCard: item.colorCard || '0, 176, 240',
        descriptionAr: item.descriptionAr || '',
        descriptionEn: item.descriptionEn || '',
        highlightsAr: item.highlightsAr || [],
        highlightsEn: item.highlightsEn || [],
        image: item.image || '/images/projects/project-1.jpg',
        link: item.link || '/about',
      };
      const updated = list.map((m) => (m.id === item.id ? savedItem : m));
      setItem(STORAGE_KEYS.TIMELINE_ITEMS, updated);
      storageAdapter.addLog({
        action: 'update',
        entity: 'settings',
        entityTitle: `تعديل محطة الخط الزمني لعام ${savedItem.year}: ${savedItem.titleAr}`,
        adminName: 'مدير النظام',
      });
    } else {
      savedItem = {
        id: item.id || `m-${Date.now()}`,
        year: item.year || '2026',
        dateLabelAr: item.dateLabelAr || '',
        dateLabelEn: item.dateLabelEn || '',
        titleAr: item.titleAr || '',
        titleEn: item.titleEn || '',
        subtitleAr: item.subtitleAr || '',
        subtitleEn: item.subtitleEn || '',
        clientAr: item.clientAr || '',
        clientEn: item.clientEn || '',
        locationAr: item.locationAr || '',
        locationEn: item.locationEn || '',
        badgeAr: item.badgeAr || '',
        badgeEn: item.badgeEn || '',
        regDocAr: item.regDocAr || '',
        regDocEn: item.regDocEn || '',
        colorCard: item.colorCard || '0, 176, 240',
        descriptionAr: item.descriptionAr || '',
        descriptionEn: item.descriptionEn || '',
        highlightsAr: item.highlightsAr || [],
        highlightsEn: item.highlightsEn || [],
        image: item.image || '/images/projects/project-1.jpg',
        link: item.link || '/about',
      };
      const updated = [...list, savedItem];
      setItem(STORAGE_KEYS.TIMELINE_ITEMS, updated);
      storageAdapter.addLog({
        action: 'create',
        entity: 'settings',
        entityTitle: `إضافة محطة خط زمني جديدة لعام ${savedItem.year}: ${savedItem.titleAr}`,
        adminName: 'مدير النظام',
      });
    }
    return savedItem;
  },

  deleteTimelineItem: (id: string): boolean => {
    const list = storageAdapter.getTimelineItems();
    const target = list.find((m) => m.id === id);
    const updated = list.filter((m) => m.id !== id);
    setItem(STORAGE_KEYS.TIMELINE_ITEMS, updated);
    storageAdapter.addLog({
      action: 'delete',
      entity: 'settings',
      entityTitle: `حذف محطة الخط الزمني: ${target?.year || id}`,
      adminName: 'مدير النظام',
    });
    return true;
  },

  reorderTimelineItems: (newItems: TimelineMilestoneItem[]): void => {
    setItem(STORAGE_KEYS.TIMELINE_ITEMS, newItems);
    storageAdapter.addLog({
      action: 'update',
      entity: 'settings',
      entityTitle: `إعادة ترتيب محطات الخط الزمني (${newItems.length} محطة)`,
      adminName: 'مدير النظام',
    });
  },

  reorderPartners: (newItems: PartnerItem[]): void => {
    setItem(STORAGE_KEYS.PARTNERS, newItems);
    storageAdapter.addLog({
      action: 'update',
      entity: 'settings',
      entityTitle: `إعادة ترتيب الشركاء والجهات (${newItems.length} شريك)`,
      adminName: 'مدير النظام',
    });
  },

  // ---------------- SAUDI REGIONS MAP ----------------
  getSaudiRegions: (): SaudiRegionItem[] => {
    return getItem<SaudiRegionItem[]>(STORAGE_KEYS.SAUDI_REGIONS, INITIAL_SAUDI_REGIONS);
  },

  saveSaudiRegion: (region: Partial<SaudiRegionItem>): SaudiRegionItem => {
    const list = storageAdapter.getSaudiRegions();
    // Strict boundary clamping [0, 100] for coordinates
    const clampedPinX = Math.max(0, Math.min(100, Number(region.pinX ?? 50)));
    const clampedPinY = Math.max(0, Math.min(100, Number(region.pinY ?? 50)));
    const safeProjectCount = Math.max(0, Number(region.projectCount ?? 0));

    let saved: SaudiRegionItem;
    if (region.id && list.some((r) => r.id === region.id)) {
      saved = {
        id: region.id,
        nameAr: region.nameAr || '',
        nameEn: region.nameEn || '',
        projectCount: safeProjectCount,
        activeKm: region.activeKm || '',
        pinX: clampedPinX,
        pinY: clampedPinY,
        highlightColor: region.highlightColor || '#0070BA',
        sampleProjects: region.sampleProjects || [],
      };
      const updated = list.map((r) => (r.id === region.id ? saved : r));
      setItem(STORAGE_KEYS.SAUDI_REGIONS, updated);
      storageAdapter.addLog({
        action: 'update',
        entity: 'settings',
        entityTitle: `تعديل بيانات منطقة الخريطة: ${saved.nameAr}`,
        adminName: 'مدير النظام',
      });
    } else {
      saved = {
        id: region.id || `reg-${Date.now()}`,
        nameAr: region.nameAr || '',
        nameEn: region.nameEn || '',
        projectCount: safeProjectCount,
        activeKm: region.activeKm || '',
        pinX: clampedPinX,
        pinY: clampedPinY,
        highlightColor: region.highlightColor || '#0070BA',
        sampleProjects: region.sampleProjects || [],
      };
      const updated = [...list, saved];
      setItem(STORAGE_KEYS.SAUDI_REGIONS, updated);
      storageAdapter.addLog({
        action: 'create',
        entity: 'settings',
        entityTitle: `إضافة منطقة خريطة جديدة: ${saved.nameAr}`,
        adminName: 'مدير النظام',
      });
    }
    return saved;
  },

  deleteSaudiRegion: (id: string): boolean => {
    const list = storageAdapter.getSaudiRegions();
    const updated = list.filter((r) => r.id !== id);
    setItem(STORAGE_KEYS.SAUDI_REGIONS, updated);
    return true;
  },

  reorderSaudiRegions: (newItems: SaudiRegionItem[]): void => {
    setItem(STORAGE_KEYS.SAUDI_REGIONS, newItems);
  },

  resetToInitialSeed: () => {
    if (!isBrowser()) return;
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};

// Initial Seed Constants for Header, Footer, HomeContent, Equipment
const INITIAL_HEADER_CONFIG: HeaderConfig = {
  announcement: {
    isEnabled: true,
    textAr: 'مركز العمليات والطوارئ الميدانية: متاح 24/7 لخدمة الأمانات والبلديات بالمملكة',
    textEn: 'Field Operations & Emergency Center: 24/7 Service for Municipalities',
    phone: '00966115126774',
    buttonTextAr: 'اتصال مباشر',
    buttonTextEn: 'Direct Call',
    buttonLink: 'tel:00966115126774',
    bgColor: '#002060',
  },
  ctaButton: {
    isEnabled: true,
    textAr: 'طلب عرض سعر',
    textEn: 'Request a Quote',
    link: '/contact',
  },
  menuItems: [
    { id: 'm-1', labelAr: 'الرئيسية', labelEn: 'Home', path: '/', order: 1, isEnabled: true },
    { id: 'm-2', labelAr: 'عن الشركة', labelEn: 'About Us', path: '/about', order: 2, isEnabled: true },
    { id: 'm-3', labelAr: 'رسالة الرئيس', labelEn: "Chairman's Message", path: '/chairman-message', order: 3, isEnabled: true },
    { id: 'm-4', labelAr: 'الخدمات والأعمال', labelEn: 'Services', path: '/services', order: 4, isEnabled: true },
    { id: 'm-5', labelAr: 'الأسطول والمعدات', labelEn: 'Fleet & Equipment', path: '/equipment', order: 5, isEnabled: true, badgeAr: 'جديد', badgeEn: 'New' },
    { id: 'm-6', labelAr: 'سجل المشاريع', labelEn: 'Projects', path: '/projects', order: 6, isEnabled: true },
    { id: 'm-7', labelAr: 'فريق العمل', labelEn: 'Team', path: '/team', order: 7, isEnabled: true },
    { id: 'm-8', labelAr: 'الشهادات والاعتمادات', labelEn: 'Certificates', path: '/certificates', order: 8, isEnabled: true },
    { id: 'm-9', labelAr: 'الأخبار والمستجدات', labelEn: 'News', path: '/news', order: 9, isEnabled: true },
    { id: 'm-10', labelAr: 'تواصل معنا', labelEn: 'Contact Us', path: '/contact', order: 10, isEnabled: true },
  ],
  logo: {
    lightUrl: '/logo-light.png',
    darkUrl: '/logo-dark.png',
    height: 80,
  },
};

const INITIAL_FOOTER_CONFIG: FooterConfig = {
  aboutTextAr: 'شركة وطنية رائدة ومصنفة في تنفيذ مشاريع البنية التحتية، سفلتة الطرق، تمديد شبكات تصريف مياه الأمطار والسيول، وتشغيل وصيانة المرافق الحكومية والمقابر بالمملكة العربية السعودية وفق مستهدفات رؤية 2030.',
  aboutTextEn: 'A leading classified national company executing infrastructure, road paving, stormwater drainage networks, and municipal facilities operation in Saudi Arabia under Vision 2030.',
  copyrightAr: '© 2026 شركة هضاب الخليج العربي للمقاولات. جميع الحقوق محفوظة.',
  copyrightEn: '© 2026 Arabian Gulf Hills Contracting Company. All rights reserved.',
  quickLinks: [
    { id: 'fl-1', labelAr: 'الرئيسية', labelEn: 'Home', path: '/' },
    { id: 'fl-2', labelAr: 'عن الشركة وتاريخنا', labelEn: 'About Us', path: '/about' },
    { id: 'fl-3', labelAr: 'سجل المشاريع الحكومية', labelEn: 'Projects', path: '/projects' },
    { id: 'fl-4', labelAr: 'أسطول الآليات والمعدات', labelEn: 'Equipment Fleet', path: '/equipment' },
    { id: 'fl-5', labelAr: 'طلب عرض سعر / تواصل معنا', labelEn: 'Contact Us', path: '/contact' },
  ],
  engineeringLinks: [
    { id: 'el-1', labelAr: 'صيانة وسفلتة الطرق وشبكات الإنارة', labelEn: 'Road Paving & Maintenance', path: '/services' },
    { id: 'el-2', labelAr: 'شبكات تصريف السيول ومياه الأمطار', labelEn: 'Stormwater Drainage', path: '/services' },
    { id: 'el-3', labelAr: 'تشغيل وصيانة مقابر منطقة الرياض', labelEn: 'Cemeteries O&M', path: '/services' },
    { id: 'el-4', labelAr: 'تشغيل وصيانة المباني والمرافق البلدية', labelEn: 'Municipal Facilities O&M', path: '/services' },
    { id: 'el-5', labelAr: 'معالجة التشوه البصري وبلاغات 940', labelEn: 'Visual Pollution Cleanup', path: '/services' },
  ],
  legalLinks: [
    { id: 'll-1', labelAr: 'شهادات التصنيف والآيزو الرسمية', labelEn: 'Certificates & ISO', path: '/certificates' },
    { id: 'll-2', labelAr: 'معايير الجودة والسلامة المهنية', labelEn: 'Safety & Compliance', path: '/certificates' },
    { id: 'll-3', labelAr: 'شهادة المحتوى المحلي والامتثال', labelEn: 'Local Content', path: '/certificates' },
  ],
  socials: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/gulf-hills', icon: 'linkedin', isEnabled: true },
    { platform: 'Twitter', url: 'https://twitter.com/gulf_hills', icon: 'twitter', isEnabled: true },
    { platform: 'YouTube', url: 'https://youtube.com/gulf_hills', icon: 'youtube', isEnabled: true },
  ],
  contact: {
    phone: '00966115126774',
    email: 'info@hedabkh.com.sa',
    cr: '7023600179',
    vat: '310989009900003',
    addressAr: '3140 الشيخ صالح بن غصون، الملز، REMA7501, 7501، الرياض 12832',
    addressEn: '3140 Sheikh Saleh Ibn Ghoson, Al Malaz, REMA7501, 7501, Riyadh 12832',
    mapUrl: 'https://maps.app.goo.gl/o8L6PDszKYuXCJzT9',
  },
};

const INITIAL_HOME_CONTENT: HomeContentConfig = {
  hero: {
    headlineAr: 'ريادة هندسية تصيغ',
    headlineEn: 'Pioneering Engineering Shaping',
    highlightAr: 'البنية التحتية والمستقبل',
    highlightEn: 'Infrastructure & Future',
    badgeAr: 'شركة هضاب الخليج العربي للمقاولات',
    badgeEn: 'Gulf Hills Contracting Co.',
    unifiedNumber: '7023600179',
    descriptionAr: 'ندير وننفذ ستة قطاعات هندسية متكاملة بالعاصمة والمحافظات؛ تشمل شق وتعبيد الطرق، مد شبكات تصريف مياه الأمطار والسيول، وحفر وتأهيل المقابر، مدعومين بأسطول هندسي نشط ومعايير امتثال موثقة لدى أمانة منطقة الرياض والوزارات.',
    descriptionEn: 'Directing six integrated engineering sectors across the capital and governorates: asphalt road construction, flood & rainwater drainage networks, and cemetery management under certified municipal standards.',
    primaryBtnTextAr: 'استكشف قطاعاتنا والأسطول',
    primaryBtnTextEn: 'Explore Sectors & Fleet',
    primaryBtnLink: '/services',
    secondaryBtnTextAr: 'طلب عرض سعر مباشر',
    secondaryBtnTextEn: 'Request Immediate Quote',
    secondaryBtnLink: '/contact',
    bentoImage: '/images/equipment/wirtgen-milling-machine.jpg',
    bentoBadgeAr: 'أسطول الآليات والمعدات الثقيلة',
    bentoBadgeEn: 'Heavy Machinery & Fleet',
  },
  aboutPreview: {
    tagAr: 'الريادة والالتزام الوطني',
    tagEn: 'NATIONAL EXCELLENCE',
    titleAr: 'أكثر من 15 عاماً في صياغة البنية التحتية والمقاولات السيادية',
    titleEn: 'Over 15 Years of Infrastructure & Municipal Civil Excellence',
    descriptionAr: 'تأسست شركة هضاب الخليج لتكون الشريك الاستراتيجي المعتمد لأمانات المناطق والوزارات في تنفيذ مشاريع الطرق، تصريف السيول، وتشغيل المرافق بكفاءة وسرعة استجابة لا تضاهى.',
    descriptionEn: 'Arabian Gulf Hills was founded to be the premier trusted partner for Saudi municipal authorities, delivering road paving, stormwater drainage, and facility operations with unrivaled efficiency.',
    image: '/images/before-after/road-paving-after.jpg',
    storyBtnTextAr: 'اقرأ قصة نجاحنا بالتفصيل',
    storyBtnTextEn: 'Read Our Full Story',
    storyBtnLink: '/about',
  },
  servicesPreview: {
    tagAr: 'القطاعات التشغيلية',
    tagEn: 'OPERATIONAL SECTORS',
    titleAr: 'حلول متكاملة تغطي كافة مجالات التشييد والتشغيل',
    titleEn: 'Comprehensive Engineering & Municipal Solutions',
    subtitleAr: 'نقدم حلولاً هندسية متقدمة تدعم التنمية العمرانية المستدامة بالمملكة.',
    subtitleEn: 'Delivering advanced engineering solutions supporting sustainable urban development in Saudi Arabia.',
  },
  projectsPreview: {
    tagAr: 'سجل المشاريع الميدانية',
    tagEn: 'PROJECTS RECORD',
    titleAr: 'مشاريع حكومية وبلدية نفذت بأعلى معايير الدقة',
    titleEn: 'Government & Municipal Projects Executed with Precision',
    subtitleAr: 'استعرض 25 مشروعاً حيوياً تم تنفيذها لصالح أمانة الرياض وأمانة القصيم والبلديات التابعة.',
    subtitleEn: 'Explore 25 vital projects executed for Riyadh Municipality, Al-Qassim Municipality, and affiliated branches.',
  },
  saudiMap: {
    tagAr: 'الانتشار الجغرافي الميداني',
    tagEn: 'GEOGRAPHIC REACH',
    titleAr: 'تغطية ميدانية شاملة في محافظات ومناطق المملكة',
    titleEn: 'Comprehensive Field Reach Across Saudi Governorates',
    subtitleAr: 'تنتشر فرقنا التشغيلية ومعداتنا الثقيلة في الرياض، الخرج، القصيم، الزلفي، الغاط، ورماح.',
    subtitleEn: 'Our operational teams and heavy fleets are deployed across Riyadh, Al-Kharj, Al-Qassim, Al-Zulfi, Al-Ghat, and Rmahh.',
    activeKmTextAr: '+780 كم شبكات وطرق',
    activeKmTextEn: '+780 KM Roads & Networks',
    regionsCountTextAr: '6 محافظات رئيسية',
    regionsCountTextEn: '6 Key Governorates',
  },
  vision2030: {
    titleAr: 'شريك فاعل في تحقيق مستهدفات رؤية المملكة 2030',
    titleEn: 'Active Partner in Saudi Vision 2030 Milestones',
    descriptionAr: 'نلتزم برفع كفاءة البنية التحتية، تحسين المشهد الحضري وإزالة التشوهات البصرية، وتطبيق أعلى معايير الاستدامة البيئية والسلامة المهنية.',
    descriptionEn: 'Committed to elevating infrastructure efficiency, improving urban landscapes, visual pollution removal, and occupational safety.',
    image: '/images/vision-2030.jpg',
  },
  timeline3D: {
    tagAr: 'المسار الزمني للإنجاز',
    tagEn: 'TIMELINE TRACKER',
    titleAr: 'مسيرة متواصلة من العقود والمشاريع الناجحة',
    titleEn: 'Continuous Legacy of Successful Contracts',
    subtitleAr: 'استكشف تطور مشاريعنا الميدانية عبر الأسطوانة التفاعلية ثلاثية الأبعاد.',
    subtitleEn: 'Explore the chronological evolution of our field projects via our interactive 3D timeline cylinder.',
  },
};

const INITIAL_EQUIPMENT_FLEET: EquipmentItem[] = [
  {
    id: 'eq-1',
    nameAr: 'كاشطة أسفلت هيدروليكية ذاتية الحركة',
    nameEn: 'Self-Propelled Hydraulic Asphalt Milling Machine',
    categoryAr: 'صيانة وكشط الطرق',
    categoryEn: 'Road Milling & Maintenance',
    model: 'Wirtgen W 2000 / W 210 Fi',
    brand: 'Wirtgen Group (Germany)',
    count: 6,
    image: '/images/equipment/wirtgen-milling-machine.jpg',
    specsAr: ['عرض الكشط: 2.0 - 2.2 متر', 'عمق الكشط: حتى 330 ملم', 'محرك ديزل: 450 - 560 كيلوواط', 'نظام توجيه ليزري دقيق ثلاثي الأبعاد'],
    specsEn: ['Milling Width: 2.0 - 2.2 m', 'Milling Depth: up to 330 mm', 'Engine Power: 450 - 560 kW', '3D Laser Surface Levelling'],
    status: 'active',
  },
  {
    id: 'eq-2',
    nameAr: 'رصاصة أسفلت ثنائية اهتزازية متطورة',
    nameEn: 'Tandem Vibratory Asphalt Roller',
    categoryAr: 'صيانة وكشط الطرق',
    categoryEn: 'Road Milling & Maintenance',
    model: 'Dynapac CC522 / CC624HF',
    brand: 'Dynapac (Sweden)',
    count: 12,
    image: '/images/equipment/dynapac-asphalt-roller.jpg',
    specsAr: ['الوزن التشغيلي: 12.5 طن', 'عرض الأسطوانة: 1950 ملم', 'تردد الاهتزاز المزدوج: 51/67 هرتز', 'نظام رش مائي مضغوط مع تحكم إلكتروني بالدمك'],
    specsEn: ['Operating Weight: 12.5 Ton', 'Drum Width: 1950 mm', 'Dual Vibration Frequency: 51/67 Hz', 'Pressurized Water Sprinkler with Compaction Meter'],
    status: 'active',
  },
  {
    id: 'eq-3',
    nameAr: 'حفار هيدروليكي ثقيل لتمديد الشبكات والسيول',
    nameEn: 'Heavy Hydraulic Excavator for Drainage Lines',
    categoryAr: 'شبكات تصريف السيول',
    categoryEn: 'Stormwater Drainage Networks',
    model: 'Caterpillar 320D / 336D L',
    brand: 'Caterpillar (USA)',
    count: 14,
    image: '/images/equipment/caterpillar-excavator.jpg',
    specsAr: ['الوزن التشغيلي: 22 - 36 طن', 'سعة الباكت: 1.4 - 2.2 م³', 'أقصى عمق حفر: 7.5 متر', 'قوة رفع هيدروليكية لأنابيب السيول الخرسانية 2400 ملم'],
    specsEn: ['Operating Weight: 22 - 36 Ton', 'Bucket Capacity: 1.4 - 2.2 m³', 'Max Digging Depth: 7.5 m', 'Hydraulic Crane Lift for 2400mm Concrete Pipes'],
    status: 'active',
  },
  {
    id: 'eq-4',
    nameAr: 'شاحنة قلاب ثقيلة لنقل الهدميات والأنقاض',
    nameEn: 'Heavy Tipper Dump Truck',
    categoryAr: 'إزالة التشوه البصري ونقل المخلفات',
    categoryEn: 'Debris Removal & Visual Pollution',
    model: 'Mercedes-Benz Actros 3340 / 4140 (6x4 & 8x4)',
    brand: 'Mercedes-Benz (Germany)',
    count: 24,
    image: '/images/equipment/mercedes-actros-tipper.jpg',
    specsAr: ['سعة الصندوق: 24 - 32 م³ (حديد هاردوكس مقاوم للتآكل)', 'حمولة تشغيلية: حتى 40 طن', 'محرك V6 توربو ديزل 400 حصان', 'نظام تفريغ هيدروليكي سريع مع غطاء كهربائي آمن'],
    specsEn: ['Body Capacity: 24 - 32 m³ (Hardox Steel)', 'Payload: up to 40 Ton', 'Engine: V6 Turbo Diesel 400 HP', 'Fast Hydraulic Tipping with Electric Tarpaulin'],
    status: 'active',
  },
  {
    id: 'eq-5',
    nameAr: 'حفار لودر متعدد الأغراض للطوارئ وبلاغات 940',
    nameEn: 'Multi-Purpose Backhoe Loader for 940 Emergencies',
    categoryAr: 'إزالة التشوه البصري ونقل المخلفات',
    categoryEn: 'Debris Removal & Visual Pollution',
    model: 'JCB 3CX / 4CX EcoMax',
    brand: 'JCB (UK)',
    count: 10,
    image: '/images/equipment/jcb-backhoe-loader.jpg',
    specsAr: ['باكت أمامي 4 في 1 بسعة 1.1 م³ مع شوك رفع', 'ذراع حفر خلفي تلسكوبي بعمق 5.8 متر', 'نظام تكسير هيدروليكي سريع للصخور والأسفلت', 'سرعة تنقل 40 كم/س للتدخل السريع في بلاغات الطوارئ'],
    specsEn: ['Front 4-in-1 Bucket: 1.1 m³ with pallet forks', 'Telescopic Backhoe Reach: 5.8 m', 'Quick-attach Hydraulic Breaker', 'Road Speed: 40 km/h for urgent 940 emergency dispatch'],
    status: 'active',
  },
  {
    id: 'eq-6',
    nameAr: 'شاحنة مكنسة شفط شوارع ذاتية الأداء',
    nameEn: 'Road Sweeper & Vacuum Cleaner Truck',
    categoryAr: 'تشغيل وصيانة المرافق والبلديات',
    categoryEn: 'Municipal Operations & Cleaning',
    model: 'Bucher CityCat / Johnston V651',
    brand: 'Bucher Municipal (Switzerland)',
    count: 8,
    image: '/images/projects/project-12.jpg',
    specsAr: ['سعة خزان الأتربة: 6.5 م³', 'عرض الكنس الإجمالي: حتى 3.6 متر', 'نظام شفط توربيني عالي الكفاءة', 'نظام رش مائي مزدوج لمنع انبعاث الغبار'],
    specsEn: ['Hopper Capacity: 6.5 m³', 'Sweeping Width: up to 3.6 m', 'High-power Turbine Suction', 'Dual Dust Suppression Water Sprinklers'],
    status: 'active',
  },
  {
    id: 'eq-7',
    nameAr: 'شاحنة سحب واسترداد سيارات تالفة ومهملة',
    nameEn: 'Hydraulic Recovery Flatbed Tow Truck',
    categoryAr: 'نقل وترحيل السيارات المهملة',
    categoryEn: 'Abandoned Vehicles Relocation',
    model: 'Isuzu FVR / Hino 500 Hydraulic Winch',
    brand: 'Isuzu / Hino (Japan)',
    count: 6,
    image: '/images/projects/project-10.jpg',
    specsAr: ['سطحة هيدروليكية منزلقة بطول 7.5 متر', 'ونش سحب هيدروليكي بقوة 8 طن', 'أذرع تثبيت وتأمين للعجلات', 'إضاءات تحذيرية محيطية وفق اشتراطات المرور'],
    specsEn: ['Hydraulic Sliding Bed: 7.5 m', 'Hydraulic Winch: 8 Ton Capacity', 'Wheel Lift Secure Towing', 'Highway Warning Beacons & Siren System'],
    status: 'active',
  },
];

const INITIAL_RICH_ARTICLES: RichArticleItem[] = [
  {
    id: 'art-1',
    slug: 'riyadh-infrastructure-road-paving-2026',
    titleAr: 'تدشين مشاريع تأهيل وسفلتة شبكات الطرق المتقدمة بالعاصمة الرياض',
    titleEn: 'Inauguration of Advanced Road Rehabilitation & Paving in Riyadh',
    excerptAr: 'ضمن خطط التطوير الحضري المستدام ومعالجة التشوه البصري، أطلقت شركة هضاب الخليج حزمة متكاملة من أعمال قشط وسفلتة المحاور الرئيسية.',
    excerptEn: 'As part of urban development and visual pollution mitigation, Gulf Hills Company launched an integrated road milling and paving package.',
    contentAr: `
      <h2>ريادة هندسية في تطوير البنية التحتية</h2>
      <p>تواصل <strong>شركة هضاب الخليج العربي للمقاولات</strong> تعزيز حضورها الميداني عبر تنفيذ مشاريع نوعية تستهدف رفع كفاءة شبكة الطرق الحضرية وتحقيق أعلى معايير السلامة المرورية وفق مستهدفات <em>رؤية السعودية 2030</em>.</p>
      
      <div class="callout callout-info" style="padding: 16px; border-radius: 12px; background: rgba(0, 112, 186, 0.08); border-left: 4px solid #0070BA; margin: 20px 0;">
        <strong>مؤشر إنجاز قياسي:</strong> تم كشط وسفلتة أكثر من 120,000 متر مربع خلال الربع الأول بدقة ليزرية متقدمة ونسبة استواء تجاوزت 99.4%.
      </div>

      <h3>أبرز المعدات والتقنيات المستخدمة:</h3>
      <ul>
        <li>كاشطات أسفلت ألمانية طراز Wirtgen W 2000 مزودة بحساسات ثلاثية الأبعاد 3D.</li>
        <li>رصاصات أسفلت اهتزازية مزدوجة Dynapac CC522 لضمان الدمك القياسي.</li>
        <li>مختبرات فحص ضبط الجودة الموقعي لكثافة الخلطة الأسفلتية والحرارة.</li>
      </ul>

      <blockquote>
        "نحن ملتزمون بتسليم المشاريع وفق الجداول الزمنية المعتمدة مع تطبيق الكود العمراني السعودي واشتراطات أمانة منطقة الرياض بأعلى درجات الدقة."
        <footer>— الإدارة الفنية والمشاريع، شركة هضاب الخليج العربي</footer>
      </blockquote>
    `,
    contentEn: `
      <h2>Engineering Leadership in Infrastructure Development</h2>
      <p><strong>Arabian Gulf Hills Contracting Company</strong> continues to strengthen its field presence through executing qualitative projects aimed at improving road networks in accordance with <em>Saudi Vision 2030</em>.</p>
      
      <div class="callout callout-info" style="padding: 16px; border-radius: 12px; background: rgba(0, 112, 186, 0.08); border-left: 4px solid #0070BA; margin: 20px 0;">
        <strong>Key Milestone:</strong> Over 120,000 m² of asphalt milling and paving executed with 99.4% smoothness compliance.
      </div>
    `,
    category: 'news',
    categoryAr: 'أخبار ومشاريع',
    categoryEn: 'News & Projects',
    coverImage: '/images/projects/project-1.jpg',
    galleryImages: ['/images/before-after/road-paving-after.jpg', '/images/equipment/wirtgen-milling-machine.jpg'],
    author: {
      nameAr: 'م. فهد القحطاني',
      nameEn: 'Eng. Fahad Al-Qahtani',
      roleAr: 'مدير العمليات الميدانية',
      roleEn: 'Field Operations Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
    status: 'published',
    tags: ['سفلتة الطرق', 'أمانة الرياض', 'البنية التحتية', 'الجودة'],
    readingTimeMinutes: 4,
    featured: true,
  },
  {
    id: 'art-2',
    slug: 'iso-certifications-quality-safety-accreditations',
    titleAr: 'هضاب الخليج العربي تعزز معاييرها بالحصول على شهادات الآيزو ISO 9001 و ISO 45001',
    titleEn: 'Gulf Hills Bolsters Standards with ISO 9001 & ISO 45001 Accreditations',
    excerptAr: 'تتويجاً لالتزامها المستمر بأعلى معايير إدارة الجودة والسلامة والصحة المهنية في كافة المشاريع والعمليات.',
    excerptEn: 'In recognition of its continuous dedication to international quality management and occupational health and safety standards.',
    contentAr: `
      <h2>التزام راسخ بالجودة والسلامة المهنية</h2>
      <p>حصلت <strong>شركة هضاب الخليج العربي للمقاولات</strong> رسمياً على حزمة شهادات الآيزو الدولية المعتمدة:</p>
      <ul>
        <li><strong>ISO 9001:2015:</strong> نظام إدارة الجودة المؤسسية الشاملة.</li>
        <li><strong>ISO 45001:2018:</strong> نظام إدارة الصحة والسلامة المهنية الميدانية.</li>
        <li><strong>ISO 14001:2015:</strong> نظام الإدارة البيئية والاستدامة.</li>
      </ul>
      <p>يؤكد هذا الإنجاز قدرة الشركة على تلبية تطلعات شركائنا في القطاعين الحكومي والخاص بمهنية وموثوقية تامة.</p>
    `,
    contentEn: `
      <h2>Unwavering Commitment to Quality & Safety</h2>
      <p><strong>Gulf Hills Contracting Company</strong> has officially achieved accredited international ISO certifications for Quality (ISO 9001), Safety (ISO 45001), and Environmental Management (ISO 14001).</p>
    `,
    category: 'announcement',
    categoryAr: 'بيانات واعتمادات',
    categoryEn: 'Accreditations',
    coverImage: '/images/projects/project-7.jpg',
    galleryImages: [],
    author: {
      nameAr: 'قسم الجودة والامتثال',
      nameEn: 'Quality & Compliance Dept',
      roleAr: 'هيئة الجودة',
      roleEn: 'Quality Board',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-02-20T14:30:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
    status: 'published',
    tags: ['آيزو', 'الجودة', 'السلامة', 'الاعتمادات'],
    readingTimeMinutes: 3,
    featured: false,
  },
  {
    id: 'art-3',
    slug: 'technical-specs-precast-new-jersey-barriers',
    titleAr: 'دليل المواصفات الفنية لتصنيع وتركيب الحواجز الخرسانية المسبقة الصب (نيوجيرسي)',
    titleEn: 'Technical Guide for Precast Concrete New Jersey Safety Barriers',
    excerptAr: 'المعايير الهندسية لنسب الخلطات الخرسانية، التسليح، ودرجات التحمل المعتمدة لدى وزارة النقل والأمانات.',
    excerptEn: 'Engineering standards for concrete mixes, reinforcement, and load ratings approved by MOT and municipalities.',
    contentAr: `
      <h2>معايير السلامة والمواصفات الفنية لحواجز نيوجيرسي</h2>
      <p>تعد الحواجز الخرسانية المسبقة الصب (New Jersey Barriers) عنصراً حيوياً لتوجيه الحركة المرورية وحماية المسارات على الطرق السريعة والمشاريع الإنشائية.</p>
      
      <h3>المواصفات القياسية:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
        <thead>
          <tr style="background: rgba(0, 112, 186, 0.1); border-bottom: 2px solid #0070BA;">
            <th style="padding: 10px; text-align: start;">العنصر</th>
            <th style="padding: 10px; text-align: start;">المواصفة المعتمدة</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(128,128,128,0.2);">
            <td style="padding: 10px;"><strong>قوة كسر الخرسانة (f'c)</strong></td>
            <td style="padding: 10px;">لا تقل عن 350 كجم/سم² بعد 28 يوماً</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(128,128,128,0.2);">
            <td style="padding: 10px;"><strong>نوع الأسمنت</strong></td>
            <td style="padding: 10px;">أسمنت بورتلاندي مقاوم للأملاح (Type V) أو عادي (Type I)</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(128,128,128,0.2);">
            <td style="padding: 10px;"><strong>حديد التسليح</strong></td>
            <td style="padding: 10px;">عالي المقاومة مشوه وفق كود البناء السعودي SBC 304</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>العاكسات الفسفورية</strong></td>
            <td style="padding: 10px;">عاكسات مدمجة ثنائية الاتجاه (3M Diamond Grade)</td>
          </tr>
        </tbody>
      </table>
    `,
    contentEn: `
      <h2>Safety Standards & Technical Specifications for New Jersey Barriers</h2>
      <p>Precast concrete New Jersey barriers provide critical vehicle redirection and work-zone protection across highways and urban arteries.</p>
    `,
    category: 'technical-guide',
    categoryAr: 'أدلة هندسية',
    categoryEn: 'Technical Guides',
    coverImage: '/images/projects/project-6.jpg',
    galleryImages: [],
    author: {
      nameAr: 'المكتب الفني الهندسي',
      nameEn: 'Technical Engineering Bureau',
      roleAr: 'هندسة المواد والخرسانة',
      roleEn: 'Materials & Concrete Engineering',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
    status: 'published',
    tags: ['حواجز خرسانية', 'نيوجيرسي', 'مواصفات فنية', 'كود البناء'],
    readingTimeMinutes: 5,
    featured: false,
  },
  {
    id: 'art-4',
    slug: 'stormwater-drainage-network-kharj',
    titleAr: 'إنجاز مرحلة متقدمة من مشروع درء أخطار السيول وتصريف مياه الأمطار بمحافظة الخرج',
    titleEn: 'Advancing Key Phase of Stormwater Drainage Network in Al-Kharj Governorate',
    excerptAr: 'تمديد خطوط خرسانية مسبقة الصب وإنشاء محطات ضخ هيدروليكية لحماية الأحياء السكنية ورفع كفاءة التصريف السطحي.',
    excerptEn: 'Laying precast concrete culverts and building hydraulic pumping stations to safeguard residential sectors and enhance storm run-off capacity.',
    contentAr: `
      <h2>بنية تحتية متطورة لمواجهة الطوارئ المائية</h2>
      <p>تواصل فرق <strong>شركة هضاب الخليج العربي للمقاولات</strong> أعمال الحفر والتبطين والتمديد لشبكات تصريف مياه الأمطار ودرء أخطار السيول في محافظة الخرج بالتنسيق المباشر مع البلدية.</p>
      
      <div class="callout callout-info" style="padding: 16px; border-radius: 12px; background: rgba(0, 112, 186, 0.08); border-left: 4px solid #0070BA; margin: 20px 0;">
        <strong>مؤشرات الأداء الميداني:</strong> مد أكثر من 18,500 متر طولي من العبارات الصندوقية الخرسانية سابقة الصب بقطر 1200 ملم، مدعومة بمضخات طوارئ بطاقة 4,500 م³/ساعة.
      </div>

      <h3>المعايير الهندسية المنفذة:</h3>
      <ul>
        <li>عزل كامل ضد التآكل والأملاح باستخدام طلاءات الإيبوكسي المقاومة.</li>
        <li>غرف تفتيش ومانهولات خرسانية مصمتة ومحكمة الغلق وفق مواصفات كود الطرق السعودي.</li>
        <li>نظم مراقبة وقياس مناسيب المياه في النقاط المنخفضة.</li>
      </ul>
    `,
    contentEn: `
      <h2>Advanced Infrastructure for Hydraulic Resilience</h2>
      <p><strong>Gulf Hills Contracting Company</strong> progresses with high-precision installation of precast concrete stormwater trunk lines in Al-Kharj.</p>
    `,
    category: 'project-story',
    categoryAr: 'مشاريع ميدانية',
    categoryEn: 'Project Story',
    coverImage: '/images/projects/project-2.jpg',
    galleryImages: ['/images/before-after/stormwater-drainage-after.jpg'],
    author: {
      nameAr: 'م. خالد الدوسري',
      nameEn: 'Eng. Khalid Al-Dossary',
      roleAr: 'مدير مشاريع السيول والمياه',
      roleEn: 'Hydraulic Projects Manager',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-09-02T09:00:00Z',
    scheduledAt: '2026-09-02T09:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z',
    status: 'scheduled',
    tags: ['تصريف السيول', 'بلدية الخرج', 'بنية تحتية', 'مضخات'],
    readingTimeMinutes: 4,
    featured: true,
  },
  {
    id: 'art-5',
    slug: 'local-content-achievement-52-percent',
    titleAr: 'هضاب الخليج تحقق 52.97% في مؤشر المحتوى المحلي وتعزز سلاسل الإمداد الوطنية',
    titleEn: 'Gulf Hills Reaches 52.97% Local Content Score, Reinforcing National Supply Chains',
    excerptAr: 'شهادة رسمية معتمدة من هيئة المحتوى المحلي والمشتريات الحكومية LCGPA تعكس التزام الشركة بتوطين الكفاءات والخدمات الهندسية.',
    excerptEn: 'Official certified score by Local Content & Government Procurement Authority (LCGPA) demonstrating commitment to Saudization and local manufacturing.',
    contentAr: `
      <h2>تمكين وطني ومستهدفات طموحة لرؤية 2030</h2>
      <p>أعلنت <strong>شركة هضاب الخليج العربي للمقاولات</strong> عن اعتماد شهادة المحتوى المحلي بنسبة <strong>52.97%</strong> تحت الشهادة الرسمية رقم <em>216243</em> الصادرة من هيئة المحتوى المحلي والمشتريات الحكومية (LCGPA).</p>
      
      <div class="callout callout-info" style="padding: 16px; border-radius: 12px; background: rgba(16, 185, 129, 0.08); border-left: 4px solid #10B981; margin: 20px 0;">
        <strong>التزام استراتيجي:</strong> أكثر من 60% من المشتريات والمواد الإنشائية من مصانع ومحاجر سعودية معتمدة، مع خطة لرفع نسبة التوطين الهندسي إلى 70% بحلول 2027.
      </div>

      <h3>ركائز المحتوى المحلي لدى الشركة:</h3>
      <ul>
        <li>الاعتماد على مصانع الأسفلت والخرسانة الوطنية المعتمدة.</li>
        <li>برامج تدريب وتأهيل الكوادر الهندسية والفنية السعودية في مواقع المشاريع الحية.</li>
        <li>تطوير الشراكات المستدامة مع الموردين المحليين المسجلين في منصة اعتماد.</li>
      </ul>
    `,
    contentEn: `
      <h2>National Empowerment & Saudi Vision 2030 Alignment</h2>
      <p><strong>Gulf Hills Contracting Company</strong> celebrates attaining an audited <strong>52.97%</strong> Local Content score certified by LCGPA.</p>
    `,
    category: 'announcement',
    categoryAr: 'بيانات واعتمادات',
    categoryEn: 'Accreditations',
    coverImage: '/images/projects/project-10.jpg',
    galleryImages: [],
    author: {
      nameAr: 'إدارة الاستدامة والمحتوى المحلي',
      nameEn: 'Sustainability & Local Content Dept',
      roleAr: 'لجنة التوطين والمحتوى',
      roleEn: 'Local Content Board',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-09-09T09:00:00Z',
    scheduledAt: '2026-09-09T09:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z',
    status: 'scheduled',
    tags: ['المحتوى المحلي', 'رؤية 2030', 'LCGPA', 'توطين'],
    readingTimeMinutes: 3,
    featured: false,
  },
  {
    id: 'art-6',
    slug: 'qassim-urban-road-milling-paving',
    titleAr: 'تنفيذ أعمال كشط وسفلتة وتأهيل المحاور الحضرية الرئيسية بمنطقة القصيم',
    titleEn: 'Executing Comprehensive Road Milling & Asphalt Paving across Al-Qassim Municipalities',
    excerptAr: 'إعادة رصف وسفلتة أكثر من 85,000 م² مع تعديل المناسيب وتأهيل أرصفة المشاة وفق معايير أمانة منطقة القصيم.',
    excerptEn: 'Paving and rehabilitating over 85,000 m² with laser level adjustments and pedestrian sidewalk enhancements for Qassim Municipality.',
    contentAr: `
      <h2>رفع جودة شبكة الطرق الحضرية وسلامة الحركة</h2>
      <p>ضمن عقود الصيانة والتشغيل المبرمة مع أمانة منطقة القصيم، أنهت الفرق الميدانية للشركة أعمال كشط الطبقات الأسفلتية المتهالكة وإعادة فرد طبقات الأساس والأسفلت الساخن بسماكات مطابقة للمواصفات القياسية.</p>
      
      <div class="callout callout-info" style="padding: 16px; border-radius: 12px; background: rgba(0, 112, 186, 0.08); border-left: 4px solid #0070BA; margin: 20px 0;">
        <strong>تقنيات متقدمة:</strong> استخدام مجسات الرصد الحراري للخلطة الأسفلتية أثناء الفرد والدمك لضمان عدم وجود فجوات هوائية وزيادة العمر الافتراضي للطريق.
      </div>
    `,
    contentEn: `
      <h2>Elevating Urban Road Network Quality & Safety</h2>
      <p>Our divisions successfully conclude comprehensive asphalt rehabilitation packages for Al-Qassim Region Municipality.</p>
    `,
    category: 'project-story',
    categoryAr: 'مشاريع ميدانية',
    categoryEn: 'Project Story',
    coverImage: '/images/projects/project-4.jpg',
    galleryImages: [],
    author: {
      nameAr: 'م. فهد القحطاني',
      nameEn: 'Eng. Fahad Al-Qahtani',
      roleAr: 'مدير العمليات الميدانية',
      roleEn: 'Field Operations Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-09-16T09:00:00Z',
    scheduledAt: '2026-09-16T09:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z',
    status: 'scheduled',
    tags: ['أمانة القصيم', 'سفلتة طرق', 'كشط أسفلت', 'صيانة'],
    readingTimeMinutes: 4,
    featured: false,
  },
  {
    id: 'art-7',
    slug: 'precast-new-jersey-concrete-barriers-launch',
    titleAr: 'تدشين خط إنتاج وتوريد حواجز نيوجيرسي الخرسانية سابقة الصب للمشاريع السيادية',
    titleEn: 'Deployment of High-Durability Precast New Jersey Concrete Safety Barriers',
    excerptAr: 'توريد حواجز خرسانية مسبقة الصب عالية المقاومة بطاقات إنتاجية يومية تلبي احتياجات مشاريع الطرق السريعة ومناطق العمل.',
    excerptEn: 'Manufacturing and supplying high-strength precast concrete barriers engineered for highway separation and safety zones.',
    contentAr: `
      <h2>أمان مروري معتمد وفق أعلى درجات التحمل</h2>
      <p>أطلقت <strong>شركة هضاب الخليج</strong> خطاً متطوراً لتصنيع حواجز نيوجيرسي الخرسانية مسبقة الصب (New Jersey Barriers) بالأبعاد القياسية (ارتفاع 81 سم و 107 سم) مع عواكس فوسفورية ثنائية الاتجاه معتمدة من وزارة النقل والخدمات اللوجستية.</p>
    `,
    contentEn: `
      <h2>Certified Traffic Safety & Vehicle Redirection</h2>
      <p>Gulf Hills expands its precast manufacturing capabilities for standard and heavy-duty New Jersey safety barriers.</p>
    `,
    category: 'technical-guide',
    categoryAr: 'أدلة هندسية',
    categoryEn: 'Technical Guides',
    coverImage: '/images/projects/project-6.jpg',
    galleryImages: [],
    author: {
      nameAr: 'المكتب الفني الهندسي',
      nameEn: 'Technical Engineering Bureau',
      roleAr: 'هندسة المواد والخرسانة',
      roleEn: 'Materials & Concrete Engineering',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-09-23T09:00:00Z',
    scheduledAt: '2026-09-23T09:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z',
    status: 'scheduled',
    tags: ['حواجز خرسانية', 'نيوجيرسي', 'سلامة مرورية', 'خرسانة جاهزة'],
    readingTimeMinutes: 3,
    featured: false,
  },
  {
    id: 'art-8',
    slug: 'riyadh-cemetery-maintenance-facility-management',
    titleAr: 'تطبيق منظومة الحوكمة والتشغيل الذكي في عقود صيانة وتطوير مرافق مقابر مدينة الرياض',
    titleEn: 'Implementing Smart Governance in Riyadh Cemetery Maintenance & Facilities Management',
    excerptAr: 'عقود تشغيلية وصيانة شاملة مع أمانة منطقة الرياض تشمل أعمال النظافة الدورية، الإنارة الموفرة للطاقة، وتطوير الممرات.',
    excerptEn: 'Comprehensive municipal operations and maintenance contracts with Riyadh Municipality covering facilities, pathways, and green perimeters.',
    contentAr: `
      <h2>كفاءة تشغيلية وعناية حضرية متكاملة</h2>
      <p>تتولى <strong>شركة هضاب الخليج العربي للمقاولات</strong> إدارة وتشغيل وصيانة مرافق المقابر بالعاصمة الرياض وفق معايير دقيقة تشمل تهيئة الممرات، صيانة الأسوار والإنارة، ونظم التشغيل الرقمي الميداني بالتنسيق المستمر مع الإدارة العامة للنظافة وصحة البيئة بأمانة منطقة الرياض.</p>
    `,
    contentEn: `
      <h2>Operational Excellence & Municipal Care</h2>
      <p>Gulf Hills executes specialized maintenance and operational contracts across Riyadh city facilities in partnership with Riyadh Municipality.</p>
    `,
    category: 'project-story',
    categoryAr: 'مشاريع ميدانية',
    categoryEn: 'Project Story',
    coverImage: '/images/projects/project-5.jpg',
    galleryImages: [],
    author: {
      nameAr: 'إدارة التشغيل والصيانة البلدية',
      nameEn: 'Municipal O&M Dept',
      roleAr: 'إدارة المرافق',
      roleEn: 'Facilities Management',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-09-30T09:00:00Z',
    scheduledAt: '2026-09-30T09:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z',
    status: 'scheduled',
    tags: ['أمانة الرياض', 'تشغيل وصيانة', 'مرافق عامة', 'إدارة مشاريع'],
    readingTimeMinutes: 4,
    featured: false,
  },
  {
    id: 'art-9',
    slug: 'heavy-fleet-expansion-wirtgen-dynapac',
    titleAr: 'تحديث أسطول الآليات بإضافة قاشطات Wirtgen الألمانية ومداحل Dynapac الذكية',
    titleEn: 'Heavy Fleet Expansion: Adding High-Precision Wirtgen Millers & Dynapac Rollers',
    excerptAr: 'تعزيز جاهزية الشركة الميدانية بأكثر من 60 آلية ومعدة ثقيلة متطورة تعمل بنظم الرقابة والتتبع اللحظي عبر الأقمار الصناعية.',
    excerptEn: 'Boosting field capacity to +60 heavy machinery units equipped with live GPS telematics and laser slope leveling.',
    contentAr: `
      <h2>أسطول آلي ضخم يضمن سرعة التنفيذ وجودة الإنشاء</h2>
      <p>في إطار خطة التوسع المستمر، عززت الشركة أسطولها الميداني بحزمة جديدة من قاشطات الأسفلت الألمانية Wirtgen W 2000 والرصاصات الثقيلة Dynapac ومضخات السيول Godwin لتلبية متطلبات المشاريع المتزامنة بكفاءة وموثوقية قياسية.</p>
    `,
    contentEn: `
      <h2>State-of-the-Art Heavy Equipment for Fast-Track Projects</h2>
      <p>Gulf Hills expands its active fleet with latest German Wirtgen cold milling machines and heavy compaction units.</p>
    `,
    category: 'news',
    categoryAr: 'أخبار ومشاريع',
    categoryEn: 'News & Projects',
    coverImage: '/images/equipment/wirtgen-milling-machine.jpg',
    galleryImages: ['/images/equipment/dynapac-road-roller.jpg', '/images/equipment/caterpillar-excavator.jpg'],
    author: {
      nameAr: 'إدارة الأسطول والمعدات الثقيلة',
      nameEn: 'Fleet & Heavy Equipment Dept',
      roleAr: 'مدير الأسطول واللوجستيات',
      roleEn: 'Fleet Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-10-07T09:00:00Z',
    scheduledAt: '2026-10-07T09:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z',
    status: 'scheduled',
    tags: ['معدات ثقيلة', 'قاشطات Wirtgen', 'مداحل Dynapac', 'أسطول'],
    readingTimeMinutes: 3,
    featured: false,
  },
  {
    id: 'art-10',
    slug: 'balady-contracting-classification-grade-2',
    titleAr: 'الحصول على التصنيف المعتمد من منصة بلدي للمقاولات (درجة ثانية طرق ودرجة خامسة صيانة)',
    titleEn: 'Achieving Certified Balady Contracting Classification (Grade 2 Roads / Grade 5 O&M)',
    excerptAr: 'اعتماد رسمي من وزارة الشؤون البلدية والقروية والإسكان يؤهل الشركة للمنافسة على المشاريع الحكومية والبلدية الكبرى.',
    excerptEn: 'Official national classification issued by MOMRAH qualifying Gulf Hills for flagship municipal infrastructure tenders.',
    contentAr: `
      <h2>تصنيف رسمي يكرس الموثوقية والكفاءة المالية والفنية</h2>
      <p>حصلت <strong>شركة هضاب الخليج العربي للمقاولات</strong> رسمياً على شهادة تصنيف المقاولين المعتمدة عبر منصة بلدي في مجالات:</p>
      <ul>
        <li><strong>الدرجة الثانية:</strong> في أعمال البناء والإنشاء وسفلتة شبكات الطرق والكباري.</li>
        <li><strong>الدرجة الخامسة:</strong> في تشغيل وصيانة المرافق والشبكات العامة.</li>
      </ul>
      <p>يعد هذا التصنيف شهادة ثقة تعكس الملاءة المالية والخبرات الهندسية التراكمية التي تمتلكها الشركة.</p>
    `,
    contentEn: `
      <h2>Certified Accreditation Enhancing Tender Readiness</h2>
      <p>Gulf Hills achieves official MOMRAH classification as a Grade 2 Road Contractor and Grade 5 Facilities O&M partner.</p>
    `,
    category: 'announcement',
    categoryAr: 'بيانات واعتمادات',
    categoryEn: 'Accreditations',
    coverImage: '/images/projects/project-8.jpg',
    galleryImages: [],
    author: {
      nameAr: 'الإدارة العامة والعلاقات الحكومية',
      nameEn: 'Executive Management & Gov Relations',
      roleAr: 'هيئة الإدارة',
      roleEn: 'Executive Board',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    publishedAt: '2026-10-14T09:00:00Z',
    scheduledAt: '2026-10-14T09:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z',
    status: 'scheduled',
    tags: ['تصنيف بلدي', 'MOMRAH', 'مناقصات', 'اعتماد حكومي'],
    readingTimeMinutes: 4,
    featured: false,
  },
];

const INITIAL_SITE_PAGES_CONTENT: SitePagesContentConfig = {
  about: {
    headerTitleAr: 'نبني الحاضر لتمهيد المستقبل',
    headerTitleEn: 'We Build Today to Pave Tomorrow',
    headerSubtitleAr: 'شركة هضاب الخليج العربي للمقاولات هي شريك البنية التحتية والتشغيل البلدي المعتمد لتنفيذ الطرق وتصريف السيول بالمملكة.',
    headerSubtitleEn: 'Arabian Gulf Hills Contracting Company is the certified infrastructure partner executing road civil works and municipal operations.',
    storyHtmlAr: `
      <h2>قصة مسيرتنا وتأسيس الشركة</h2>
      <p>تأسست <strong>شركة هضاب الخليج العربي للمقاولات</strong> في مدينة الرياض، حاملة رؤية واضحة للمساهمة الفعالة في النهضة العمرانية التي تشهدها المملكة العربية السعودية. على مدى السنوات الماضية، نجحنا في تنفيذ مشاريع طرق وأعمال تجميلية وحواجز نيوجرسي لصالح كبرى الجهات الحكومية والشركات الخاصة.</p>
      
      <div class="callout callout-info" style="padding: 16px; border-radius: 12px; background: rgba(0, 112, 186, 0.08); border-left: 4px solid #0070BA; margin: 20px 0;">
        <strong>التزامنا الهندسي:</strong> نمتلك أسطولاً متكاملاً من المعدات الثقيلة وكادراً هندسياً سعودياً ودولياً خبيراً يضمن أعلى معايير الجودة والسلامة الميدانية.
      </div>

      <h3>الرؤية والرسالة المؤسسية</h3>
      <p>نعمل على ترسيخ مكانتنا كأحد أبرز المقاولين المعتمدين في قطاع البنية التحتية والمرافق الحضرية بالمملكة، عبر الالتزام بأدق المواصفات الفنية ومطابقة الكود السعودي للطرق.</p>
    `,
    storyHtmlEn: `
      <h2>Our Corporate Story & Journey</h2>
      <p>Arabian Gulf Hills Contracting was founded in Riyadh with a steadfast vision to elevate national road infrastructure and stormwater management systems.</p>
    `,
    visionHtmlAr: `
      <h3>رؤيتنا الإستراتيجية</h3>
      <p>أن نكون الشريك الرائد والأكثر موثوقية في تطوير وتنفيذ شبكات الطرق الحضرية والبنية التحتية المستدامة بالمملكة العربية السعودية، دعماً لمستهدفات رؤية 2030.</p>
    `,
    visionHtmlEn: `
      <h3>Our Vision</h3>
      <p>To be the premier trusted partner in delivering sustainable urban highways and modern infrastructure across Saudi Arabia.</p>
    `,
    missionHtmlAr: `
      <h3>رسالتنا</h3>
      <p>تقديم حلول هندسية وإنشائية متكاملة في مجالات السفلتة وتصريف السيول والخرسانة المسبقة الصب، بأعلى معايير الجودة والالتزام الصارم بالجداول الزمنية واشتراطات السلامة المهنية.</p>
    `,
    missionHtmlEn: `
      <h3>Our Mission</h3>
      <p>Providing integrated engineering civil solutions in asphalt paving, drainage networks, and precast barriers with absolute quality and punctuality.</p>
    `,
    storyImage: '/images/projects/project-1.jpg',
    values: [
      {
        titleAr: 'الجودة المطلقة',
        titleEn: 'Absolute Quality',
        descAr: 'نلتزم بتصنيع وتركيب الحواجز الخرسانية ورصف الطرق وتصريف السيول بأدق المعايير الهندسية وشهادات الاعتماد الرسمية.',
        descEn: 'We commit to manufacturing precast concrete barriers, paving roads, and laying drainage networks with extreme engineering accuracy.',
        icon: 'Trophy',
      },
      {
        titleAr: 'الالتزام بالجدول الزمني',
        titleEn: 'Schedule Commitment',
        descAr: 'ندرك أهمية الوقت الحرج في مشاريع البنية التحتية، ونضمن تسليم كافة قطاعات الأعمال في مواعيدها الفنية المحددة.',
        descEn: 'We value critical timelines in infrastructure projects, guaranteeing project handovers strictly within municipal calendar guidelines.',
        icon: 'Clock',
      },
      {
        titleAr: 'الاحترافية والسلامة المهنية',
        titleEn: 'Safety & Professionalism',
        descAr: 'تطبيق أعلى معايير السلامة المهنية لكوادرنا وللمستفيدين من الطرق، بما يتماشى مع الكود السعودي للبناء والرؤية الوطنية.',
        descEn: 'Enforcing occupational safety guidelines for our construction crews and road users, aligned with the Saudi Building Code.',
        icon: 'ShieldCheck',
      },
    ],
  },
  chairmanMessage: {
    headerTitleAr: 'رسالة رئيس مجلس الإدارة',
    headerTitleEn: "Chairman's Statement",
    headerSubtitleAr: 'رؤية إستراتيجية وعهد وطني بصياغة وتطوير بنية تحتية مستدامة لأحياء ومحافظات المملكة.',
    headerSubtitleEn: 'Strategic vision and national commitment to formulating sustainable infrastructure across Saudi regions.',
    messageHtmlAr: `
      <p>بصفتنا شريكاً وطنياً ممتثلاً، انطلقت <strong>شركة هضاب الخليج للمقاولات</strong> برؤية هندسية واضحة تهدف إلى الارتقاء بالبنية التحتية للمملكة العربية السعودية. إننا في هضاب الخليج لا ننظر إلى مشاريع سفلتة الطرق، وتمديد شبكات تصريف السيول، ومعالجة التشوهات البصرية كأعمال إنشائية مجردة، بل كالتزام وطني راسخ يسهم مباشرة في تحقيق مستهدفات <strong>رؤية المملكة 2030</strong> وبرامج جودة الحياة.</p>
      
      <div class="callout callout-success" style="padding: 16px; border-radius: 12px; background: rgba(16, 185, 129, 0.08); border-left: 4px solid #10B981; margin: 20px 0;">
        <strong>ركيزة الجاهزية اللوجستية:</strong> لقد حرصنا على بناء أسطول ميداني ضخم وجاهزية لوجستية متكاملة تضمن تنفيذ كافة العقود المسندة إلينا من أمانات المناطق والوزارات السيادية بأعلى معايير الكفاءة والسرعة التشغيلية.
      </div>

      <p>نجدد عهدنا بالاستمرار في التطوير، والامتثال للمواصفات الفنية القياسية، لتبقى هضاب الخليج دائماً الخيار الأول الموثوق في بناء غدٍ مستدام.</p>

      <blockquote>
        "طموحنا يرتقي لمواكبة تطلعات قيادتنا الرشيدة ونهضة وطننا الغالي، وسواعدنا الهندسية جاهزة دائماً لتمهيد دروب المستقبل."
        <footer>— الإدارة التنفيذية، شركة هضاب الخليج العربي</footer>
      </blockquote>
    `,
    messageHtmlEn: `
      <p>As a compliant national partner, <strong>Arabian Gulf Hills Contracting</strong> was launched with a clear engineering vision aimed at elevating the infrastructure of the Kingdom of Saudi Arabia. We do not look at road civil works as mere construction tasks, but as a steadfast national commitment directly contributing to <strong>Saudi Vision 2030</strong>.</p>
      <p>We have built a massive operational fleet and complete logistics readiness to guarantee that all contracts assigned to us by regional municipalities and sovereign ministries are executed with the highest efficiency.</p>
    `,
    authorNameAr: 'المهندس / رئيس مجلس الإدارة',
    authorNameEn: 'Chairman of the Board',
    authorRoleAr: 'الإدارة التنفيذية العليا',
    authorRoleEn: 'Executive Leadership',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  contact: {
    headerTitleAr: 'تواصل مع الإدارة الهندسية والميدانية',
    headerTitleEn: 'Contact Engineering & Field Operations',
    headerSubtitleAr: 'نرحب باستفسارات الأمانات والبلديات والشركات لطلب عروض الأسعار والحلول الهندسية.',
    headerSubtitleEn: 'We welcome inquiries from municipalities and corporations for tenders and engineering solutions.',
    introHtmlAr: `
      <p>يسعد فريق الدعم الهندسي والمبيعات بشركة <strong>هضاب الخليج العربي للمقاولات</strong> باستقبال طلبات عروض الأسعار ودراسة المشاريع والاستشارات الفنية على مدار الساعة.</p>
    `,
    introHtmlEn: `
      <p>Our engineering support and bidding divisions are pleased to receive RFQs, technical tenders, and field inquiries 24/7.</p>
    `,
    workingHoursAr: 'من الأحد إلى الخميس: 8:00 صباحاً – 5:00 مساءً | مركز الطوارئ الميداني: 24/7',
    workingHoursEn: 'Sunday to Thursday: 8:00 AM – 5:00 PM | Emergency Response: 24/7',
    emergencyNoticeAr: 'لبلاغات الطوارئ الميدانية العاجلة لخطوط السيول وهبوط الطرق: يرجى الاتصال المباشر على الخط الساخن 00966115126774.',
    emergencyNoticeEn: 'For urgent field emergencies and road subsidence: please contact direct hotline 00966115126774.',
  },
};

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media-1',
    name: 'شعار الشركة - الوضع الفاتح',
    url: '/logo-light.png',
    type: 'image',
    uploadedAt: '2026-01-01T00:00:00.000Z',
    category: 'branding',
    altAr: 'شعار هضاب الخليج للمقاولات',
    altEn: 'Gulf Hills Contracting Logo',
  },
  {
    id: 'media-2',
    name: 'شعار الشركة - الوضع الداكن',
    url: '/logo-dark.png',
    type: 'image',
    uploadedAt: '2026-01-01T00:00:00.000Z',
    category: 'branding',
    altAr: 'شعار هضاب الخليج للمقاولات',
    altEn: 'Gulf Hills Contracting Logo Dark',
  },
  {
    id: 'media-3',
    name: 'مشروع صيانة الطرق وكشط الأسفلت',
    url: '/images/projects/project-1.jpg',
    type: 'image',
    uploadedAt: '2026-02-15T00:00:00.000Z',
    category: 'projects',
    altAr: 'أعمال سفلتة وكشط الطرق',
    altEn: 'Road Asphalting & Milling',
  },
  {
    id: 'media-4',
    name: 'تنفيذ شبكات تصريف مياه السيول',
    url: '/images/projects/project-3.jpg',
    type: 'image',
    uploadedAt: '2026-03-10T00:00:00.000Z',
    category: 'projects',
    altAr: 'شبكات تصريف السيول',
    altEn: 'Stormwater Drainage',
  },
  {
    id: 'media-5',
    name: 'الملف التعريفي للشركة (PDF)',
    url: '/gulf-hills-profile.pdf',
    type: 'pdf',
    uploadedAt: '2026-04-01T00:00:00.000Z',
    category: 'documents',
    altAr: 'بروفايل هضاب الخليج',
    altEn: 'Gulf Hills Corporate Profile',
  },
];

const INITIAL_SEO_SETTINGS: SeoSettingsConfig = {
  home: {
    titleAr: 'شركة هضاب الخليج للمقاولات | الريادة في البنية التحتية وتشغيل وصيانة المرافق',
    titleEn: 'Gulf Hills Contracting | Infrastructure & Municipal Facility Operations',
    descriptionAr: 'شركة هضاب الخليج العربي للمقاولات - الشريك المعتمد في مقاولات البنية التحتية، رصف وكشط الطرق، تمديد شبكات تصريف مياه الأمطار والسيول، تشغيل وصيانة المقابر والمباني الحكومية بالمملكة.',
    descriptionEn: 'Arabian Gulf Hills Contracting Company - Certified national partner for infrastructure contracting, road asphalt paving, stormwater drainage networks, and facility maintenance in Saudi Arabia.',
    keywordsAr: ['هضاب الخليج للمقاولات', 'مقاولات بنية تحتية', 'سفلتة طرق بالرياض', 'شبكات سيول', 'حواجز نيوجيرسي'],
    keywordsEn: ['Gulf Hills Contracting', 'Infrastructure Saudi Arabia', 'Road Paving Riyadh', 'Stormwater Drainage', 'New Jersey Barriers'],
    ogImage: '/images/projects/project-1.jpg',
  },
  about: {
    titleAr: 'من نحن ورؤية الشركة | شركة هضاب الخليج للمقاولات',
    titleEn: 'About Us & Vision | Gulf Hills Contracting',
    descriptionAr: 'تعرف على تاريخ ورؤية وقيم شركة هضاب الخليج العربي للمقاولات وخبراتها الممتدة في البنية التحتية والمقاولات بالمملكة العربية السعودية.',
    descriptionEn: 'Learn about the history, vision, and core values of Arabian Gulf Hills Contracting in Saudi infrastructure development.',
    keywordsAr: ['عن هضاب الخليج', 'رؤية 2030', 'مقاولات الرياض', 'خبرة البنية التحتية'],
    keywordsEn: ['About Gulf Hills', 'Vision 2030', 'Contracting Riyadh', 'Infrastructure Experience'],
    ogImage: '/images/projects/project-1.jpg',
  },
  services: {
    titleAr: 'خدماتنا وأعمالنا الهندسية | شركة هضاب الخليج للمقاولات',
    titleEn: 'Services & Engineering Solutions | Gulf Hills Contracting',
    descriptionAr: 'استعرض خدمات مقاولات الطرق والأسفلت، تصريف مياه السيول والأمطار، صيانة المرافق، وتوريد الحواجز الخرسانية نيوجيرسي.',
    descriptionEn: 'Explore our infrastructure services including highway paving, stormwater drainage networks, facilities O&M, and precast concrete barriers.',
    keywordsAr: ['خدمات المقاولات', 'سفلتة طرق', 'تصريف سيول', 'حواجز نيوجيرسي'],
    keywordsEn: ['Contracting Services', 'Road Paving', 'Stormwater Drainage', 'Precast Barriers'],
  },
  projects: {
    titleAr: 'سجل المشاريع الهندسية المنجزة | شركة هضاب الخليج للمقاولات',
    titleEn: 'Engineering Projects Portfolio | Gulf Hills Contracting',
    descriptionAr: 'سجل المشاريع المنجزة وعقود البنية التحتية المعتمدة مع أمانات المناطق ووزارات المملكة العربية السعودية.',
    descriptionEn: 'Portfolio of landmark infrastructure projects and municipal contracts across Saudi Arabia.',
    keywordsAr: ['مشاريع هضاب الخليج', 'مشاريع أمانة الرياض', 'سفلتة المحاور', 'درء السيول'],
    keywordsEn: ['Gulf Hills Projects', 'Riyadh Municipality Projects', 'Highway Resurfacing', 'Flood Mitigation'],
  },
  equipment: {
    titleAr: 'أسطول الآليات والمعدات الثقيلة | شركة هضاب الخليج للمقاولات',
    titleEn: 'Heavy Machinery & Fleet | Gulf Hills Contracting',
    descriptionAr: 'أسطول متكامل يضم أكثر من 120 آلية ومعدة ثقيلة متخصصة في كشط وسفلتة الطرق، حفر ونقل التربة، والصب الخرساني.',
    descriptionEn: 'Comprehensive fleet of 120+ specialized heavy machinery units for asphalt milling, earthmoving, and concrete operations.',
    keywordsAr: ['أسطول المعدات', 'كاشطات أسفلت', 'رصاصات', 'معدات ثقيلة'],
    keywordsEn: ['Heavy Machinery Fleet', 'Asphalt Millers', 'Vibratory Rollers', 'Excavators'],
  },
  certificates: {
    titleAr: 'الشهادات والاعتمادات الرسمية والآيزو | شركة هضاب الخليج للمقاولات',
    titleEn: 'Certificates & ISO Accreditations | Gulf Hills Contracting',
    descriptionAr: 'شهادات الآيزو ISO 9001, ISO 14001, ISO 45001 وتصنيف المقاولين المعتمد من وزارة الشؤون البلدية والقروية والإسكان.',
    descriptionEn: 'ISO 9001, ISO 14001, ISO 45001 certifications and official Saudi contractors classification credentials.',
    keywordsAr: ['شهادات الآيزو', 'تصنيف المقاولين', 'اعتماد أمانة الرياض', 'جودة وسلامة'],
    keywordsEn: ['ISO Certifications', 'Contractor Classification', 'Accredited Partner', 'Quality Safety'],
  },
  team: {
    titleAr: 'فريق العمل والكوادر القيادية | شركة هضاب الخليج للمقاولات',
    titleEn: 'Leadership & Engineering Team | Gulf Hills Contracting',
    descriptionAr: 'الكوادر الهندسية والإدارية والخبرات الوطنية التي تقود تنفيذ كبرى مشاريع البنية التحتية بشركة هضاب الخليج.',
    descriptionEn: 'Meet the executive leadership and specialized engineers driving landmark infrastructure delivery at Gulf Hills.',
    keywordsAr: ['فريق العمل', 'الإدارة التنفيذية', 'مهندسو الموقع'],
    keywordsEn: ['Executive Team', 'Engineering Leaders', 'Site Supervisors'],
  },
  news: {
    titleAr: 'الأخبار والمستجدات والبيانات الصحفية | شركة هضاب الخليج للمقاولات',
    titleEn: 'News & Press Releases | Gulf Hills Contracting',
    descriptionAr: 'آخر أخبار وإنجازات شركة هضاب الخليج العربي للمقاولات وتحديثات مشاريع الطرق وتصريف السيول والاعتمادات.',
    descriptionEn: 'Latest news, project updates, and press releases from Arabian Gulf Hills Contracting.',
    keywordsAr: ['أخبار هضاب الخليج', 'مشاريع جديدة', 'إنجازات البنية التحتية'],
    keywordsEn: ['Gulf Hills News', 'Project Updates', 'Press Releases'],
  },
  contact: {
    titleAr: 'تواصل معنا وطلب عرض سعر | شركة هضاب الخليج للمقاولات',
    titleEn: 'Contact Us & Request a Quote | Gulf Hills Contracting',
    descriptionAr: 'تواصل مع الإدارة الهندسية والمبيعات لطلب عروض الأسعار والدراسات الفنية لمشاريع الطرق والسيول والحواجز الخرسانية.',
    descriptionEn: 'Get in touch with our engineering and bidding team for quotations and technical tenders.',
    keywordsAr: ['اتصل بنا', 'طلب عرض سعر', 'هاتف هضاب الخليج', 'عنوان الرياض'],
    keywordsEn: ['Contact Us', 'Request a Quote', 'Phone Gulf Hills', 'Riyadh Office'],
  },
  chairmanMessage: {
    titleAr: 'رسالة رئيس مجلس الإدارة | شركة هضاب الخليج للمقاولات',
    titleEn: "Chairman's Statement | Gulf Hills Contracting",
    descriptionAr: 'كلمة رئيس مجلس الإدارة حول التزام شركة هضاب الخليج بالريادة الهندسية والمساهمة في تحقيق مستهدفات رؤية 2030.',
    descriptionEn: "Chairman's statement on engineering commitment and contributing to Saudi Vision 2030.",
    keywordsAr: ['رسالة رئيس مجلس الإدارة', 'رؤية 2030', 'التزام وطني'],
    keywordsEn: ["Chairman's Statement", 'Vision 2030', 'National Infrastructure'],
  },
};

const INITIAL_TIMELINE_ITEMS: TimelineMilestoneItem[] = [
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
      'ISO 9001:2015 Quality Management System Certification',
      'ISO 14001:2015 Environmental & ISO 45001:2018 Safety Certifications',
      'Official Contractor Classification for Roads and Infrastructure Tenders',
    ],
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
    link: '/certificates',
  },
  {
    id: 'm-2025',
    year: '2025',
    dateLabelAr: 'عام 2025',
    dateLabelEn: 'Year 2025',
    titleAr: 'توسيع الأسطول الثقيل وعقود تشغيل وصيانة المقابر',
    titleEn: 'Heavy Fleet Modernization & Municipal Cemeteries O&M Contracts',
    subtitleAr: 'إدخال كاشطات الأسفلت الحديثة ومصانع الخرسانة الجاهزة المتنقلة',
    subtitleEn: 'Deploying high-efficiency asphalt millers and mobile batching assets',
    clientAr: 'أمانة منطقة الرياض وبلديات المحافظات',
    clientEn: 'Riyadh Region Municipality & Provincial Subdivisions',
    locationAr: 'منطقة الرياض ومحافظاتها',
    locationEn: 'Riyadh Region & Governorates',
    badgeAr: 'أسطول +120 آلية ومعدة',
    badgeEn: 'Fleet: 120+ Heavy Units',
    regDocAr: 'عقود أمانة الرياض 2025 | تراخيص السلامة المهنية',
    regDocEn: 'Riyadh Municipality 2025 Contracts | Safety Licenses',
    colorCard: '139, 92, 246', // Purple
    descriptionAr: 'تحديث أسطول الآليات والمعدات الثقيلة بأحدث كاشطات الأسفلت ومعدات الصيانة وتوقيع عقود التشغيل والصيانة للمرافق البلدية والمقابر بمنطقة الرياض.',
    descriptionEn: 'Modernizing heavy machinery fleet with advanced asphalt planers, pavers, and sealing municipal operations and maintenance contracts.',
    highlightsAr: [
      'توسيع الأسطول بأكثر من 120 آلية متخصصة ومصانع خلط أسفلت مركزية',
      'تشغيل وصيانة مرافق المقابر والمباني الحكومية التابعة لأمانة الرياض',
      'تطبيق أحدث نظم إدارة وتتبع الأسطول الميداني بنظام GPS',
    ],
    highlightsEn: [
      'Expanded fleet with 120+ specialized heavy units and central asphalt plants',
      'Comprehensive O&M for municipal facilities and cemeteries under Riyadh Scope',
      'Implemented real-time GPS fleet tracking and telematics operations',
    ],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    link: '/equipment',
  },
  {
    id: 'm-2026',
    year: '2026',
    dateLabelAr: 'اليوم - 2026 وما بعدها',
    dateLabelEn: 'Today - 2026 & Beyond',
    titleAr: 'الريادة في البنية التحتية وتمكين مستهدفات رؤية 2030',
    titleEn: 'Infrastructure Leadership & Driving Saudi Vision 2030',
    subtitleAr: 'التحول الرقمي الكامل، معالجة التشوه البصري، والتميز الهندسي',
    subtitleEn: 'Digital Transformation, Urban Visual Uplift & Engineering Excellence',
    clientAr: 'كافة أمانات ووزارات المملكة والقطاع الخاص',
    clientEn: 'All Saudi Municipalities, Sovereign Ministries & Private Sector',
    locationAr: 'كافة مناطق المملكة العربية السعودية',
    locationEn: 'All Regions of the Kingdom of Saudi Arabia',
    badgeAr: 'جاهزية طوارئ 24/7',
    badgeEn: '24/7 Field Readiness',
    regDocAr: 'منظومة الجودة الوطنية | امتثال الكود السعودي SBC',
    regDocEn: 'National Quality Framework | SBC Code Compliance',
    colorCard: '0, 176, 240', // Horizon Glow
    descriptionAr: 'ترسيخ مكانة الشركة كالذراع الإنشائي والتشغيلي الأول في مقاولات البنية التحتية، رصف الطرق، شبكات السيول، معالجة التشوهات البصرية، وتحقيق أعلى مؤشرات جودة الحياة.',
    descriptionEn: 'Cementing leadership as the premier civil infrastructure, road paving, stormwater mitigation, and municipal contracting partner advancing Quality of Life programs under Vision 2030.',
    highlightsAr: [
      'مركز تحكم وطوارئ ميداني 24/7 للاستجابة المباشرة للبلاغات البلدية',
      'تطبيق الكود السعودي للبناء (SBC) وأعلى معايير الاستدامة البيئية',
      'المساهمة في تحقيق مستهدفات رؤية المملكة 2030 لجودة الطرق والبنية التحتية',
    ],
    highlightsEn: [
      '24/7 Field Emergency Command Center for municipal incident response',
      'Strict Saudi Building Code (SBC) compliance & ESG sustainability metrics',
      'Active contribution towards Saudi Vision 2030 Quality of Life indicators',
    ],
    image: '/images/projects/project-1.jpg',
    link: '/projects',
  },
];

const INITIAL_SAUDI_REGIONS: SaudiRegionItem[] = [
  {
    id: 'riyadh',
    nameAr: 'منطقة الرياض (المقر الرئيسي)',
    nameEn: 'Riyadh Province (HQ)',
    projectCount: 12,
    activeKm: '+350 كم',
    pinX: 52,
    pinY: 48,
    highlightColor: '#0070BA',
    sampleProjects: [
      {
        id: 'proj-1',
        titleAr: 'تشغيل وصيانة مقابر المسلمين بمدينة الرياض',
        titleEn: 'Operation and Maintenance of Muslim Cemeteries in Riyadh',
        image: '/images/projects/project-1.jpg',
        progress: 78,
        clientAr: 'أمانة منطقة الرياض',
        clientEn: 'Riyadh Municipality',
      },
      {
        id: 'proj-8',
        titleAr: 'صيانة وتشغيل شبكات تصريف السيول والمياه الأرضية (بلدية العزيزية)',
        titleEn: 'Stormwater & Groundwater Networks (Al-Aziziyah)',
        image: '/images/before-after/stormwater-drainage-after.jpg',
        progress: 100,
        clientAr: 'أمانة منطقة الرياض',
        clientEn: 'Riyadh Municipality',
      },
    ],
  },
  {
    id: 'qassim',
    nameAr: 'منطقة القصيم (بريدة وعنيزة)',
    nameEn: 'Al-Qassim Province (Buraidah & Unaizah)',
    projectCount: 2,
    activeKm: '+85 كم',
    pinX: 44,
    pinY: 36,
    highlightColor: '#0070BA',
    sampleProjects: [
      {
        id: 'proj-2',
        titleAr: 'صيانة الشوارع نطاق بلدية شرق بريدة',
        titleEn: 'Street Maintenance in East Buraidah Municipality',
        image: '/images/before-after/road-paving-after.jpg',
        progress: 74,
        clientAr: 'أمانة منطقة القصيم',
        clientEn: 'Al-Qassim Municipality',
      },
      {
        id: 'proj-3',
        titleAr: 'معالجة بلاغات 940 والتشوهات البصرية شمال مدينة بريدة',
        titleEn: 'Resolving 940 Reports & Visual Pollution North Buraidah',
        image: '/images/before-after/visual-pollution-after.jpg',
        progress: 100,
        clientAr: 'أمانة منطقة القصيم',
        clientEn: 'Al-Qassim Municipality',
      },
    ],
  },
  {
    id: 'eastern',
    nameAr: 'المنطقة الشرقية (الدمام والخبر والأحساء)',
    nameEn: 'Eastern Province (Dammam, Khobar & Al-Ahsa)',
    projectCount: 3,
    activeKm: '+120 كم',
    pinX: 68,
    pinY: 42,
    highlightColor: '#0070BA',
    sampleProjects: [
      {
        id: 'proj-4',
        titleAr: 'توريد حواجز نيوجرسي الخرسانية للطرق السريعة بالدمام',
        titleEn: 'Supplying Precast Concrete Barriers for Dammam Highways',
        image: '/images/projects/project-2.jpg',
        progress: 100,
        clientAr: 'وزارة النقل والخدمات اللوجستية',
        clientEn: 'Ministry of Transport',
      },
    ],
  },
  {
    id: 'makkah',
    nameAr: 'منطقة مكة المكرمة وجدة',
    nameEn: 'Makkah & Jeddah Province',
    projectCount: 2,
    activeKm: '+95 كم',
    pinX: 28,
    pinY: 62,
    highlightColor: '#0070BA',
    sampleProjects: [
      {
        id: 'proj-5',
        titleAr: 'أعمال كشط وسفلتة المحاور الرابطة بمحافظة جدة',
        titleEn: 'Asphalt Milling and Paving in Jeddah Corridor',
        image: '/images/projects/project-3.jpg',
        progress: 88,
        clientAr: 'أمانة محافظة جدة',
        clientEn: 'Jeddah Municipality',
      },
    ],
  },
  {
    id: 'madinah',
    nameAr: 'منطقة المدينة المنورة وينبع',
    nameEn: 'Al-Madinah & Yanbu Province',
    projectCount: 1,
    activeKm: '+40 كم',
    pinX: 25,
    pinY: 45,
    highlightColor: '#0070BA',
    sampleProjects: [
      {
        id: 'proj-6',
        titleAr: 'تمديد خطوط تصريف مياه الأمطار والسيول بينبع',
        titleEn: 'Stormwater Pipeline Extensions in Yanbu',
        image: '/images/projects/project-1.jpg',
        progress: 92,
        clientAr: 'أمانة منطقة المدينة المنورة',
        clientEn: 'Madinah Municipality',
      },
    ],
  },
];

const INITIAL_PARTNERS: PartnerItem[] = [
  {
    id: 'p-1',
    nameAr: 'وزارة الشؤون البلدية والقروية والإسكان',
    nameEn: 'Ministry of Municipal & Rural Affairs and Housing',
    categoryAr: 'وزارة سيادية',
    categoryEn: 'Ministry',
    badgeAr: 'اعتماد رسمي شامل',
    badgeEn: 'Full Accreditation',
    projectsCount: 18,
    logoUrl: '/images/logos/momrah-user-logo.jpg',
    status: 'active',
  },
  {
    id: 'p-2',
    nameAr: 'أمانة منطقة الرياض',
    nameEn: 'Riyadh Region Municipality',
    categoryAr: 'أمانات المناطق',
    categoryEn: 'Municipality',
    badgeAr: 'مشاريع حيوية كبرى',
    badgeEn: 'Major Infrastructure',
    projectsCount: 14,
    logoUrl: '/images/logos/riyadh-municipality-official.png',
    status: 'active',
  },
  {
    id: 'p-3',
    nameAr: 'أمانة منطقة القصيم',
    nameEn: 'Al-Qassim Region Municipality',
    categoryAr: 'أمانات المناطق',
    categoryEn: 'Municipality',
    badgeAr: 'عقود صيانة وطرق',
    badgeEn: 'Road Maintenance Contracts',
    projectsCount: 11,
    logoUrl: '/images/logos/qassim-user-logo.png',
    status: 'active',
  },
  {
    id: 'p-4',
    nameAr: 'وزارة الحرس الوطني',
    nameEn: 'Ministry of National Guard',
    categoryAr: 'قطاع أمني وسيادي',
    categoryEn: 'Defense & Security',
    badgeAr: 'مواقع عسكرية خاصة',
    badgeEn: 'Special Military Sites',
    projectsCount: 6,
    logoUrl: '/images/logos/national-guard-user-logo.png',
    status: 'active',
  },
  {
    id: 'p-5',
    nameAr: 'بلدية محافظة الخرج',
    nameEn: 'Al-Kharj Governorate Municipality',
    categoryAr: 'بلديات المحافظات',
    categoryEn: 'Governorate Municipality',
    badgeAr: 'تصريف سيول وطرق',
    badgeEn: 'Drainage & Roads',
    projectsCount: 9,
    logoUrl: '/images/logos/kharj-user-logo.jpg',
    status: 'active',
  },
  {
    id: 'p-6',
    nameAr: 'بلدية محافظة الزلفي',
    nameEn: 'Al-Zulfi Governorate Municipality',
    categoryAr: 'بلديات المحافظات',
    categoryEn: 'Governorate Municipality',
    badgeAr: 'تأسيس وتطوير ميداني',
    badgeEn: 'Site Preparation',
    projectsCount: 6,
    logoUrl: '/images/logos/zulfi-user-logo.jpg',
    status: 'active',
  },
  {
    id: 'p-7',
    nameAr: 'المركز السعودي للأعمال',
    nameEn: 'Saudi Business Center',
    categoryAr: 'منظومة الأعمال',
    categoryEn: 'Business Hub',
    badgeAr: 'منصة ممارسة الأعمال',
    badgeEn: 'Certified Business Hub',
    projectsCount: 12,
    logoUrl: '/images/logos/saudi-business-center.jpg',
    status: 'active',
  },
  {
    id: 'p-8',
    nameAr: 'وزارة التجارة',
    nameEn: 'Ministry of Commerce',
    categoryAr: 'سجل تجاري معتمد',
    categoryEn: 'Commerce Ministry',
    badgeAr: 'سجل تجاري موثق',
    badgeEn: 'Verified CR',
    projectsCount: 10,
    logoUrl: '/images/logos/ministry-of-commerce.png',
    status: 'active',
  },
  {
    id: 'p-9',
    nameAr: 'منصة بلدي الرقمية',
    nameEn: 'Balady Digital Platform',
    categoryAr: 'منصة حكومية رقمية',
    categoryEn: 'Digital Gov Platform',
    badgeAr: 'رخص تشغيل معتمدة',
    badgeEn: 'Verified Permits',
    projectsCount: 22,
    logoUrl: '/images/logos/balady-platform.png',
    status: 'active',
  },
  {
    id: 'p-10',
    nameAr: 'هيئة الزكاة والضريبة والجمارك',
    nameEn: 'Zakat, Tax and Customs Authority',
    categoryAr: 'التزام مالي وضريبي',
    categoryEn: 'Tax & Customs Compliance',
    badgeAr: 'شهادة ضريبية سارية',
    badgeEn: 'Active Tax Cert',
    projectsCount: 15,
    logoUrl: '/images/logos/zatca-vat.png',
    status: 'active',
  },
  {
    id: 'p-11',
    nameAr: 'رؤية المملكة 2030',
    nameEn: 'Saudi Vision 2030',
    categoryAr: 'المستهدفات الوطنية',
    categoryEn: 'National Vision',
    badgeAr: 'شريك التنمية المستدامة',
    badgeEn: 'Sustainable Partner',
    projectsCount: 30,
    logoUrl: '/images/logos/vision-2030-logo.jpg',
    status: 'active',
  },
];


