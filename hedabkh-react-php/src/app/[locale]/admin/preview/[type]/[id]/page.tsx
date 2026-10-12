import React from 'react';
import { useParams } from 'react-router-dom';
import { PreviewClientContainer } from './PreviewClientContainer';

export default function LivePreviewPage(props?: any) {
  const routerParams = useParams<{ locale?: string; type?: string; id?: string }>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const type = props?.type || routerParams?.type || 'page';
  const id = props?.id || routerParams?.id || 'page-home';

  return <PreviewClientContainer locale={locale} type={type} id={id} />;
}
