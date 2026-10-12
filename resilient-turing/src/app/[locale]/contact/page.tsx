"use client";

import React, { use, useState, useEffect } from 'react';
import { PublicPageRenderer } from '../../../components/cms/PublicPageRenderer';
import { contentEngine } from '../../../services/contentEngine';
import { ContentBlock } from '../../../lib/cms/blockSchemas';

interface ContactPageProps {
  params: Promise<{ locale: 'ar' | 'en' }>;
}

/**
 * ContactPage Component
 * Driven 100% by the Visual CMS Published Block Tree for page-contact.
 */
export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = use(params);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    const published = contentEngine.getPublishedVersion('page-contact');
    setBlocks(published?.blocks || []);
  }, []);

  const published = contentEngine.getPublishedVersion('page-contact');
  const activeBlocks = blocks.length > 0 ? blocks : (published?.blocks || []);

  return (
    <div className="w-full bg-transparent text-text-main transition-colors duration-300">
      <PublicPageRenderer blocks={activeBlocks} locale={locale} />
    </div>
  );
}
