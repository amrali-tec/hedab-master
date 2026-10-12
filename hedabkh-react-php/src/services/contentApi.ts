import { apiClient } from './apiClient';
import { ContentPage, PageVersion, ContentBlock, BlockType } from '../lib/cms/blockSchemas';
import { ApiCmsPageData } from '../types/apiContracts';
import { contentEngine } from './contentEngine';

/**
 * Visual Content API Service
 * Connects directly to PHP REST API endpoints (/api/v1/content/pages/... and /api/v1/admin/cms/...)
 */
export const contentApi = {
  getPages: (): ContentPage[] => {
    return contentEngine.getPages();
  },

  getPageById: (pageId: string): ContentPage | undefined => {
    return contentEngine.getPageById(pageId);
  },

  /**
   * Fetch published version directly from PHP REST API.
   */
  getPublishedVersionAsync: async (pageId: string, locale: 'ar' | 'en' = 'ar'): Promise<PageVersion | null> => {
    try {
      const res = await apiClient.get<ApiCmsPageData>(`/content/pages/${pageId}`, { locale });
      if (res.success && res.data) {
        return {
          id: `ver-${res.data.pageId}-pub-${res.data.versionNumber}`,
          pageId: res.data.pageId,
          versionNumber: res.data.versionNumber,
          titleAr: res.data.titleAr || 'الصفحة الرئيسية',
          titleEn: res.data.titleEn || 'Home Page',
          state: 'published',
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          blocks: (res.data.blocks || []).map((b) => ({
            id: b.id,
            type: b.type as BlockType,
            sortOrder: b.sortOrder,
            isVisible: b.isVisible,
            config: b.config,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        };
      }
    } catch {
      // Fallback to embedded schema baseline if offline
    }

    return contentEngine.getPublishedVersion(pageId);
  },

  /**
   * Synchronous accessor for compatibility, backed by contentEngine fallback.
   */
  getPublishedVersion: (pageId: string): PageVersion | null => {
    return contentEngine.getPublishedVersion(pageId);
  },

  getDraftVersion: (pageId: string): PageVersion => {
    return contentEngine.getDraftVersion(pageId);
  },

  getDraftVersionAsync: async (pageId: string): Promise<PageVersion> => {
    try {
      const res = await apiClient.get<ApiCmsPageData>(`/admin/cms/pages/${pageId}`, { version: 'draft' });
      if (res.success && res.data) {
        return {
          id: `ver-${res.data.pageId}-draft-${res.data.versionNumber}`,
          pageId: res.data.pageId,
          versionNumber: res.data.versionNumber,
          titleAr: res.data.titleAr || 'مسودة الصفحة',
          titleEn: res.data.titleEn || 'Draft Page',
          state: 'draft',
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          blocks: (res.data.blocks || []).map((b) => ({
            id: b.id,
            type: b.type as BlockType,
            sortOrder: b.sortOrder,
            isVisible: b.isVisible,
            config: b.config,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        };
      }
    } catch {
      // Fallback
    }

    return contentEngine.getDraftVersion(pageId);
  },

  saveDraftAsync: async (pageId: string, blocks: ContentBlock[], changeNote?: string): Promise<PageVersion> => {
    try {
      const res = await apiClient.post<ApiCmsPageData>(`/admin/cms/pages/${pageId}/draft`, {
        blocks,
        changeNote: changeNote || 'Draft saved from Visual Builder',
      });
      if (res.success && res.data) {
        return {
          id: `ver-${res.data.pageId}-draft-${res.data.versionNumber}`,
          pageId: res.data.pageId,
          versionNumber: res.data.versionNumber,
          titleAr: res.data.titleAr || 'مسودة الصفحة',
          titleEn: res.data.titleEn || 'Draft Page',
          state: 'draft',
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          blocks: (res.data.blocks || []).map((b) => ({
            id: b.id,
            type: b.type as BlockType,
            sortOrder: b.sortOrder,
            isVisible: b.isVisible,
            config: b.config,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        };
      }
    } catch {
      // Fallback
    }

    return contentEngine.saveDraft(pageId, blocks, changeNote);
  },

  publishDraftAsync: async (pageId: string, publishNote?: string): Promise<any> => {
    try {
      const res = await apiClient.post<ApiCmsPageData>(`/admin/cms/pages/${pageId}/publish`, {
        changeNote: publishNote,
      });
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    return contentEngine.publishDraft(pageId, publishNote);
  },

  rollbackToVersionAsync: async (pageId: string, versionNumber: number): Promise<any> => {
    const res = await apiClient.post<ApiCmsPageData>(`/admin/cms/pages/${pageId}/rollback/${versionNumber}`);
    return res.success ? res.data : null;
  },

  saveDraft: (pageId: string, blocks: ContentBlock[], changeNote?: string): PageVersion => {
    contentApi.saveDraftAsync(pageId, blocks, changeNote).catch(() => {});
    return contentEngine.saveDraft(pageId, blocks, changeNote);
  },

  publishDraft: (pageId: string, publishNote?: string) => {
    contentApi.publishDraftAsync(pageId, publishNote).catch(() => {});
    return contentEngine.publishDraft(pageId, publishNote);
  },

  rollbackToVersion: (pageId: string, versionId: string) => {
    return contentEngine.rollbackToVersion(pageId, versionId);
  },

  getPageHistory: (pageId: string): PageVersion[] => {
    return contentEngine.getPageHistory(pageId);
  },

  addBlockToDraft: (pageId: string, blockType: BlockType): ContentBlock => {
    return contentEngine.addBlockToDraft(pageId, blockType);
  },

  updateBlockInDraft: (pageId: string, blockId: string, configUpdates: Record<string, any>): ContentBlock | null => {
    return contentEngine.updateBlockInDraft(pageId, blockId, configUpdates);
  },

  removeBlockFromDraft: (pageId: string, blockId: string): boolean => {
    return contentEngine.removeBlockFromDraft(pageId, blockId);
  },

  reorderBlocksInDraft: (pageId: string, startIndex: number, endIndex: number): ContentBlock[] => {
    return contentEngine.reorderBlocksInDraft(pageId, startIndex, endIndex);
  },
};
