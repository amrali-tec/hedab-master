import { ContentBlock } from './blockSchemas';

export type TransactionType =
  | 'ADD_BLOCK'
  | 'DELETE_BLOCK'
  | 'DUPLICATE_BLOCK'
  | 'MOVE_BLOCK'
  | 'UPDATE_BLOCK'
  | 'TOGGLE_VISIBILITY'
  | 'UPDATE_BLOCK_STYLE'
  | 'UPDATE_BLOCK_MEDIA';

export interface BlockTransaction {
  id: string;
  type: TransactionType;
  timestamp: number;
  descriptionAr: string;
  descriptionEn: string;
  pageId: string;
  blockId?: string;
  propertyKey?: string;
  previousBlocks: ContentBlock[];
  nextBlocks: ContentBlock[];
  previousSelectedId?: string | null;
  nextSelectedId?: string | null;
}

export interface PageHistory {
  undoStack: BlockTransaction[];
  redoStack: BlockTransaction[];
}

export const DEFAULT_MAX_HISTORY = 50;
export const DEFAULT_DEBOUNCE_MS = 500;

/**
 * TransactionManager
 * Manages scoped undo/redo stacks per pageId with debounce grouping for continuous input.
 */
export class TransactionManager {
  private historyMap: Map<string, PageHistory> = new Map();
  private maxHistory: number;
  private debounceMs: number;
  private pendingDebounceTimer: NodeJS.Timeout | null = null;
  private pendingTransaction: BlockTransaction | null = null;

  constructor(maxHistory = DEFAULT_MAX_HISTORY, debounceMs = DEFAULT_DEBOUNCE_MS) {
    this.maxHistory = maxHistory;
    this.debounceMs = debounceMs;
  }

  private getOrCreatePageHistory(pageId: string): PageHistory {
    if (!this.historyMap.has(pageId)) {
      this.historyMap.set(pageId, {
        undoStack: [],
        redoStack: [],
      });
    }
    return this.historyMap.get(pageId)!;
  }

  public getUndoCount(pageId: string): number {
    return this.getOrCreatePageHistory(pageId).undoStack.length;
  }

  public getRedoCount(pageId: string): number {
    return this.getOrCreatePageHistory(pageId).redoStack.length;
  }

  public canUndo(pageId: string): boolean {
    return this.getUndoCount(pageId) > 0 || this.pendingTransaction !== null;
  }

  public canRedo(pageId: string): boolean {
    return this.getRedoCount(pageId) > 0;
  }

  public getLatestUndoDescription(pageId: string, isAr = true): string | null {
    if (this.pendingTransaction && this.pendingTransaction.pageId === pageId) {
      return isAr ? this.pendingTransaction.descriptionAr : this.pendingTransaction.descriptionEn;
    }
    const stack = this.getOrCreatePageHistory(pageId).undoStack;
    if (stack.length === 0) return null;
    const latest = stack[stack.length - 1];
    return isAr ? latest.descriptionAr : latest.descriptionEn;
  }

  public getLatestRedoDescription(pageId: string, isAr = true): string | null {
    const stack = this.getOrCreatePageHistory(pageId).redoStack;
    if (stack.length === 0) return null;
    const latest = stack[stack.length - 1];
    return isAr ? latest.descriptionAr : latest.descriptionEn;
  }

  /**
   * Commits any pending debounced transaction immediately
   */
  public flushPending(): void {
    if (this.pendingDebounceTimer) {
      clearTimeout(this.pendingDebounceTimer);
      this.pendingDebounceTimer = null;
    }
    if (this.pendingTransaction) {
      const history = this.getOrCreatePageHistory(this.pendingTransaction.pageId);
      history.undoStack.push(this.pendingTransaction);
      if (history.undoStack.length > this.maxHistory) {
        history.undoStack.shift();
      }
      history.redoStack = []; // Clear redo on new action
      this.pendingTransaction = null;
    }
  }

  /**
   * Records a discrete transaction (Add, Delete, Duplicate, Move, Visibility)
   */
  public recordDiscreteTransaction(params: {
    pageId: string;
    type: TransactionType;
    descriptionAr: string;
    descriptionEn: string;
    previousBlocks: ContentBlock[];
    nextBlocks: ContentBlock[];
    previousSelectedId?: string | null;
    nextSelectedId?: string | null;
  }): BlockTransaction {
    this.flushPending();

    const tx: BlockTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: params.type,
      timestamp: Date.now(),
      descriptionAr: params.descriptionAr,
      descriptionEn: params.descriptionEn,
      pageId: params.pageId,
      previousBlocks: JSON.parse(JSON.stringify(params.previousBlocks)),
      nextBlocks: JSON.parse(JSON.stringify(params.nextBlocks)),
      previousSelectedId: params.previousSelectedId,
      nextSelectedId: params.nextSelectedId,
    };

    const history = this.getOrCreatePageHistory(params.pageId);
    history.undoStack.push(tx);
    if (history.undoStack.length > this.maxHistory) {
      history.undoStack.shift();
    }
    history.redoStack = []; // New mutation clears redo stack

    return tx;
  }

  /**
   * Records a debounced / continuous property update (typing, slider, style)
   */
  public recordContinuousPropertyUpdate(params: {
    pageId: string;
    blockId: string;
    propertyKey: string;
    type?: TransactionType;
    descriptionAr: string;
    descriptionEn: string;
    previousBlocks: ContentBlock[];
    nextBlocks: ContentBlock[];
    previousSelectedId?: string | null;
    nextSelectedId?: string | null;
  }): void {
    const isSameGroup =
      this.pendingTransaction &&
      this.pendingTransaction.pageId === params.pageId &&
      this.pendingTransaction.blockId === params.blockId &&
      this.pendingTransaction.propertyKey === params.propertyKey;

    if (isSameGroup && this.pendingTransaction) {
      // Update the nextBlocks target of existing pending transaction
      this.pendingTransaction.nextBlocks = JSON.parse(JSON.stringify(params.nextBlocks));
      this.pendingTransaction.nextSelectedId = params.nextSelectedId;
      this.pendingTransaction.timestamp = Date.now();
    } else {
      // Flush previous different pending transaction if any
      this.flushPending();

      this.pendingTransaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: params.type || 'UPDATE_BLOCK',
        timestamp: Date.now(),
        descriptionAr: params.descriptionAr,
        descriptionEn: params.descriptionEn,
        pageId: params.pageId,
        blockId: params.blockId,
        propertyKey: params.propertyKey,
        previousBlocks: JSON.parse(JSON.stringify(params.previousBlocks)),
        nextBlocks: JSON.parse(JSON.stringify(params.nextBlocks)),
        previousSelectedId: params.previousSelectedId,
        nextSelectedId: params.nextSelectedId,
      };
    }

    if (this.pendingDebounceTimer) {
      clearTimeout(this.pendingDebounceTimer);
    }

    this.pendingDebounceTimer = setTimeout(() => {
      this.flushPending();
    }, this.debounceMs);
  }

  /**
   * Performs an Undo operation for the given pageId
   */
  public undo(pageId: string): {
    restoredBlocks: ContentBlock[];
    restoredSelectedId?: string | null;
    transaction: BlockTransaction;
  } | null {
    this.flushPending();

    const history = this.getOrCreatePageHistory(pageId);
    if (history.undoStack.length === 0) return null;

    const tx = history.undoStack.pop()!;
    history.redoStack.push(tx);

    return {
      restoredBlocks: JSON.parse(JSON.stringify(tx.previousBlocks)),
      restoredSelectedId: tx.previousSelectedId,
      transaction: tx,
    };
  }

  /**
   * Performs a Redo operation for the given pageId
   */
  public redo(pageId: string): {
    restoredBlocks: ContentBlock[];
    restoredSelectedId?: string | null;
    transaction: BlockTransaction;
  } | null {
    this.flushPending();

    const history = this.getOrCreatePageHistory(pageId);
    if (history.redoStack.length === 0) return null;

    const tx = history.redoStack.pop()!;
    history.undoStack.push(tx);

    return {
      restoredBlocks: JSON.parse(JSON.stringify(tx.nextBlocks)),
      restoredSelectedId: tx.nextSelectedId,
      transaction: tx,
    };
  }

  /**
   * Resets or clears history for a specific page (e.g. upon draft reload or explicit reset)
   */
  public clearPageHistory(pageId: string): void {
    if (this.pendingTransaction && this.pendingTransaction.pageId === pageId) {
      if (this.pendingDebounceTimer) clearTimeout(this.pendingDebounceTimer);
      this.pendingTransaction = null;
      this.pendingDebounceTimer = null;
    }
    this.historyMap.set(pageId, {
      undoStack: [],
      redoStack: [],
    });
  }
}

// Global singleton instance for app-wide transaction coordination
export const transactionManager = new TransactionManager();
