import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { PublicPageRenderer } from '../../components/cms/PublicPageRenderer';
import { useCmsPage } from '../../hooks';
import { contentEngine } from '../../services/contentEngine';
import { ContentBlock } from '../../lib/cms/blockSchemas';

/**
 * LocaleLandingPage Component (Home Route)
 * Driven 100% by the Visual CMS Published Block Tree from MariaDB / PHP REST API.
 */
export default function LocaleLandingPage(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  
  const { data: pageVersion, isLoading } = useCmsPage('page-home', locale);
  const fallbackVersion = contentEngine.getPublishedVersion('page-home');
  const activeBlocks = (pageVersion?.blocks && pageVersion.blocks.length > 0)
    ? pageVersion.blocks
    : (fallbackVersion?.blocks || []);

  return (
    <div className="w-full bg-transparent text-text-main transition-colors duration-300" suppressHydrationWarning>
      <PublicPageRenderer blocks={activeBlocks} locale={locale} />
    </div>
  );
}
