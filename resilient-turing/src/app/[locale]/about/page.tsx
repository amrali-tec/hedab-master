"use client";

import React, { use, useState, useEffect } from 'react';
import { PublicPageRenderer } from '../../../components/cms/PublicPageRenderer';
import { contentEngine } from '../../../services/contentEngine';
import { ContentBlock } from '../../../lib/cms/blockSchemas';

interface AboutPageProps {
  params: Promise<{ locale: 'ar' | 'en' }>;
}

/**
 * AboutPage Component
 * Driven 100% by the Visual CMS Published Block Tree for page-about.
 */
export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = use(params);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    const published = contentEngine.getPublishedVersion('page-about');
    setBlocks(published?.blocks || []);
  }, []);

  const published = contentEngine.getPublishedVersion('page-about');
  const activeBlocks = blocks.length > 0 ? blocks : (published?.blocks || []);

  return (
    <div className="w-full bg-transparent text-text-main transition-colors duration-300">
      <PublicPageRenderer blocks={activeBlocks} locale={locale} />
    </div>
  );
}