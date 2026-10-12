'use client';

import React from 'react';
import { LucideIcon, Save, RefreshCw, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

interface UnifiedEditorHeaderProps {
  title: string;
  titleEn?: string;
  description: string;
  icon: LucideIcon;
  badgeText?: string;
  isDirty?: boolean;
  isSaving?: boolean;
  lastSavedAt?: string | null;
  onSave: () => void;
  onReset?: () => void;
  onPreview?: () => void;
  previewUrl?: string;
}

export const UnifiedEditorHeader: React.FC<UnifiedEditorHeaderProps> = ({
  title,
  titleEn,
  description,
  icon: Icon,
  badgeText = 'محرر واجهة تفاعلية',
  isDirty = false,
  isSaving = false,
  lastSavedAt,
  onSave,
  onReset,
  onPreview,
  previewUrl,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-xl shadow-slate-950/40 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        {/* Left / Top: Title, Icon & Description */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 shadow-lg shadow-sky-500/10">
            <Icon className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
              {titleEn && <span className="text-sm font-medium text-slate-400 font-sans">({titleEn})</span>}
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30">
                {badgeText}
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Right / Actions & Status */}
        <div className="flex items-center gap-3 flex-wrap lg:self-center shrink-0">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300">
            {isDirty ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300 font-medium">تغييرات غير محفوظة</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">
                  {lastSavedAt ? `تم الحفظ ${lastSavedAt}` : 'البيانات متزامنة'}
                </span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {onPreview && (
            <button
              onClick={onPreview}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-all text-sm font-medium shadow-sm"
              title="معاينة مباشرة في الموقع"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>معاينة</span>
            </button>
          )}

          {onReset && (
            <button
              onClick={onReset}
              type="button"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all text-sm font-medium"
              title="إعادة تعيين التعديلات"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">إعادة ضبط</span>
            </button>
          )}

          <button
            onClick={onSave}
            disabled={isSaving}
            type="button"
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>حفظ ونشر التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
