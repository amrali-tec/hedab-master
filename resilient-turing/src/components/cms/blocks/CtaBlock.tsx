import React from 'react';
import Link from 'next/link';
import { CtaBlockConfig } from '../../../lib/cms/blockSchemas';
import { Button, Container } from '../../ui/primitives';

interface CtaBlockProps {
  config: CtaBlockConfig;
  locale: 'ar' | 'en';
}

export const CtaBlock: React.FC<CtaBlockProps> = ({ config, locale }) => {
  const isAr = locale === 'ar';

  return (
    <section className="py-16 bg-gradient-to-r from-[#002060] to-[#070B14] border-y border-sky-900/40">
      <Container width="narrow" className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
          {isAr ? config.titleAr || 'هل لديك مشروع بنية تحتية أو صيانة بلدية؟' : config.titleEn || 'Have an Infrastructure or Roadwork Project?'}
        </h2>
        <p className="text-slate-300 text-sm mb-8 leading-relaxed">
          {isAr
            ? config.descriptionAr || 'تواصل مباشرة مع مهندسينا للاستشارة وطلب التسعير الفوري لجميع الأعمال الإنشائية والتشغيلية.'
            : config.descriptionEn || 'Get in touch directly with our engineering team for expert consultations and RFQs.'}
        </p>
        <Link href={config.buttonLink || `/${locale}/contact`}>
          <Button variant="primary" size="lg">
            {isAr ? config.buttonTextAr || 'طلب عرض سعر فوري' : config.buttonTextEn || 'Request Quote Now'}
          </Button>
        </Link>
      </Container>
    </section>
  );
};
