'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { ServiceCollectionBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { SelectField } from '../primitives/SelectField';
import { Wrench } from 'lucide-react';

export const ServiceCollectionBlockEditor: React.FC<BlockEditorProps<ServiceCollectionBlockConfig>> = ({
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
        placeholderAr="مثال: مجالات الاختصاص والتميز"
        placeholderEn="e.g. CORE ENGINEERING DOMAINS"
      />

      {/* Title */}
      <LocalizedTextField
        label="عنوان قسم الخدمات"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: خدمات متكاملة في المقاولات والتشغيل والصيانة"
        placeholderEn="e.g. Comprehensive Contracting, Operation & Maintenance"
      />

      {/* Subtitle */}
      <LocalizedTextarea
        label="الوصف"
        valueAr={config.subtitleAr}
        valueEn={config.subtitleEn}
        onChangeAr={(val) => onUpdate({ subtitleAr: val })}
        onChangeEn={(val) => onUpdate({ subtitleEn: val })}
        placeholderAr="حلول هندسية متقدمة في تنفيذ شبكات تصريف مياه الأمطار وأعمال السفلتة..."
        placeholderEn="Advanced civil engineering solutions across roads and municipal works..."
        rows={2}
      />

      {/* Query & Presentation Settings */}
      <div className="pt-2 border-t border-slate-800/80 space-y-3">
        <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5" />
          <span>إعدادات العرض والاستعلام</span>
        </span>

        <SelectField
          label="الحد الأقصى للخدمات المعروضة"
          value={config.maxItems || 6}
          options={[
            { value: 3, label: '3 خدمات' },
            { value: 6, label: '6 خدمات' },
            { value: 9, label: '9 خدمات' },
            { value: 12, label: '12 خدمة' },
          ]}
          onChange={(val) => onUpdate({ maxItems: Number(val) })}
        />

        <SelectField
          label="نمط التخطيط"
          value={config.layout || 'grid'}
          options={[
            { value: 'grid', label: 'شبكة بطاقات (Grid)' },
            { value: 'cards', label: 'بطاقات عريضة بتفاصيل إضافية (Cards)' },
          ]}
          onChange={(val) => onUpdate({ layout: val as 'grid' | 'cards' })}
        />
      </div>
    </div>
  );
};
