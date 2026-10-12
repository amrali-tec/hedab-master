'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { ContactFormBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { ToggleField } from '../primitives/ToggleField';
import { Mail } from 'lucide-react';

export const ContactFormBlockEditor: React.FC<BlockEditorProps<ContactFormBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Header & Title */}
      <LocalizedTextField
        label="عنوان نموذج التواصل الرئيسي"
        valueAr={config.titleAr}
        valueEn={config.titleEn}
        onChangeAr={(val) => onUpdate({ titleAr: val })}
        onChangeEn={(val) => onUpdate({ titleEn: val })}
        placeholderAr="مثال: اطلب عرض سعر أو استفسر عن خدماتنا"
        placeholderEn="e.g. Request a Quotation or Inquire About Our Services"
      />

      <LocalizedTextarea
        label="النص الوصفي للنموذج"
        valueAr={config.subtitleAr}
        valueEn={config.subtitleEn}
        onChangeAr={(val) => onUpdate({ subtitleAr: val })}
        onChangeEn={(val) => onUpdate({ subtitleEn: val })}
        placeholderAr="فريقنا الهندسي مستعد لمناقشة متطلبات مشروعك والرد خلال 24 ساعة..."
        placeholderEn="Our engineering team is ready to discuss your project requirements within 24 hours..."
        rows={2}
      />

      {/* 2. Submit Button Text */}
      <LocalizedTextField
        label="نص زر الإرسال (Submit Button)"
        valueAr={config.submitButtonTextAr}
        valueEn={config.submitButtonTextEn}
        onChangeAr={(val) => onUpdate({ submitButtonTextAr: val })}
        onChangeEn={(val) => onUpdate({ submitButtonTextEn: val })}
        placeholderAr="مثال: إرسال الطلب الآن"
        placeholderEn="e.g. Send Request Now"
      />

      {/* 3. Form Settings */}
      <div className="pt-2 border-t border-slate-800/80 space-y-3">
        <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          <span>إعدادات الحقول والاستقبال</span>
        </span>

        <ToggleField
          label="إظهار حقل رقم الجوال الإلزامي"
          description="تفعيل حقل رقم الاتصال والمفتاح الدولي للمتصلين"
          checked={config.showPhoneField ?? true}
          onChange={(checked) => onUpdate({ showPhoneField: checked })}
        />

        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
            البريد الإلكتروني لاستقبال الطلبات (Recipient Email)
          </label>
          <input
            type="email"
            value={config.recipientEmail || 'info@hidab-gulf.com'}
            onChange={(e) => onUpdate({ recipientEmail: e.target.value })}
            placeholder="info@hidab-gulf.com"
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
