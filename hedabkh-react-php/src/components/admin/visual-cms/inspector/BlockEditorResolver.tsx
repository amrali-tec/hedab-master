'use client';

import React from 'react';
import { ContentBlock } from '@/lib/cms/blockSchemas';
import { BLOCK_EDITOR_REGISTRY } from './BlockEditorRegistry';
import { Layers } from 'lucide-react';

interface BlockEditorResolverProps {
  block: ContentBlock;
  onUpdateConfig: (updates: Record<string, any>) => void;
  openMediaPicker?: (targetField: string) => void;
  locale?: string;
}

export const BlockEditorResolver: React.FC<BlockEditorResolverProps> = ({
  block,
  onUpdateConfig,
  openMediaPicker,
  locale,
}) => {
  const EditorComponent = BLOCK_EDITOR_REGISTRY[block.type];

  if (!EditorComponent) {
    return (
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <Layers className="w-5 h-5" />
        </div>
        <h4 className="text-xs font-bold text-slate-200">محرر قيد التطوير</h4>
        <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto leading-relaxed">
          الكتلة <span className="font-mono text-sky-400">{block.type}</span> معتمدة ولكن المحرر المتخصص غير مسجل.
        </p>
      </div>
    );
  }

  return (
    <EditorComponent
      block={block}
      config={block.config || {}}
      onUpdate={onUpdateConfig}
      openMediaPicker={openMediaPicker}
      locale={locale}
    />
  );
};
