"use client";

import React, { use } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { TechnicalCatalogCenter } from '../../../components/ui/TechnicalCatalogCenter';

interface CertificatesPageProps {
  params: Promise<{ locale: 'ar' | 'en' }>;
}

export default function CertificatesPage({ params }: CertificatesPageProps) {
  const { locale } = use(params);
  const isAr = locale === 'ar';

  return (
    <div className="min-h-[90vh] bg-transparent text-text-main transition-colors duration-300 relative space-y-8 pb-16">
      
      {/* 1. Executive Page Header */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-8 sm:pt-10">
        <PageHeader
          title={isAr ? 'مركز اعتمادات الجودة والتراخيص الرسمية' : 'Corporate Licenses & Accreditation Center'}
          subtitle={isAr
            ? 'منصة رسمية شاملة لاستعراض وتنزيل وثائق التثبت، التراخيص الحكومية المعتمدة، وشهادات الجودة والسلامة ISO الخاصة بشركة هضاب الخليج.'
            : 'Verified corporate dashboard displaying government licenses, classification credentials, and ISO certifications.'}
          currentPageLabel={isAr ? 'الاعتمادات والشراكات' : 'Accreditations & Certificates'}
          locale={locale}
        />
      </div>

      {/* 2. Unified Master Sovereign Technical Specs & Document Catalog Center */}
      <TechnicalCatalogCenter locale={locale} />

      {/* 3. Bottom Verification Note */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 text-center text-xs text-slate-500 font-semibold relative z-10">
        <p>
          {isAr
            ? 'تخضع كافة الشهادات والتصاريح المعروضة للتدقيق والاعتماد المباشر من الجهات المصدرة الرسمية في المملكة العربية السعودية.'
            : 'All displayed accreditations, licenses, and certificates are subject to direct verification by official issuing bodies in Saudi Arabia.'}
        </p>
      </div>

    </div>
  );
}
