'use client';

export interface AnalyticsEvent {
  category: 'conversion' | 'lead' | 'engagement' | 'download';
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

const ANALYTICS_STORAGE_KEY = 'hedabkh_analytics_counters';

interface AnalyticsCounters {
  whatsappClicks: number;
  formSubmissions: number;
  pdfDownloads: number;
  ctaClicks: number;
  lastEventAt: string;
}

const getStoredCounters = (): AnalyticsCounters => {
  if (typeof window === 'undefined') {
    return { whatsappClicks: 0, formSubmissions: 0, pdfDownloads: 0, ctaClicks: 0, lastEventAt: '' };
  }
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return { whatsappClicks: 0, formSubmissions: 0, pdfDownloads: 0, ctaClicks: 0, lastEventAt: '' };
};

export const trackEvent = (event: AnalyticsEvent): void => {
  if (typeof window === 'undefined') return;

  // 1. Dispatch to GA4 / GTM dataLayer if present
  try {
    const windowWithDataLayer = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    if (windowWithDataLayer.dataLayer) {
      windowWithDataLayer.dataLayer.push({
        event: event.action,
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }
  } catch {
    // fail silently
  }

  // 2. Increment local conversion counters
  try {
    const counters = getStoredCounters();
    counters.lastEventAt = new Date().toISOString();

    if (event.action === 'whatsapp_click') {
      counters.whatsappClicks += 1;
    } else if (event.action === 'contact_form_submit' || event.action === 'inquiry_created') {
      counters.formSubmissions += 1;
    } else if (event.action === 'pdf_download') {
      counters.pdfDownloads += 1;
    } else if (event.action === 'cta_click') {
      counters.ctaClicks += 1;
    }

    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(counters));
  } catch {
    // fail silently
  }

  console.log(`[Analytics Tracked] ${event.category} -> ${event.action} (${event.label || ''})`);
};

export const getAnalyticsCounters = (): AnalyticsCounters => {
  return getStoredCounters();
};
