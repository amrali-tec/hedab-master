import React from 'react';
import { useParams } from 'react-router-dom';
import { VisualEditorShell } from '../../../../../components/admin/visual-cms/VisualEditorShell';

export default function VisualBuilderDynamicPage(props?: any) {
  const routerParams = useParams<{ locale?: string; pageId?: string }>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const pageId = props?.pageId || routerParams?.pageId || 'page-home';

  return (
    <div className="w-full h-full">
      <VisualEditorShell pageId={pageId} locale={locale} />
    </div>
  );
}
