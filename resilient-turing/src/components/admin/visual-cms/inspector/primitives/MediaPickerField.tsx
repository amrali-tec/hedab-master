'use client';

import React from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';

interface MediaPickerFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  onOpenPicker?: () => void;
  description?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
}

export const MediaPickerField: React.FC<MediaPickerFieldProps> = ({
  label,
  value = '',
  onChange,
  onOpenPicker,
  description,
  aspectRatio = 'video',
}) => {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  }[aspectRatio];

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-bold text-slate-300 truncate">
        {label}
      </label>

      {description && (
        <p className="text-[10px] text-slate-400">{description}</p>
      )}

      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
        {value ? (
          <div className={`relative rounded-xl overflow-hidden ${aspectClasses} border border-slate-800 group bg-slate-900`}>
            <img
              src={value}
              alt="Media Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {onOpenPicker && (
                <button
                  type="button"
                  onClick={onOpenPicker}
                  className="px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>تغيير</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
                <span>حذف</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={onOpenPicker}
            className="border-2 border-dashed border-slate-800 hover:border-sky-500/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-slate-900/80"
          >
            <UploadCloud className="w-7 h-7 text-slate-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-slate-300">اختر صورة من مكتبة الوسائط</p>
            <p className="text-[10px] text-slate-500 mt-0.5">يدعم JPG, PNG, WEBP بدقة عالية</p>
          </div>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="أو الصق رابط الصورة المباشر هنا..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono placeholder-slate-600 focus:border-sky-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
