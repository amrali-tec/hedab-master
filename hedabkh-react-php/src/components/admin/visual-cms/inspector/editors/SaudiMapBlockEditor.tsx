'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { SaudiMapBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { SelectField } from '../primitives/SelectField';

export const SaudiMapBlockEditor: React.FC<BlockEditorProps<SaudiMapBlockConfig>> = ({
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
        placeholderAr="مثال: التغطية الجغرافية للمملكة"
        placeholderEn="e.g. KINGDOM-WIDE COVERAGE"
      />

      {/* Title */}
      <LocalizedTextField
        label="عنوان قسم الانتشار الجغرافي"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: تواجدنا الميداني في كافة مناطق المملكة"
        placeholderEn="e.g. Our Active Footprint Across Saudi Regions"
      />

      {/* Subtitle */}
      <LocalizedTextarea
        label="الوصف الجغرافي"
        valueAr={config.subtitleAr}
        valueEn={config.subtitleEn}
        onChangeAr={(val) => onUpdate({ subtitleAr: val })}
        onChangeEn={(val) => onUpdate({ subtitleEn: val })}
        placeholderAr="خريطة حية ترصد انتشار فرق العمل والآليات في الرياض والقصيم والشرقية..."
        placeholderEn="Live operational map tracking heavy fleet deployments..."
        rows={2}
      />

      {/* Region Selector */}
      <div className="pt-2 border-t border-slate-800/80">
        <SelectField
          label="المنطقة المحددة تلقائياً عند فتح الصفحة"
          value={config.selectedRegionId || 'riyadh'}
          options={[
            { value: 'riyadh', label: 'منطقة الرياض (المقر الرئيسي)' },
            { value: 'qassim', label: 'منطقة القصيم (بريدة وعنيزة)' },
            { value: 'eastern', label: 'المنطقة الشرقية (الدمام والخبر)' },
            { value: 'makkah', label: 'منطقة مكة المكرمة وجدة' },
            { value: 'madinah', label: 'منطقة المدينة المنورة وينبع' },
          ]}
          onChange={(val) => onUpdate({ selectedRegionId: val })}
          description="تحديد المنطقة النشطة افتراضياً على خريطة المملكة التفاعلية"
        />
      </div>
    </div>
  );
};
