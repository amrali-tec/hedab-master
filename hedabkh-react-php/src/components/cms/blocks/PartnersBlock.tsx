import React from 'react';
import PartnersShowcase from '../../ui/PartnersShowcase';
import { PartnersBlockConfig } from '../../../lib/cms/blockSchemas';

interface PartnersBlockProps {
  config: PartnersBlockConfig;
  partners: Array<{ id: string; nameAr: string; nameEn: string; logoUrl?: string }>;
  locale: 'ar' | 'en';
}

export const PartnersBlock: React.FC<PartnersBlockProps> = ({ config, locale }) => {
  return (
    <PartnersShowcase
      locale={locale}
      configOverride={{
        tagAr: config.tagAr,
        tagEn: config.tagEn,
        titleAr: config.titleAr,
        titleEn: config.titleEn,
        subtitleAr: config.subtitleAr,
        subtitleEn: config.subtitleEn,
      }}
    />
  );
};
