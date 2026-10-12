'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { ProjectCollectionBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { SelectField } from '../primitives/SelectField';
import { ToggleField } from '../primitives/ToggleField';
import { FolderKanban } from 'lucide-react';

export const ProjectCollectionBlockEditor: React.FC<BlockEditorProps<ProjectCollectionBlockConfig>> = ({
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
        placeholderAr="مثال: معرض المشاريع الهندسية الكبرى"
        placeholderEn="e.g. INFRASTRUCTURE PORTFOLIO"
      />

      {/* Title */}
      <LocalizedTextField
        label="عنوان قسم المشاريع"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: مشاريع وطنية بارزة في مختلف مناطق المملكة"
        placeholderEn="e.g. Flagship National Infrastructure Projects"
      />

      {/* Subtitle */}
      <LocalizedTextarea
        label="الوصف"
        valueAr={config.subtitleAr}
        valueEn={config.subtitleEn}
        onChangeAr={(val) => onUpdate({ subtitleAr: val })}
        onChangeEn={(val) => onUpdate({ subtitleEn: val })}
        placeholderAr="استعراض لأبرز مشاريع الطرق وتصريف السيول والتشغيل البلدي..."
        placeholderEn="Showcasing high-impact civil works and storm networks..."
        rows={2}
      />

      {/* Query & Presentation Settings */}
      <div className="pt-2 border-t border-slate-800/80 space-y-3">
        <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
          <FolderKanban className="w-3.5 h-3.5" />
          <span>إعدادات العرض والاستعلام</span>
        </span>

        <SelectField
          label="الحد الأقصى للمشاريع المعروضة"
          value={config.maxItems || 6}
          options={[
            { value: 3, label: '3 مشاريع' },
            { value: 6, label: '6 مشاريع' },
            { value: 9, label: '9 مشاريع' },
            { value: 12, label: '12 مشروعاً' },
          ]}
          onChange={(val) => onUpdate({ maxItems: Number(val) })}
        />

        <SelectField
          label="نمط التخطيط"
          value={config.layout || 'grid'}
          options={[
            { value: 'grid', label: 'شبكة بطاقات هندسية (Grid)' },
            { value: 'carousel', label: 'سلايدر متحرك أفقي (Carousel)' },
          ]}
          onChange={(val) => onUpdate({ layout: val as 'grid' | 'carousel' })}
        />

        <ToggleField
          label="عرض المشاريع المميزة فقط (Featured)"
          description="تصفية المشهد ليقتصر على المشاريع ذات التصنيف السيادي"
          checked={config.featuredOnly ?? false}
          onChange={(checked) => onUpdate({ featuredOnly: checked })}
        />
      </div>
    </div>
  );
};
