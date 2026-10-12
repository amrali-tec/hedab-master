import React from 'react';
import { Metadata } from 'next';
import { PreviewClientContainer } from './PreviewClientContainer';

interface PreviewPageProps {
  params: Promise<{ locale: 'ar' | 'en'; type: string; id: string }>;
}

export const metadata: Metadata = {
  title: 'معاينة المسودة الحية | لوحة التحكم',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export async function generateStaticParams() {
  const locales = ['ar', 'en'];
  const types = ['page', 'project', 'service', 'article'];
  const sampleIds = ['page-home', 'page-about', 'page-chairman', 'page-contact', 'proj-1', 'srv-1', 'art-1'];

  const params: { locale: string; type: string; id: string }[] = [];

  for (const locale of locales) {
    for (const type of types) {
      for (const id of sampleIds) {
        params.push({ locale, type, id });
      }
    }
  }

  return params;
}

export default async function LivePreviewPage({ params }: PreviewPageProps) {
  const { locale, type, id } = await params;

  return <PreviewClientContainer locale={locale} type={type} id={id} />;
}
