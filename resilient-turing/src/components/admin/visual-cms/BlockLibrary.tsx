'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  X,
  Search,
  Sparkles,
  Layout,
  FileText,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Layers,
  Box,
  LayoutGrid,
  Columns,
  MapPin,
  Globe,
  Info,
} from 'lucide-react';
import { BlockType } from '../../../lib/cms/blockSchemas';
import { BLOCK_REGISTRY } from '../../../lib/cms/blockRegistry';

export type LayoutPresetId = '50-50' | '33-33-33' | '25-75' | '75-25' | '25-50-25';

interface BlockLibraryProps {
  isOpen?: boolean;
  isDocked?: boolean;
  onSelectBlockType: (type: BlockType) => void;
  onSelectLayoutPreset?: (presetId: LayoutPresetId) => void;
  onClose?: () => void;
  locale?: 'ar' | 'en';
}

export const BlockLibrary: React.FC<BlockLibraryProps> = ({
  isOpen = true,
  isDocked = false,
  onSelectBlockType,
  onSelectLayoutPreset,
  onClose,
  locale = 'ar',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isAr = locale === 'ar';

  const categories = useMemo(
    () => [
      { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: Layers },
      { id: 'layout', labelAr: 'الهيكل', labelEn: 'Layout', icon: Layout },
      { id: 'content', labelAr: 'المحتوى', labelEn: 'Content', icon: FileText },
      { id: 'business', labelAr: 'الأعمال', labelEn: 'Business', icon: Briefcase },
      { id: 'conversion', labelAr: 'التحويل', labelEn: 'Conversion', icon: MessageSquare },
      { id: 'site', labelAr: 'الموقع', labelEn: 'Site', icon: Globe },
      { id: 'specialized', labelAr: 'خرائط', labelEn: 'Maps', icon: MapPin },
    ],
    []
  );

  const allBlocks = useMemo(() => Object.values(BLOCK_REGISTRY), []);

  const layoutPresets = useMemo(
    () => [
      { id: '50-50' as LayoutPresetId, label: '50 / 50', descAr: 'عمودان متساويان', descEn: '2 Equal Columns', cols: 2 },
      { id: '33-33-33' as LayoutPresetId, label: '33 / 33 / 33', descAr: 'ثلاثة أعمدة', descEn: '3 Equal Columns', cols: 3 },
      { id: '25-75' as LayoutPresetId, label: '25 / 75', descAr: 'عمود جانبي + رئيسي', descEn: 'Sidebar + Main', cols: 2 },
      { id: '75-25' as LayoutPresetId, label: '75 / 25', descAr: 'رئيسي + عمود جانبي', descEn: 'Main + Sidebar', cols: 2 },
      { id: '25-50-25' as LayoutPresetId, label: '25 / 50 / 25', descAr: 'ثلاثة أعمدة مميزة', descEn: '3 Columns Highlight', cols: 3 },
    ],
    []
  );

  // Group blocks by conceptual category
  const categorizedBlocks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allBlocks.filter((block) => {
      // Map specialized/site blocks to conceptual categories
      let mappedCategory: string = block.category;
      if (block.type === 'header' || block.type === 'footer') {
        mappedCategory = 'site';
      } else if (block.type === 'saudiMap') {
        mappedCategory = 'specialized';
      } else if (block.type === 'gallery' || block.type === 'statistics') {
        mappedCategory = 'content';
      }

      const matchesCategory =
        selectedCategory === 'all' ||
        block.category === selectedCategory ||
        mappedCategory === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        block.labelAr.toLowerCase().includes(q) ||
        block.labelEn.toLowerCase().includes(q) ||
        block.descriptionAr.toLowerCase().includes(q) ||
        block.descriptionEn.toLowerCase().includes(q) ||
        block.type.toLowerCase().includes(q)
      );
    });
  }, [allBlocks, selectedCategory, searchQuery]);

  if (!isOpen && !isDocked) return null;

  return (
    <div className={`flex flex-col h-full overflow-hidden select-none ${isDocked ? 'p-2.5' : 'p-6'}`}>
      {/* Header (Visible when presented as modal) */}
      {!isDocked && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'مكتبة العناصر والكتل (Elementor Widgets)' : 'Element & Block Library'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr
                  ? 'اختر عنصراً لإضافته فوراً إلى هيكل الصفحة'
                  : 'Select an element to add it directly to the page structure'}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Search Bar & Category Filters */}
      <div className="space-y-1.5 mb-2.5 shrink-0">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في العناصر والكتل...' : 'Search widgets...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-8 pl-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 bg-slate-950/70 border border-slate-800/60'
                }`}
              >
                <CatIcon className="w-2.5 h-2.5" />
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-0.5 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
        {/* PINNED SECTION 1: Layout Primitives & Quick Presets */}
        {(selectedCategory === 'all' || selectedCategory === 'layout') && !searchQuery && (
          <div className="space-y-1.5 pb-2 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-sky-400 flex items-center gap-1">
                <Box className="w-3 h-3" />
                <span>{isAr ? 'الهيكل والتوزيع' : 'Layout Primitives'}</span>
              </span>
              <span className="text-[8px] font-mono text-slate-500 px-1 py-0.2 rounded bg-slate-900 border border-slate-800">
                Flex & Grid
              </span>
            </div>

            {/* Quick Layout Presets Bar */}
            {onSelectLayoutPreset && (
              <div className="grid grid-cols-5 gap-1 pt-0.5">
                {layoutPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectLayoutPreset(preset.id)}
                    className="p-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500 hover:bg-sky-950/30 text-center transition-all cursor-pointer group"
                    title={isAr ? `${preset.label}: ${preset.descAr}` : `${preset.label}: ${preset.descEn}`}
                  >
                    <div className="flex items-center justify-center gap-0.5 mb-0.5 opacity-70 group-hover:opacity-100">
                      {Array.from({ length: preset.cols }).map((_, i) => (
                        <div key={i} className="h-2.5 bg-sky-500/40 rounded-sm flex-1" />
                      ))}
                    </div>
                    <span className="text-[8px] font-mono font-bold text-slate-400 group-hover:text-sky-400 block truncate">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPACT WIDGET CARDS LIST (Icon + Label only, description in tooltip) */}
        <div
          className={isDocked ? 'space-y-1' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'}
        >
          {categorizedBlocks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs col-span-full">
              <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-slate-600" />
              <p>{isAr ? 'لا توجد عناصر تطابق البحث' : 'No matching widgets'}</p>
            </div>
          ) : (
            categorizedBlocks.map((block) => {
              const Icon = block.icon;
              const isStructural = block.type === 'container' || block.type === 'grid';
              const blockLabel = isAr ? block.labelAr : block.labelEn;
              const blockDesc = isAr ? block.descriptionAr : block.descriptionEn;
              const tooltipText = `${blockLabel}\n${blockDesc}`;

              return (
                <div
                  key={block.type}
                  tabIndex={0}
                  role="button"
                  onClick={() => onSelectBlockType(block.type)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectBlockType(block.type);
                    }
                  }}
                  title={tooltipText}
                  className={`group px-2.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                    isStructural
                      ? 'bg-sky-950/20 border-sky-500/30 hover:border-sky-500 hover:bg-sky-950/40 shadow-sm'
                      : 'bg-slate-950/80 border-slate-800/90 hover:border-sky-500/60 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        isStructural
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 group-hover:bg-sky-500 group-hover:text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 group-hover:text-sky-400 group-hover:border-sky-500/40'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                      {blockLabel}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800/60 group-hover:text-slate-400">
                      {isStructural ? 'Layout' : block.type}
                    </span>

                    {/* Quick Add Plus Action */}
                    <span className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity p-0.5 rounded bg-sky-500 text-white">
                      <Plus className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockLibrary;
