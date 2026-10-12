'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
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
  Sparkles,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Plus,
  GripVertical,
  Box,
  LayoutGrid,
} from 'lucide-react';
import { ContentBlock } from '../../../lib/cms/blockSchemas';
import { BLOCK_REGISTRY } from '../../../lib/cms/blockRegistry';
import { PublicPageRenderer } from '../../cms/PublicPageRenderer';
import { treeUtils } from '../../../lib/cms/treeUtils';

interface SortableCanvasBlockProps {
  block: ContentBlock;
  index: number;
  parentBlock: ContentBlock | null;
  isSelected: boolean;
  selectedBlockId: string | null;
  isPreviewMode: boolean;
  siblingsCount: number;
  depth?: number;
  locale: 'ar' | 'en';
  onSelectBlock: (blockId: string) => void;
  onRemoveBlock: (blockId: string) => void;
  onMoveBlockUp?: (blockId: string) => void;
  onMoveBlockDown?: (blockId: string) => void;
  onDuplicateBlock?: (blockId: string) => void;
  onInsertBlockAtIndex?: (index: number, parentId?: string | null) => void;
}

const SortableCanvasBlock: React.FC<SortableCanvasBlockProps> = ({
  block,
  index,
  parentBlock,
  isSelected,
  selectedBlockId,
  isPreviewMode,
  siblingsCount,
  depth = 0,
  locale,
  onSelectBlock,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onDuplicateBlock,
  onInsertBlockAtIndex,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    disabled: isPreviewMode,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const isContainer = block.type === 'container';
  const isGrid = block.type === 'grid';
  const isStructural = isContainer || isGrid;

  const def = BLOCK_REGISTRY[block.type] || {
    labelAr: isContainer ? 'حاوية (Container)' : isGrid ? 'شبكة (Grid)' : block.type,
    labelEn: isContainer ? 'Container' : isGrid ? 'Grid' : block.type,
    icon: isContainer ? Box : isGrid ? LayoutGrid : Layers,
  };
  const BlockIcon = def.icon;
  const isAr = locale === 'ar';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group/block ${
        isDragging ? 'opacity-40 ring-2 ring-sky-500 scale-[0.99]' : ''
      } ${isStructural ? 'my-2' : ''}`}
    >
      {/* In-Between Insert Point at Top of Sibling (Edit Mode Only) */}
      {!isPreviewMode && onInsertBlockAtIndex && (
        <div className="relative h-2 flex items-center justify-center -top-1 opacity-0 hover:opacity-100 group/adder transition-all z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInsertBlockAtIndex(index, parentBlock ? parentBlock.id : null);
            }}
            className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded-full text-[10px] font-bold shadow-lg shadow-sky-500/30 flex items-center gap-1 transform scale-90 group-hover/adder:scale-100 transition-transform cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>إضافة عنصر هنا</span>
          </button>
        </div>
      )}

      {/* Block Container Shell */}
      <div
        onClick={(e) => {
          if (!isPreviewMode) {
            e.stopPropagation();
            onSelectBlock(block.id);
          }
        }}
        className={`relative transition-all ${
          !isPreviewMode ? 'cursor-pointer' : ''
        } ${
          !isPreviewMode && isSelected
            ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-slate-950 rounded-xl shadow-2xl'
            : !isPreviewMode
            ? isStructural
              ? 'border border-dashed border-slate-700/80 rounded-xl hover:border-sky-500/60'
              : 'hover:ring-1 hover:ring-sky-500/40 rounded-lg'
            : ''
        } ${!block.isVisible ? 'opacity-40 grayscale-[50%]' : ''}`}
      >
        {/* Contextual Action Bar (Persistent when Selected, or visible on hover) */}
        {!isPreviewMode && (
          <div
            className={`absolute top-2 right-2 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black shadow-2xl backdrop-blur-xl border transition-all ${
              isSelected
                ? 'bg-sky-500 text-white border-sky-400 opacity-100'
                : 'bg-slate-900/95 text-slate-200 border-slate-700 opacity-0 group-hover/block:opacity-100'
            }`}
          >
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-grab active:cursor-grabbing text-slate-300 hover:text-white"
              title={isAr ? 'اسحب لإعادة الترتيب' : 'Drag to reorder'}
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
              <BlockIcon className="w-3.5 h-3.5" />
              <span className="text-[11px]">{isAr ? def.labelAr : def.labelEn}</span>
            </div>

            {/* Move Up */}
            {onMoveBlockUp && index > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveBlockUp(block.id);
                }}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                title="تحريك لأعلى"
              >
                <ChevronUp className="w-3.5 h-3.5" />
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
                className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                title="تحريك لأسفل"
              >
                <ChevronDown className="w-3.5 h-3.5" />
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
                className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                title="تكرار العنصر"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveBlock(block.id);
              }}
              className="p-1 hover:bg-rose-500/30 text-rose-300 rounded-lg transition-colors cursor-pointer"
              title="حذف العنصر"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Render: Structural vs Leaf Block */}
        {isStructural ? (
          <div className="p-3 md:p-4 rounded-xl bg-slate-950/40 min-h-[90px]">
            {/* Structural Header Tag */}
            <div className="flex items-center gap-2 mb-2 text-[11px] font-bold text-slate-400">
              <BlockIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>{isContainer ? (isAr ? 'حاوية مرنة' : 'Flex Container') : (isAr ? 'شبكة تخطيط' : 'CSS Grid')}</span>
            </div>

            {/* Nested Sortable Zone */}
            <SortableContext
              items={Array.isArray(block.children) ? block.children.map((c) => c.id) : []}
              strategy={verticalListSortingStrategy}
            >
              <div
                className={`w-full ${
                  isContainer
                    ? block.config?.direction === 'row'
                      ? 'flex flex-col md:flex-row flex-wrap gap-4'
                      : 'flex flex-col gap-4'
                    : `grid grid-cols-1 md:grid-cols-${block.config?.columnsTablet || 2} lg:grid-cols-${
                        block.config?.columnsDesktop || 3
                      } gap-4`
                }`}
              >
                {Array.isArray(block.children) && block.children.length > 0 ? (
                  block.children.map((childBlock, childIndex) => (
                    <SortableCanvasBlock
                      key={childBlock.id}
                      block={childBlock}
                      index={childIndex}
                      parentBlock={block}
                      isSelected={selectedBlockId === childBlock.id}
                      selectedBlockId={selectedBlockId}
                      isPreviewMode={isPreviewMode}
                      siblingsCount={block.children!.length}
                      depth={depth + 1}
                      locale={locale}
                      onSelectBlock={onSelectBlock}
                      onRemoveBlock={onRemoveBlock}
                      onMoveBlockUp={onMoveBlockUp}
                      onMoveBlockDown={onMoveBlockDown}
                      onDuplicateBlock={onDuplicateBlock}
                      onInsertBlockAtIndex={onInsertBlockAtIndex}
                    />
                  ))
                ) : (
                  /* Empty State Drop Target for Empty Container */
                  <div
                    onClick={(e) => {
                      if (!isPreviewMode && onInsertBlockAtIndex) {
                        e.stopPropagation();
                        onInsertBlockAtIndex(0, block.id);
                      }
                    }}
                    className="w-full py-8 px-4 rounded-xl border border-dashed border-slate-800 hover:border-sky-500/50 bg-slate-900/30 text-center space-y-2 cursor-pointer transition-all"
                  >
                    <Plus className="w-5 h-5 text-sky-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">
                      {isAr ? '+ أضف أو اسحب عنصراً داخل هذه الحاوية' : '+ Add or drop elements inside container'}
                    </p>
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        ) : (
          /* Specialized Leaf Block Render */
          <div className={!isPreviewMode ? 'pointer-events-none' : ''}>
            <PublicPageRenderer blocks={[block]} locale={locale} isStandalone={true} />
          </div>
        )}
      </div>
    </div>
  );
};

interface EditorCanvasProps {
  blocks: ContentBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onRemoveBlock: (blockId: string) => void;
  onMoveBlockUp?: (blockId: string) => void;
  onMoveBlockDown?: (blockId: string) => void;
  onDuplicateBlock?: (blockId: string) => void;
  onInsertBlockAtIndex?: (index: number, parentId?: string | null) => void;
  onReorderBlocks?: (startIndex: number, endIndex: number) => void;
  onMoveNode?: (sourceId: string, destParentId: string | null, destIndex: number) => void;
  locale?: 'ar' | 'en';
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
  zoom?: number;
  isPreviewMode?: boolean;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onDuplicateBlock,
  onInsertBlockAtIndex,
  onReorderBlocks,
  onMoveNode,
  locale = 'ar',
  deviceMode = 'desktop',
  zoom = 100,
  isPreviewMode = false,
}) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px threshold to differentiate between click and drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // If onMoveNode handler is provided, perform treeUtils-backed multi-zone move
    if (onMoveNode) {
      const activeLookup = treeUtils.findNode(blocks, activeId);
      const overLookup = treeUtils.findNode(blocks, overId);

      if (activeLookup.node && overLookup.node) {
        // If dropping onto a container/grid directly
        if (overLookup.node.type === 'container' || overLookup.node.type === 'grid') {
          const targetIndex = Array.isArray(overLookup.node.children) ? overLookup.node.children.length : 0;
          onMoveNode(activeId, overId, targetIndex);
        } else {
          // Dropping next to a sibling
          const destParentId = overLookup.parent ? overLookup.parent.id : null;
          const destIndex = overLookup.index;
          onMoveNode(activeId, destParentId, destIndex);
        }
        return;
      }
    }

    // Fallback: Legacy flat reordering
    if (onReorderBlocks) {
      const oldIndex = blocks.findIndex((b) => b.id === activeId);
      const newIndex = blocks.findIndex((b) => b.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderBlocks(oldIndex, newIndex);
      }
    }
  };

  const getCanvasWidthClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[390px] border-x border-slate-700/80 shadow-2xl my-6 rounded-3xl overflow-hidden';
      case 'tablet':
        return 'max-w-[768px] border-x border-slate-700/80 shadow-2xl my-6 rounded-2xl overflow-hidden';
      default:
        return 'w-full';
    }
  };

  const { node: activeDraggedBlock } = activeDragId ? treeUtils.findNode(blocks, activeDragId) : { node: null };
  const activeDef = activeDraggedBlock ? BLOCK_REGISTRY[activeDraggedBlock.type] : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/95 overflow-hidden relative select-none">
      {/* Canvas Body with Zoom Transform */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center bg-slate-950/90 relative">
        <div
          style={{
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
          className={`h-fit transition-all duration-300 ${getCanvasWidthClass()}`}
        >
          {blocks.length === 0 ? (
            <div className="p-16 text-center text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-sky-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">الصفحة لا تحتوي على أي كتل</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                استخدم لوحة العناصر على اليمين لإضافة كتل جديدة إلى المسودة
              </p>
              {onInsertBlockAtIndex && (
                <button
                  type="button"
                  onClick={() => onInsertBlockAtIndex(0, null)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20"
                >
                  إضافة الكتلة الأولى
                </button>
              )}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-0 relative">
                  {blocks.map((block, index) => (
                    <SortableCanvasBlock
                      key={block.id}
                      block={block}
                      index={index}
                      parentBlock={null}
                      isSelected={selectedBlockId === block.id}
                      selectedBlockId={selectedBlockId}
                      isPreviewMode={isPreviewMode}
                      siblingsCount={blocks.length}
                      depth={0}
                      locale={locale}
                      onSelectBlock={onSelectBlock}
                      onRemoveBlock={onRemoveBlock}
                      onMoveBlockUp={onMoveBlockUp}
                      onMoveBlockDown={onMoveBlockDown}
                      onDuplicateBlock={onDuplicateBlock}
                      onInsertBlockAtIndex={onInsertBlockAtIndex}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay
                dropAnimation={{
                  sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                      active: {
                        opacity: '0.4',
                      },
                    },
                  }),
                }}
              >
                {activeDraggedBlock && activeDef ? (
                  <div className="p-4 rounded-2xl bg-slate-900 border-2 border-sky-500 shadow-2xl text-white flex items-center gap-3 w-72">
                    <GripVertical className="w-5 h-5 text-sky-400" />
                    <activeDef.icon className="w-5 h-5 text-sky-400" />
                    <span className="text-sm font-bold">{activeDef.labelAr}</span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
};
