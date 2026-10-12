'use client';

import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string | number;
  options: SelectOption[];
  onChange: (val: any) => void;
  description?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
  description,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-slate-300 truncate">
        {label}
      </label>

      {description && (
        <p className="text-[10px] text-slate-400">{description}</p>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-xs text-white cursor-pointer focus:border-sky-500 focus:outline-none transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
