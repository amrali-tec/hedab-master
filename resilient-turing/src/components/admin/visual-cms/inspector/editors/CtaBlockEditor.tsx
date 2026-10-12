'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { CtaBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { Link as LinkIcon } from 'lucide-react';

export const CtaBlockEditor: React.FC<BlockEditorProps<CtaBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <LocalizedTextField
        label="عنوان دعوة الإجراء (CTA Headline)"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: جاهزون لتنفيذ مشاريعكم الإنشائية بأعلى معايير الجودة"
        placeholderEn="e.g. Ready to Execute Your Infrastructure Projects with Precision"
      />

      {/* Description */}
      <LocalizedTextarea
        label="الوصف الشارح"
        valueAr={config.descriptionAr}
        valueEn={config.descriptionEn}
        onChangeAr={(val) => onUpdate({ descriptionAr: val })}
        onChangeEn={(val) => onUpdate({ descriptionEn: val })}
        placeholderAr="تواصل مع فريقنا الفني للحصول على دراسة متكاملة وعروض أسعار منافسة..."
        placeholderEn="Contact our technical team for comprehensive quotes..."
        rows={3}
      />

      {/* Button Text & Link */}
      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <span className="text-[11px] font-black text-sky-400 flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5" />
          <span>زر الإجراء والارتباط</span>
        </span>

        <LocalizedTextField
          label="نص زر الإجراء"
          valueAr={config.buttonTextAr}
          valueEn={config.buttonTextEn}
          onChangeAr={(val) => onUpdate({ buttonTextAr: val })}
          onChangeEn={(val) => onUpdate({ buttonTextEn: val })}
          placeholderAr="طلب عرض سعر الآن"
          placeholderEn="Request Quote Now"
        />

        <div>
          <label className="block text-[10px] text-slate-400 mb-1">رابط الوجهة (URL)</label>
          <input
            type="text"
            value={config.buttonLink || '/contact'}
            onChange={(e) => onUpdate({ buttonLink: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono placeholder-slate-600 focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
