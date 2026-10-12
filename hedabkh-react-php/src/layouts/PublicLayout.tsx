import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import Preloader from '../components/ui/Preloader';
import GeometricBackground from '../components/layouts/GeometricBackground';
import WhatsAppFloatingWidget from '../components/ui/WhatsAppFloatingWidget';
import Providers from '../components/layouts/Providers';

import { storageAdapter } from '../services/storageAdapter';

export const PublicLayout: React.FC = () => {
  const { locale: rawLocale } = useParams<{ locale?: string }>();
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const isRtl = locale === 'ar';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    // Dynamic Google Analytics and Search Console Verification Injection
    try {
      const seo = storageAdapter.getSeoSettings();
      if (seo?.analytics?.googleSearchConsoleVerification) {
        let metaTag = document.querySelector('meta[name="google-site-verification"]');
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', 'google-site-verification');
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', seo.analytics.googleSearchConsoleVerification);
      }

      if (seo?.analytics?.ga4MeasurementId && !document.getElementById('ga4-script')) {
        const gaScript = document.createElement('script');
        gaScript.id = 'ga4-script';
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${seo.analytics.ga4MeasurementId}`;
        document.head.appendChild(gaScript);

        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${seo.analytics.ga4MeasurementId}');
        `;
        document.head.appendChild(inlineScript);
      }
    } catch {}
  }, [locale, isRtl]);

  return (
    <Providers>
      <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden">
        {/* Preloader */}
        <Preloader />

        {/* Geometric Background Layer */}
        <GeometricBackground />

        {/* Header */}
        <Header locale={locale} />

        {/* Main Content Area */}
        <main className="flex-grow relative z-10 bg-transparent pt-40 sm:pt-44 lg:pt-48">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer locale={locale} />

        {/* WhatsApp Floating Widget */}
        <WhatsAppFloatingWidget locale={locale} />
      </div>
    </Providers>
  );
};

export default PublicLayout;
