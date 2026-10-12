'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { WhatsAppBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';
import { ToggleField } from '../primitives/ToggleField';

export const WhatsAppBlockEditor: React.FC<BlockEditorProps<WhatsAppBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      {/* Phone Number */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
          رقم الواتساب الرسمي (مع المفتاح الدولي بدون إشارات أو مسافات)
        </label>
        <input
          type="text"
          value={config.phoneNumber || '966551234567'}
          onChange={(e) => onUpdate({ phoneNumber: e.target.value.replace(/[^0-9]/g, '') })}
          placeholder="966551234567"
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-500 focus:outline-none"
        />
      </div>

      {/* Default Message */}
      <LocalizedTextarea
        label="الرسالة التلقائية الترحيبية"
        valueAr={config.defaultMessageAr}
        valueEn={config.defaultMessageEn}
        onChangeAr={(val) => onUpdate({ defaultMessageAr: val })}
        onChangeEn={(val) => onUpdate({ defaultMessageEn: val })}
        placeholderAr="السلام عليكم، أرغب في الاستفسار عن خدمات مقاولات البنية التحتية..."
        placeholderEn="Hello, I would like to inquire about infrastructure contracting services..."
        rows={3}
      />

      {/* Tooltip */}
      <LocalizedTextField
        label="نص التلميح التفاعلي (Hover Tooltip)"
        valueAr={config.tooltipAr}
        valueEn={config.tooltipEn}
        onChangeAr={(val) => onUpdate({ tooltipAr: val })}
        onChangeEn={(val) => onUpdate({ tooltipEn: val })}
        placeholderAr="تواصل معنا عبر واتساب"
        placeholderEn="Chat with us on WhatsApp"
      />

      {/* Pulse Glow Toggle */}
      <div className="pt-2 border-t border-slate-800/80">
        <ToggleField
          label="تأثير الوهج النابض (Pulse Glow Animation)"
          description="تفعيل حلقة ضوئية نابضة لجذب انتباه الزوار للزر العائم"
          checked={config.pulseGlow ?? true}
          onChange={(checked) => onUpdate({ pulseGlow: checked })}
        />
      </div>
    </div>
  );
};
