import { storageAdapter } from './storageAdapter';
import { Project, Service, Statistic, TeamMember, Certificate, Inquiry } from '../types';

/**
 * Service Layer - Connects to local persistent storage adapter or remote DB/API.
 * Enables instant live reflection of admin updates across all public pages.
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  /**
   * Fetches projects based on the selected locale.
   */
  getProjects: async (locale: 'ar' | 'en'): Promise<Project[]> => {
    await delay(300); // Simulate light network latency
    return storageAdapter.getProjects(locale);
  },

  /**
   * Fetches a single project by ID.
   */
  getProjectById: async (id: string, locale: 'ar' | 'en'): Promise<Project | undefined> => {
    await delay(200);
    const projects = storageAdapter.getProjects(locale);
    return projects.find((p) => p.id === id);
  },

  /**
   * Fetches services based on the selected locale.
   */
  getServices: async (locale: 'ar' | 'en'): Promise<Service[]> => {
    await delay(200);
    return storageAdapter.getServices(locale);
  },

  /**
   * Fetches statistics based on the selected locale.
   */
  getStatistics: async (locale: 'ar' | 'en'): Promise<Statistic[]> => {
    await delay(150);
    return storageAdapter.getStatistics(locale);
  },

  /**
   * Fetches team profiles based on the selected locale.
   */
  getTeam: async (locale: 'ar' | 'en'): Promise<TeamMember[]> => {
    await delay(200);
    return storageAdapter.getTeam(locale);
  },

  /**
   * Fetches company certificates and accreditations based on the selected locale.
   */
  getCertificates: async (locale: 'ar' | 'en'): Promise<Certificate[]> => {
    await delay(200);
    return storageAdapter.getCertificates(locale);
  },

  /**
   * Submits a visitor inquiry from the contact form into the admin inquiries box.
   */
  submitInquiry: async (inquiry: { name: string; email: string; phone: string; message: string }): Promise<Inquiry> => {
    await delay(400);
    return storageAdapter.saveInquiry(inquiry);
  },
};

