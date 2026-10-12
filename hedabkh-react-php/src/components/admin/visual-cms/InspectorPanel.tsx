'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Image as ImageIcon,
  Type,
  Eye,
  EyeOff,
  Palette,
  Layers,
  PanelRightClose,
  Globe,
} from 'lucide-react';
import { ContentBlock } from '../../../lib/cms/blockSchemas';
import { BLOCK_REGISTRY } from '../../../lib/cms/blockRegistry';
import { UnifiedMediaPickerModal } from '../common/UnifiedMediaPickerModal';
import { BlockEditorResolver } from './inspector/BlockEditorResolver';
import { SharedStyleTab } from './inspector/tabs/SharedStyleTab';
import { SharedMediaTab } from './inspector/tabs/SharedMediaTab';

interface InspectorPanelProps {
  selectedBlock: ContentBlock | null;
  onUpdateBlockConfig: (blockId: string, updates: Record<string, any>) => void;
  onToggleVisibility?: (blockId: string) => void;
  onClose?: () => void;
}

type InspectorTab = 'content' | 'style' | 'media';

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedBlock,
  onUpdateBlockConfig,
  onToggleVisibility,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('content');
  const [editingLocale, setEditingLocale] = useState<'ar' | 'en'>('ar');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<string>('bgImageUrl');

  if (!selectedBlock) {
    return (
      <div className="w-full bg-slate-900 border-r border-slate-800 p-5 flex flex-col items-center justify-center text-center select-none h-full">
        <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
          <Sliders className="w-5 h-5" />
        </div>
        <h3 className="text-xs font-bold text-slate-200 mb-1">محرر الخصائص</h3>
        <p className="text-[11px] text-slate-400 max-w-[220px] leading-relaxed">
          اختر عنصراً من اللوحة المرئية أو شجرة الهيكل لبدء التعديل.
        </p>
      </div>
    );
  }

  const blockDef = BLOCK_REGISTRY[selectedBlock.type] || {
    labelAr: selectedBlock.type,
    labelEn: selectedBlock.type,
    descriptionAr: '',
    icon: Layers,
    defaultConfig: {},
  };
  const Icon = blockDef.icon;

  const handleUpdate = (updates: Record<string, any>) => {
    onUpdateBlockConfig(selectedBlock.id, updates);
  };

  const openMediaPicker = (field: string) => {
    setMediaTargetField(field);
    setIsMediaPickerOpen(true);
  };

  const handleSelectMedia = (url: string) => {
    handleUpdate({ [mediaTargetField]: url });
    setIsMediaPickerOpen(false);
  };

  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden select-none">
      {/* 1. Header with Block Info, Language Switcher & Actions */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Block Type & Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-white truncate">{blockDef.labelAr}</h3>
                <span className="text-[9px] text-sky-400 font-mono bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-500/20 shrink-0">
                  {selectedBlock.type}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Global Language Toggle Pill */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setEditingLocale('ar')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  editingLocale === 'ar'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="تعديل المحتوى باللغة العربية"
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setEditingLocale('en')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  editingLocale === 'en'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Edit English content"
              >
                EN
              </button>
            </div>

            {onToggleVisibility && (
              <button
                type="button"
                onClick={() => onToggleVisibility(selectedBlock.id)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedBlock.isVisible
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                }`}
                title={selectedBlock.isVisible ? 'إخفاء الكتلة' : 'إظهار الكتلة'}
              >
                {selectedBlock.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                title="طي لوحة الخصائص"
              >
                <PanelRightClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Compact Navigation Tabs (30px) */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'content'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>المحتوى</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'style'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>المظهر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'media'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>الوسائط</span>
          </button>
        </div>
      </div>

      {/* 2. Body with Compact 8px Spacing Rhythm */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'content' && (
          <BlockEditorResolver
            block={selectedBlock}
            onUpdateConfig={handleUpdate}
            openMediaPicker={openMediaPicker}
          />
        )}

        {activeTab === 'style' && (
          <SharedStyleTab
            blockType={selectedBlock.type}
            config={selectedBlock.config}
            onUpdate={handleUpdate}
          />
        )}

        {activeTab === 'media' && (
          <SharedMediaTab
            blockType={selectedBlock.type}
            config={selectedBlock.config}
            onUpdate={handleUpdate}
            openMediaPicker={openMediaPicker}
          />
        )}
      </div>

      {/* Unified Media Picker Modal */}
      <UnifiedMediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSelectMedia}
      />
    </div>
  );
};
