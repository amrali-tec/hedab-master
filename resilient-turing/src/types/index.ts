/**
 * TypeScript Interfaces for the Engineering Portal
 * Separates data models from the UI layer to ensure future API or CMS integration is seamless.
 */

/**
 * Represents an engineering project.
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  detailsHtmlAr?: string; // Rich visual HTML details & specs
  detailsHtmlEn?: string;
  category: string;
  image: string;
  sitePrepImage?: string; // صورة تمهيد وتأسيس الموقع
  executionPhaseImage?: string; // صورة مرحلة التنفيذ والتشييد
  finalHandoverImage?: string; // صورة التسليم الميداني النهائي
  galleryImages?: string[]; // معرض الصور الميدانية
  completionDate: string;
  startDate?: string;
  contractSignDate?: string;
  durationMonths?: number;
  contractNumber?: string;
  contractRole?: string;
  contractScope?: string;
  classificationStatus?: string;
  location: string;
  client: string;
  features: string[];
  progress?: number;
}

/**
 * Represents an engineering or architectural service.
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  detailsHtmlAr?: string; // Rich visual HTML details
  detailsHtmlEn?: string;
  icon: string; // CSS class or icon identifier
  features: string[]; // Key deliverables or features of the service
  sectors: string[]; // Sectors where this service is applied (e.g. Infrastructure, Energy)
}

/**
 * Represents a key performance indicator or statistic for the portal.
 */
export interface Statistic {
  id: string;
  label: string;
  value: number; // Numeric value for counting animations
  prefix?: string; // e.g. "+" or "$"
  suffix?: string; // e.g. "%" or "M+" or "Projects"
  icon?: string; // Icon identifier
}

/**
 * Represents a corporate team member.
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  sector?: string;
  badge?: string;
  experience?: string;
  email?: string;
  phone?: string;
}

/**
 * Represents a corporate accreditation or certificate.
 */
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  idNumber: string;
  type: 'government' | 'iso';
  /** Category group for filtering: official, classification, iso, identity */
  category?: 'official' | 'classification' | 'iso' | 'identity';
  /** Path to the actual PDF document served from /public/documents/ */
  filePath?: string;
}

/**
 * Represents a contact form inquiry / lead from the website.
 */
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
  notes?: string;
}

/**
 * Represents an admin activity log item.
 */
export interface ActivityLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'status_change';
  entity: 'project' | 'service' | 'certificate' | 'statistic' | 'team' | 'inquiry' | 'settings' | 'media';
  entityTitle: string;
  timestamp: string;
  adminName: string;
}

export type AdminRole = 
  | 'super_admin' 
  | 'project_manager' 
  | 'quality_officer' 
  | 'inquiries_manager' 
  | 'content_editor';

export type AdminPermission = 
  | 'projects_manage' 
  | 'certificates_manage' 
  | 'services_manage' 
  | 'inquiries_view_reply' 
  | 'statistics_manage' 
  | 'team_manage' 
  | 'settings_manage' 
  | 'users_manage' 
  | 'logs_view'
  | 'design_manage'
  | 'media_manage';

/**
 * Admin User and permissions model.
 */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AdminRole | string;
  roleTitleAr?: string;
  roleTitleEn?: string;
  permissions: AdminPermission[];
  status: 'active' | 'suspended';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

/**
 * Header & Navigation Menu CMS Types
 */
export interface MenuItem {
  id: string;
  labelAr: string;
  labelEn: string;
  path: string;
  order: number;
  isEnabled: boolean;
  badgeAr?: string;
  badgeEn?: string;
  isExternal?: boolean;
}

export interface HeaderConfig {
  announcement: {
    isEnabled: boolean;
    textAr: string;
    textEn: string;
    phone: string;
    buttonTextAr: string;
    buttonTextEn: string;
    buttonLink: string;
    bgColor: string;
  };
  ctaButton: {
    isEnabled: boolean;
    textAr: string;
    textEn: string;
    link: string;
  };
  menuItems: MenuItem[];
  logo: {
    lightUrl: string;
    darkUrl: string;
    height: number;
  };
}

/**
 * Footer CMS Types
 */
export interface FooterLinkItem {
  id: string;
  labelAr: string;
  labelEn: string;
  path: string;
}

export interface FooterConfig {
  aboutTextAr: string;
  aboutTextEn: string;
  copyrightAr: string;
  copyrightEn: string;
  quickLinks: FooterLinkItem[];
  engineeringLinks: FooterLinkItem[];
  legalLinks: FooterLinkItem[];
  socials: {
    platform: string;
    url: string;
    icon: string;
    isEnabled: boolean;
  }[];
  contact: {
    phone: string;
    email: string;
    cr: string;
    vat: string;
    addressAr: string;
    addressEn: string;
    mapUrl: string;
  };
}

/**
 * Homepage Sections & Content Builder CMS Types
 */
export interface HomeContentConfig {
  hero: {
    headlineAr: string;
    headlineEn: string;
    highlightAr: string;
    highlightEn: string;
    badgeAr: string;
    badgeEn: string;
    unifiedNumber: string;
    descriptionAr: string;
    descriptionEn: string;
    primaryBtnTextAr: string;
    primaryBtnTextEn: string;
    primaryBtnLink: string;
    secondaryBtnTextAr: string;
    secondaryBtnTextEn: string;
    secondaryBtnLink: string;
    bentoImage: string;
    bentoBadgeAr: string;
    bentoBadgeEn: string;
  };
  aboutPreview: {
    tagAr: string;
    tagEn: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    image: string;
    storyBtnTextAr: string;
    storyBtnTextEn: string;
    storyBtnLink: string;
  };
  servicesPreview: {
    tagAr: string;
    tagEn: string;
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
  };
  projectsPreview: {
    tagAr: string;
    tagEn: string;
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
  };
  saudiMap: {
    tagAr: string;
    tagEn: string;
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
    activeKmTextAr: string;
    activeKmTextEn: string;
    regionsCountTextAr: string;
    regionsCountTextEn: string;
  };
  vision2030: {
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    image: string;
  };
  timeline3D: {
    tagAr: string;
    tagEn: string;
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
  };
  partnersPreview?: {
    tagAr: string;
    tagEn: string;
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
    speedDuration?: number;
    pauseOnHover?: boolean;
    showProjectsCount?: boolean;
    displayMode?: 'marquee' | 'grid';
  };
}

export interface TimelineMilestoneItem {
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
}

export interface SaudiRegionItem {
  id: string;
  nameAr: string;
  nameEn: string;
  projectCount: number;
  activeKm: string;
  pinX: number; // Percentage 0-100
  pinY: number; // Percentage 0-100
  highlightColor: string;
  sampleProjects: {
    id: string;
    titleAr: string;
    titleEn: string;
    image: string;
    progress: number;
    clientAr: string;
    clientEn: string;
  }[];
}

/**
 * Heavy Machinery & Equipment Fleet CMS Types
 */
export interface EquipmentItem {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  model: string;
  brand: string;
  count: number;
  image: string;
  specsAr: string[];
  specsEn: string[];
  status: 'active' | 'maintenance' | 'standby';
}

/**
 * Partners & Clients Strategic CMS Types
 */
export interface PartnerItem {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  badgeAr: string;
  badgeEn: string;
  projectsCount?: number;
  logoUrl?: string;
  status?: 'active' | 'archived';
}

/**
 * Rich Article & Custom Page Visual CMS Types
 */
export interface RichArticleItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string; // Rich HTML content
  contentEn: string; // Rich HTML content
  category: 'news' | 'project-story' | 'announcement' | 'technical-guide' | 'sustainability';
  categoryAr: string;
  categoryEn: string;
  coverImage: string;
  galleryImages?: string[];
  author: {
    nameAr: string;
    nameEn: string;
    roleAr: string;
    roleEn: string;
    avatar: string;
  };
  publishedAt: string;
  updatedAt: string;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  readingTimeMinutes: number;
  featured?: boolean;
}

export interface SitePagesContentConfig {
  about: {
    headerTitleAr: string;
    headerTitleEn: string;
    headerSubtitleAr: string;
    headerSubtitleEn: string;
    storyHtmlAr: string;
    storyHtmlEn: string;
    visionHtmlAr: string;
    visionHtmlEn: string;
    missionHtmlAr: string;
    missionHtmlEn: string;
    storyImage: string;
    values: Array<{
      titleAr: string;
      titleEn: string;
      descAr: string;
      descEn: string;
      icon: string;
    }>;
  };
  chairmanMessage: {
    headerTitleAr: string;
    headerTitleEn: string;
    headerSubtitleAr: string;
    headerSubtitleEn: string;
    messageHtmlAr: string;
    messageHtmlEn: string;
    authorNameAr: string;
    authorNameEn: string;
    authorRoleAr: string;
    authorRoleEn: string;
    authorImage: string;
  };
  contact: {
    headerTitleAr: string;
    headerTitleEn: string;
    headerSubtitleAr: string;
    headerSubtitleEn: string;
    introHtmlAr: string;
    introHtmlEn: string;
    workingHoursAr: string;
    workingHoursEn: string;
    emergencyNoticeAr: string;
    emergencyNoticeEn: string;
  };
}

/**
 * Site-Wide Visual Editor Architecture Types (Visual Site Editor)
 */
export type EditableResourceType = 
  | 'page'
  | 'template'
  | 'header'
  | 'footer'
  | 'section'
  | 'component'
  | 'form';

export interface EditorElementNode {
  id: string;
  type: 
    | 'header-logo'
    | 'nav-menu'
    | 'hero-banner'
    | 'heading'
    | 'paragraph'
    | 'button'
    | 'card'
    | 'grid'
    | 'form-input'
    | 'form-submit'
    | 'dynamic-field'
    | 'container'
    | 'custom-html';
  name: string;
  props: Record<string, any>;
  styles: {
    bgColor?: string;
    textColor?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    border?: string;
    shadow?: string;
    customClasses?: string;
  };
  responsive?: {
    mobile?: Record<string, any>;
    tablet?: Record<string, any>;
    desktop?: Record<string, any>;
  };
  children?: EditorElementNode[];
  isGlobal?: boolean;
  linkedId?: string;
  bindings?: Record<string, string>; // Dynamic Data Path: e.g. "project.title" or "service.description"
  behavior?: {
    actionType?: 'submit_form' | 'navigate' | 'open_modal' | 'whatsapp';
    submitUrl?: string;
    validation?: { required?: boolean; pattern?: string };
  };
}

export interface EditableResource {
  id: string;
  type: EditableResourceType;
  name: string;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  target: string; // e.g. 'global:header', 'page:home', 'template:service'
  isGlobal: boolean;
  linkedResourceId?: string;
  content: {
    nodes: EditorElementNode[];
    settings: Record<string, any>;
    styles?: Record<string, any>;
    bindings?: Record<string, any>;
  };
  conditions?: {
    pages?: string[];
    languages?: ('ar' | 'en')[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'badge' | 'pdf';
  sizeBytes?: number;
  width?: number;
  height?: number;
  uploadedAt: string;
  category?: string;
  altAr?: string;
  altEn?: string;
}

export interface SeoPageMeta {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  keywordsAr: string[];
  keywordsEn: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface SeoSettingsConfig {
  home: SeoPageMeta;
  about: SeoPageMeta;
  services: SeoPageMeta;
  projects: SeoPageMeta;
  equipment: SeoPageMeta;
  certificates: SeoPageMeta;
  team: SeoPageMeta;
  news: SeoPageMeta;
  contact: SeoPageMeta;
  chairmanMessage: SeoPageMeta;
}
