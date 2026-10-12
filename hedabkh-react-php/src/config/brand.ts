export interface BrandIdentity {
  name: {
    ar: string;
    en: string;
  };
  tagline: {
    ar: string;
    en: string;
  };
  logoText: {
    ar: string;
    en: string;
  };
  cr: string;
  vat: string;
  phone: string;
  email: string;
  address: {
    ar: string;
    en: string;
  };
  mapUrl?: string;
  profilePdfUrl?: string;
  colors: {
    primary: string; // Corporate Blue: #002060
    sky: string;     // Sky Blue: #00B0F0
    yellow: string;  // Safety Yellow: #FFC000
    light: {
      bg: string;      // #F8FAFC
      textMain: string; // #0F172A
      textSub: string;  // #475569
    };
    dark: {
      bg: string;      // #0B111E
      textMain: string; // #F8FAFC
      textSub: string;  // #94A3B8
    };
  };
  socials: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export const BRAND_IDENTITY: BrandIdentity = {
  name: {
    ar: 'شركة هضاب الخليج العربي للمقاولات',
    en: 'Arabian Gulf Hills Contracting Company',
  },
  tagline: {
    ar: 'الريادة في البنية التحتية والمقاولات والحلول الهندسية المتكاملة.',
    en: 'Pioneering infrastructure, contracting, and integrated engineering solutions.',
  },
  logoText: {
    ar: 'هضاب الخليج | GULF HILLS',
    en: 'GULF HILLS',
  },
  cr: '1010720712',
  vat: '310989009900003',
  phone: '0564222252',
  email: 'Info@hedabkh.com.sa',
  address: {
    ar: 'مبنى رقم 7501، شارع الشيخ صالح بن غصون، حي الملز، الرياض 12832، المملكة العربية السعودية',
    en: 'Building 7501, Sheikh Saleh Ibn Ghoson St, Al Malaz Dist, Riyadh 12832, Saudi Arabia',
  },
  mapUrl: 'https://maps.app.goo.gl/o8L6PDszKYuXCJzT9',
  profilePdfUrl: '/gulf-hills-profile.pdf',
  colors: {
    primary: '#002060',
    sky: '#00B0F0',
    yellow: '#FFC000',
    light: {
      bg: '#F8FAFC',
      textMain: '#0F172A',
      textSub: '#475569',
    },
    dark: {
      bg: '#0B111E',
      textMain: '#F8FAFC',
      textSub: '#94A3B8',
    },
  },
  socials: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/gulf-hills', icon: 'linkedin' },
    { platform: 'Twitter', url: 'https://twitter.com/gulf_hills', icon: 'twitter' },
    { platform: 'YouTube', url: 'https://youtube.com/gulf_hills', icon: 'youtube' },
  ],
};
