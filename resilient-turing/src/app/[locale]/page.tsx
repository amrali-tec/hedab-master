"use client";

import React, { use, useState, useEffect } from 'react';
import { PublicPageRenderer } from '../../components/cms/PublicPageRenderer';
import { contentEngine } from '../../services/contentEngine';
import { ContentBlock } from '../../lib/cms/blockSchemas';

interface PageProps {
  params: Promise<{ locale: 'ar' | 'en' }>;
}

/**
 * LocaleLandingPage Component (Home Route)
 * Driven 100% by the Visual CMS Published Block Tree.
 */
export default function LocaleLandingPage({ params }: PageProps) {
  const { locale } = use(params);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const published = contentEngine.getPublishedVersion('page-home');
    if (published?.blocks) {
      setBlocks(published.blocks);
    }
  }, []);

  const published = contentEngine.getPublishedVersion('page-home');
  const activeBlocks = mounted && blocks.length > 0 ? blocks : (published?.blocks || []);

  return (
    <div className="w-full bg-transparent text-text-main transition-colors duration-300" suppressHydrationWarning>
      <PublicPageRenderer blocks={activeBlocks} locale={locale} />
    </div>
  );
}
