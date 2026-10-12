'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { StatisticsBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { ToggleField } from '../primitives/ToggleField';
import { BarChart3, Award, Building2, ShieldCheck, MapPin } from 'lucide-react';

export const StatisticsBlockEditor: React.FC<BlockEditorProps<StatisticsBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Header & Tagline */}
      <LocalizedTextField
        label="الشارة التمهيدية (Tagline)"
        valueAr={config.tagAr}
        valueEn={config.tagEn}
        onChangeAr={(val) => onUpdate({ tagAr: val })}
        onChangeEn={(val) => onUpdate({ tagEn: val })}
        placeholderAr="مثال: أرقام وإنجازات وطنية"
        placeholderEn="e.g. NATIONAL ACHIEVEMENTS & METRICS"
      />

      <LocalizedTextField
        label="العنوان الرئيسي للقسم"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: مسيرة 15 عاماً من الريادة في البنية التحتية"
        placeholderEn="e.g. 15 Years of Infrastructure Leadership"
      />

      <LocalizedTextarea
        label="النص الوصفي الشارح"
        valueAr={config.subtitleAr}
        valueEn={config.subtitleEn}
        onChangeAr={(val) => onUpdate({ subtitleAr: val })}
        onChangeEn={(val) => onUpdate({ subtitleEn: val })}
        placeholderAr="أرقام وإحصائيات موثقة ترصد حجم الأعمال المنفذة..."
        placeholderEn="Verified metrics reflecting completed infrastructure volume..."
        rows={2}
      />

      {/* 2. Display Settings */}
      <div className="pt-2 border-t border-slate-800/80 space-y-3">
        <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>إعدادات العرض والمؤشرات المركزية</span>
        </span>

        <ToggleField
          label="إظهار الأيقونات التعبيرية للمؤشرات"
          description="عرض الأيقونات الهندسية والرموز الإحصائية بجانب الأرقام"
          checked={config.showIcons ?? true}
          onChange={(checked) => onUpdate({ showIcons: checked })}
        />

        {/* Informative summary of centralized KPIs */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
            المؤشرات المركزية المرتبطة تلقائياً:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>+15 سنة خبرة</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>+120 مشروع منجز</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% نسبة الامتثال</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>4 مناطق رئيسية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
