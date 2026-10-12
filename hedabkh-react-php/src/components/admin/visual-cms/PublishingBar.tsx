'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Save,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  History,
  RotateCcw,
  Undo2,
  Redo2,
  ShieldCheck,
  AlertCircle,
  X,
  Layers,
  Lock,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
} from 'lucide-react';
import { PageVersion, ContentPage } from '../../../lib/cms/blockSchemas';

interface PublishingBarProps {
  pageTitle: string;
  currentPageId: string;
  allPages: ContentPage[];
  onSwitchPage: (pageId: string) => void;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  lastSavedAt: string | null;
  activeDraft: PageVersion | null;
  historyVersions: PageVersion[];
  onSaveDraft: () => void;
  onPublish: (note?: string) => void;
  onRollback: (versionId: string) => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  undoTooltip?: string | null;
  redoTooltip?: string | null;
  locale?: 'ar' | 'en';
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
  onDeviceModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export const PublishingBar: React.FC<PublishingBarProps> = ({
  pageTitle,
  currentPageId,
  allPages,
  onSwitchPage,
  isDirty,
  isSaving,
  isPublishing,
  lastSavedAt,
  activeDraft,
  historyVersions,
  onSaveDraft,
  onPublish,
  onRollback,
  onTogglePreview,
  isPreviewMode,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  undoTooltip = null,
  redoTooltip = null,
  locale = 'ar',
  deviceMode = 'desktop',
  onDeviceModeChange,
  zoom = 100,
  onZoomChange,
}) => {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [publishNote, setPublishNote] = useState('');
  const isAr = locale === 'ar';

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl px-3 sm:px-4 py-1.5 sticky top-0 z-40 shadow-xl flex items-center justify-between gap-2.5 h-12 shrink-0">
      {/* Left: Brand Identity, Page Selector & Status */}
      <div className="flex items-center gap-2">
        <Link
          href={`/${locale}/admin/visual-builder`}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          title="دليل الصفحات"
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
        </Link>

        {/* Page Selector Dropdown */}
        <select
          value={currentPageId}
          onChange={(e) => onSwitchPage(e.target.value)}
          className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-sky-500 cursor-pointer shadow-inner"
        >
          {allPages.map((p) => (
            <option key={p.id} value={p.id}>
              {isAr ? p.titleAr : p.titleEn}
            </option>
          ))}
        </select>

        {/* Draft Badge & Concurrency Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            <span>مسودة v{activeDraft?.versionNumber || 1}</span>
          </span>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {isDirty ? (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                تغييرات غير محفوظة
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{lastSavedAt ? `تم الحفظ ${lastSavedAt}` : 'المسودة متزامنة'}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Device Viewport Controls & Zoom */}
      {onDeviceModeChange && (
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onDeviceModeChange('desktop')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="عرض سطح المكتب (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[10px]">سطح المكتب</span>
            </button>

            <button
              type="button"
              onClick={() => onDeviceModeChange('tablet')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="عرض الجهاز اللوحي (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="text-[10px]">لوحي</span>
            </button>

            <button
              type="button"
              onClick={() => onDeviceModeChange('mobile')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="عرض الهاتف المحمول (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[10px]">جوال</span>
            </button>
          </div>

          {onZoomChange && (
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-[11px] text-slate-300">
              <span className="text-slate-400 text-[10px]">التقريب:</span>
              <select
                value={zoom}
                onChange={(e) => onZoomChange(Number(e.target.value))}
                className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value={50} className="bg-slate-900">50%</option>
                <option value={75} className="bg-slate-900">75%</option>
                <option value={100} className="bg-slate-900">100%</option>
                <option value={125} className="bg-slate-900">125%</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Right: Actions Cluster */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo Button Group */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 shadow-inner">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={undoTooltip ? `تراجع: ${undoTooltip} (Ctrl+Z)` : 'تراجع (Ctrl+Z)'}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 bg-slate-800 mx-0.5" />
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={redoTooltip ? `إعادة: ${redoTooltip} (Ctrl+Y)` : 'إعادة (Ctrl+Y / Ctrl+Shift+Z)'}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* History / Versions button */}
        <button
          type="button"
          onClick={() => setIsHistoryModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          title="سجل الإصدارات والاسترجاع"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">الإصدارات ({historyVersions.length})</span>
        </button>

        {/* Live Preview Toggle & Engine Link */}
        <Link
          href={`/${locale}/admin/preview/page/${currentPageId}`}
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
          title={isAr ? 'فتح المعاينة الحية المعزولة في نافذة جديدة' : 'Open Live Preview Engine in New Window'}
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{isAr ? 'معاينة حية' : 'Live Preview'}</span>
        </Link>

        <button
          type="button"
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            isPreviewMode
              ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title={isAr ? 'معاينة سريعة داخل المحرر (Ctrl+P)' : 'Quick Canvas Preview (Ctrl+P)'}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isPreviewMode ? 'إغلاق المعاينة' : 'معاينة القالب'}</span>
        </button>

        {/* Save Draft Button */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors cursor-pointer"
          title={isAr ? 'حفظ المسودة (Ctrl+S)' : 'Save Draft (Ctrl+S)'}
        >
          <Save className="w-3.5 h-3.5 text-sky-400" />
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ'}</span>
        </button>

        {/* Publish Version Button */}
        <button
          type="button"
          onClick={() => setIsPublishModalOpen(true)}
          disabled={isPublishing}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          title={isAr ? 'اعتماد ونشر الصفحة للموقع العام' : 'Publish to Live Site'}
        >
          <Send className="w-3.5 h-3.5" />
          <span>اعتماد ونشر</span>
        </button>
      </div>

      {/* Publish Confirmation Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>اعتماد ونشر الإصدار الجديد</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              سيتم ترحيل مسودة العمل الحالية واعتمادها كنسخة منشورة رسمياً وظاهرة لزوار البوابة الفعليين.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                ملاحظات التغيير لهذا الإصدار (Change Note)
              </label>
              <textarea
                value={publishNote}
                onChange={(e) => setPublishNote(e.target.value)}
                placeholder="مثال: تحديث أرقام الإنجازات وإعادة ترتيب خدمات الطرق..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 h-20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  onPublish(publishNote || undefined);
                  setIsPublishModalOpen(false);
                  setPublishNote('');
                }}
                disabled={isPublishing}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
              >
                {isPublishing ? 'جاري النشر...' : 'تأكيد النشر الفوري'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History & Rollback Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <History className="w-5 h-5" />
                <span>سجل الإصدارات والاسترجاع (Version History)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {historyVersions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">لا توجد إصدارات سابقة مسجلة لهذه الصفحة.</div>
              ) : (
                historyVersions.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">إصدار #{v.versionNumber}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            v.state === 'published'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {v.state === 'published' ? 'منشور رسمياً' : 'مؤرشف'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {v.changeNote || 'لا توجد ملاحظات مرفقة'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(v.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US')}</span>
                        <span>• {v.blocks?.length || 0} كتل</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onRollback(v.id);
                        setIsHistoryModalOpen(false);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-semibold transition-colors shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استرجاع</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
