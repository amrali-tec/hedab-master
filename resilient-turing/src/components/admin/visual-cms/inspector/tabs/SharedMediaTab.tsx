'use client';

import React from 'react';
import { BaseBlockConfig, BlockType } from '@/lib/cms/blockSchemas';
import { MediaPickerField } from '../primitives/MediaPickerField';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface SharedMediaTabProps {
  blockType: BlockType;
  config: BaseBlockConfig;
  onUpdate: (updates: Partial<BaseBlockConfig>) => void;
  openMediaPicker: (targetField: string) => void;
}

export const SharedMediaTab: React.FC<SharedMediaTabProps> = ({
  blockType,
  config,
  onUpdate,
  openMediaPicker,
}) => {
  if (blockType === 'header') {
    return (
      <div className="space-y-4">
        <MediaPickerField
          label="شعار النسخة الفاتحة (Light Logo)"
          value={(config as any).logoLightUrl || '/images/logo-light.png'}
          onChange={(url) => onUpdate({ logoLightUrl: url } as any)}
          onOpenPicker={() => openMediaPicker('logoLightUrl')}
          description="يستخدم في الخلفيات الداكنة وشريط الترويسة الرئيسي"
        />

        <MediaPickerField
          label="شعار النسخة الداكنة (Dark Logo)"
          value={(config as any).logoDarkUrl || '/images/logo-dark.png'}
          onChange={(url) => onUpdate({ logoDarkUrl: url } as any)}
          onOpenPicker={() => openMediaPicker('logoDarkUrl')}
          description="يستخدم في القوائم المنبثقة والخلفيات الفاتحة"
        />
      </div>
    );
  }

  const supportsBackgroundImage = ['hero', 'cta', 'richText'].includes(blockType);

  if (supportsBackgroundImage) {
    return (
      <div className="space-y-4">
        <MediaPickerField
          label="صورة الخلفية / البانر الإنشائي"
          value={(config as any).bgImageUrl || ''}
          onChange={(url) => onUpdate({ bgImageUrl: url } as any)}
          onOpenPicker={() => openMediaPicker('bgImageUrl')}
          description="صورة بانورامية عالية الجودة للخلفية مع تطبيق تراكب داكن تلقائياً"
          aspectRatio="wide"
        />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
        <ImageIcon className="w-5 h-5" />
      </div>
      <h4 className="text-xs font-bold text-slate-200">الوسائط مدمجة بالمحتوى</h4>
      <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto leading-relaxed">
        يتم إدارة صور وأيقونات هذه الكتلة مباشرة من تبويب «المحتوى» لضمان التناسق البصري.
      </p>
    </div>
  );
};
