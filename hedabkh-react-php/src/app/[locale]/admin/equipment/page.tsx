import { useParams } from 'react-router-dom';
"use client";

import React, { use, useState, useEffect, useMemo } from 'react';
import {
  Truck,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  HardHat,
  Sliders,
  Filter,
  Layers,
  Wrench,
  Shield,
  Globe,
  EyeOff,
  Eye,
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { EquipmentItem } from '../../../../types';
import AdminModal from '../../../../components/admin/AdminModal';
import DeleteConfirmDialog from '../../../../components/admin/DeleteConfirmDialog';
import MediaDropzone from '../../../../components/admin/MediaDropzone';
import { handleImageError } from '../../../../lib/imageFallback';

interface EquipmentAdminProps {
  params: Promise<{ locale: string }>;
}

const EQUIPMENT_CATEGORIES = [
  { ar: 'صيانة وكشط الطرق', en: 'Road Milling & Maintenance' },
  { ar: 'شبكات تصريف السيول', en: 'Stormwater Drainage Networks' },
  { ar: 'إزالة التشوه البصري ونقل المخلفات', en: 'Debris Removal & Visual Pollution' },
  { ar: 'تشغيل وصيانة المرافق والبلديات', en: 'Municipal Operations & Cleaning' },
  { ar: 'نقل وترحيل السيارات المهملة', en: 'Abandoned Vehicles Relocation' },
];

export default function EquipmentAdminPage(props: any = {}) {
  const routerParams = useParams<any>();
  const locale = (props?.locale || (routerParams?.locale === 'en' ? 'en' : 'ar')) as 'ar' | 'en';
  const isAr = locale === 'ar';
  const [fleet, setFleet] = useState<EquipmentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSaved, setIsSaved] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EquipmentItem | null>(null);

  // Form State
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formCategoryAr, setFormCategoryAr] = useState(EQUIPMENT_CATEGORIES[0].ar);
  const [formCategoryEn, setFormCategoryEn] = useState(EQUIPMENT_CATEGORIES[0].en);
  const [formModel, setFormModel] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCount, setFormCount] = useState<number>(1);
  const [formImage, setFormImage] = useState('/images/equipment/wirtgen-milling-machine.jpg');
  const [formSpecsAr, setFormSpecsAr] = useState<string[]>([]);
  const [newSpecInput, setNewSpecInput] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'maintenance' | 'standby'>('active');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const loadFleet = () => {
    adminApi.getEquipmentFleet().then((items) => {
      setFleet(items || []);
    }).catch(() => {});
  };

  useEffect(() => {
    loadFleet();
  }, []);

  const publishedCount = useMemo(() => fleet.filter((e) => e.isPublished !== false).length, [fleet]);
  const draftCount = useMemo(() => fleet.filter((e) => e.isPublished === false).length, [fleet]);

  const filteredFleet = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return fleet.filter((item) => {
      const nameAr = (item.nameAr || '').toLowerCase();
      const nameEn = (item.nameEn || '').toLowerCase();
      const model = (item.model || '').toLowerCase();
      const brand = (item.brand || '').toLowerCase();

      const matchesSearch =
        !q ||
        nameAr.includes(q) ||
        nameEn.includes(q) ||
        model.includes(q) ||
        brand.includes(q);

      const matchesCategory =
        selectedCategory === 'all' ||
        item.categoryAr === selectedCategory ||
        item.categoryEn === selectedCategory;

      const isItemPublished = item.isPublished !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && isItemPublished) ||
        (statusFilter === 'draft' && !isItemPublished);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [fleet, searchQuery, selectedCategory, statusFilter]);

  const handleTogglePublish = async (item: EquipmentItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStatus = item.isPublished === false;
    setFleet((prev) =>
      prev.map((eq) => (eq.id === item.id ? { ...eq, isPublished: newStatus } : eq))
    );
    await adminApi.toggleEquipmentPublish(item.id);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormNameAr('');
    setFormNameEn('');
    setFormCategoryAr(EQUIPMENT_CATEGORIES[0].ar);
    setFormCategoryEn(EQUIPMENT_CATEGORIES[0].en);
    setFormModel('');
    setFormBrand('');
    setFormCount(1);
    setFormImage('/images/equipment/wirtgen-milling-machine.jpg');
    setFormSpecsAr(['محرك ديزل عالي الكفاءة', 'نظام تحكم إلكتروني متطور']);
    setFormStatus('active');
    setFormIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EquipmentItem) => {
    setEditingItem(item);
    setFormNameAr(item.nameAr);
    setFormNameEn(item.nameEn);
    setFormCategoryAr(item.categoryAr);
    setFormCategoryEn(item.categoryEn);
    setFormModel(item.model);
    setFormBrand(item.brand);
    setFormCount(item.count);
    setFormImage(item.image);
    setFormSpecsAr(item.specsAr || []);
    setFormStatus(item.status);
    setFormIsPublished(item.isPublished !== false);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemToSave: EquipmentItem = {
      id: editingItem ? editingItem.id : `eq-${Date.now()}`,
      nameAr: formNameAr,
      nameEn: formNameEn,
      categoryAr: formCategoryAr,
      categoryEn: formCategoryEn,
      model: formModel,
      brand: formBrand,
      count: Number(formCount) || 1,
      image: formImage,
      specsAr: formSpecsAr,
      specsEn: formSpecsAr,
      status: formStatus,
      isPublished: formIsPublished,
    };

    await adminApi.saveEquipmentItem(itemToSave);
    loadFleet();
    setIsModalOpen(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    await adminApi.deleteEquipmentItem(deleteTarget.id);
    loadFleet();
    setDeleteTarget(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleAddSpec = () => {
    if (!newSpecInput.trim()) return;
    setFormSpecsAr([...formSpecsAr, newSpecInput.trim()]);
    setNewSpecInput('');
  };

  const handleRemoveSpec = (index: number) => {
    setFormSpecsAr(formSpecsAr.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isAr ? 'إدارة أسطول الآليات والمعدات الثقيلة' : 'Heavy Machinery & Fleet Manager'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'إضافة وتعديل وحذف المعدات الثقيلة، الكاشطات، الرصاصات، الحفارات، والشاحنات الميدانية'
                  : 'Manage heavy machinery, asphalt rollers, excavators, and municipal support vehicles'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xl shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة معدة جديدة للأسطول' : 'Add New Machinery'}</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{isAr ? 'تم تحديث بيانات الأسطول بنجاح!' : 'Equipment fleet updated successfully!'}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
          <input
            type="text"
            placeholder={isAr ? 'البحث باسم المعدة، الموديل، أو الشركة المصنعة...' : 'Search machinery name, model, brand...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white`}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({fleet.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>{isAr ? 'المنشورة' : 'Published'} ({publishedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <EyeOff className="w-3 h-3" />
            <span>{isAr ? 'المسودات' : 'Drafts'} ({draftCount})</span>
          </button>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
        >
          <option value="all">{isAr ? 'جميع القطاعات والتصنيفات' : 'All Categories'}</option>
          {EQUIPMENT_CATEGORIES.map((cat, idx) => (
            <option key={idx} value={cat.ar}>
              {isAr ? cat.ar : cat.en}
            </option>
          ))}
        </select>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFleet.map((eq) => (
          <div
            key={eq.id}
            className={`group bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all ${
              eq.isPublished !== false
                ? 'border-slate-200/80 dark:border-slate-800'
                : 'border-dashed border-amber-400/60 dark:border-amber-500/40 bg-amber-50/10'
            }`}
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={eq.image}
                  alt={isAr ? eq.nameAr : eq.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Status Toggle Pill */}
                <div className="absolute top-3 end-3">
                  <button
                    type="button"
                    onClick={(e) => handleTogglePublish(eq, e)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                      eq.isPublished !== false
                        ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white border border-emerald-400/40'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-400/40'
                    }`}
                    title={eq.isPublished !== false ? (isAr ? 'انقر للتحويل لمسودة وإخفاء المعدة' : 'Click to unpublish') : (isAr ? 'انقر للنشر على الموقع' : 'Click to publish')}
                  >
                    {eq.isPublished !== false ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span>{isAr ? 'منشور' : 'Published'}</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>{isAr ? 'مسودة' : 'Draft'}</span>
                      </>
                    )}
                  </button>
                </div>

                <span className="absolute top-3 start-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase">
                  {isAr ? eq.categoryAr : eq.categoryEn}
                </span>
                <span className="absolute bottom-3 end-3 px-3 py-1 rounded-full bg-sky-600/90 text-white font-mono text-xs font-black shadow">
                  {eq.count} {isAr ? 'وحدة متوفرة' : 'Units'}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3 text-start">
                <div className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-bold">
                  {eq.brand} • {eq.model}
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                  {isAr ? eq.nameAr : eq.nameEn}
                </h3>

                {/* Specs Bullets */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {eq.specsAr?.slice(0, 3).map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  eq.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : eq.status === 'maintenance'
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-slate-500/10 text-slate-500'
                }`}
              >
                {eq.status === 'active'
                  ? isAr ? 'جاهزة ميدانياً' : 'Active'
                  : eq.status === 'maintenance'
                  ? isAr ? 'صيانة دورية' : 'Maintenance'
                  : isAr ? 'احتياط' : 'Standby'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(eq)}
                  className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 hover:bg-sky-100 transition-colors cursor-pointer"
                  title="تعديل"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(eq)}
                  className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Equipment Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? (isAr ? 'تعديل بيانات وإعدادات الآلية' : 'Edit Equipment') : (isAr ? 'إضافة معدة وآلية جديدة للأسطول' : 'Add Machinery')}
        subtitle={isAr ? 'توثيق مواصفات الآلية والماركة والعدد ومرحلة الجاهزية الميدانية' : 'Specify machinery brand, fleet count, specs, and status'}
        maxWidth="6xl"
        defaultFullscreen={true}
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'اسم المعدة (بالعربية) *' : 'Machinery Name (Arabic) *'}
              </label>
              <input
                type="text"
                required
                value={formNameAr}
                onChange={(e) => setFormNameAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'اسم المعدة (بالإنجليزية) *' : 'Machinery Name (English) *'}
              </label>
              <input
                type="text"
                required
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'الموديل (Model) *' : 'Model *'}
              </label>
              <input
                type="text"
                required
                value={formModel}
                onChange={(e) => setFormModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'الشركة المصنعة (Brand) *' : 'Brand *'}
              </label>
              <input
                type="text"
                required
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'القطاع / التصنيف التشغيلي' : 'Category'}
              </label>
              <select
                value={formCategoryAr}
                onChange={(e) => {
                  setFormCategoryAr(e.target.value);
                  const matched = EQUIPMENT_CATEGORIES.find((c) => c.ar === e.target.value);
                  if (matched) setFormCategoryEn(matched.en);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white font-bold"
              >
                {EQUIPMENT_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat.ar}>
                    {cat.ar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'عدد الوحدات المتوفرة' : 'Available Units Count'}
              </label>
              <input
                type="number"
                min="1"
                value={formCount}
                onChange={(e) => setFormCount(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? 'رابط صورة المعدة *' : 'Image URL *'}
            </label>
            <input
              type="text"
              required
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          {/* Specs Manager */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'المواصفات الفنية التشغيلية' : 'Technical Specifications'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isAr ? 'أضف مواصفة فنية (مثال: محرك 400 حصان، عمق كشط 300 ملم)...' : 'Add specification...'}
                value={newSpecInput}
                onChange={(e) => setNewSpecInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                {isAr ? 'إضافة' : 'Add'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {formSpecsAr.map((spec, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Publishing & Visibility Box */}
          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/60 flex items-center justify-between">
            <div className="space-y-0.5 text-start">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isAr ? 'حالة النشر والظهور على الموقع' : 'Publication Status'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'عند تفعيل الخيار تظهر المعدة مباشرة في كروت الأسطول بالصفحة الرئيسية وصفحات الخدمات'
                  : 'When enabled, this machinery item is visible in fleet showcases'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formIsPublished}
                onChange={(e) => setFormIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/20"
            >
              {isAr ? 'حفظ المعدة' : 'Save Machinery'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteItem}
        title={isAr ? 'حذف المعدة من الأسطول' : 'Delete Equipment'}
        message={
          isAr
            ? `هل أنت متأكد من رغبتك في حذف معدة "${deleteTarget?.nameAr}" (${deleteTarget?.model})؟`
            : `Are you sure you want to remove "${deleteTarget?.nameEn}"?`
        }
      />
    </div>
  );
}
