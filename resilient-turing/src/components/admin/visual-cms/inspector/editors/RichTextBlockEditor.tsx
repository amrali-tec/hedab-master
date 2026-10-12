'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { RichTextBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { AlignRight, AlignCenter, AlignLeft } from 'lucide-react';

export const RichTextBlockEditor: React.FC<BlockEditorProps<RichTextBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      {/* Badge */}
      <LocalizedTextField
        label="الشارة التوضيحية (Badge)"
        valueAr={config.badgeAr}
        valueEn={config.badgeEn}
        onChangeAr={(val) => onUpdate({ badgeAr: val })}
        onChangeEn={(val) => onUpdate({ badgeEn: val })}
        placeholderAr="مثال: رؤيتنا ورسالتنا"
        placeholderEn="e.g. Vision & Mission"
      />

      {/* Title */}
      <LocalizedTextField
        label="العنوان الرئيسي"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: التزامنا بالريادة الهندسية"
        placeholderEn="e.g. Our Engineering Commitment"
      />

      {/* Content */}
      <LocalizedTextarea
        label="المحتوى النصي المقيد"
        valueAr={config.contentAr}
        valueEn={config.contentEn}
        onChangeAr={(val) => onUpdate({ contentAr: val })}
        onChangeEn={(val) => onUpdate({ contentEn: val })}
        placeholderAr="نلتزم بتطبيق الكود السعودي للبناء وأعلى معايير السلامة..."
        placeholderEn="We adhere to the Saudi Building Code and strict safety standards..."
        rows={6}
      />

      {/* Alignment */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
          محاذاة النص والفقرات
        </label>
        <div className="flex gap-2">
          {[
            { id: 'right', label: 'يمين', icon: AlignRight },
            { id: 'center', label: 'وسط', icon: AlignCenter },
            { id: 'left', label: 'يسار', icon: AlignLeft },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onUpdate({ align: id as 'right' | 'center' | 'left' })}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                (config.align || 'right') === id
                  ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
