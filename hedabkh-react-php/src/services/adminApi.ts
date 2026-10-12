import { apiClient } from './apiClient';
import {
  Project,
  Service,
  Statistic,
  TeamMember,
  Certificate,
  Inquiry,
  ActivityLog,
  AdminUser,
  PartnerItem,
  EquipmentItem,
  RichArticleItem,
  SeoSettingsConfig,
} from '../types';
import { storageAdapter } from './storageAdapter';

/**
 * Admin Management API Service
 * Connects directly to PHP REST API endpoints (/api/v1/admin/...)
 */
export const adminApi = {
  // 1. Projects
  getProjects: async (locale: 'ar' | 'en' = 'ar'): Promise<Project[]> => {
    try {
      const res = await apiClient.get<any[]>('/admin/projects', { locale });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((p: any) => ({
          id: p.id,
          title: (locale === 'en' ? (p.titleEn || p.title) : (p.titleAr || p.title)) || '',
          description: (locale === 'en' ? (p.descriptionEn || p.description) : (p.descriptionAr || p.description)) || '',
          category: (locale === 'en' ? (p.categoryEn || p.category) : (p.categoryAr || p.category)) || 'مقاولات عامة',
          image: p.image || p.imageUrl || '/images/projects/project-1.jpg',
          sitePrepImage: p.sitePrepImage || p.image || '/images/projects/project-1.jpg',
          executionPhaseImage: p.executionPhaseImage || p.image || '/images/projects/project-2.jpg',
          finalHandoverImage: p.finalHandoverImage || p.image || '/images/projects/project-3.jpg',
          completionDate: p.completionDate || '2026-12-31',
          location: (locale === 'en' ? (p.locationEn || p.location) : (p.locationAr || p.location)) || 'المملكة العربية السعودية',
          client: (locale === 'en' ? (p.clientEn || p.client) : (p.clientAr || p.client)) || 'جهة حكومية',
          progress: Number(p.progress || p.progressPercent) || 85,
          features: Array.isArray(p.features) ? p.features : [],
          isPublished: p.isPublished !== false && p.isActive !== false,
        }));
      }
    } catch {}
    return storageAdapter.getProjects(locale);
  },

  saveProject: async (project: Project, locale: 'ar' | 'en' = 'ar'): Promise<Project> => {
    try {
      const isNew = !project.id || project.id.startsWith('temp-');
      const res = isNew
        ? await apiClient.post<Project>('/admin/projects', project)
        : await apiClient.put<Project>(`/admin/projects/${project.id}`, project);
      if (res.success && res.data) {
        return res.data;
      }
    } catch {}
    return storageAdapter.saveProject(project, locale);
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/projects/${id}`);
    } catch {}
    storageAdapter.deleteProject(id);
  },

  toggleProjectPublish: async (id: string, locale: 'ar' | 'en' = 'ar'): Promise<boolean> => {
    return storageAdapter.toggleProjectPublish(id, locale);
  },

  // 2. Services
  getServices: async (locale: 'ar' | 'en' = 'ar'): Promise<Service[]> => {
    try {
      const res = await apiClient.get<Service[]>('/admin/services', { locale });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((s: any) => ({
          id: s.id,
          title: (locale === 'en' ? (s.titleEn || s.title) : (s.titleAr || s.title)) || '',
          description: (locale === 'en' ? (s.descriptionEn || s.description) : (s.descriptionAr || s.description)) || '',
          icon: s.icon || s.iconKey || 'barrier-icon',
          features: Array.isArray(s.features) ? s.features : [],
          sectors: Array.isArray(s.sectors) ? s.sectors : ['البنية التحتية'],
          isPublished: s.isPublished !== false && s.isActive !== false,
        }));
      }
    } catch {}
    return storageAdapter.getServices(locale);
  },

  saveService: async (service: Service, locale: 'ar' | 'en' = 'ar'): Promise<Service> => {
    try {
      const isNew = !service.id || service.id.startsWith('temp-');
      const res = isNew
        ? await apiClient.post<Service>('/admin/services', service)
        : await apiClient.put<Service>(`/admin/services/${service.id}`, service);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.saveService(service, locale);
  },

  deleteService: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/services/${id}`);
    } catch {}
    storageAdapter.deleteService(id);
  },

  toggleServicePublish: async (id: string, locale: 'ar' | 'en' = 'ar'): Promise<boolean> => {
    return storageAdapter.toggleServicePublish(id, locale);
  },

  // 3. Certificates
  getCertificates: async (locale: 'ar' | 'en' = 'ar'): Promise<Certificate[]> => {
    try {
      const res = await apiClient.get<Certificate[]>('/admin/certificates');
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((c: any) => ({
          id: c.id,
          title: (locale === 'en' ? (c.titleEn || c.title) : (c.titleAr || c.title)) || '',
          issuer: (locale === 'en' ? (c.issuerEn || c.issuer) : (c.issuerAr || c.issuer)) || '',
          issueDate: c.issueDate || c.issue_date || '2024-01-01',
          expiryDate: c.expiryDate || c.expiry_date || '2027-01-01',
          idNumber: c.idNumber || c.id_number || '',
          type: c.type || 'government',
          category: c.category || 'official',
          filePath: c.filePath || c.file_path || '/documents/certificate.pdf',
          isPublished: c.isPublished !== false && c.isActive !== false,
        }));
      }
    } catch {}
    return storageAdapter.getCertificates(locale);
  },

  saveCertificate: async (cert: Certificate, locale: 'ar' | 'en' = 'ar'): Promise<Certificate> => {
    try {
      const isNew = !cert.id || cert.id.startsWith('temp-');
      const res = isNew
        ? await apiClient.post<Certificate>('/admin/certificates', cert)
        : await apiClient.put<Certificate>(`/admin/certificates/${cert.id}`, cert);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.saveCertificate(cert, locale);
  },

  deleteCertificate: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/certificates/${id}`);
    } catch {}
    storageAdapter.deleteCertificate(id);
  },

  toggleCertificatePublish: async (id: string, locale: 'ar' | 'en' = 'ar'): Promise<boolean> => {
    return storageAdapter.toggleCertificatePublish(id, locale);
  },

  // 4. Statistics
  getStatistics: async (locale: 'ar' | 'en' = 'ar'): Promise<Statistic[]> => {
    try {
      const res = await apiClient.get<Statistic[]>('/admin/statistics');
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((st: any) => ({
          id: st.id,
          label: (locale === 'en' ? (st.labelEn || st.label) : (st.labelAr || st.label)) || '',
          value: String(st.valueNum !== undefined ? st.valueNum : (st.value || 0)),
          prefix: (locale === 'en' ? (st.prefixEn || st.prefix) : (st.prefixAr || st.prefix)) || '',
          suffix: (locale === 'en' ? (st.suffixEn || st.suffix) : (st.suffixAr || st.suffix)) || '',
          icon: st.icon || st.iconKey || 'hard-hat'
        }));
      }
    } catch {}
    return storageAdapter.getStatistics(locale);
  },

  saveStatistic: async (stat: Statistic, locale: 'ar' | 'en' = 'ar'): Promise<Statistic> => {
    try {
      const res = await apiClient.put<Statistic>(`/admin/statistics/${stat.id}`, stat);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.saveStatistic(stat, locale);
  },

  // 5. Team
  getTeam: async (locale: 'ar' | 'en' = 'ar'): Promise<TeamMember[]> => {
    try {
      const res = await apiClient.get<TeamMember[]>('/admin/team');
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((m: any) => ({
          id: m.id,
          name: (locale === 'en' ? (m.nameEn || m.name) : (m.nameAr || m.name)) || '',
          nameAr: m.nameAr || m.name || '',
          nameEn: m.nameEn || m.name || '',
          role: (locale === 'en' ? (m.roleEn || m.role) : (m.roleAr || m.role)) || '',
          roleAr: m.roleAr || m.role || '',
          roleEn: m.roleEn || m.role || '',
          bio: (locale === 'en' ? (m.bioEn || m.bio) : (m.bioAr || m.bio)) || '',
          bioAr: m.bioAr || m.bio || '',
          bioEn: m.bioEn || m.bio || '',
          image: m.image || m.imageUrl || '/images/avatars/admin-avatar.jpg',
          imageUrl: m.imageUrl || m.image || '/images/avatars/admin-avatar.jpg',
          sector: m.sector || 'PROJECTS',
          badge: (locale === 'en' ? (m.badgeEn || m.badge) : (m.badgeAr || m.badge)) || '',
          badgeAr: m.badgeAr || m.badge || '',
          badgeEn: m.badgeEn || m.badge || '',
          experience: (locale === 'en' ? (m.experienceEn || m.experience) : (m.experienceAr || m.experience)) || '',
          email: m.email || '',
          phone: m.phone || '',
          isActive: m.isActive !== undefined ? m.isActive : true,
          isPublished: m.isPublished !== false && m.isActive !== false,
          sortOrder: m.sortOrder || 1
        }));
      }
    } catch {}
    return storageAdapter.getTeam(locale);
  },

  saveTeamMember: async (member: TeamMember, locale: 'ar' | 'en' = 'ar'): Promise<TeamMember> => {
    try {
      const isNew = !member.id || member.id.startsWith('temp-');
      const res = isNew
        ? await apiClient.post<TeamMember>('/admin/team', member)
        : await apiClient.put<TeamMember>(`/admin/team/${member.id}`, member);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.saveTeamMember(member, locale);
  },

  deleteTeamMember: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/team/${id}`);
    } catch {}
    storageAdapter.deleteTeamMember(id);
  },

  toggleTeamPublish: async (id: string, locale: 'ar' | 'en' = 'ar'): Promise<boolean> => {
    return storageAdapter.toggleTeamPublish(id, locale);
  },

  // 6. Inquiries
  getInquiries: async (): Promise<Inquiry[]> => {
    try {
      const res = await apiClient.get<Inquiry[]>('/admin/inquiries');
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((inq: any) => ({
          id: inq.id,
          name: inq.name || '',
          phone: inq.phone || '',
          email: inq.email || '',
          serviceCategory: inq.serviceCategory || inq.service_category || 'عام',
          message: inq.message || '',
          status: inq.status || 'pending',
          createdAt: inq.createdAt || inq.created_at || new Date().toISOString(),
          notes: inq.notes || ''
        }));
      }
    } catch {}
    return storageAdapter.getInquiries();
  },

  updateInquiryStatus: async (id: string, status: Inquiry['status'], notes?: string): Promise<void> => {
    try {
      await apiClient.patch(`/admin/inquiries/${id}/status`, { status, notes });
    } catch {}
    storageAdapter.updateInquiryStatus(id, status, notes);
  },

  deleteInquiry: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/inquiries/${id}`);
    } catch {}
    storageAdapter.deleteInquiry(id);
  },

  // 7. Equipment Fleet
  getEquipmentFleet: async (): Promise<EquipmentItem[]> => {
    try {
      const res = await apiClient.get<EquipmentItem[]>('/admin/equipment');
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((e: any) => ({
          id: e.id,
          nameAr: e.nameAr || e.name || '',
          nameEn: e.nameEn || e.name || '',
          categoryAr: e.categoryAr || e.category || 'معدات ثقيلة',
          categoryEn: e.categoryEn || e.category || 'Heavy Equipment',
          model: e.model || '',
          brand: e.brand || '',
          count: Number(e.count || e.unitCount) || 1,
          imageUrl: e.imageUrl || e.image || '/images/equipment/wirtgen-milling-machine.jpg',
          status: e.status || 'active',
          isPublished: e.isPublished !== false && e.status !== 'maintenance' && e.isActive !== false,
          specifications: e.specifications || {},
          features: Array.isArray(e.features) ? e.features : []
        }));
      }
    } catch {}
    return storageAdapter.getEquipmentFleet();
  },

  saveEquipmentItem: async (item: EquipmentItem): Promise<EquipmentItem> => {
    try {
      const isNew = !item.id || item.id.startsWith('temp-');
      const res = isNew
        ? await apiClient.post<EquipmentItem>('/admin/equipment', item)
        : await apiClient.put<EquipmentItem>(`/admin/equipment/${item.id}`, item);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.saveEquipmentItem(item);
  },

  deleteEquipmentItem: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/equipment/${id}`);
    } catch {}
    storageAdapter.deleteEquipmentItem(id);
  },

  toggleEquipmentPublish: async (id: string): Promise<boolean> => {
    return storageAdapter.toggleEquipmentPublish(id);
  },

  // 8. Partners
  getPartners: async (): Promise<PartnerItem[]> => {
    try {
      const res = await apiClient.get<PartnerItem[]>('/admin/partners');
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((p: any) => ({
          id: p.id,
          nameAr: p.nameAr || p.name_ar || '',
          nameEn: p.nameEn || p.name_en || p.nameAr || '',
          categoryAr: p.categoryAr || p.category || 'جهة حكومية',
          categoryEn: p.categoryEn || p.category || 'Government Entity',
          badgeAr: p.badgeAr || p.contractRoleAr || p.contract_role_ar || 'اعتماد رسمي',
          badgeEn: p.badgeEn || p.contractRoleEn || p.contract_role_en || 'Official Partner',
          projectsCount: Number(p.projectsCount || p.projects_count) || 5,
          logoUrl: p.logoUrl || p.logo_url || p.logo || '/images/logos/ministry-municipal-affairs.jpg',
          status: p.status || (p.isActive ? 'active' : 'inactive'),
          isPublished: p.isPublished !== false && p.isActive !== false && p.status !== 'archived' && p.status !== 'inactive',
        }));
      }
    } catch {}
    return storageAdapter.getPartners();
  },

  savePartner: async (partner: PartnerItem): Promise<PartnerItem> => {
    try {
      const isNew = !partner.id || partner.id.startsWith('temp-');
      const res = isNew
        ? await apiClient.post<PartnerItem>('/admin/partners', partner)
        : await apiClient.put<PartnerItem>(`/admin/partners/${partner.id}`, partner);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.savePartnerItem(partner);
  },

  deletePartner: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/partners/${id}`);
    } catch {}
    storageAdapter.deletePartnerItem(id);
  },

  togglePartnerPublish: async (id: string): Promise<boolean> => {
    return storageAdapter.togglePartnerPublish(id);
  },

  // 9. Articles
  getRichArticles: async (): Promise<RichArticleItem[]> => {
    try {
      const res = await apiClient.get<RichArticleItem[]>('/admin/articles');
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.getArticles();
  },

  saveRichArticle: async (article: RichArticleItem): Promise<RichArticleItem> => {
    try {
      const isNew = !article.id || article.id.startsWith('temp-');
      const res = isNew
        ? await apiClient.post<RichArticleItem>('/admin/articles', article)
        : await apiClient.put<RichArticleItem>(`/admin/articles/${article.id}`, article);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.saveArticle(article);
  },

  deleteRichArticle: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/articles/${id}`);
    } catch {}
    storageAdapter.deleteArticle(id);
  },

  toggleArticlePublish: async (id: string): Promise<boolean> => {
    try {
      const res = await apiClient.patch<{ success: boolean; isPublished: boolean }>(`/admin/articles/${id}/publish`);
      if (res.success && typeof res.data?.isPublished === 'boolean') {
        return res.data.isPublished;
      }
    } catch {}
    return storageAdapter.toggleArticlePublish(id);
  },

  // 10. Admin Users
  getAdminUsers: async (): Promise<AdminUser[]> => {
    try {
      const res = await apiClient.get<AdminUser[]>('/admin/users');
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.getAdminUsers();
  },

  saveAdminUser: async (user: AdminUser): Promise<AdminUser> => {
    try {
      const isNew = !user.id || user.id.startsWith('temp-');
      const res = isNew
        ? await apiClient.post<AdminUser>('/admin/users', user)
        : await apiClient.put<AdminUser>(`/admin/users/${user.id}`, user);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.saveAdminUser(user);
  },

  deleteAdminUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/users/${id}`);
    } catch {}
    storageAdapter.deleteAdminUser(id);
  },

  // 11. Activity Logs
  getActivityLogs: async (): Promise<ActivityLog[]> => {
    try {
      const res = await apiClient.get<ActivityLog[]>('/admin/logs');
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.getLogs();
  },

  addLog: async (log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> => {
    storageAdapter.addLog(log);
  },

  // 12. Settings
  getBrandSettings: async (): Promise<any> => {
    try {
      const res = await apiClient.get<any>('/admin/settings');
      if (res.success && res.data?.brand) return res.data.brand;
    } catch {}
    return storageAdapter.getBrandSettings();
  },

  saveBrandSettings: async (settings: any): Promise<any> => {
    try {
      const res = await apiClient.put<any>('/admin/settings/brand', settings);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.saveBrandSettings(settings);
  },

  getSeoSettings: async (): Promise<SeoSettingsConfig> => {
    try {
      const res = await apiClient.get<any>('/admin/settings');
      if (res.success && res.data?.seo) return res.data.seo;
    } catch {}
    return storageAdapter.getSeoSettings();
  },

  saveSeoSettings: async (config: SeoSettingsConfig): Promise<SeoSettingsConfig> => {
    try {
      const res = await apiClient.put<SeoSettingsConfig>('/admin/settings/seo', config);
      if (res.success && res.data) return res.data;
    } catch {}
    return storageAdapter.saveSeoSettings(config);
  },
};
