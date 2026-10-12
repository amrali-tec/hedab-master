'use client';

import React from 'react';

interface NumberSliderFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  description?: string;
}

export const NumberSliderField: React.FC<NumberSliderFieldProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  description,
}) => {
  return (
    <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] font-bold text-slate-300 truncate">
          {label}
        </label>
        <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
          {value} {unit}
        </span>
      </div>

      {description && (
        <p className="text-[10px] text-slate-400 leading-tight">{description}</p>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-500 cursor-pointer bg-slate-800 h-1.5 rounded-lg appearance-none"
      />
    </div>
  );
};
