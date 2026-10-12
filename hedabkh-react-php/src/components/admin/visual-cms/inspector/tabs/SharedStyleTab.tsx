'use client';

import React from 'react';
import { BaseBlockConfig, BlockType } from '@/lib/cms/blockSchemas';
import { Check, Palette, Maximize2, MoveVertical, Sparkles, Box, Sliders } from 'lucide-react';
import { ToggleField } from '../primitives/ToggleField';

interface SharedStyleTabProps {
  blockType: BlockType;
  config: BaseBlockConfig;
  onUpdate: (updates: Partial<BaseBlockConfig>) => void;
}

export const SharedStyleTab: React.FC<SharedStyleTabProps> = ({
  blockType,
  config,
  onUpdate,
}) => {
  const isWidget = blockType === 'whatsapp';

  const paddingPixels = {
    compact: '48px',
    normal: '80px',
    spacious: '112px',
  };

  const currentPaddingKey = config.padding || 'normal';
  const currentPaddingVal = paddingPixels[currentPaddingKey as keyof typeof paddingPixels] || '80px';

  return (
    <div className="space-y-4">
      {/* 1. Theme Selection */}
      <div>
        <label className="block text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <span>سمة الخلفية واللون (Color Theme)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'dark', label: 'الأسود السيادي', bg: 'bg-slate-950 text-white' },
            { id: 'navy', label: 'كحلي هندسي', bg: 'bg-[#002060] text-white' },
            { id: 'slate', label: 'رمادي احترافي', bg: 'bg-slate-900 text-white' },
            { id: 'gradient', label: 'تدرج سماوي', bg: 'bg-gradient-to-r from-sky-600 to-[#002060] text-white' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onUpdate({ theme: t.id as any })}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                (config.theme || 'dark') === t.id
                  ? 'border-sky-400 ring-2 ring-sky-500/30 shadow-md'
                  : 'border-slate-800 hover:border-slate-700'
              } ${t.bg}`}
            >
              <span>{t.label}</span>
              {(config.theme || 'dark') === t.id && <Check className="w-3.5 h-3.5 text-sky-400" />}
            </button>
          ))}
        </div>
      </div>

      {!isWidget && (
        <>
          {/* 2. Visual CSS Box Model Diagram */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-sky-400 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                <span>نموذج الصندوق المرئي (Box Model)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Padding: {currentPaddingVal}</span>
            </div>

            {/* Visual Box Container */}
            <div className="border border-dashed border-slate-700 rounded-xl p-3 bg-slate-900/60 relative flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-mono text-sky-400 absolute top-1 font-bold">▲ Top: {currentPaddingVal}</span>
              <span className="text-[9px] font-mono text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2">Auto</span>
              <span className="text-[9px] font-mono text-slate-500 absolute left-1.5 top-1/2 -translate-y-1/2">Auto</span>
              
              {/* Inner Content Representation */}
              <div className="my-3 px-6 py-2 rounded-lg bg-slate-950 border border-sky-500/30 text-[10px] font-bold text-slate-200">
                محتوى الكتلة (Block Content)
              </div>

              <span className="text-[9px] font-mono text-sky-400 absolute bottom-1 font-bold">▼ Bottom: {currentPaddingVal}</span>
            </div>

            {/* Vertical Spacing Selector */}
            <div className="flex gap-2 pt-1">
              {[
                { id: 'compact', label: 'مدمج (48px)' },
                { id: 'normal', label: 'قياسي (80px)' },
                { id: 'spacious', label: 'متسع (112px)' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onUpdate({ padding: p.id as any })}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    (config.padding || 'normal') === p.id
                      ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Container Width */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span>عرض المحتوى (Container Width)</span>
            </label>
            <div className="flex gap-2">
              {[
                { id: 'standard', label: 'قياسي 1200px' },
                { id: 'wide', label: 'عريض 1440px' },
                { id: 'full', label: 'كامل العرض' },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onUpdate({ containerWidth: w.id as any })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    (config.containerWidth || 'standard') === w.id
                      ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Border Accents & Dividers */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-[11px] font-black text-sky-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>فواصل وحواف التمييز السيادية</span>
            </span>

            <ToggleField
              label="فاصل علوي مميز (Top Divider)"
              checked={config.borderTop || false}
              onChange={(val) => onUpdate({ borderTop: val })}
              description="إضافة خط ذهبي/سماوي رفيع في أعلى القسم"
            />

            <ToggleField
              label="فاصل سفلي مميز (Bottom Divider)"
              checked={config.borderBottom || false}
              onChange={(val) => onUpdate({ borderBottom: val })}
              description="إضافة خط تمييز هندسي في أسفل القسم"
            />
          </div>
        </>
      )}
    </div>
  );
};
