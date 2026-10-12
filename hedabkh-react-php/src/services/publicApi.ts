import { apiClient } from './apiClient';
import {
  ApiProject,
  ApiService,
  ApiStatistic,
  ApiTeamMember,
  ApiCertificate,
  ApiPartner,
  ApiArticle,
  ApiEquipment,
  ApiCoverageRegion,
  ApiTimelineMilestone,
  ApiBrandSettings,
  ApiSeoSetting,
  ApiInquiryResponse
} from '../types/apiContracts';
import {
  Project,
  Service,
  Statistic,
  TeamMember,
  Certificate,
  Inquiry,
  RichArticleItem,
  EquipmentItem,
  PartnerItem
} from '../types';
import { BRAND_IDENTITY } from '../config/brand';

/**
 * Public Data API Service
 * Connects directly to PHP REST API endpoints (/api/v1/...)
 */
export const publicApi = {
  getProjects: async (locale: 'ar' | 'en' = 'ar'): Promise<Project[]> => {
    const res = await apiClient.get<ApiProject[]>('/projects', { locale, limit: 100 });
    if (!res.success || !res.data) {
      return [];
    }
    return res.data
      .filter((p: any) => p.isPublished !== false && p.is_published !== 0 && p.is_published !== '0')
      .map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        image: p.imageUrl || p.image,
        sitePrepImage: p.sitePrepImage,
        executionPhaseImage: p.executionPhaseImage,
        finalHandoverImage: p.finalHandoverImage,
        completionDate: p.completionDate,
        location: p.location,
        client: p.client,
        features: p.features || [],
        progress: p.progress ?? p.progressPercent ?? 100,
        isPublished: true,
      }));
  },

  getProjectById: async (id: string, locale: 'ar' | 'en' = 'ar'): Promise<Project | undefined> => {
    const res = await apiClient.get<ApiProject>(`/projects/${id}`, { locale });
    if (!res.success || !res.data) {
      return undefined;
    }
    const p = res.data;
    if ((p as any).isPublished === false || (p as any).is_published === 0 || (p as any).is_published === '0') {
      return undefined;
    }
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      image: p.imageUrl || p.image,
      sitePrepImage: p.sitePrepImage,
      executionPhaseImage: p.executionPhaseImage,
      finalHandoverImage: p.finalHandoverImage,
      completionDate: p.completionDate,
      location: p.location,
      client: p.client,
      features: p.features || [],
      progress: p.progress ?? p.progressPercent ?? 100,
      isPublished: true,
    };
  },

  getServices: async (locale: 'ar' | 'en' = 'ar'): Promise<Service[]> => {
    const res = await apiClient.get<ApiService[]>('/services', { locale });
    if (!res.success || !res.data) {
      return [];
    }
    return res.data
      .filter((s: any) => s.isPublished !== false && s.is_published !== 0 && s.is_published !== '0')
      .map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        icon: s.iconKey || s.icon || 'building-icon',
        features: s.features || [],
        sectors: s.sectors || [],
        isPublished: true,
      }));
  },

  getServiceById: async (id: string, locale: 'ar' | 'en' = 'ar'): Promise<Service | undefined> => {
    const res = await apiClient.get<ApiService>(`/services/${id}`, { locale });
    if (!res.success || !res.data) {
      return undefined;
    }
    const s = res.data;
    if ((s as any).isPublished === false || (s as any).is_published === 0 || (s as any).is_published === '0') {
      return undefined;
    }
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.iconKey || s.icon || 'building-icon',
      features: s.features || [],
      sectors: s.sectors || [],
      isPublished: true,
    };
  },

  getStatistics: async (locale: 'ar' | 'en' = 'ar'): Promise<Statistic[]> => {
    const res = await apiClient.get<ApiStatistic[]>('/statistics', { locale });
    if (!res.success || !res.data) {
      return [];
    }
    return res.data.map((st) => ({
      id: st.id,
      label: st.label,
      value: st.value ?? st.valueNum ?? 0,
      prefix: st.prefix || undefined,
      suffix: st.suffix || undefined,
      icon: st.iconKey || st.icon || undefined,
    }));
  },

  getTeam: async (locale: 'ar' | 'en' = 'ar'): Promise<TeamMember[]> => {
    const res = await apiClient.get<ApiTeamMember[]>('/team', { locale });
    if (!res.success || !res.data) {
      return [];
    }
    return res.data
      .filter((t: any) => t.isPublished !== false && t.is_published !== 0 && t.is_published !== '0')
      .map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        bio: t.bio,
        image: t.imageUrl || t.image,
        sector: t.sector,
        badge: t.badge,
        experience: t.experience,
        email: t.email,
        phone: t.phone,
        isPublished: true,
      }));
  },

  getCertificates: async (locale: 'ar' | 'en' = 'ar'): Promise<Certificate[]> => {
    const res = await apiClient.get<ApiCertificate[]>('/certificates');
    if (!res.success || !res.data) {
      return [];
    }
    return res.data
      .filter((c: any) => c.isPublished !== false && c.is_published !== 0 && c.is_published !== '0')
      .map((c) => ({
        id: c.id,
        title: locale === 'en' ? (c.titleEn || c.titleAr) : c.titleAr,
        issuer: locale === 'en' ? (c.issuerEn || c.issuerAr) : c.issuerAr,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
        idNumber: c.idNumber,
        type: (c.type === 'government' ? 'government' : 'iso'),
        category: c.category as Certificate['category'],
        filePath: c.filePath,
        isPublished: true,
      }));
  },

  getArticles: async (): Promise<RichArticleItem[]> => {
    const res = await apiClient.get<ApiArticle[]>('/articles', { limit: 50 });
    if (!res.success || !res.data) {
      return [];
    }
    return res.data.map((a) => ({
      id: a.id,
      slug: a.slug,
      titleAr: a.titleAr,
      titleEn: a.titleEn,
      category: 'news' as const,
      categoryAr: a.categoryAr || 'أخبار ومقالات',
      categoryEn: a.categoryEn || 'News & Articles',
      publishedAt: a.publishedDate,
      updatedAt: a.publishedDate,
      coverImage: a.coverImage,
      excerptAr: a.summaryAr,
      excerptEn: a.summaryEn,
      contentAr: a.contentAr,
      contentEn: a.contentEn,
      status: (a.status === 'published' ? 'published' : 'draft') as 'published' | 'draft',
      tags: ['مشاريع', 'بنية تحتية'],
      readingTimeMinutes: 4,
      author: {
        nameAr: 'الإدارة التنفيذية',
        nameEn: 'Executive Management',
        roleAr: 'هضاب الخليج للمقاولات',
        roleEn: 'Gulf Hills Contracting',
        avatar: '/images/avatars/admin-avatar.jpg',
      },
    }));
  },

  getArticleBySlug: async (slug: string): Promise<RichArticleItem | undefined> => {
    const res = await apiClient.get<ApiArticle>(`/articles/${slug}`);
    if (!res.success || !res.data) {
      return undefined;
    }
    const a = res.data;
    return {
      id: a.id,
      slug: a.slug,
      titleAr: a.titleAr,
      titleEn: a.titleEn,
      category: 'news' as const,
      categoryAr: a.categoryAr || 'أخبار ومقالات',
      categoryEn: a.categoryEn || 'News & Articles',
      publishedAt: a.publishedDate,
      updatedAt: a.publishedDate,
      coverImage: a.coverImage,
      excerptAr: a.summaryAr,
      excerptEn: a.summaryEn,
      contentAr: a.contentAr,
      contentEn: a.contentEn,
      status: (a.status === 'published' ? 'published' : 'draft') as 'published' | 'draft',
      tags: ['مشاريع', 'بنية تحتية'],
      readingTimeMinutes: 4,
      author: {
        nameAr: 'الإدارة التنفيذية',
        nameEn: 'Executive Management',
        roleAr: 'هضاب الخليج للمقاولات',
        roleEn: 'Gulf Hills Contracting',
        avatar: '/images/avatars/admin-avatar.jpg',
      },
    };
  },

  getEquipmentFleet: async (): Promise<EquipmentItem[]> => {
    const res = await apiClient.get<ApiEquipment[]>('/equipment');
    if (!res.success || !res.data) {
      return [];
    }
    return res.data
      .filter((eq: any) => eq.isPublished !== false && eq.is_published !== 0 && eq.is_published !== '0')
      .map((eq) => ({
        id: eq.id,
        nameAr: eq.nameAr,
        nameEn: eq.nameEn,
        categoryAr: eq.categoryAr || 'معدات ثقيلة',
        categoryEn: eq.categoryEn || 'Heavy Machinery',
        model: eq.model,
        brand: eq.brand,
        count: eq.count ?? eq.unitCount ?? 1,
        image: eq.image || eq.imageUrl || '/images/equipment/wirtgen-milling-machine.jpg',
        specsAr: ['معدات تشغيلية معتمدة للمشاريع الإنشائية'],
        specsEn: ['Certified operational equipment for infrastructure works'],
        status: 'active' as const,
        isPublished: true,
      }));
  },

  getPartners: async (): Promise<PartnerItem[]> => {
    const res = await apiClient.get<ApiPartner[]>('/partners');
    if (!res.success || !res.data) {
      return [];
    }
    return res.data
      .filter((p: any) => p.isPublished !== false && p.is_published !== 0 && p.is_published !== '0')
      .map((p) => ({
        id: p.id,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        logoUrl: p.logoUrl || p.logo,
        categoryAr: p.category || 'شريك استراتيجي',
        categoryEn: p.category || 'Strategic Partner',
        badgeAr: p.contractRoleAr || 'معتمد',
        badgeEn: p.contractRoleEn || 'Verified',
        projectsCount: p.projectsCount,
        status: 'active' as const,
        isPublished: true,
      }));
  },

  getTimeline: async (locale: 'ar' | 'en' = 'ar'): Promise<ApiTimelineMilestone[]> => {
    const res = await apiClient.get<ApiTimelineMilestone[]>('/timeline', { locale });
    return res.success && res.data ? res.data : [];
  },

  getRegions: async (locale: 'ar' | 'en' = 'ar'): Promise<ApiCoverageRegion[]> => {
    const res = await apiClient.get<ApiCoverageRegion[]>('/regions', { locale });
    return res.success && res.data ? res.data : [];
  },

  getBrandIdentity: async (): Promise<ApiBrandSettings> => {
    try {
      const res = await apiClient.get<ApiBrandSettings>('/settings/brand');
      if (res.success && res.data && Object.keys(res.data).length > 0) {
        return { ...BRAND_IDENTITY, ...res.data };
      }
    } catch {
      // Return static baseline fallback
    }
    return BRAND_IDENTITY as unknown as ApiBrandSettings;
  },

  getSeoSettings: async (pageKey?: string): Promise<ApiSeoSetting | ApiSeoSetting[] | null> => {
    const res = await apiClient.get<any>('/settings/seo', pageKey ? { page: pageKey } : undefined);
    return res.success && res.data ? res.data : null;
  },

  submitInquiry: async (inquiry: { name: string; email: string; phone: string; message: string }): Promise<Inquiry> => {
    const res = await apiClient.post<ApiInquiryResponse>('/inquiries', inquiry);
    if (!res.success) {
      throw new Error(res.error?.message || 'Failed to submit inquiry');
    }
    return {
      id: res.data?.id || `inq-${Date.now()}`,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      createdAt: res.data?.createdAt || new Date().toISOString(),
      status: 'new',
    };
  },
};
