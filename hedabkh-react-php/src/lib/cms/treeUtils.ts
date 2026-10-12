/**
 * TreeUtils: Pure, Immutable, Strongly-Typed Recursive Tree Engine
 * Visual CMS Studio — Saudi Sovereign Infrastructure Platform
 * Milestone: v1.1.0-dev (Phase 1)
 *
 * Implements deterministic recursive algorithms for Elementor-class nested block structures.
 * Zero external runtime dependencies (No React, No DOM, No @dnd-kit).
 */

import { ContentBlock } from './blockSchemas';

export const MAX_TREE_DEPTH = 6;
export const MAX_PAGE_NODES = 100;

export type TreeErrorCode =
  | 'NODE_NOT_FOUND'
  | 'PARENT_NOT_FOUND'
  | 'INVALID_CHILD'
  | 'CIRCULAR_REFERENCE'
  | 'MAX_DEPTH_EXCEEDED'
  | 'MAX_NODES_EXCEEDED'
  | 'DUPLICATE_NODE_ID'
  | 'INVALID_MOVE'
  | 'INVALID_CONTAINER';

export class TreeOperationError extends Error {
  public code: TreeErrorCode;
  public details?: Record<string, any>;

  constructor(code: TreeErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'TreeOperationError';
    this.code = code;
    this.details = details;
  }
}

export interface TreeValidationError {
  code: TreeErrorCode;
  nodeId?: string;
  message: string;
}

export interface TreeValidationResult {
  valid: boolean;
  errors: TreeValidationError[];
}

export interface TreeLookupResult {
  node: ContentBlock | null;
  parent: ContentBlock | null;
  path: ContentBlock[];
  index: number;
}

/**
 * Valid container-capable block types that are permitted to have child blocks.
 */
export const CONTAINER_CAPABLE_TYPES: ReadonlySet<string> = new Set([
  'container',
  'grid',
]);

/**
 * Centralized Tree Engine Utilities
 */
export const treeUtils = {
  /**
   * 1. findNode: Recursively locate a node by ID, returning the node, parent, ancestor path, and index.
   */
  findNode(tree: ContentBlock[], targetId: string, currentPath: ContentBlock[] = []): TreeLookupResult {
    if (!targetId || !Array.isArray(tree)) {
      return { node: null, parent: null, path: [], index: -1 };
    }

    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (!node || typeof node !== 'object') continue;

      if (node.id === targetId) {
        return {
          node,
          parent: currentPath.length > 0 ? currentPath[currentPath.length - 1] : null,
          path: [...currentPath, node],
          index: i,
        };
      }

      if (Array.isArray(node.children) && node.children.length > 0) {
        const result = this.findNode(node.children, targetId, [...currentPath, node]);
        if (result.node) {
          return result;
        }
      }
    }

    return { node: null, parent: null, path: [], index: -1 };
  },

  /**
   * 2. findParent: Returns the immediate parent node of targetId, or null if root / missing.
   */
  findParent(tree: ContentBlock[], targetId: string): ContentBlock | null {
    return this.findNode(tree, targetId).parent;
  },

  /**
   * 3. getAncestors: Returns ordered array of ancestors from root down to the immediate parent.
   */
  getAncestors(tree: ContentBlock[], targetId: string): ContentBlock[] {
    const { path } = this.findNode(tree, targetId);
    if (path.length <= 1) return [];
    return path.slice(0, path.length - 1);
  },

  /**
   * 4. getDescendants: Returns flat array of all recursive child nodes under targetId.
   */
  getDescendants(tree: ContentBlock[], targetId: string): ContentBlock[] {
    const { node } = this.findNode(tree, targetId);
    if (!node || !Array.isArray(node.children)) return [];

    const result: ContentBlock[] = [];
    const collect = (children: ContentBlock[]) => {
      for (const child of children) {
        result.push(child);
        if (Array.isArray(child.children) && child.children.length > 0) {
          collect(child.children);
        }
      }
    };

    collect(node.children);
    return result;
  },

  /**
   * 5. containsNode: Fast check if targetId exists anywhere in the tree.
   */
  containsNode(tree: ContentBlock[], targetId: string): boolean {
    return this.findNode(tree, targetId).node !== null;
  },

  /**
   * 6. countNodes: Total count of all nodes across all depths.
   */
  countNodes(tree: ContentBlock[]): number {
    if (!Array.isArray(tree)) return 0;
    let count = 0;
    for (const node of tree) {
      count++;
      if (Array.isArray(node.children) && node.children.length > 0) {
        count += this.countNodes(node.children);
      }
    }
    return count;
  },

  /**
   * 7. getNodeDepth: Returns 1-based depth of targetId (1 = root level, 2 = 1st level child, etc.).
   */
  getNodeDepth(tree: ContentBlock[], targetId: string): number {
    const { path } = this.findNode(tree, targetId);
    return path.length;
  },

  /**
   * 8. getTreeDepth: Returns the maximum depth of any branch in the tree (0 for empty tree).
   */
  getTreeDepth(tree: ContentBlock[]): number {
    if (!Array.isArray(tree) || tree.length === 0) return 0;

    let maxDepth = 0;
    const traverse = (nodes: ContentBlock[], currentDepth: number) => {
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }
      for (const node of nodes) {
        if (Array.isArray(node.children) && node.children.length > 0) {
          traverse(node.children, currentDepth + 1);
        }
      }
    };

    traverse(tree, 1);
    return maxDepth;
  },

  /**
   * 9. insertNode: Immutably insert newNode into root (targetParentId === null) or into a target container.
   */
  insertNode(
    tree: ContentBlock[],
    newNode: ContentBlock,
    targetParentId: string | null = null,
    targetIndex?: number
  ): ContentBlock[] {
    if (!newNode || !newNode.id) {
      throw new TreeOperationError('INVALID_CHILD', 'Cannot insert empty or invalid node');
    }

    if (this.containsNode(tree, newNode.id)) {
      throw new TreeOperationError('DUPLICATE_NODE_ID', `Node with ID ${newNode.id} already exists in tree`, {
        nodeId: newNode.id,
      });
    }

    const currentTotal = this.countNodes(tree);
    const incomingCount = 1 + (Array.isArray(newNode.children) ? this.countNodes(newNode.children) : 0);
    if (currentTotal + incomingCount > MAX_PAGE_NODES) {
      throw new TreeOperationError(
        'MAX_NODES_EXCEEDED',
        `Insertion would exceed MAX_PAGE_NODES limit (${currentTotal + incomingCount} > ${MAX_PAGE_NODES})`
      );
    }

    // A. Insert at Root Level
    if (targetParentId === null) {
      const incomingSubtreeDepth = this.getTreeDepth([newNode]);
      if (incomingSubtreeDepth > MAX_TREE_DEPTH) {
        throw new TreeOperationError('MAX_DEPTH_EXCEEDED', `Subtree depth exceeds MAX_TREE_DEPTH (${MAX_TREE_DEPTH})`);
      }

      const nextTree = [...tree];
      const idx = targetIndex !== undefined && targetIndex >= 0 && targetIndex <= nextTree.length ? targetIndex : nextTree.length;
      nextTree.splice(idx, 0, newNode);
      return nextTree;
    }

    // B. Insert inside Target Container
    const parentLookup = this.findNode(tree, targetParentId);
    if (!parentLookup.node) {
      throw new TreeOperationError('PARENT_NOT_FOUND', `Target parent container ${targetParentId} not found`);
    }

    const parentNode = parentLookup.node;
    if (!CONTAINER_CAPABLE_TYPES.has(parentNode.type)) {
      throw new TreeOperationError(
        'INVALID_CONTAINER',
        `Block type "${parentNode.type}" is a leaf block and cannot contain child blocks`,
        { parentId: targetParentId, parentType: parentNode.type }
      );
    }

    const parentDepth = parentLookup.path.length;
    const incomingSubtreeDepth = this.getTreeDepth([newNode]);
    if (parentDepth + incomingSubtreeDepth > MAX_TREE_DEPTH) {
      throw new TreeOperationError(
        'MAX_DEPTH_EXCEEDED',
        `Insertion at depth ${parentDepth} with subtree depth ${incomingSubtreeDepth} exceeds MAX_TREE_DEPTH (${MAX_TREE_DEPTH})`
      );
    }

    return this._mapTree(tree, (node) => {
      if (node.id === targetParentId) {
        const children = Array.isArray(node.children) ? [...node.children] : [];
        const idx = targetIndex !== undefined && targetIndex >= 0 && targetIndex <= children.length ? targetIndex : children.length;
        children.splice(idx, 0, newNode);
        return {
          ...node,
          children,
          updatedAt: new Date().toISOString(),
        };
      }
      return node;
    });
  },

  /**
   * 10. removeNode: Immutably remove a node and all its descendants from the tree.
   */
  removeNode(tree: ContentBlock[], targetId: string): ContentBlock[] {
    if (!this.containsNode(tree, targetId)) {
      throw new TreeOperationError('NODE_NOT_FOUND', `Cannot remove non-existent node with ID "${targetId}"`);
    }

    return tree
      .filter((n) => n.id !== targetId)
      .map((n) => {
        if (Array.isArray(n.children)) {
          return {
            ...n,
            children: this._removeNodeFromSubtree(n.children, targetId),
          };
        }
        return n;
      });
  },

  /**
   * 11. moveNode: Immutably move a node to root or to a destination container at targetIndex.
   * Enforces circular reference protection and depth checks.
   */
  moveNode(
    tree: ContentBlock[],
    sourceId: string,
    destParentId: string | null = null,
    destIndex?: number
  ): ContentBlock[] {
    const sourceLookup = this.findNode(tree, sourceId);
    if (!sourceLookup.node) {
      throw new TreeOperationError('NODE_NOT_FOUND', `Source node "${sourceId}" not found`);
    }

    const sourceNode = sourceLookup.node;

    // Reject moving into itself
    if (destParentId === sourceId) {
      throw new TreeOperationError('CIRCULAR_REFERENCE', `Cannot move node "${sourceId}" into itself`);
    }

    // Reject moving into any of its own descendants
    const descendants = this.getDescendants(tree, sourceId);
    if (destParentId && descendants.some((d) => d.id === destParentId)) {
      throw new TreeOperationError(
        'CIRCULAR_REFERENCE',
        `Cannot move node "${sourceId}" into its descendant container "${destParentId}"`
      );
    }

    // Check destination container
    let destDepth = 0;
    if (destParentId !== null) {
      const destLookup = this.findNode(tree, destParentId);
      if (!destLookup.node) {
        throw new TreeOperationError('PARENT_NOT_FOUND', `Destination parent container "${destParentId}" not found`);
      }

      if (!CONTAINER_CAPABLE_TYPES.has(destLookup.node.type)) {
        throw new TreeOperationError(
          'INVALID_CONTAINER',
          `Destination block type "${destLookup.node.type}" cannot contain child blocks`
        );
      }

      destDepth = destLookup.path.length;
    }

    const subtreeDepth = this.getTreeDepth([sourceNode]);
    if (destDepth + subtreeDepth > MAX_TREE_DEPTH) {
      throw new TreeOperationError(
        'MAX_DEPTH_EXCEEDED',
        `Move operation would exceed MAX_TREE_DEPTH (${destDepth + subtreeDepth} > ${MAX_TREE_DEPTH})`
      );
    }

    // Step 1: Remove source from tree
    const treeWithoutSource = this.removeNode(tree, sourceId);

    // Step 2: Insert into destination
    return this.insertNode(treeWithoutSource, sourceNode, destParentId, destIndex);
  },

  /**
   * 12. duplicateNode: Immutably clone a node and all its descendants with brand-new unique IDs.
   */
  duplicateNode(tree: ContentBlock[], targetId: string): { nextTree: ContentBlock[]; newId: string } {
    const lookup = this.findNode(tree, targetId);
    if (!lookup.node) {
      throw new TreeOperationError('NODE_NOT_FOUND', `Cannot duplicate non-existent node "${targetId}"`);
    }

    const generateId = () => `blk-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;

    const deepCloneWithNewIds = (node: ContentBlock): ContentBlock => {
      const newId = generateId();
      return {
        ...node,
        id: newId,
        config: JSON.parse(JSON.stringify(node.config || {})),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: Array.isArray(node.children) ? node.children.map(deepCloneWithNewIds) : undefined,
      };
    };

    const clonedNode = deepCloneWithNewIds(lookup.node);
    const parentId = lookup.parent ? lookup.parent.id : null;
    const nextTree = this.insertNode(tree, clonedNode, parentId, lookup.index + 1);

    return {
      nextTree,
      newId: clonedNode.id,
    };
  },

  /**
   * 13. updateNode: Immutably update a target node using an updater function.
   */
  updateNode(
    tree: ContentBlock[],
    targetId: string,
    updater: (node: ContentBlock) => ContentBlock
  ): ContentBlock[] {
    if (!this.containsNode(tree, targetId)) {
      throw new TreeOperationError('NODE_NOT_FOUND', `Cannot update non-existent node "${targetId}"`);
    }

    return this._mapTree(tree, (node) => {
      if (node.id === targetId) {
        const updated = updater(node);
        return {
          ...updated,
          id: node.id, // ID must remain invariant during property update
          updatedAt: new Date().toISOString(),
        };
      }
      return node;
    });
  },

  /**
   * 14. validateTree: Comprehensive validation of tree integrity, uniqueness, depths, and limits.
   */
  validateTree(tree: ContentBlock[]): TreeValidationResult {
    const errors: TreeValidationError[] = [];
    const seenIds = new Set<string>();

    if (!Array.isArray(tree)) {
      return {
        valid: false,
        errors: [{ code: 'INVALID_CHILD', message: 'Tree must be an array of ContentBlocks' }],
      };
    }

    const totalNodes = this.countNodes(tree);
    if (totalNodes > MAX_PAGE_NODES) {
      errors.push({
        code: 'MAX_NODES_EXCEEDED',
        message: `Total node count (${totalNodes}) exceeds limit of ${MAX_PAGE_NODES}`,
      });
    }

    const validateBranch = (nodes: ContentBlock[], currentDepth: number, visitedInAncestry: Set<string>) => {
      if (currentDepth > MAX_TREE_DEPTH) {
        errors.push({
          code: 'MAX_DEPTH_EXCEEDED',
          message: `Tree depth ${currentDepth} exceeds MAX_TREE_DEPTH (${MAX_TREE_DEPTH})`,
        });
      }

      for (const node of nodes) {
        if (!node || typeof node !== 'object') {
          errors.push({ code: 'INVALID_CHILD', message: 'Found malformed non-object node in tree' });
          continue;
        }

        if (!node.id || typeof node.id !== 'string') {
          errors.push({ code: 'INVALID_CHILD', message: 'Found node without a valid string ID' });
          continue;
        }

        // Circular reference check
        if (visitedInAncestry.has(node.id)) {
          errors.push({
            code: 'CIRCULAR_REFERENCE',
            nodeId: node.id,
            message: `Circular reference detected for node ID "${node.id}"`,
          });
          continue;
        }

        // Duplicate ID check
        if (seenIds.has(node.id)) {
          errors.push({
            code: 'DUPLICATE_NODE_ID',
            nodeId: node.id,
            message: `Duplicate node ID detected: "${node.id}"`,
          });
        }
        seenIds.add(node.id);

        // Container validation: Non-container types must NOT have child blocks
        if (Array.isArray(node.children) && node.children.length > 0) {
          if (!CONTAINER_CAPABLE_TYPES.has(node.type)) {
            errors.push({
              code: 'INVALID_CONTAINER',
              nodeId: node.id,
              message: `Leaf block type "${node.type}" cannot contain child blocks`,
            });
          }

          const nextAncestry = new Set(visitedInAncestry);
          nextAncestry.add(node.id);
          validateBranch(node.children, currentDepth + 1, nextAncestry);
        } else if (node.children !== undefined && !Array.isArray(node.children)) {
          errors.push({
            code: 'INVALID_CHILD',
            nodeId: node.id,
            message: `Invalid children property on node "${node.id}" (must be array or undefined)`,
          });
        }
      }
    };

    validateBranch(tree, 1, new Set());

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Internal Helper: Recursive Tree Mapper
  _mapTree(tree: ContentBlock[], mapper: (node: ContentBlock) => ContentBlock): ContentBlock[] {
    return tree.map((node) => {
      const updated = mapper(node);
      if (Array.isArray(updated.children)) {
        return {
          ...updated,
          children: this._mapTree(updated.children, mapper),
        };
      }
      return updated;
    });
  },

  // Internal Helper: Recursive Subtree Remover
  _removeNodeFromSubtree(children: ContentBlock[], targetId: string): ContentBlock[] {
    return children
      .filter((c) => c.id !== targetId)
      .map((c) => {
        if (Array.isArray(c.children)) {
          return {
            ...c,
            children: this._removeNodeFromSubtree(c.children, targetId),
          };
        }
        return c;
      });
  },
};
