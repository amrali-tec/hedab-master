/**
 * HEDABKH Corporate REST API Type Contracts
 * Mirrors MariaDB schema & PHP REST API envelopes (/api/v1/)
 */

export interface ApiSuccessMeta {
  timestamp: string;
  version: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  locale?: 'ar' | 'en';
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[] | Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: ApiSuccessMeta;
  error?: ApiErrorPayload;
}

// 1. Projects
export interface ApiProject {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  titleEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  category: string;
  categoryAr: string;
  categoryEn: string;
  image: string;
  imageUrl: string;
  sitePrepImage?: string;
  executionPhaseImage?: string;
  finalHandoverImage?: string;
  completionDate: string;
  location: string;
  locationAr: string;
  locationEn: string;
  client: string;
  clientAr: string;
  clientEn: string;
  progress: number;
  progressPercent: number;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  features: string[];
}

// 2. Services
export interface ApiService {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  titleEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  iconKey: string;
  features: string[];
  sectors: string[];
  sortOrder: number;
  isActive: boolean;
}

// 3. Equipment
export interface ApiEquipment {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  model: string;
  brand: string;
  count: number;
  unitCount: number;
  image: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

// 4. Certificates
export interface ApiCertificate {
  id: string;
  titleAr: string;
  titleEn: string;
  issuerAr: string;
  issuerEn: string;
  idNumber: string;
  issueDate: string;
  expiryDate: string;
  type: 'iso' | 'government' | string;
  category: 'official' | 'classification' | 'iso' | 'identity' | string;
  creditRating?: string;
  filePath?: string;
  isActive: boolean;
  sortOrder: number;
}

// 5. Team
export interface ApiTeamMember {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  role: string;
  roleAr: string;
  roleEn: string;
  bio: string;
  bioAr: string;
  bioEn: string;
  image: string;
  imageUrl: string;
  sector: string;
  badge: string;
  badgeAr: string;
  badgeEn: string;
  experience: string;
  experienceAr: string;
  experienceEn: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  sortOrder: number;
}

// 6. Partners
export interface ApiPartner {
  id: string;
  nameAr: string;
  nameEn: string;
  logoUrl: string;
  logo: string;
  category: string;
  contractRoleAr: string;
  contractRoleEn: string;
  projectsCount: number;
  isActive: boolean;
  sortOrder: number;
}

// 7. Articles
export interface ApiArticle {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  readTimeAr: string;
  readTimeEn: string;
  publishedDate: string;
  coverImage: string;
  imageAltAr: string;
  imageAltEn: string;
  summaryAr: string;
  summaryEn: string;
  seoTitleAr: string;
  seoTitleEn: string;
  metaDescriptionAr: string;
  metaDescriptionEn: string;
  contentAr: string;
  contentEn: string;
  status: 'published' | 'draft' | string;
}

// 8. Statistics
export interface ApiStatistic {
  id: string;
  key: string;
  keyName: string;
  value: number;
  valueNum: number;
  prefix: string;
  suffix: string;
  prefixAr: string;
  prefixEn: string;
  suffixAr: string;
  suffixEn: string;
  label: string;
  labelAr: string;
  labelEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  iconKey: string;
  sortOrder: number;
}

// 9. Timeline Milestones
export interface ApiTimelineMilestone {
  id: string;
  year: string;
  yearLabelAr: string;
  yearLabelEn: string;
  title: string;
  titleAr: string;
  titleEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  colorCard: string;
  colorRing: string;
  sortOrder: number;
  isActive: boolean;
}

// 10. Regional Coverage
export interface ApiCoverageRegion {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  activeProjectsCount: number;
  coverage: string;
  coverageAr: string;
  coverageEn: string;
  headquarters: string;
  headquartersAr: string;
  headquartersEn: string;
  fleetCount: string;
  fleetCountLabel: string;
  status: string;
  sortOrder: number;
}

// 11. Settings
export interface ApiBrandSettings {
  companyNameAr?: string;
  companyNameEn?: string;
  taglineAr?: string;
  taglineEn?: string;
  commercialRegistration?: string;
  unifiedNumber?: string;
  phone?: string;
  email?: string;
  addressAr?: string;
  addressEn?: string;
  workingHoursAr?: string;
  workingHoursEn?: string;
  socialLinks?: Record<string, string>;
  [key: string]: unknown;
}

export interface ApiSeoSetting {
  id: string;
  page_key: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  keywords_ar: string[];
  keywords_en: string[];
  og_image?: string;
  canonical_url?: string;
}

// 12. Visual CMS Page
export interface ApiCmsPageData {
  pageId: string;
  slug: string;
  versionNumber: number;
  state: 'published' | 'draft';
  titleAr: string;
  titleEn: string;
  blocks: Array<{
    id: string;
    type: string;
    sortOrder: number;
    isVisible: boolean;
    config: Record<string, any>;
  }>;
}

// 13. Inquiries
export interface ApiInquiryInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ApiInquiryResponse {
  id: string;
  status: string;
  createdAt: string;
}

// 14. Admin Auth
export interface ApiAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'project_manager' | 'quality_officer' | 'content_editor' | string;
  avatar: string;
  phone?: string;
  status: 'active' | 'suspended' | string;
  permissions: string[];
  lastLogin?: string;
}
