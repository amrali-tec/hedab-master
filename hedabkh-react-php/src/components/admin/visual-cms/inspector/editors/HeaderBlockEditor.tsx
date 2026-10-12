'use client';

import React from 'react';
import { BlockEditorProps } from '../types';
import { HeaderBlockConfig } from '@/lib/cms/blockSchemas';
import { LocalizedTextField } from '../primitives/LocalizedTextField';
import { LocalizedTextarea } from '../primitives/LocalizedTextarea';

export const HeaderBlockEditor: React.FC<BlockEditorProps<HeaderBlockConfig>> = ({
  config,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      {/* Announcement text */}
      <LocalizedTextarea
        label="نص شريط الإعلانات والمناقصات"
        valueAr={config.announcementTextAr}
        valueEn={config.announcementTextEn}
        onChangeAr={(val) => onUpdate({ announcementTextAr: val })}
        onChangeEn={(val) => onUpdate({ announcementTextEn: val })}
        placeholderAr="الخط الساخن المباشر للمشاريع والمناقصات: 00966115126774"
        placeholderEn="Direct Projects & Tenders Hotline: 00966115126774"
        rows={2}
      />

      {/* Hotline phone */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
          رقم الخط الساخن للمشاريع
        </label>
        <div className="relative">
          <input
            type="text"
            value={config.hotlinePhone || ''}
            onChange={(e) => onUpdate({ hotlinePhone: e.target.value })}
            placeholder="00966115126774"
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>

      {/* RFQ button text */}
      <LocalizedTextField
        label="نص زر طلب السعر المباشر"
        valueAr={config.rfqButtonTextAr}
        valueEn={config.rfqButtonTextEn}
        onChangeAr={(val) => onUpdate({ rfqButtonTextAr: val })}
        onChangeEn={(val) => onUpdate({ rfqButtonTextEn: val })}
        placeholderAr="طلب عرض سعر مباشر"
        placeholderEn="Request Quote"
      />
    </div>
  );
};
