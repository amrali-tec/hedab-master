import { BRAND_IDENTITY } from '../config/brand';

export interface BrandTranslation {
  name: string;
  tagline: string;
  logoText: string;
  address: string;
  mapUrl: string;
  phone: string;
  email: string;
  cr: string;
  vat: string;
  socials: {
    platform: string;
    url: string;
    icon: string;
  }[];
  sitemap: {
    title: string;
    links: { label: string; path: string }[];
  }[];
}

export const BRAND_CONFIG: Record<'ar' | 'en', BrandTranslation> = {
  ar: {
    name: BRAND_IDENTITY.name.ar,
    tagline: BRAND_IDENTITY.tagline.ar,
    logoText: BRAND_IDENTITY.logoText.ar,
    address: BRAND_IDENTITY.address.ar,
    mapUrl: BRAND_IDENTITY.mapUrl || 'https://maps.app.goo.gl/o8L6PDszKYuXCJzT9',
    phone: BRAND_IDENTITY.phone,
    email: BRAND_IDENTITY.email,
    cr: BRAND_IDENTITY.cr,
    vat: BRAND_IDENTITY.vat,
    socials: BRAND_IDENTITY.socials,
    sitemap: [
      {
        title: 'الشركة',
        links: [
          { label: 'من نحن', path: '/ar#about' },
          { label: 'رسالة رئيس مجلس الإدارة', path: '/ar/chairman-message' },
          { label: 'فريق العمل', path: '/ar/team' },
          { label: 'الخدمات', path: '/ar#services' },
          { label: 'المشاريع', path: '/ar/projects' },
          { label: 'اتصل بنا', path: '/ar/contact' }
        ]
      },
      {
        title: 'الخدمات الهندسية',
        links: [
          { label: 'أعمال الحواجز الخرسانية', path: '/ar/projects' },
          { label: 'أعمال الإنترلوك والبردورات', path: '/ar/projects' },
          { label: 'شبكات تصريف السيول والأمطار', path: '/ar/projects' }
        ]
      },
      {
        title: 'الروابط القانونية',
        links: [
          { label: 'سياسة الخصوصية', path: '/privacy' },
          { label: 'شروط الخدمة', path: '/terms' }
        ]
      }
    ]
  },
  en: {
    name: BRAND_IDENTITY.name.en,
    tagline: BRAND_IDENTITY.tagline.en,
    logoText: BRAND_IDENTITY.logoText.en,
    address: BRAND_IDENTITY.address.en,
    mapUrl: BRAND_IDENTITY.mapUrl || 'https://maps.app.goo.gl/o8L6PDszKYuXCJzT9',
    phone: BRAND_IDENTITY.phone,
    email: BRAND_IDENTITY.email,
    cr: BRAND_IDENTITY.cr,
    vat: BRAND_IDENTITY.vat,
    socials: BRAND_IDENTITY.socials,
    sitemap: [
      {
        title: 'Company',
        links: [
          { label: 'About Us', path: '/en#about' },
          { label: "Chairman's Message", path: '/en/chairman-message' },
          { label: 'Our Team', path: '/en/team' },
          { label: 'Services', path: '/en#services' },
          { label: 'Projects', path: '/en/projects' },
          { label: 'Contact Us', path: '/en/contact' }
        ]
      },
      {
        title: 'Engineering Services',
        links: [
          { label: 'Concrete Barrier Works', path: '/en/projects' },
          { label: 'Interlock & Pavement Works', path: '/en/projects' },
          { label: 'Stormwater & Drainage Systems', path: '/en/projects' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', path: '/privacy' },
          { label: 'Terms of Service', path: '/terms' }
        ]
      }
    ]
  }
};
