import { apiClient, getApiBaseUrl } from './apiClient';
import { MediaItem } from '../types';
import { storageAdapter } from './storageAdapter';

export const mediaApi = {
  getMediaItems: async (): Promise<MediaItem[]> => {
    try {
      const res = await apiClient.get<MediaItem[]>('/admin/media');
      if (res.success && res.data) {
        return res.data;
      }
    } catch {}
    return storageAdapter.getMediaItems();
  },

  saveMediaItem: async (item: MediaItem): Promise<MediaItem> => {
    return storageAdapter.saveMediaItem(item);
  },

  deleteMediaItem: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/media/${id}`);
    } catch {}
    storageAdapter.deleteMediaItem(id);
  },

  uploadFile: async (file: File, category: string = 'general'): Promise<{ success: boolean; url?: string; item?: MediaItem; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const baseUrl = getApiBaseUrl();
      const uploadUrl = baseUrl.endsWith('/api/v1')
        ? `${baseUrl}/admin/media/upload`
        : `${baseUrl}/api/v1/admin/media/upload`;

      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success && data.data) {
        const item: MediaItem = {
          id: data.data.id || `media-${Date.now()}`,
          name: data.data.name || file.name,
          url: data.data.url || data.data.file_path,
          type: data.data.type || (file.type.startsWith('image/') ? 'image' : 'document'),
          category: data.data.category || category,
          uploadedAt: data.data.created_at || new Date().toISOString(),
          sizeBytes: data.data.size || file.size,
          width: data.data.width || undefined,
          height: data.data.height || undefined,
        };
        return { success: true, url: item.url, item };
      }
      return { success: false, error: data.error?.message || data.error || 'Upload failed' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error during upload';
      return { success: false, error: msg };
    }
  },
};
