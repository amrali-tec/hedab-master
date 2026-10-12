import { useParams } from 'react-router-dom';
import React from 'react';
import { PublicPageRenderer } from '../../../components/cms/PublicPageRenderer';
import { useCmsPage } from '../../../hooks';
import { contentEngine } from '../../../services/contentEngine';

/**
 * ChairmanMessageClient Component
 * Driven 100% by the Visual CMS Published Block Tree for page-chairman.
 */
export default function ChairmanMessageClient(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';

  const { data: pageVersion } = useCmsPage('page-chairman', locale);
  const fallbackVersion = contentEngine.getPublishedVersion('page-chairman');
  const activeBlocks = (pageVersion?.blocks && pageVersion.blocks.length > 0)
    ? pageVersion.blocks
    : (fallbackVersion?.blocks || []);

  return (
    <div className="w-full bg-transparent text-text-main transition-colors duration-300">
      <PublicPageRenderer blocks={activeBlocks} locale={locale} />
    </div>
  );
}
