'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Check,
  X,
  Search,
  AlertCircle,
  RefreshCw,
  FileText,
  Video,
  Folder,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import MediaDropzone from '../MediaDropzone';
import { storageAdapter } from '../../../services/storageAdapter';
import { handleImageError } from '../../../lib/imageFallback';

export interface UnifiedMediaItem {
  id: string;
  name: string;
  url: string;
  type?: 'image' | 'document' | 'video' | 'pdf' | 'badge';
  source?: 'project' | 'upload' | 'preset' | 'document';
  sizeBytes?: number;
  uploadedAt?: string;
  relativePath?: string;
}

interface UnifiedMediaPickerModalProps {
  isOpen: boolean;
  onSelect: (url: string) => void;
  onClose: () => void;
  title?: string;
}

// Built-in offline fallback preset catalog
const STATIC_PRESET_IMAGES: UnifiedMediaItem[] = [
  { id: 'p-1', url: '/logo-light.png', name: 'شعار هضاب الخليج (الفاتح)', type: 'image', source: 'project' },
  { id: 'p-2', url: '/logo-dark.png', name: 'شعار هضاب الخليج (الداكن)', type: 'image', source: 'project' },
  { id: 'p-3', url: '/images/vision-2030.jpg', name: 'رؤية المملكة 2030', type: 'image', source: 'project' },
  { id: 'p-4', url: '/images/chairman.jpg', name: 'صورة رئيس مجلس الإدارة', type: 'image', source: 'project' },
  { id: 'p-5', url: '/images/projects/project-1.jpg', name: 'مشروع صيانة الطرق والأسفلت', type: 'image', source: 'project' },
  { id: 'p-6', url: '/images/projects/project-2.jpg', name: 'مشروع الجسور والأنفاق', type: 'image', source: 'project' },
  { id: 'p-7', url: '/images/projects/project-3.jpg', name: 'مشروع تصريف السيول', type: 'image', source: 'project' },
  { id: 'p-8', url: '/images/equipment/caterpillar-excavator.jpg', name: 'حفار كاتربيلر ثقيل', type: 'image', source: 'project' },
  { id: 'p-9', url: '/images/equipment/dynapac-road-roller.jpg', name: 'مدحلة أسفلت دينAPAC', type: 'image', source: 'project' },
  { id: 'p-10', url: '/gulf-hills-profile.pdf', name: 'الملف التعريفي للشركة (PDF)', type: 'pdf', source: 'document' },
];

export const UnifiedMediaPickerModal: React.FC<UnifiedMediaPickerModalProps> = ({
  isOpen,
  onSelect,
  onClose,
  title = 'مكتبة وسائط وأصول المشروع الموحدة',
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [filterSource, setFilterSource] = useState<'all' | 'image' | 'upload' | 'project' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [mediaList, setMediaList] = useState<UnifiedMediaItem[]>(STATIC_PRESET_IMAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch discovered media from /api/admin/media & storageAdapter
  const fetchDiscoveredMedia = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch from server discovery API
      const res = await fetch('/api/admin/media');
      let serverItems: UnifiedMediaItem[] = [];
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          serverItems = data.items;
        }
      }

      // 2. Fetch from client storageAdapter for any un-persisted dynamic uploads
      const clientMedia = storageAdapter.getMediaItems().map((m) => ({
        id: m.id,
        name: m.name,
        url: m.url,
        type: m.type as 'image' | 'document' | 'pdf',
        source: 'upload' as const,
        sizeBytes: m.sizeBytes,
        uploadedAt: m.uploadedAt,
      }));

      // 3. Deduplicate strictly by canonical URL
      const combined = [...serverItems, ...clientMedia, ...STATIC_PRESET_IMAGES];
      const seen = new Set<string>();
      const deduped: UnifiedMediaItem[] = [];

      for (const item of combined) {
        const key = item.url.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(item);
        }
      }

      setMediaList(deduped);
    } catch {
      // Fallback gracefully to storageAdapter + presets
      const clientMedia = storageAdapter.getMediaItems().map((m) => ({
        id: m.id,
        name: m.name,
        url: m.url,
        type: m.type as 'image' | 'document' | 'pdf',
        source: 'upload' as const,
      }));
      setMediaList([...STATIC_PRESET_IMAGES, ...clientMedia]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchDiscoveredMedia();
    }
  }, [isOpen, fetchDiscoveredMedia]);

  const filteredAssets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mediaList.filter((item) => {
      // Search filter
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        (item.relativePath && item.relativePath.toLowerCase().includes(q));

      // Source/Type filter
      let matchesFilter = true;
      if (filterSource === 'image') {
        matchesFilter = item.type === 'image' || (!item.type && !item.url.endsWith('.pdf'));
      } else if (filterSource === 'upload') {
        matchesFilter = item.source === 'upload' || item.url.startsWith('/uploads');
      } else if (filterSource === 'project') {
        matchesFilter = item.source === 'project' || item.url.startsWith('/images') || item.url.startsWith('/logo');
      } else if (filterSource === 'document') {
        matchesFilter = item.type === 'pdf' || item.type === 'document' || item.url.endsWith('.pdf');
      }

      return matchesSearch && matchesFilter;
    });
  }, [mediaList, searchQuery, filterSource]);

  const handleUploadSuccess = (newUrl: string) => {
    // Add newly uploaded item to storageAdapter
    storageAdapter.saveMediaItem({
      name: newUrl.split('/').pop() || 'ملف مرفوع جديد',
      url: newUrl,
      type: newUrl.endsWith('.pdf') ? 'pdf' : 'image',
      category: 'uploads',
    });

    setSelectedUrl(newUrl);
    fetchDiscoveredMedia();
    setActiveTab('library');
  };

  const handleConfirmSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-slate-950 flex flex-col max-h-[90vh] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {mediaList.length} ملف
                </span>
              </h3>
              <p className="text-xs text-slate-400">اختر من وسائط وأصول المشروع المكتشفة أو ارفع ملفاً جديداً</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchDiscoveredMedia}
              type="button"
              disabled={isLoading}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="تحديث قائمة الوسائط"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              type="button"
              className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex items-center gap-2 mb-3 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'library'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>مكتبة الأصول المكتشفة ({mediaList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع ملف جديد إلى السيرفر</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto min-h-[300px] pr-1">
          {activeTab === 'library' ? (
            <div className="space-y-3">
              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم أو المسار..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-9 pl-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50"
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

                {/* Source Filter Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                  {[
                    { id: 'all' as const, label: 'الكل' },
                    { id: 'image' as const, label: 'الصور' },
                    { id: 'project' as const, label: 'أصول المشروع' },
                    { id: 'upload' as const, label: 'المرفوعات' },
                    { id: 'document' as const, label: 'المستندات' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setFilterSource(filter.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        filterSource === filter.id
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Grid */}
              {isLoading ? (
                <div className="text-center py-16 text-slate-400 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
                  <p className="text-xs">جاري فحص واكتشاف أصول المشروع...</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="font-semibold text-slate-400">لا توجد ملفات وسائط مطابقة</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {searchQuery ? 'جرّب تغيير عبارة البحث أو التصفية' : 'يمكنك رفع ملف جديد من تبويب "رفع ملف جديد"'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {filteredAssets.map((asset) => {
                    const isSelected = selectedUrl === asset.url;
                    const isPdf = asset.type === 'pdf' || asset.url.endsWith('.pdf');

                    return (
                      <div
                        key={asset.id + asset.url}
                        onClick={() => setSelectedUrl(asset.url)}
                        onDoubleClick={() => {
                          setSelectedUrl(asset.url);
                          onSelect(asset.url);
                          onClose();
                        }}
                        className={`group relative rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer overflow-hidden ${
                          isSelected
                            ? 'bg-sky-500/10 border-sky-500 shadow-md shadow-sky-500/20 ring-1 ring-sky-500'
                            : 'bg-slate-950/70 border-slate-800/90 hover:border-sky-500/50 hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Thumbnail Container */}
                        <div className="w-full h-24 rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center relative mb-1.5 border border-slate-800/60">
                          {isPdf ? (
                            <div className="flex flex-col items-center justify-center text-rose-400 gap-1">
                              <FileText className="w-8 h-8" />
                              <span className="text-[9px] font-mono font-bold uppercase">PDF</span>
                            </div>
                          ) : (
                            <img
                              src={asset.url}
                              alt={asset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={handleImageError}
                            />
                          )}

                          {/* Source Badge */}
                          <div className="absolute top-1 right-1">
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm ${
                                asset.source === 'upload'
                                  ? 'bg-emerald-500/90 text-white'
                                  : isPdf
                                  ? 'bg-rose-500/90 text-white'
                                  : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {asset.source === 'upload' ? 'مرفوع' : isPdf ? 'مستند' : 'أصل مشروع'}
                            </span>
                          </div>

                          {/* Selected Checkmark */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-sky-500/30 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Title & Path Details */}
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-white" title={asset.name}>
                            {asset.name}
                          </p>
                          <p className="text-[9px] font-mono text-slate-500 truncate" title={asset.url}>
                            {asset.url}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Upload Tab */
            <div className="p-2 space-y-4">
              <MediaDropzone onChange={handleUploadSuccess} />
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>الصيغ المدعومة:</span>
                </p>
                <p className="text-[11px]">الصور: JPG, PNG, WEBP, SVG, GIF, AVIF (حتى 10MB) | المستندات: PDF</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-800 mt-3.5 shrink-0">
          <div className="text-xs text-slate-400 truncate max-w-[50%]">
            {selectedUrl ? (
              <span className="text-sky-300 font-mono text-[11px] truncate block">
                الملف المحدد: {selectedUrl}
              </span>
            ) : (
              <span>انقر لاختيار ملف من القائمة</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleConfirmSelect}
              disabled={!selectedUrl}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-sky-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              تأكيد الاختيار
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedMediaPickerModal;
