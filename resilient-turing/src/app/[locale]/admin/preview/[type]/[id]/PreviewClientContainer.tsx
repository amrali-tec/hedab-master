'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { PublicPageRenderer } from '@/components/cms/PublicPageRenderer';
import { contentEngine } from '@/services/contentEngine';
import { storageAdapter } from '@/services/storageAdapter';
import { ContentBlock } from '@/lib/cms/blockSchemas';

interface PreviewClientContainerProps {
  locale: 'ar' | 'en';
  type: string;
  id: string;
}

export const PreviewClientContainer: React.FC<PreviewClientContainerProps> = ({ locale, type, id }) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishMessage, setPublishMessage] = useState<string>('');

  const isAr = locale === 'ar';

  useEffect(() => {
    if (type === 'page' || type === 'visual-builder') {
      const draft = contentEngine.getDraftVersion(id);
      setBlocks(draft.blocks || []);
      setPageTitle(isAr ? draft.titleAr : draft.titleEn);
    } else if (type === 'project') {
      const projects = storageAdapter.getProjects(locale);
      const proj = projects.find((p) => p.id === id);
      if (proj) {
        setPageTitle(proj.title);
      }
    }
  }, [id, type, locale, isAr]);

  const handlePublishNow = async () => {
    setIsPublishing(true);
    setPublishMessage('');
    try {
      if (type === 'page' || type === 'visual-builder') {
        contentEngine.publishDraft(id, 'تم النشر من شاشة المعاينة الحية المباشرة');
        setPublishMessage(isAr ? 'تم نشر الصفحة وتحديث الواجهة العامة بنجاح!' : 'Page published successfully!');
      }
    } catch {
      setPublishMessage(isAr ? 'حدث خطأ أثناء عملية النشر' : 'Publishing failed');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white">
      {/* 1. Floating Top Live Preview Admin Control Bar */}
      <div className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-sky-500/30 px-6 py-3 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
            <Eye className="w-3.5 h-3.5" />
            <span>{isAr ? 'وضع المعاينة الحية (Draft Live Preview)' : 'Live Draft Preview'}</span>
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-300">
            {pageTitle || id}
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-slate-500">
            <ShieldAlert className="w-3 h-3 text-emerald-400" />
            <span>{isAr ? 'معزول عن محركات البحث (noindex)' : 'Isolated (noindex)'}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {publishMessage && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{publishMessage}</span>
            </span>
          )}

          <Link
            href={`/${locale}/admin/visual-builder/${id}`}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? 'العودة للمحرر المرئي' : 'Back to Editor'}</span>
          </Link>

          <button
            onClick={handlePublishNow}
            disabled={isPublishing}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPublishing ? (isAr ? 'جاري النشر...' : 'Publishing...') : (isAr ? 'نشر المسودة الآن' : 'Publish Draft Now')}</span>
          </button>
        </div>
      </div>

      {/* 2. Public Page Renderer with Live Draft Block Data */}
      <div className="w-full">
        {blocks.length > 0 ? (
          <PublicPageRenderer blocks={blocks} locale={locale} />
        ) : (
          <div className="py-32 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-300">
              {isAr ? 'جاري تحميل مسودة المعاينة...' : 'Loading draft preview...'}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};
