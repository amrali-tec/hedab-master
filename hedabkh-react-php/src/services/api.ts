import { publicApi } from './publicApi';
import { Project, Service, Statistic, TeamMember, Certificate, Inquiry, EquipmentItem, PartnerItem, RichArticleItem } from '../types';

/**
 * Service Layer - Connects to native PHP REST API via publicApi.
 */
export const api = {
  getProjects: (locale: 'ar' | 'en'): Promise<Project[]> => publicApi.getProjects(locale),
  getProjectById: (id: string, locale: 'ar' | 'en'): Promise<Project | undefined> => publicApi.getProjectById(id, locale),
  getServices: (locale: 'ar' | 'en'): Promise<Service[]> => publicApi.getServices(locale),
  getServiceById: (id: string, locale: 'ar' | 'en'): Promise<Service | undefined> => publicApi.getServiceById(id, locale),
  getStatistics: (locale: 'ar' | 'en'): Promise<Statistic[]> => publicApi.getStatistics(locale),
  getTeam: (locale: 'ar' | 'en'): Promise<TeamMember[]> => publicApi.getTeam(locale),
  getCertificates: (locale: 'ar' | 'en'): Promise<Certificate[]> => publicApi.getCertificates(locale),
  getEquipmentFleet: (): Promise<EquipmentItem[]> => publicApi.getEquipmentFleet(),
  getPartners: (): Promise<PartnerItem[]> => publicApi.getPartners(),
  getArticles: (): Promise<RichArticleItem[]> => publicApi.getArticles(),
  getArticleBySlug: (slug: string): Promise<RichArticleItem | undefined> => publicApi.getArticleBySlug(slug),
  submitInquiry: (inquiry: { name: string; email: string; phone: string; message: string }): Promise<Inquiry> => publicApi.submitInquiry(inquiry),
};
