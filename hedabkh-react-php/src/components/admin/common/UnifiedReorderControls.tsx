'use client';

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface UnifiedReorderControlsProps {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disabled?: boolean;
}

export const UnifiedReorderControls: React.FC<UnifiedReorderControlsProps> = ({
  index,
  total,
  onMoveUp,
  onMoveDown,
  disabled = false,
}) => {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 shadow-inner">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={isFirst || disabled}
        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50"
        title="نقل للأعلى (Move Up)"
        aria-label={`نقل العنصر ${index + 1} للأعلى`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      <span className="text-[11px] font-mono font-medium text-slate-400 px-1 select-none">
        {index + 1}
      </span>

      <button
        type="button"
        onClick={onMoveDown}
        disabled={isLast || disabled}
        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50"
        title="نقل للأسفل (Move Down)"
        aria-label={`نقل العنصر ${index + 1} للأسفل`}
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
};
