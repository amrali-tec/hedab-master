import { useParams } from 'react-router-dom';
import React from 'react';
import { PublicPageRenderer } from '../../../components/cms/PublicPageRenderer';
import { useCmsPage } from '../../../hooks';
import { contentEngine } from '../../../services/contentEngine';

/**
 * AboutPage Component
 * Driven 100% by the Visual CMS Published Block Tree for page-about.
 */
export default function AboutPage(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';

  const { data: pageVersion } = useCmsPage('page-about', locale);
  const fallbackVersion = contentEngine.getPublishedVersion('page-about');
  const activeBlocks = (pageVersion?.blocks && pageVersion.blocks.length > 0)
    ? pageVersion.blocks
    : (fallbackVersion?.blocks || []);

  return (
    <div className="w-full bg-transparent text-text-main transition-colors duration-300">
      <PublicPageRenderer blocks={activeBlocks} locale={locale} />
    </div>
  );
}