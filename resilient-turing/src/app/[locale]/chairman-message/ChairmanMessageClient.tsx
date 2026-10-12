"use client";

import React, { useState, useEffect } from 'react';
import { PublicPageRenderer } from '../../../components/cms/PublicPageRenderer';
import { contentEngine } from '../../../services/contentEngine';
import { ContentBlock } from '../../../lib/cms/blockSchemas';

interface ChairmanMessageClientProps {
  locale: 'ar' | 'en';
}

/**
 * ChairmanMessageClient Component
 * Driven 100% by the Visual CMS Published Block Tree for page-chairman.
 */
export default function ChairmanMessageClient({ locale }: ChairmanMessageClientProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    const published = contentEngine.getPublishedVersion('page-chairman');
    setBlocks(published?.blocks || []);
  }, []);

  const published = contentEngine.getPublishedVersion('page-chairman');
  const activeBlocks = blocks.length > 0 ? blocks : (published?.blocks || []);

  return (
    <div className="w-full bg-transparent text-text-main transition-colors duration-300">
      <PublicPageRenderer blocks={activeBlocks} locale={locale} />
    </div>
  );
}
