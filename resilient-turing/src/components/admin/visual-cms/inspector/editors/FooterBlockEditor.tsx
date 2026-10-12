'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { FooterBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { ToggleField } from '../primitives/ToggleField';

export const FooterBlockEditor: React.FC<BlockEditorProps<FooterBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      {/* Headquarters Address */}
      <LocalizedTextField
        label="عنوان المقر الرئيسي"
        valueAr={config.headquartersAr}
        valueEn={config.headquartersEn}
        onChangeAr={(val) => onUpdate({ headquartersAr: val })}
        onChangeEn={(val) => onUpdate({ headquartersEn: val })}
        placeholderAr="الرياض، المملكة العربية السعودية"
        placeholderEn="Riyadh, Kingdom of Saudi Arabia"
      />

      {/* Copyright Notice */}
      <LocalizedTextField
        label="حقوق النشر والملكية الفكرية"
        valueAr={config.copyrightAr}
        valueEn={config.copyrightEn}
        onChangeAr={(val) => onUpdate({ copyrightAr: val })}
        onChangeEn={(val) => onUpdate({ copyrightEn: val })}
        placeholderAr="جميع الحقوق محفوظة © شركة هضاب الخليج للمقاولات"
        placeholderEn="All Rights Reserved © Gulf Hills Contracting Co."
      />

      {/* Official Email */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
          البريد الإلكتروني الرسمي للمراسلات
        </label>
        <input
          type="email"
          value={config.email || 'info@hidab-gulf.com'}
          onChange={(e) => onUpdate({ email: e.target.value })}
          placeholder="info@hidab-gulf.com"
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-500 focus:outline-none"
        />
      </div>

      {/* Official Phone */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
          هاتف التواصل المباشر
        </label>
        <input
          type="text"
          value={config.phone || '00966115126774'}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          placeholder="00966115126774"
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-500 focus:outline-none"
        />
      </div>

      {/* Social Links Toggle */}
      <div className="pt-2 border-t border-slate-800/80">
        <ToggleField
          label="إظهار أيقونات شبكات التواصل الاجتماعي"
          description="عرض روابط منصات إكس، لينكد إن، يوتيوب الرسمية في التذييل"
          checked={config.showSocialLinks ?? true}
          onChange={(checked) => onUpdate({ showSocialLinks: checked })}
        />
      </div>
    </div>
  );
};
