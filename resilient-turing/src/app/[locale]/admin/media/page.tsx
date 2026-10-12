"use client";

import React, { use, useState, useEffect, useMemo } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { storageAdapter } from '../../../../services/storageAdapter';
import { handleImageError } from '../../../../lib/imageFallback';
import { MediaItem } from '../../../../types';
import MediaDropzone from '../../../../components/admin/MediaDropzone';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';

interface MediaAdminProps {
  params: Promise<{ locale: string }>;
}

export default function MediaAdminPage({ params }: MediaAdminProps) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  const isAr = locale === 'ar';

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal & Notification state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Form State for new media item
  const [nameInput, setNameInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('general');
  const [typeInput, setTypeInput] = useState<'image' | 'pdf' | 'document' | 'badge'>('image');
  const [altArInput, setAltArInput] = useState('');
  const [altEnInput, setAltEnInput] = useState('');

  const loadMedia = () => {
    setMediaList(storageAdapter.getMediaItems());
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.altAr && item.altAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.altEn && item.altEn.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;

      return matchesSearch && matchesCat && matchesType;
    });
  }, [mediaList, searchQuery, categoryFilter, typeFilter]);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showNotification(isAr ? 'تم نسخ رابط الوسائط للحافظة!' : 'Media URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) {
      showNotification(isAr ? 'يرجى تحديد أو رفع رابط الملف أولاً' : 'Please provide or upload a file URL first', 'info');
      return;
    }

    storageAdapter.saveMediaItem({
      name: nameInput || (isAr ? 'ملف وسائط جديد' : 'New Media Asset'),
      url: urlInput,
      category: categoryInput,
      type: typeInput,
      altAr: altArInput,
      altEn: altEnInput,
    });

    loadMedia();
    setIsAddModalOpen(false);
    setNameInput('');
    setUrlInput('');
    setAltArInput('');
    setAltEnInput('');
    showNotification(isAr ? 'تم حفظ وإضافة الوسائط إلى المكتبة بنجاح!' : 'Media asset added to library successfully!');
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    storageAdapter.deleteMediaItem(deleteTarget.id);
    loadMedia();
    setDeleteTarget(null);
    showNotification(isAr ? 'تم حذف الملف من المكتبة بنجاح!' : 'Media asset deleted successfully!');
  };

  return (
    <div className="space-y-8 pb-16 text-start">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#002060] via-[#004080] to-[#0070BA] text-white shadow-xl shadow-sky-950/20 border border-sky-600/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isAr ? 'إدارة الأصول والملفات الرقمية' : 'Digital Assets & Media Manager'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {isAr ? 'مكتبة الوسائط المركزية' : 'Central Media & Asset Library'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
            {isAr
              ? 'رفع وإدارة واستعراض كافة صور المشاريع، الشعارات، الشهادات، وملفات البروفايل (PDF) ونسخ روابطها لاستخدامها في كافة المحررات.'
              : 'Upload, manage, and retrieve project photos, brand logos, PDF brochures, and certificates across all CMS sections.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-white text-[#002060] hover:bg-sky-50 text-xs font-black transition-all flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'رفع ملف / وسائط جديدة' : 'Upload New Media'}</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-sky-50 dark:bg-sky-950/40 border border-sky-500/30 text-sky-700 dark:text-sky-300'
          }`}
        >
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالاسم أو الرابط...' : 'Search by name or URL...'}
            className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">{isAr ? 'كافة التصنيفات' : 'All Categories'}</option>
            <option value="branding">{isAr ? 'الهوية والشعارات' : 'Branding & Logos'}</option>
            <option value="projects">{isAr ? 'صور المشاريع' : 'Project Photos'}</option>
            <option value="documents">{isAr ? 'المستندات والبروفايل' : 'Documents & PDFs'}</option>
            <option value="general">{isAr ? 'وسائط عامة' : 'General Media'}</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">{isAr ? 'كافة الأنواع' : 'All Types'}</option>
            <option value="image">{isAr ? 'صور (Images)' : 'Images'}</option>
            <option value="pdf">{isAr ? 'ملفات PDF' : 'PDFs'}</option>
            <option value="badge">{isAr ? 'شارات واعتمادات' : 'Badges'}</option>
          </select>
        </div>
      </div>

      {/* Media Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.map((item) => {
          const isPdf = item.type === 'pdf' || item.url.endsWith('.pdf');
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="group p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-3"
            >
              {/* Media Preview Box */}
              <div className="relative h-40 w-full rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 overflow-hidden flex items-center justify-center">
                {isPdf ? (
                  <div className="flex flex-col items-center justify-center text-rose-500 space-y-2">
                    <FileText className="w-12 h-12" />
                    <span className="text-[11px] font-bold font-mono uppercase bg-rose-500/10 px-2 py-0.5 rounded-md">
                      PDF DOCUMENT
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                  />
                )}

                {/* Category Badge on top */}
                <span className="absolute top-2.5 start-2.5 px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                  {item.category || 'general'}
                </span>
              </div>

              {/* Media Details */}
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-400 truncate select-all">
                  {item.url}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950 hover:text-sky-600 dark:hover:text-sky-400'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy URL')}</span>
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-sky-500 flex items-center justify-center transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setDeleteTarget(item)}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMedia.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            {isAr ? 'لم يتم العثور على وسائط مطابقة' : 'No matching media assets found'}
          </h3>
          <p className="text-xs text-slate-500">
            {isAr ? 'يمكنك رفع صور وملفات جديدة للبدء في استخدامها.' : 'You can upload new photos or documents to start.'}
          </p>
        </div>
      )}

      {/* Upload / Add Media Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={isAr ? 'رفع وإضافة وسائط جديدة' : 'Upload New Media Asset'}
        subtitle={isAr ? 'حدد الملف وقم بتعيين التصنيف والاسم المناسب' : 'Select asset file and specify name & category'}
      >
        <form onSubmit={handleSaveMedia} className="space-y-5 text-start">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              {isAr ? 'الملف / الصورة المراد رفعها' : 'Media Asset File'}
            </label>
            <MediaDropzone
              value={urlInput}
              onChange={setUrlInput}
              label={isAr ? 'اسحب الصورة أو الملف هنا أو اختر رابطاً' : 'Drop photo/file here or enter URL'}
              helperText={isAr ? 'يدعم صور JPG, PNG, WebP ومستندات PDF' : 'Supports JPG, PNG, WebP and PDF'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isAr ? 'اسم الملف / العنوان' : 'Asset Name'}
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={isAr ? 'مثال: صورة مشروع كشط الأسفلت' : 'e.g. Road milling photo'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isAr ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="projects">{isAr ? 'مشاريع (Projects)' : 'Projects'}</option>
                <option value="branding">{isAr ? 'هوية وشعارات (Branding)' : 'Branding'}</option>
                <option value="documents">{isAr ? 'مستندات وبروفايل (Documents)' : 'Documents'}</option>
                <option value="general">{isAr ? 'عام (General)' : 'General'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isAr ? 'النص البديل (عربي)' : 'Alt Text (Arabic)'}
              </label>
              <input
                type="text"
                value={altArInput}
                onChange={(e) => setAltArInput(e.target.value)}
                placeholder={isAr ? 'وصف مختصر للصورة لمحركات البحث' : 'Brief description for SEO'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {isAr ? 'النص البديل (إنجليزي)' : 'Alt Text (English)'}
              </label>
              <input
                type="text"
                value={altEnInput}
                onChange={(e) => setAltEnInput(e.target.value)}
                placeholder="Brief English alt description for SEO"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              {isAr ? 'حفظ وإضافة للمكتبة' : 'Save to Library'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={isAr ? 'حذف ملف الوسائط' : 'Delete Media Asset'}
        message={
          isAr
            ? `هل أنت متأكد من حذف الملف "${deleteTarget?.name}" من مكتبة الوسائط؟`
            : `Are you sure you want to delete "${deleteTarget?.name}" from media library?`
        }
      />
    </div>
  );
}
