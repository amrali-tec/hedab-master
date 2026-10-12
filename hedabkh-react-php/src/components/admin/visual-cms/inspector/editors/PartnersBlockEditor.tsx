'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { PartnersBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { ToggleField } from '../primitives/ToggleField';
import { NumberSliderField } from '../primitives/NumberSliderField';
import { Handshake } from 'lucide-react';

export const PartnersBlockEditor: React.FC<BlockEditorProps<PartnersBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      {/* Tag */}
      <LocalizedTextField
        label="الشارة التمهيدية"
        valueAr={config.tagAr}
        valueEn={config.tagEn}
        onChangeAr={(val) => onUpdate({ tagAr: val })}
        onChangeEn={(val) => onUpdate({ tagEn: val })}
        placeholderAr="مثال: شركاء النجاح والثقة"
        placeholderEn="e.g. TRUSTED PARTNERS"
      />

      {/* Title */}
      <LocalizedTextField
        label="عنوان قسم الشركاء"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: نعتز بثقة كبرى الجهات الحكومية والسيادية"
        placeholderEn="e.g. Proud Partners with Sovereign Ministries & Municipalities"
      />

      {/* Subtitle */}
      <LocalizedTextarea
        label="الوصف التعريفي"
        valueAr={config.subtitleAr}
        valueEn={config.subtitleEn}
        onChangeAr={(val) => onUpdate({ subtitleAr: val })}
        onChangeEn={(val) => onUpdate({ subtitleEn: val })}
        placeholderAr="سجل حافل من الشراكات الناجحة مع وزارة البلديات وأمانة الرياض..."
        placeholderEn="A proven track record with municipalities and ministries..."
        rows={2}
      />

      {/* Marquee Settings */}
      <div className="pt-2 border-t border-slate-800/80 space-y-3">
        <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
          <Handshake className="w-3.5 h-3.5" />
          <span>إعدادات الشريط المتحرك (Marquee Strip)</span>
        </span>

        <ToggleField
          label="عرض عدد المشاريع المنجزة لكل شريك"
          description="إظهار شارة رقمية صغيرة توضح حجم العقود المنجزة"
          checked={config.showProjectsCount ?? true}
          onChange={(checked) => onUpdate({ showProjectsCount: checked })}
        />

        <NumberSliderField
          label="سرعة حركة شريط الشركاء"
          value={config.speedSec || 25}
          min={10}
          max={60}
          step={5}
          unit="ثانية"
          description="كلما قل الرقم زادت سرعة دوران الشعارات"
          onChange={(val) => onUpdate({ speedSec: val })}
        />
      </div>
    </div>
  );
};
