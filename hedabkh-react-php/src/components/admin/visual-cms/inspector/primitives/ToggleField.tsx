'use client';

import React from 'react';

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  checked,
  onChange,
  description,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-bold text-slate-200 block truncate">{label}</span>
        {description && (
          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-sky-500' : 'bg-slate-800'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
