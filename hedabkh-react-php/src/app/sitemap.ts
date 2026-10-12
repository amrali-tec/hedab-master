import { MetadataRoute } from 'next';
import { mockData } from '../data/mockData';
import { storageAdapter } from '../services/storageAdapter';

export const dynamic = 'force-static';

/**
 * Dynamic Multilingual XML Sitemap Generator
 * Automatically indexes all localized routes, dynamic projects, and news articles for search engines (Google, Bing).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['ar', 'en'] as const;
  const baseUrl = 'https://hedabkh.com.sa';

  const routes = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/projects', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/services', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/equipment', priority: 0.85, changeFreq: 'monthly' as const },
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/certificates', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/chairman-message', priority: 0.75, changeFreq: 'monthly' as const },
    { path: '/news', priority: 0.75, changeFreq: 'weekly' as const },
    { path: '/team', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
  ];

  // 1. Generate URLs for static localized pages with hreflang alternates
  const staticUrls = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFreq,
      priority: route.priority,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar${route.path}`,
          en: `${baseUrl}/en${route.path}`,
          'x-default': `${baseUrl}/ar${route.path}`,
        },
      },
    }))
  );

  // 2. Generate URLs dynamically for each project page with hreflang alternates
  const projectUrls = locales.flatMap((locale) =>
    mockData[locale].projects.map((proj) => ({
      url: `${baseUrl}/${locale}/projects/${proj.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar/projects/${proj.id}`,
          en: `${baseUrl}/en/projects/${proj.id}`,
          'x-default': `${baseUrl}/ar/projects/${proj.id}`,
        },
      },
    }))
  );

  // 3. Generate URLs dynamically for each news article with hreflang alternates
  const articles = storageAdapter.getArticles();
  const articleUrls = locales.flatMap((locale) =>
    articles.map((art) => ({
      url: `${baseUrl}/${locale}/news/${art.slug}`,
      lastModified: new Date(art.publishedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar/news/${art.slug}`,
          en: `${baseUrl}/en/news/${art.slug}`,
          'x-default': `${baseUrl}/ar/news/${art.slug}`,
        },
      },
    }))
  );

  return [...staticUrls, ...projectUrls, ...articleUrls];
}
