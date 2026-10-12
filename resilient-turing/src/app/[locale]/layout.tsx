import "../globals.css";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import GeometricBackground from "@/components/layouts/GeometricBackground";
import Providers from "@/components/layouts/Providers";
import Preloader from "@/components/ui/Preloader";
import WhatsAppFloatingWidget from "@/components/ui/WhatsAppFloatingWidget";

import { Metadata } from "next";
import { Cairo } from "next/font/google";
import { BRAND_IDENTITY } from "@/config/brand";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const BASE_URL = "https://hedabkh.com.sa";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  
  const siteTitle = isAr 
    ? "شركة هضاب الخليج للمقاولات | الريادة في البنية التحتية وتشغيل وصيانة المرافق" 
    : "Gulf Hills Contracting | Infrastructure & Municipal Facility Operations";

  const siteDescription = isAr
    ? "شركة هضاب الخليج العربي للمقاولات - الشريك المعتمد في مقاولات البنية التحتية، رصف وكشط الطرق، تمديد شبكات تصريف مياه الأمطار والسيول، تشغيل وصيانة المقابر والمباني الحكومية، وإزالة عناصر التشوه البصري بالمملكة العربية السعودية وفق رؤية 2030."
    : "Arabian Gulf Hills Contracting Company - Certified national partner for infrastructure contracting, road asphalt paving, stormwater drainage networks, cemetery & government building maintenance, and municipal fleet operations in Saudi Arabia under Vision 2030.";

  const keywords = isAr
    ? [
        "هضاب الخليج للمقاولات",
        "شركة هضاب الخليج العربي للمقاولات",
        "مقاولات بنية تحتية السعودية",
        "سفلتة وكشط الطرق بالرياض",
        "شبكات تصريف مياه الأمطار والسيول",
        "تشغيل وصيانة مقابر المسلمين بالرياض",
        "تشغيل وصيانة المباني الحكومية",
        "إزالة التشوه البصري بلاغات 940",
        "أمانة منطقة الرياض",
        "أمانة منطقة القصيم",
        "بلدية محافظة الخرج",
        "بلدية محافظة الزلفي",
        "بلدية محافظة الغاط",
        "بلدية محافظة رماح",
        "حواجز نيوجيرسي الخرسانية",
        "تأجير أسطول معدات ثقيلة",
        "تصنيف المقاولين وزارة الشؤون البلدية والقروية",
        "رؤية السعودية 2030",
      ]
    : [
        "Gulf Hills Contracting",
        "Arabian Gulf Hills Contracting Company",
        "Saudi Infrastructure Contractors",
        "Road Asphalt Paving Riyadh",
        "Stormwater Drainage Networks",
        "Riyadh Muslim Cemeteries Operation & Maintenance",
        "Government Buildings Maintenance",
        "940 Municipal Visual Pollution Cleanup",
        "Riyadh Region Municipality Contractor",
        "Al-Qassim Municipality",
        "Al-Kharj Municipality",
        "Al-Zulfi Municipality",
        "Al-Ghat Municipality",
        "Rmahh Municipality",
        "New Jersey Concrete Barriers",
        "Heavy Machinery Fleet Rental",
        "Saudi Vision 2030 Contractors",
      ];

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: siteTitle,
      template: isAr ? "%s | هضاب الخليج للمقاولات" : "%s | Gulf Hills Contracting",
    },
    description: siteDescription,
    keywords,
    authors: [{ name: "شركة هضاب الخليج العربي للمقاولات", url: BASE_URL }],
    creator: "شركة هضاب الخليج العربي للمقاولات",
    publisher: "شركة هضاب الخليج العربي للمقاولات",
    applicationName: isAr ? "بوابة هضاب الخليج الهندسية" : "Gulf Hills Engineering Portal",
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        "ar-SA": `${BASE_URL}/ar`,
        "en-US": `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/ar`,
      },
    },
    openGraph: {
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_SA"],
      url: `${BASE_URL}/${locale}`,
      siteName: isAr ? "هضاب الخليج للمقاولات" : "Gulf Hills Contracting",
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: `${BASE_URL}/images/vision-2030.jpg`,
          width: 1200,
          height: 630,
          alt: isAr ? "شركة هضاب الخليج للمقاولات" : "Gulf Hills Contracting",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: [`${BASE_URL}/images/vision-2030.jpg`],
      creator: "@gulf_hills",
      site: "@gulf_hills",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/logo-light.png", type: "image/png" },
      ],
      apple: [{ url: "/logo-light.png" }],
    },
    category: "construction",
    other: {
      "geo.region": "SA-01",
      "geo.placename": "Riyadh",
      "geo.position": "24.6738;46.7329",
      "ICBM": "24.6738, 46.7329",
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const isRtl = locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  // Structured Data (Schema.org) for GeneralContractor & LocalBusiness
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "GeneralContractor", "LocalBusiness"],
        "@id": `${BASE_URL}/#organization`,
        "name": BRAND_IDENTITY.name.ar,
        "alternateName": BRAND_IDENTITY.name.en,
        "url": BASE_URL,
        "logo": `${BASE_URL}/logo-light.png`,
        "image": `${BASE_URL}/images/vision-2030.jpg`,
        "description": BRAND_IDENTITY.tagline.ar,
        "telephone": BRAND_IDENTITY.phone,
        "email": BRAND_IDENTITY.email,
        "taxID": BRAND_IDENTITY.vat,
        "vatID": BRAND_IDENTITY.vat,
        "legalName": BRAND_IDENTITY.name.ar,
        "foundingDate": "2011",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": BRAND_IDENTITY.address.ar,
          "addressLocality": "الرياض",
          "addressRegion": "منطقة الرياض",
          "postalCode": "12832",
          "addressCountry": "SA"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 24.6738,
          "longitude": 46.7329
        },
        "areaServed": [
          { "@type": "AdministrativeArea", "name": "منطقة الرياض" },
          { "@type": "AdministrativeArea", "name": "منطقة القصيم" },
          { "@type": "AdministrativeArea", "name": "محافظة الخرج" },
          { "@type": "AdministrativeArea", "name": "محافظة الزلفي" },
          { "@type": "AdministrativeArea", "name": "محافظة الغاط" },
          { "@type": "AdministrativeArea", "name": "محافظة رماح" },
          { "@type": "AdministrativeArea", "name": "المملكة العربية السعودية" }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "مجالات وخدمات المقاولات والتشغيل والصيانة",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تشغيل وصيانة المباني الحكومية" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تشغيل وصيانة مقابر منطقة الرياض" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "إنشاء وتطوير شبكات تصريف مياه الأمطار والسيول" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "إصلاح وصيانة الطرق والشبكات الأرضية" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "أعمال نقل الهدميات وإزالة المخلفات الإنشائية" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تشغيل وصيانة المعدات والآليات للبلديات والأمانات" } }
          ]
        },
        "sameAs": [
          "https://linkedin.com/company/gulf-hills",
          "https://twitter.com/gulf_hills",
          "https://youtube.com/gulf_hills"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": BASE_URL,
        "name": BRAND_IDENTITY.name.ar,
        "publisher": { "@id": `${BASE_URL}/#organization` },
        "inLanguage": ["ar-SA", "en-US"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${BASE_URL}/${locale}/projects?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body 
        className="relative min-h-screen w-full flex flex-col bg-[#070B14] text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden" 
        suppressHydrationWarning
      >
        {/* شاشة التحميل الهندسية الأولية */}
        <Preloader />

        {/* طبقة الشبكة الهندسية كأول عنصر في الـ Body */}
        <GeometricBackground />

        <Providers>
          {/* المكونات العلوية التي تطفو فوق الشبكة بفضل z-index المدمج */}
          <Header locale={locale as 'ar' | 'en'} />
          <main className="flex-grow relative z-10 bg-transparent pt-36 sm:pt-40 lg:pt-44">
            {children}
          </main>
          <Footer locale={locale as 'ar' | 'en'} />

          {/* ودجت التواصل الفوري الذكي عبر الواتساب */}
          <WhatsAppFloatingWidget locale={locale as 'ar' | 'en'} />
        </Providers>
      </body>
    </html>
  );
}