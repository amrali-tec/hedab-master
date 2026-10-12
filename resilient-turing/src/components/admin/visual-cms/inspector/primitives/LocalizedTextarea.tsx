'use client';

import React, { useState } from 'react';

interface LocalizedTextareaProps {
  label: string;
  valueAr?: string;
  valueEn?: string;
  onChangeAr: (val: string) => void;
  onChangeEn: (val: string) => void;
  placeholderAr?: string;
  placeholderEn?: string;
  description?: string;
  rows?: number;
}

export const LocalizedTextarea: React.FC<LocalizedTextareaProps> = ({
  label,
  valueAr = '',
  valueEn = '',
  onChangeAr,
  onChangeEn,
  placeholderAr,
  placeholderEn,
  description,
  rows = 3,
}) => {
  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar');

  return (
    <div className="space-y-1.5">
      {/* Label and Language Switcher Pills */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] font-bold text-slate-300 truncate">
          {label}
        </label>
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveLang('ar')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              activeLang === 'ar'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            عربي
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
              activeLang === 'en'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {description && (
        <p className="text-[10px] text-slate-400 leading-relaxed">{description}</p>
      )}

      {/* Textarea Field based on active tab */}
      {activeLang === 'ar' ? (
        <textarea
          dir="rtl"
          rows={rows}
          value={valueAr}
          onChange={(e) => onChangeAr(e.target.value)}
          placeholder={placeholderAr || 'أدخل النص بالعربية...'}
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors leading-relaxed"
        />
      ) : (
        <textarea
          dir="ltr"
          rows={rows}
          value={valueEn}
          onChange={(e) => onChangeEn(e.target.value)}
          placeholder={placeholderEn || 'Enter English text...'}
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors leading-relaxed font-sans"
        />
      )}
    </div>
  );
};
