'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Layers,
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Search,
  Eye,
  EyeOff,
  X,
  Copy,
  Box,
  LayoutGrid,
} from 'lucide-react';
import { ContentBlock } from '../../../lib/cms/blockSchemas';
import { BLOCK_REGISTRY } from '../../../lib/cms/blockRegistry';
import { treeUtils } from '../../../lib/cms/treeUtils';
import { UnifiedConfirmationModal } from '../common/UnifiedConfirmationModal';

interface RecursiveTreeRowProps {
  block: ContentBlock;
  parentBlock: ContentBlock | null;
  index: number;
  siblingsCount: number;
  depth: number;
  isSelected: boolean;
  selectedBlockId: string | null;
  collapsedIds: Set<string>;
  onToggleCollapse: (blockId: string) => void;
  onSelectBlock: (blockId: string) => void;
  onToggleVisibility?: (blockId: string) => void;
  onMoveBlockUp?: (blockId: string) => void;
  onMoveBlockDown?: (blockId: string) => void;
  onDuplicateBlock?: (blockId: string) => void;
  onDeleteRequest: (blockId: string) => void;
  locale: 'ar' | 'en';
}

const RecursiveTreeRow: React.FC<RecursiveTreeRowProps> = ({
  block,
  parentBlock,
  index,
  siblingsCount,
  depth,
  isSelected,
  selectedBlockId,
  collapsedIds,
  onToggleCollapse,
  onSelectBlock,
  onToggleVisibility,
  onMoveBlockUp,
  onMoveBlockDown,
  onDuplicateBlock,
  onDeleteRequest,
  locale,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const isContainer = block.type === 'container';
  const isGrid = block.type === 'grid';
  const isStructural = isContainer || isGrid;
  const hasChildren = Array.isArray(block.children) && block.children.length > 0;
  const isCollapsed = collapsedIds.has(block.id);

  const def = BLOCK_REGISTRY[block.type] || {
    labelAr: isContainer ? 'حاوية مرنة' : isGrid ? 'شبكة تخطيط' : block.type,
    labelEn: isContainer ? 'Container' : isGrid ? 'Grid' : block.type,
    icon: isContainer ? Box : isGrid ? LayoutGrid : Layers,
  };
  const Icon = def.icon;
  const isAr = locale === 'ar';

  return (
    <div ref={setNodeRef} style={style} className="space-y-1">
      {/* Current Row Item */}
      <div
        onClick={() => onSelectBlock(block.id)}
        style={{
          paddingRight: isAr ? `${Math.min(depth * 14 + 8, 80)}px` : '8px',
          paddingLeft: !isAr ? `${Math.min(depth * 14 + 8, 80)}px` : '8px',
        }}
        className={`group flex items-center justify-between gap-1.5 py-1.5 px-2 rounded-xl border transition-all cursor-pointer ${
          isDragging
            ? 'opacity-40 ring-2 ring-sky-500 scale-[0.98]'
            : isSelected
            ? 'bg-sky-500/15 border-sky-500/50 shadow-md ring-1 ring-sky-500/30'
            : isStructural
            ? 'bg-slate-900/90 border-slate-800/90 hover:bg-slate-800/80 hover:border-slate-700'
            : 'bg-slate-950/60 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700'
        } ${!block.isVisible ? 'opacity-40 grayscale-[40%]' : ''}`}
      >
        {/* Left / Drag Handle & Collapse Toggle & Icon & Title */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded cursor-grab active:cursor-grabbing transition-colors shrink-0"
            title={isAr ? 'اسحب لإعادة الترتيب' : 'Drag to reorder'}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Folder Collapse Toggle (Structural only) */}
          {isStructural ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse(block.id);
              }}
              className="p-0.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors shrink-0"
              title={isCollapsed ? (isAr ? 'توسيع الحاوية' : 'Expand') : (isAr ? 'طي الحاوية' : 'Collapse')}
            >
              {isCollapsed ? (
                isAr ? <ChevronLeft className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
              )}
            </button>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          {/* Icon Badge */}
          <div
            className={`p-1 rounded-lg border flex items-center justify-center shrink-0 ${
              isSelected
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                : isStructural
                ? 'bg-sky-950/30 text-sky-400 border-sky-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>

          {/* Title & Type */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-200 truncate">
                {isAr ? def.labelAr : def.labelEn}
              </p>
              {isStructural && hasChildren && (
                <span className="text-[9px] font-mono text-sky-400 px-1 py-0.2 rounded bg-sky-500/10 border border-sky-500/20 shrink-0">
                  {block.children!.length}
                </span>
              )}
            </div>
            <p className="text-[9px] text-slate-500 font-mono truncate">{block.type}</p>
          </div>
        </div>

        {/* Action Buttons (Hover / Selected Only) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0">
          {/* Visibility Toggle */}
          {onToggleVisibility && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(block.id);
              }}
              className={`p-1 rounded transition-colors ${
                block.isVisible
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-amber-400 hover:bg-slate-800'
              }`}
              title={block.isVisible ? 'إخفاء الكتلة مؤقتاً' : 'إظهار الكتلة'}
            >
              {block.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          )}

          {/* Move Up */}
          {onMoveBlockUp && index > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveBlockUp(block.id);
              }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="تحريك لأعلى"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          )}

          {/* Move Down */}
          {onMoveBlockDown && index < siblingsCount - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveBlockDown(block.id);
              }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="تحريك لأسفل"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          )}

          {/* Duplicate */}
          {onDuplicateBlock && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateBlock(block.id);
              }}
              className="p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800 cursor-pointer"
              title="تكرار الكتلة"
            >
              <Copy className="w-3 h-3" />
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest(block.id);
            }}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
            title="حذف الكتلة"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Recursive Children Rows (When not collapsed) */}
      {isStructural && hasChildren && !isCollapsed && (
        <div className="space-y-1 relative pr-1.5 border-r-2 border-dashed border-sky-500/25 mr-3 my-0.5">
          <SortableContext
            items={block.children!.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {block.children!.map((childBlock, childIndex) => (
              <RecursiveTreeRow
                key={childBlock.id}
                block={childBlock}
                parentBlock={block}
                index={childIndex}
                siblingsCount={block.children!.length}
                depth={depth + 1}
                isSelected={selectedBlockId === childBlock.id}
                selectedBlockId={selectedBlockId}
                collapsedIds={collapsedIds}
                onToggleCollapse={onToggleCollapse}
                onSelectBlock={onSelectBlock}
                onToggleVisibility={onToggleVisibility}
                onMoveBlockUp={onMoveBlockUp}
                onMoveBlockDown={onMoveBlockDown}
                onDuplicateBlock={onDuplicateBlock}
                onDeleteRequest={onDeleteRequest}
                locale={locale}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
};

interface PageTreeProps {
  blocks: ContentBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onAddBlockClick?: () => void;
  onMoveBlock?: (startIndex: number, endIndex: number) => void;
  onMoveNode?: (sourceId: string, destParentId: string | null, destIndex: number) => void;
  onMoveBlockUp?: (blockId: string) => void;
  onMoveBlockDown?: (blockId: string) => void;
  onDuplicateBlock?: (blockId: string) => void;
  onToggleVisibility?: (blockId: string) => void;
  onRemoveBlock: (blockId: string) => void;
  locale?: 'ar' | 'en';
}

export const PageTree: React.FC<PageTreeProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlockClick,
  onMoveBlock,
  onMoveNode,
  onMoveBlockUp,
  onMoveBlockDown,
  onDuplicateBlock,
  onToggleVisibility,
  onRemoveBlock,
  locale = 'ar',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const isAr = locale === 'ar';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-expand ancestors when selectedBlockId changes
  useEffect(() => {
    if (!selectedBlockId) return;
    const ancestors = treeUtils.getAncestors(blocks, selectedBlockId);
    if (ancestors.length > 0) {
      setCollapsedIds((prev) => {
        let changed = false;
        const next = new Set(prev);
        for (const anc of ancestors) {
          if (next.has(anc.id)) {
            next.delete(anc.id);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }
  }, [selectedBlockId, blocks]);

  const toggleCollapse = (blockId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (onMoveNode) {
      const activeLookup = treeUtils.findNode(blocks, activeId);
      const overLookup = treeUtils.findNode(blocks, overId);

      if (activeLookup.node && overLookup.node) {
        if (overLookup.node.type === 'container' || overLookup.node.type === 'grid') {
          const targetIndex = Array.isArray(overLookup.node.children) ? overLookup.node.children.length : 0;
          onMoveNode(activeId, overId, targetIndex);
        } else {
          const destParentId = overLookup.parent ? overLookup.parent.id : null;
          const destIndex = overLookup.index;
          onMoveNode(activeId, destParentId, destIndex);
        }
        return;
      }
    }

    if (onMoveBlock) {
      const oldIndex = blocks.findIndex((b) => b.id === activeId);
      const newIndex = blocks.findIndex((b) => b.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        onMoveBlock(oldIndex, newIndex);
      }
    }
  };

  const confirmDelete = () => {
    if (deleteCandidateId) {
      onRemoveBlock(deleteCandidateId);
      setDeleteCandidateId(null);
    }
  };

  const totalNodesCount = useMemo(() => treeUtils.countNodes(blocks), [blocks]);

  return (
    <div className="flex flex-col h-full overflow-hidden select-none p-3">
      {/* Header & Stats */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white">
              {isAr ? 'شجرة هيكل الصفحة' : 'Page Tree Navigator'}
            </h3>
            <p className="text-[10px] text-slate-400">
              {totalNodesCount} {isAr ? 'عنصر مسجل' : 'nodes'}
            </p>
          </div>
        </div>

        {onAddBlockClick && (
          <button
            type="button"
            onClick={onAddBlockClick}
            className="px-2 py-1 bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white rounded-lg text-xs font-bold border border-sky-500/30 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة' : 'Add'}</span>
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="relative mb-2.5 shrink-0">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? 'بحث في هيكل الصفحة...' : 'Filter tree...'}
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

      {/* Tree Content Area */}
      <div className="flex-1 overflow-y-auto pr-0.5 space-y-1">
        {blocks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <Layers className="w-6 h-6 mx-auto mb-2 text-slate-600" />
            <p>{isAr ? 'لا توجد كتل في الصفحة حتى الآن' : 'No blocks in page structure'}</p>
            {onAddBlockClick && (
              <button
                type="button"
                onClick={onAddBlockClick}
                className="mt-3 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-bold shadow transition-all"
              >
                {isAr ? 'إضافة كتلة جديدة' : 'Add First Block'}
              </button>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {blocks.map((block, index) => (
                  <RecursiveTreeRow
                    key={block.id}
                    block={block}
                    parentBlock={null}
                    index={index}
                    siblingsCount={blocks.length}
                    depth={0}
                    isSelected={selectedBlockId === block.id}
                    selectedBlockId={selectedBlockId}
                    collapsedIds={collapsedIds}
                    onToggleCollapse={toggleCollapse}
                    onSelectBlock={onSelectBlock}
                    onToggleVisibility={onToggleVisibility}
                    onMoveBlockUp={onMoveBlockUp}
                    onMoveBlockDown={onMoveBlockDown}
                    onDuplicateBlock={onDuplicateBlock}
                    onDeleteRequest={(id) => setDeleteCandidateId(id)}
                    locale={locale}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Unified Deletion Confirmation Modal */}
      {deleteCandidateId && (
        <UnifiedConfirmationModal
          isOpen={Boolean(deleteCandidateId)}
          onClose={() => setDeleteCandidateId(null)}
          onConfirm={confirmDelete}
          title={isAr ? 'تأكيد حذف العنصر' : 'Confirm Element Deletion'}
          description={
            isAr
              ? 'هل أنت متأكد من حذف هذا العنصر؟ سيتم حذف جميع العناصر المتداخلة داخله (إن وجدت) بصورة فورية مع إمكانية التراجع (Ctrl+Z).'
              : 'Are you sure you want to delete this element and all its nested children?'
          }
          confirmText={isAr ? 'تأكيد الحذف' : 'Confirm Delete'}
          cancelText={isAr ? 'إلغاء' : 'Cancel'}
          isDestructive={true}
        />
      )}
    </div>
  );
};
