'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { TimelineBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { ToggleField } from '../primitives/ToggleField';
import { NumberSliderField } from '../primitives/NumberSliderField';
import { RotateCcw } from 'lucide-react';

export const TimelineBlockEditor: React.FC<BlockEditorProps<TimelineBlockConfig>> = ({
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
        placeholderAr="مثال: مسار الإنجازات والنمو"
        placeholderEn="e.g. MILESTONES & GROWTH"
      />

      {/* Title */}
      <LocalizedTextField
        label="عنوان المسار الزمني"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: محطات من الريادة وبناء القدرات الوطنية"
        placeholderEn="e.g. Milestones of Leadership & National Infrastructure"
      />

      {/* Subtitle */}
      <LocalizedTextarea
        label="الوصف التعريفي"
        valueAr={config.subtitleAr}
        valueEn={config.subtitleEn}
        onChangeAr={(val) => onUpdate({ subtitleAr: val })}
        onChangeEn={(val) => onUpdate({ subtitleEn: val })}
        placeholderAr="تدرج مسيرة هضاب الخليج منذ التأسيس وحتى تصدر المشاريع..."
        placeholderEn="The evolutionary journey of Gulf Hills from founding..."
        rows={2}
      />

      {/* 3D Parameters */}
      <div className="pt-2 border-t border-slate-800/80 space-y-3">
        <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعدادات الأسطوانة التفاعلية 360°</span>
        </span>

        <ToggleField
          label="التدوير التلقائي البطيء 360°"
          description="تدوير كروت الإنجاز والاعتمادات تلقائياً في الخلفية"
          checked={config.autoRotate ?? true}
          onChange={(checked) => onUpdate({ autoRotate: checked })}
        />

        <NumberSliderField
          label="نصف قطر أسطوانة العرض ثلاثية الأبعاد"
          value={config.cylinderRadius || 600}
          min={200}
          max={800}
          step={20}
          unit="px"
          description="التحكم في تباعد بطاقات الإنجاز وعمق المشهد"
          onChange={(val) => onUpdate({ cylinderRadius: val })}
        />
      </div>
    </div>
  );
};
