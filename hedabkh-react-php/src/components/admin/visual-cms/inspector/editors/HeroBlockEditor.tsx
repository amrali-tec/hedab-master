'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { HeroBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { Link as LinkIcon, Award } from 'lucide-react';

export const HeroBlockEditor: React.FC<BlockEditorProps<HeroBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      {/* Tagline */}
      <LocalizedTextField
        label="الشارة التمهيدية (Tagline)"
        valueAr={config.tagAr}
        valueEn={config.tagEn}
        onChangeAr={(val) => onUpdate({ tagAr: val })}
        onChangeEn={(val) => onUpdate({ tagEn: val })}
        placeholderAr="مثال: المقاول الإنشائي والتشغيلي الرائد بالمملكة"
        placeholderEn="e.g. PREMIER SAUDI INFRASTRUCTURE CONTRACTOR"
      />

      {/* Main Title */}
      <LocalizedTextarea
        label="العنوان الرئيسي (Headline)"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="العنوان البارز في الواجهة الرئيسية"
        placeholderEn="Main Sovereign Headline"
        rows={2}
      />

      {/* Subtitle */}
      <LocalizedTextarea
        label="النص الوصفي الشارح (Subtitle)"
        valueAr={config.subtitleAr}
        valueEn={config.subtitleEn}
        onChangeAr={(val) => onUpdate({ subtitleAr: val })}
        onChangeEn={(val) => onUpdate({ subtitleEn: val })}
        placeholderAr="وصف مختصر للشركة والخدمات الهندسية"
        placeholderEn="Brief narrative of engineering capabilities"
        rows={3}
      />

      {/* Badge Metric */}
      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <span className="text-[11px] font-black text-sky-400 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          <span>شارة الإنجاز الرقمية</span>
        </span>
        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">الرقم</label>
            <input
              type="text"
              value={config.badgeNumber || '+15'}
              onChange={(e) => onUpdate({ badgeNumber: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono text-center"
            />
          </div>
          <div className="col-span-2">
            <LocalizedTextField
              label="تسمية الشارة"
              valueAr={config.badgeTextAr}
              valueEn={config.badgeTextEn}
              onChangeAr={(val) => onUpdate({ badgeTextAr: val })}
              onChangeEn={(val) => onUpdate({ badgeTextEn: val })}
              placeholderAr="عاماً من الريادة"
              placeholderEn="Years of Excellence"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons (CTAs) */}
      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <span className="text-[11px] font-black text-sky-400 flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5" />
          <span>أزرار الإجراءات الرئيسية (Call to Action)</span>
        </span>

        {/* Primary CTA */}
        <div className="space-y-2 pt-1 border-t border-slate-800/60">
          <span className="text-[10px] font-bold text-slate-300 block">الزر الأساسي (Primary CTA)</span>
          <LocalizedTextField
            label="نص الزر الأساسي"
            valueAr={config.primaryCtaTextAr}
            valueEn={config.primaryCtaTextEn}
            onChangeAr={(val) => onUpdate({ primaryCtaTextAr: val })}
            onChangeEn={(val) => onUpdate({ primaryCtaTextEn: val })}
            placeholderAr="استعراض المشاريع الكبرى"
            placeholderEn="Explore Projects"
          />
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">رابط الزر الأساسي</label>
            <input
              type="text"
              value={config.primaryCtaLink || '/projects'}
              onChange={(e) => onUpdate({ primaryCtaLink: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <span className="text-[10px] font-bold text-slate-300 block">الزر الثانوي (Secondary CTA)</span>
          <LocalizedTextField
            label="نص الزر الثانوي"
            valueAr={config.secondaryCtaTextAr}
            valueEn={config.secondaryCtaTextEn}
            onChangeAr={(val) => onUpdate({ secondaryCtaTextAr: val })}
            onChangeEn={(val) => onUpdate({ secondaryCtaTextEn: val })}
            placeholderAr="طلب عرض سعر مباشر"
            placeholderEn="Request RFQ"
          />
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">رابط الزر الثانوي</label>
            <input
              type="text"
              value={config.secondaryCtaLink || '/contact'}
              onChange={(e) => onUpdate({ secondaryCtaLink: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
