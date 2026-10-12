import React from 'react';
import { VisualEditorShell } from '../../../../../components/admin/visual-cms/VisualEditorShell';

export function generateStaticParams() {
  return [
    { pageId: 'page-home' },
    { pageId: 'page-about' },
    { pageId: 'page-chairman' },
    { pageId: 'page-contact' },
  ];
}

interface VisualBuilderDynamicPageProps {
  params: Promise<{ locale: string; pageId: string }>;
}

export default async function VisualBuilderDynamicPage({ params }: VisualBuilderDynamicPageProps) {
  const { locale: rawLocale, pageId } = await params;
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';

  return (
    <div className="w-full h-full">
      <VisualEditorShell pageId={pageId || 'page-home'} locale={locale} />
    </div>
  );
}
