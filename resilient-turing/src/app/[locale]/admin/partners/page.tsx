"use client";

import React, { use, useState, useEffect, useMemo } from 'react';
import {
  Handshake,
  Plus,
  Search,
  Edit2,
  Trash2,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Image as ImageIcon,
  FolderKanban,
  FileText,
  Save,
  X,
  ExternalLink,
  UploadCloud,
  FileImage,
} from 'lucide-react';
import { storageAdapter } from '../../../../services/storageAdapter';
import { PartnerItem } from '../../../../types';
import AdminModal from '../../../../components/admin/AdminModal';
import { handleImageError } from '../../../../lib/imageFallback';

interface PageProps {
  params: Promise<{ locale: 'ar' | 'en' }>;
}

export default function PartnersCMSPage({ params }: PageProps) {
  const { locale } = use(params);
  const isAr = locale === 'ar';

  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PartnerItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formCategoryAr, setFormCategoryAr] = useState('');
  const [formCategoryEn, setFormCategoryEn] = useState('');
  const [formBadgeAr, setFormBadgeAr] = useState('');
  const [formBadgeEn, setFormBadgeEn] = useState('');
  const [formProjectsCount, setFormProjectsCount] = useState<number>(5);
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [useUrlInputMode, setUseUrlInputMode] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert(isAr ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WebP)' : 'Please select a valid image file');
      return;
    }

    setAttachedFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormLogoUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadPartners = () => {
    const list = storageAdapter.getPartners();
    setPartners(list);
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingPartner(null);
    setFormNameAr('');
    setFormNameEn('');
    setFormCategoryAr('وزارة سيادية');
    setFormCategoryEn('Ministry');
    setFormBadgeAr('اعتماد رسمي شامل');
    setFormBadgeEn('Full Accreditation');
    setFormProjectsCount(10);
    setFormLogoUrl('/images/logos/balady-platform.png');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PartnerItem) => {
    setEditingPartner(item);
    setFormNameAr(item.nameAr);
    setFormNameEn(item.nameEn);
    setFormCategoryAr(item.categoryAr);
    setFormCategoryEn(item.categoryEn);
    setFormBadgeAr(item.badgeAr);
    setFormBadgeEn(item.badgeEn);
    setFormProjectsCount(item.projectsCount || 5);
    setFormLogoUrl(item.logoUrl || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr.trim()) return;

    const partnerToSave: PartnerItem = {
      id: editingPartner ? editingPartner.id : `partner-${Date.now()}`,
      nameAr: formNameAr,
      nameEn: formNameEn || formNameAr,
      categoryAr: formCategoryAr || 'جهة متعاونة',
      categoryEn: formCategoryEn || 'Partner Entity',
      badgeAr: formBadgeAr || 'اعتماد رسمي',
      badgeEn: formBadgeEn || 'Official Partner',
      projectsCount: Number(formProjectsCount) || 1,
      logoUrl: formLogoUrl || '/images/logos/balady-platform.png',
      status: 'active',
    };

    storageAdapter.savePartnerItem(partnerToSave);
    loadPartners();
    setIsModalOpen(false);
    showNotification(
      editingPartner
        ? isAr ? 'تم تحديث بيانات الشريك بنجاح' : 'Partner details updated'
        : isAr ? 'تم إضافة الشريك إلى المنظومة بنجاح' : 'New partner added'
    );
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      storageAdapter.deletePartnerItem(deleteTarget.id);
      loadPartners();
      setDeleteTarget(null);
      showNotification(isAr ? 'تم حذف الشريك بنجاح' : 'Partner deleted');
    }
  };

  const filteredPartners = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return partners.filter((p) => {
      const matchesSearch =
        !q ||
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.categoryAr.toLowerCase().includes(q);

      const matchesCat = categoryFilter === 'all' || p.categoryAr === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [partners, searchQuery, categoryFilter]);

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    partners.forEach((p) => {
      if (p.categoryAr) set.add(p.categoryAr);
    });
    return Array.from(set);
  }, [partners]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto text-start">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 start-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold">
            <Handshake className="w-4 h-4" />
            <span>{isAr ? 'إدارة الشركاء والعملاء الاستراتيجيين' : 'Strategic Partners & Clients Management'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {isAr ? 'شركاء النجاح والجهات الحكومية المتعاونة' : 'Collaborating Strategic Clients'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {isAr
              ? 'إدارة بطاقات الوزارات والأمانات والجهات الرسمية المعروضة في سلايدر الشركاء بالصفحة الرئيسية'
              : 'Manage sovereign ministries and municipalities displayed in the homepage partners marquee.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-[#002060] text-white text-xs font-black hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة شريك جديد' : 'Add New Partner'}</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-xs font-bold text-slate-500">{isAr ? 'إجمالي الشركاء المسجلين' : 'Total Partners'}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{partners.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-xs font-bold text-slate-500">{isAr ? 'الجهات والوزارات السيادية' : 'Sovereign Entities'}</p>
          <p className="text-2xl font-black text-sky-600 font-mono">
            {partners.filter((p) => p.categoryAr.includes('وزارة') || p.categoryAr.includes('أمني')).length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-xs font-bold text-slate-500">{isAr ? 'إجمالي العقود والمشاريع' : 'Executed Projects'}</p>
          <p className="text-2xl font-black text-emerald-500 font-mono">
            {partners.reduce((sum, p) => sum + (p.projectsCount || 0), 0)}+
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث باسم الشريك أو الجهة...' : 'Search by partner name...'}
            className="w-full h-10 ps-10 pe-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 font-bold shrink-0 w-full sm:w-auto"
        >
          <option value="all">{isAr ? 'جميع القطاعات والجهات' : 'All Categories'}</option>
          {categoriesList.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500/50 transition-all flex flex-col justify-between items-center text-center space-y-4 group"
          >
            {/* Top Row */}
            <div className="w-full flex items-center justify-between text-[10px] font-bold">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
                {isAr ? partner.categoryAr : partner.categoryEn}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {partner.projectsCount}+ {isAr ? 'مشروع' : 'Projects'}
              </span>
            </div>

            {/* Logo Display */}
            <div className="w-36 h-24 rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={isAr ? partner.nameAr : partner.nameEn}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-10 h-10 text-slate-400" />
              )}
            </div>

            {/* Partner Title */}
            <div className="space-y-1 w-full">
              <h3 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-snug">
                {isAr ? partner.nameAr : partner.nameEn}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold">{isAr ? partner.badgeAr : partner.badgeEn}</p>
            </div>

            {/* Actions Bar */}
            <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
              <button
                onClick={() => handleOpenEdit(partner)}
                className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition-colors cursor-pointer"
                title={isAr ? 'تعديل البيانات' : 'Edit'}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(partner)}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                title={isAr ? 'حذف الشريك' : 'Delete'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Add / Edit Partner Modal (Standardized 7xl Fullscreen Design) */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingPartner
            ? isAr ? 'تعديل بيانات الشريك والجهة الرسمية' : 'Edit Partner Entity'
            : isAr ? 'إضافة شريك أو جهة حكومية جديدة' : 'Add New Partner Entity'
        }
        subtitle={
          isAr
            ? 'توثيق بيانات وتصنيفات وشعار الجهة الرسمية المعروضة في سلايدر الشركاء بالصفحة الرئيسية'
            : 'Configure partner name, logo URL, category tag, and accreditation badge'
        }
        maxWidth="7xl"
        defaultFullscreen={true}
      >
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Main Partner Names */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Building2 className="w-4 h-4" />
              <span>{isAr ? '1. المسميات الرسمية للشريك (بالعربية والإنجليزية)' : '1. Official Entity Names'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسم الشريك / الجهة (بالعربية) *' : 'Entity Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={formNameAr}
                  onChange={(e) => setFormNameAr(e.target.value)}
                  placeholder="مثال: وزارة الشؤون البلدية والقروية والإسكان"
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="space-y-1.5 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'اسم الشريك / الجهة (بالإنجليزية) *' : 'Entity Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  placeholder="e.g. Ministry of Municipal & Rural Affairs"
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Categories & Badges */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Award className="w-4 h-4" />
              <span>{isAr ? '2. التصنيفات وشارات الاعتماد' : '2. Categories & Accreditations'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'التصنيف والقطاع (بالعربية)' : 'Category (Arabic)'}
                </label>
                <input
                  type="text"
                  value={formCategoryAr}
                  onChange={(e) => setFormCategoryAr(e.target.value)}
                  placeholder="وزارة سيادية / أمانات المناطق"
                  className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="space-y-1.5 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'التصنيف والقطاع (بالإنجليزية)' : 'Category (English)'}
                </label>
                <input
                  type="text"
                  value={formCategoryEn}
                  onChange={(e) => setFormCategoryEn(e.target.value)}
                  placeholder="Ministry / Municipality"
                  className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="space-y-1.5 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'عدد العقود والمشاريع المنفذة' : 'Executed Projects Count'}
                </label>
                <input
                  type="number"
                  value={formProjectsCount}
                  onChange={(e) => setFormProjectsCount(Number(e.target.value))}
                  className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'شارة الاعتماد الميداني (بالعربية)' : 'Badge Label (Arabic)'}
                </label>
                <input
                  type="text"
                  value={formBadgeAr}
                  onChange={(e) => setFormBadgeAr(e.target.value)}
                  placeholder="اعتماد رسمي شامل"
                  className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="space-y-1.5 text-start">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isAr ? 'شارة الاعتماد الميداني (بالإنجليزية)' : 'Badge Label (English)'}
                </label>
                <input
                  type="text"
                  value={formBadgeEn}
                  onChange={(e) => setFormBadgeEn(e.target.value)}
                  placeholder="Full Accreditation"
                  className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Interactive Logo File Attachment Picker */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400">
                <UploadCloud className="w-4 h-4" />
                <span>{isAr ? '3. إرفاق وتحميل الشعار الرسمي (Logo File Attachment)' : '3. Logo File Attachment'}</span>
              </div>
              <button
                type="button"
                onClick={() => setUseUrlInputMode(!useUrlInputMode)}
                className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                {useUrlInputMode
                  ? isAr ? '← العودة إلى الإرفاق المباشر' : '← Switch to File Attachment'
                  : isAr ? 'إدخال رابط نصي مخصص ↗' : 'Enter Text URL ↗'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3 text-start">
                
                {useUrlInputMode ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? 'مسار أو رابط الشعار النصي' : 'Logo Image Path'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formLogoUrl}
                      onChange={(e) => setFormLogoUrl(e.target.value)}
                      placeholder="/images/logos/momrah-user-logo.jpg"
                      className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? 'إرفاق صورة الشعار من جهازك' : 'Attach Logo Image File'} *
                    </label>

                    {/* Drag and Drop Attachment Box */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => document.getElementById('partner-logo-file-input')?.click()}
                      className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group ${
                        isDragOver
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-sky-500/60 hover:bg-sky-50/50 dark:hover:bg-sky-950/20'
                      }`}
                    >
                      <input
                        id="partner-logo-file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />

                      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>

                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {isAr ? 'انقر هنا لإرفاق وتصفح صورة الشعار من جهازك' : 'Click to browse and attach logo image'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {isAr ? 'أو اسحب ملف الصورة وأسقطه هنا (PNG, JPG, WebP, SVG)' : 'Or drag and drop image file here'}
                        </p>
                      </div>

                      {attachedFileName && (
                        <div className="mt-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                          <FileImage className="w-3.5 h-3.5" />
                          <span>{attachedFileName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Live Logo Preview Box */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-500">{isAr ? 'الشعار المرفق الحقيقي' : 'Attached Logo Preview'}</span>
                <div className="w-40 h-24 rounded-xl bg-white p-2 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-md">
                  {formLogoUrl ? (
                    <img
                      src={formLogoUrl}
                      alt="Attached Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-slate-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Buttons Bar */}
          <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pt-4 pb-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-[#002060] hover:from-sky-500 hover:to-[#001540] text-white text-xs font-black shadow-lg shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ بيانات الشريك' : 'Save Partner Details'}</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          title={isAr ? 'تأكيد حذف الشريك' : 'Confirm Delete Partner'}
          maxWidth="md"
        >
          <div className="space-y-4 text-start">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? `هل أنت تأكد من رغبتك في حذف الشريك "${deleteTarget.nameAr}" من سلايدر الشركاء والقائمة؟`
                : `Are you sure you want to delete "${deleteTarget.nameAr}"?`}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 text-xs font-bold"
              >
                {isAr ? 'تراجع' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-black shadow-lg shadow-rose-600/20"
              >
                {isAr ? 'تأكيد الحذف' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

    </div>
  );
}
