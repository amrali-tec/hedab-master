'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ContentBlock, PageVersion, BlockType, ContentPage } from '../../../lib/cms/blockSchemas';
import { BLOCK_REGISTRY } from '../../../lib/cms/blockRegistry';
import { contentEngine } from '../../../services/contentEngine';
import { contentApi } from '../../../services/contentApi';
import { transactionManager } from '../../../lib/cms/transactionManager';
import { treeUtils } from '../../../lib/cms/treeUtils';
import { PublishingBar } from './PublishingBar';
import { PageTree } from './PageTree';
import { BlockLibrary } from './BlockLibrary';
import { InspectorPanel } from './InspectorPanel';
import { EditorCanvas } from './EditorCanvas';
import {
  Sparkles,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Sliders,
} from 'lucide-react';

interface VisualEditorShellProps {
  pageId?: string;
  locale?: 'ar' | 'en';
}

export const VisualEditorShell: React.FC<VisualEditorShellProps> = ({
  pageId: initialPageId = 'page-home',
  locale = 'ar',
}) => {
  const [currentPageId, setCurrentPageId] = useState<string>(initialPageId);
  const [allPages, setAllPages] = useState<ContentPage[]>([]);
  const [activeDraft, setActiveDraft] = useState<PageVersion | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isBlockLibraryModalOpen, setIsBlockLibraryModalOpen] = useState(false);
  const [insertTargetIndex, setInsertTargetIndex] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [historyVersions, setHistoryVersions] = useState<PageVersion[]>([]);

  // Studio UI Layout State
  const [leftSidebarTab, setLeftSidebarTab] = useState<'elements' | 'structure'>('elements');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState<number>(100);
  const [isLeftDockOpen, setIsLeftDockOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Undo/Redo State
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [undoTooltip, setUndoTooltip] = useState<string | null>(null);
  const [redoTooltip, setRedoTooltip] = useState<string | null>(null);

  const isAr = locale === 'ar';

  const updateHistoryState = useCallback(() => {
    setCanUndo(transactionManager.canUndo(currentPageId));
    setCanRedo(transactionManager.canRedo(currentPageId));
    setUndoTooltip(transactionManager.getLatestUndoDescription(currentPageId, isAr));
    setRedoTooltip(transactionManager.getLatestRedoDescription(currentPageId, isAr));
  }, [currentPageId, isAr]);

  // Load all pages
  useEffect(() => {
    setAllPages(contentEngine.getPages());
  }, []);

  // Load initial draft from ContentEngine when page changes
  useEffect(() => {
    const draft = contentEngine.getDraftVersion(currentPageId);
    setActiveDraft(draft);
    setBlocks(draft.blocks || []);
    if (draft.blocks && draft.blocks.length > 0) {
      setSelectedBlockId(draft.blocks[0].id);
    }
    setHistoryVersions(contentEngine.getPageHistory(currentPageId));
    setIsDirty(false);
    updateHistoryState();
  }, [currentPageId, updateHistoryState]);

  // Handle saving draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      transactionManager.flushPending();
      const updatedDraft = contentEngine.saveDraft(currentPageId, blocks, 'حفظ مسودة يدوية');
      await contentApi.saveDraftAsync(currentPageId, blocks, 'حفظ مسودة يدوية');
      setActiveDraft(updatedDraft);
      setIsDirty(false);
      setLastSavedAt(new Date().toLocaleTimeString(isAr ? 'ar-SA' : 'en-US'));
      updateHistoryState();
    } catch (err) {
      console.error('Error saving draft:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle publishing version
  const handlePublish = async (note?: string) => {
    setIsPublishing(true);
    try {
      transactionManager.flushPending();
      contentEngine.saveDraft(currentPageId, blocks);
      await contentApi.saveDraftAsync(currentPageId, blocks);
      const res = contentEngine.publishDraft(currentPageId, note);
      await contentApi.publishDraftAsync(currentPageId, note);
      if (res.success) {
        setIsDirty(false);
        setLastSavedAt(new Date().toLocaleTimeString(isAr ? 'ar-SA' : 'en-US'));
        setHistoryVersions(contentEngine.getPageHistory(currentPageId));
        updateHistoryState();
      }
    } catch (err) {
      console.error('Error publishing:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle rollback
  const handleRollback = async (versionId: string) => {
    try {
      transactionManager.flushPending();
      const res = contentEngine.rollbackToVersion(currentPageId, versionId);
      const verNum = parseInt(versionId.replace(/\D/g, '')) || 1;
      await contentApi.rollbackToVersionAsync(currentPageId, verNum);
      if (res.success) {
        const refreshedDraft = contentEngine.getDraftVersion(currentPageId);
        setActiveDraft(refreshedDraft);
        setBlocks(refreshedDraft.blocks);
        if (refreshedDraft.blocks.length > 0) {
          setSelectedBlockId(refreshedDraft.blocks[0].id);
        }
        setIsDirty(false);
        setHistoryVersions(contentEngine.getPageHistory(currentPageId));
        transactionManager.clearPageHistory(currentPageId);
        updateHistoryState();
      }
    } catch (err) {
      console.error('Error in rollback:', err);
    }
  };

  // Undo & Redo Handlers
  const handleUndo = useCallback(() => {
    const result = transactionManager.undo(currentPageId);
    if (result) {
      setBlocks(result.restoredBlocks);
      if (result.restoredSelectedId !== undefined) {
        setSelectedBlockId(result.restoredSelectedId);
      }
      setIsDirty(true);
      updateHistoryState();
    }
  }, [currentPageId, updateHistoryState]);

  const handleRedo = useCallback(() => {
    const result = transactionManager.redo(currentPageId);
    if (result) {
      setBlocks(result.restoredBlocks);
      if (result.restoredSelectedId !== undefined) {
        setSelectedBlockId(result.restoredSelectedId);
      }
      setIsDirty(true);
      updateHistoryState();
    }
  }, [currentPageId, updateHistoryState]);

  // Global Keyboard Shortcuts (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      if (e.key === 'z' || e.key === 'Z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSaveDraft();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Add block to draft
  const handleAddBlockType = (type: BlockType) => {
    const previousBlocks = [...blocks];
    const newBlock = contentEngine.addBlockToDraft(currentPageId, type);
    let nextBlocks = [...blocks];

    if (insertTargetIndex !== null && insertTargetIndex < blocks.length) {
      nextBlocks.splice(insertTargetIndex, 0, newBlock);
    } else {
      nextBlocks = contentEngine.getDraftVersion(currentPageId).blocks;
    }

    const blockDef = BLOCK_REGISTRY[type];
    transactionManager.recordDiscreteTransaction({
      pageId: currentPageId,
      type: 'ADD_BLOCK',
      descriptionAr: `إضافة كتلة ${blockDef?.labelAr || type}`,
      descriptionEn: `Add ${blockDef?.labelEn || type} Block`,
      previousBlocks,
      nextBlocks,
      previousSelectedId: selectedBlockId,
      nextSelectedId: newBlock.id,
    });

    setBlocks(nextBlocks);
    setSelectedBlockId(newBlock.id);
    setInsertTargetIndex(null);
    setIsBlockLibraryModalOpen(false);
    setIsDirty(true);
    updateHistoryState();
  };

  // Add layout preset (Grid / Flex Layout Preset transaction-safe)
  const handleSelectLayoutPreset = (presetId: '50-50' | '33-33-33' | '25-75' | '75-25' | '25-50-25') => {
    const previousBlocks = [...blocks];
    const newId = `grid-preset-${Date.now()}`;
    const cols = presetId === '33-33-33' || presetId === '25-50-25' ? 3 : 2;

    const newGridBlock: ContentBlock = {
      id: newId,
      type: 'grid',
      sortOrder: blocks.length,
      isVisible: true,
      config: {
        columnsDesktop: cols,
        columnsTablet: Math.min(cols, 2),
        columnsMobile: 1,
        columnGap: 16,
        rowGap: 16,
        theme: 'dark',
        padding: 'normal',
      },
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextBlocks = treeUtils.insertNode(
      blocks,
      newGridBlock,
      null,
      insertTargetIndex !== null ? insertTargetIndex : undefined
    );

    transactionManager.recordDiscreteTransaction({
      pageId: currentPageId,
      type: 'ADD_BLOCK',
      descriptionAr: `إضافة قالب تخطيط ${presetId}`,
      descriptionEn: `Add Layout Preset ${presetId}`,
      previousBlocks,
      nextBlocks,
      previousSelectedId: selectedBlockId,
      nextSelectedId: newId,
    });

    setBlocks(nextBlocks);
    setSelectedBlockId(newId);
    setInsertTargetIndex(null);
    setIsBlockLibraryModalOpen(false);
    setIsDirty(true);
    updateHistoryState();
  };

  // Duplicate block (Deep recursive duplication)
  const handleDuplicateBlock = (blockId: string) => {
    const { node: target } = treeUtils.findNode(blocks, blockId);
    if (!target) return;

    const previousBlocks = [...blocks];
    const { nextTree, newId } = treeUtils.duplicateNode(blocks, blockId);

    const blockDef = BLOCK_REGISTRY[target.type] || { labelAr: target.type, labelEn: target.type };
    transactionManager.recordDiscreteTransaction({
      pageId: currentPageId,
      type: 'DUPLICATE_BLOCK',
      descriptionAr: `تكرار عنصر ${blockDef.labelAr || target.type}`,
      descriptionEn: `Duplicate ${blockDef.labelEn || target.type} Block`,
      previousBlocks,
      nextBlocks: nextTree,
      previousSelectedId: selectedBlockId,
      nextSelectedId: newId,
    });

    setBlocks(nextTree);
    setSelectedBlockId(newId);
    setIsDirty(true);
    updateHistoryState();
  };

  // Update block config (Debounced & Grouped across any tree depth)
  const handleUpdateBlockConfig = (blockId: string, updates: Record<string, any>) => {
    const { node: target } = treeUtils.findNode(blocks, blockId);
    if (!target) return;

    const previousBlocks = [...blocks];
    const nextBlocks = treeUtils.updateNode(blocks, blockId, (b) => ({
      ...b,
      config: {
        ...b.config,
        ...updates,
      },
      updatedAt: new Date().toISOString(),
    }));

    const blockDef = BLOCK_REGISTRY[target.type] || { labelAr: target.type, labelEn: target.type };
    const propertyKey = Object.keys(updates)[0] || 'general';

    transactionManager.recordContinuousPropertyUpdate({
      pageId: currentPageId,
      blockId,
      propertyKey,
      descriptionAr: `تعديل محتوى ${blockDef.labelAr || target.type}`,
      descriptionEn: `Update ${blockDef.labelEn || target.type}`,
      previousBlocks,
      nextBlocks,
      previousSelectedId: selectedBlockId,
      nextSelectedId: selectedBlockId,
    });

    setBlocks(nextBlocks);
    setIsDirty(true);
    updateHistoryState();
  };

  // Toggle block visibility (Recursive tree safe)
  const handleToggleVisibility = (blockId: string) => {
    const { node: target } = treeUtils.findNode(blocks, blockId);
    if (!target) return;

    const previousBlocks = [...blocks];
    const nextVisibility = !target.isVisible;
    const nextBlocks = treeUtils.updateNode(blocks, blockId, (b) => ({
      ...b,
      isVisible: nextVisibility,
      updatedAt: new Date().toISOString(),
    }));

    const blockDef = BLOCK_REGISTRY[target.type] || { labelAr: target.type, labelEn: target.type };
    transactionManager.recordDiscreteTransaction({
      pageId: currentPageId,
      type: 'TOGGLE_VISIBILITY',
      descriptionAr: `${nextVisibility ? 'إظهار' : 'إخفاء'} عنصر ${blockDef.labelAr || target.type}`,
      descriptionEn: `${nextVisibility ? 'Show' : 'Hide'} ${blockDef.labelEn || target.type} Block`,
      previousBlocks,
      nextBlocks,
      previousSelectedId: selectedBlockId,
      nextSelectedId: selectedBlockId,
    });

    setBlocks(nextBlocks);
    setIsDirty(true);
    updateHistoryState();
  };

  // Move node across multi-zone tree (Root, Containers, Grids)
  const handleMoveNode = (sourceId: string, destParentId: string | null, destIndex: number) => {
    const { node: sourceNode } = treeUtils.findNode(blocks, sourceId);
    if (!sourceNode) return;

    const previousBlocks = [...blocks];
    try {
      const nextBlocks = treeUtils.moveNode(blocks, sourceId, destParentId, destIndex);
      const blockDef = BLOCK_REGISTRY[sourceNode.type] || { labelAr: sourceNode.type, labelEn: sourceNode.type };

      transactionManager.recordDiscreteTransaction({
        pageId: currentPageId,
        type: 'MOVE_BLOCK',
        descriptionAr: `إعادة ترتيب ${blockDef.labelAr || sourceNode.type}`,
        descriptionEn: `Reorder ${blockDef.labelEn || sourceNode.type}`,
        previousBlocks,
        nextBlocks,
        previousSelectedId: selectedBlockId,
        nextSelectedId: sourceId,
      });

      setBlocks(nextBlocks);
      setIsDirty(true);
      updateHistoryState();
    } catch (err) {
      console.warn('[VisualEditorShell] Invalid tree move rejected safely:', err);
    }
  };

  // Move block up within its sibling context
  const handleMoveBlockUp = (blockId: string) => {
    const { parent, index } = treeUtils.findNode(blocks, blockId);
    if (index > 0) {
      handleMoveNode(blockId, parent ? parent.id : null, index - 1);
    }
  };

  // Move block down within its sibling context
  const handleMoveBlockDown = (blockId: string) => {
    const { parent, index } = treeUtils.findNode(blocks, blockId);
    const siblings = parent && Array.isArray(parent.children) ? parent.children : blocks;
    if (index < siblings.length - 1) {
      handleMoveNode(blockId, parent ? parent.id : null, index + 1);
    }
  };

  // Flat reorder fallback
  const handleMoveBlock = (startIndex: number, endIndex: number) => {
    if (startIndex === endIndex || startIndex >= blocks.length || endIndex >= blocks.length) return;
    const moved = blocks[startIndex];
    handleMoveNode(moved.id, null, endIndex);
  };

  // Remove block (Purges complete subtree)
  const handleRemoveBlock = (blockId: string) => {
    const { node: target } = treeUtils.findNode(blocks, blockId);
    if (!target) return;

    const previousBlocks = [...blocks];
    const nextBlocks = treeUtils.removeNode(blocks, blockId);
    const nextSelected = selectedBlockId === blockId ? (nextBlocks.length > 0 ? nextBlocks[0].id : null) : selectedBlockId;

    const blockDef = BLOCK_REGISTRY[target.type] || { labelAr: target.type, labelEn: target.type };
    transactionManager.recordDiscreteTransaction({
      pageId: currentPageId,
      type: 'DELETE_BLOCK',
      descriptionAr: `حذف عنصر ${blockDef.labelAr || target.type}`,
      descriptionEn: `Delete ${blockDef.labelEn || target.type} Block`,
      previousBlocks,
      nextBlocks,
      previousSelectedId: selectedBlockId,
      nextSelectedId: nextSelected,
    });

    setBlocks(nextBlocks);
    setSelectedBlockId(nextSelected);
    setIsDirty(true);
    updateHistoryState();
  };

  const selectedBlock = (selectedBlockId ? treeUtils.findNode(blocks, selectedBlockId).node : null) || null;
  const currentPage = allPages.find((p) => p.id === currentPageId);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white overflow-hidden rounded-none border-none">
      {/* 1. TOP STUDIO TOOLBAR */}
      <PublishingBar
        pageTitle={currentPage?.titleAr || activeDraft?.titleAr || 'الصفحة'}
        currentPageId={currentPageId}
        allPages={allPages}
        onSwitchPage={(newPageId) => setCurrentPageId(newPageId)}
        isDirty={isDirty}
        isSaving={isSaving}
        isPublishing={isPublishing}
        lastSavedAt={lastSavedAt}
        activeDraft={activeDraft}
        historyVersions={historyVersions}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onRollback={handleRollback}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        isPreviewMode={isPreviewMode}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        undoTooltip={undoTooltip}
        redoTooltip={redoTooltip}
        locale={locale}
        deviceMode={deviceMode}
        onDeviceModeChange={(mode) => setDeviceMode(mode)}
        zoom={zoom}
        onZoomChange={(newZoom) => setZoom(newZoom)}
      />

      {/* 2. MAIN STUDIO BODY: DOCKED LEFT PANEL -> CANVAS -> DOCKED RIGHT INSPECTOR */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* A. DOCKED LEFT PANEL: Elements / Structure */}
        {!isPreviewMode && isLeftDockOpen ? (
          <div className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden shrink-0 select-none shadow-xl z-20 transition-all duration-200">
            {/* Dock Tabs & Collapse Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 p-1.5 gap-1">
              <div className="flex items-center flex-1 gap-1">
                <button
                  type="button"
                  onClick={() => setLeftSidebarTab('elements')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    leftSidebarTab === 'elements'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>العناصر</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLeftSidebarTab('structure')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    leftSidebarTab === 'structure'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>الهيكل</span>
                </button>
              </div>

              {/* Collapse Left Dock Button */}
              <button
                type="button"
                onClick={() => setIsLeftDockOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="طي اللوحة الجانبية"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Dock Content Body */}
            <div className="flex-1 overflow-hidden">
              {leftSidebarTab === 'elements' ? (
                <BlockLibrary
                  isDocked={true}
                  onSelectBlockType={handleAddBlockType}
                  onSelectLayoutPreset={handleSelectLayoutPreset}
                  locale={locale}
                />
              ) : (
                <PageTree
                  blocks={blocks}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={(id) => setSelectedBlockId(id)}
                  onAddBlockClick={() => setLeftSidebarTab('elements')}
                  onMoveBlock={handleMoveBlock}
                  onMoveNode={handleMoveNode}
                  onMoveBlockUp={handleMoveBlockUp}
                  onMoveBlockDown={handleMoveBlockDown}
                  onDuplicateBlock={handleDuplicateBlock}
                  onToggleVisibility={handleToggleVisibility}
                  onRemoveBlock={handleRemoveBlock}
                  locale={locale}
                />
              )}
            </div>
          </div>
        ) : !isPreviewMode ? (
          /* Slim Icon Rail when Left Dock is Collapsed (48px) */
          <div className="w-12 bg-slate-900/90 border-l border-slate-800 flex flex-col items-center py-3 gap-2 shrink-0 select-none z-20">
            <button
              type="button"
              onClick={() => {
                setLeftSidebarTab('elements');
                setIsLeftDockOpen(true);
              }}
              className="p-2.5 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
              title="فتح العناصر (Elements)"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setLeftSidebarTab('structure');
                setIsLeftDockOpen(true);
              }}
              className="p-2.5 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
              title="فتح هيكل الصفحة (Structure)"
            >
              <Layers className="w-4 h-4" />
            </button>

            <div className="w-6 h-px bg-slate-800 my-1" />

            <button
              type="button"
              onClick={() => setIsLeftDockOpen(true)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="توسيع اللوحة الجانبية"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        ) : null}

        {/* B. CENTER CANVAS */}
        <EditorCanvas
          blocks={blocks}
          selectedBlockId={isPreviewMode ? null : selectedBlockId}
          onSelectBlock={(id) => setSelectedBlockId(id)}
          onRemoveBlock={handleRemoveBlock}
          onMoveBlockUp={handleMoveBlockUp}
          onMoveBlockDown={handleMoveBlockDown}
          onDuplicateBlock={handleDuplicateBlock}
          onInsertBlockAtIndex={(index) => {
            setInsertTargetIndex(index);
            setLeftSidebarTab('elements');
            setIsLeftDockOpen(true);
          }}
          onReorderBlocks={handleMoveBlock}
          onMoveNode={handleMoveNode}
          locale={locale}
          deviceMode={deviceMode}
          zoom={zoom}
          isPreviewMode={isPreviewMode}
        />

        {/* C. DOCKED RIGHT INSPECTOR PANEL (320px) */}
        {!isPreviewMode && isInspectorOpen ? (
          <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden shrink-0 select-none shadow-2xl z-20 transition-all duration-200">
            <InspectorPanel
              selectedBlock={selectedBlock}
              onUpdateBlockConfig={handleUpdateBlockConfig}
              onToggleVisibility={handleToggleVisibility}
              onClose={() => setIsInspectorOpen(false)}
            />
          </div>
        ) : !isPreviewMode ? (
          /* Slim Icon Rail when Inspector is Collapsed (48px) */
          <div className="w-12 bg-slate-900/90 border-r border-slate-800 flex flex-col items-center py-3 gap-2 shrink-0 select-none z-20">
            <button
              type="button"
              onClick={() => setIsInspectorOpen(true)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
              title="فتح محرر الخصائص (Inspector)"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>

      {/* Standalone In-Between Modal (Backup Trigger) */}
      {isBlockLibraryModalOpen && (
        <BlockLibrary
          isOpen={isBlockLibraryModalOpen}
          isDocked={false}
          onSelectBlockType={handleAddBlockType}
          onSelectLayoutPreset={handleSelectLayoutPreset}
          onClose={() => {
            setIsBlockLibraryModalOpen(false);
            setInsertTargetIndex(null);
          }}
          locale={locale}
        />
      )}
    </div>
  );
};
